import type Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { buscarStory } from "../loja/dados";
import { modoEm, type ModoAtendimento } from "../loja/horario";
import type { DadosLoja } from "../loja/tipos";
import { aplicarGuardas } from "./guardas";
import { DecisaoSchema, montarMensagemUsuario, montarSistema } from "./prompt";
import type { Decisao, EntradaMensagem } from "./tipos";

export const MODELO = "claude-haiku-5-5";

export interface Dependencias {
  client: Pick<Anthropic, "messages">;
  dados: DadosLoja;
  agora?: Date;
  // permite simular um horário específico; por padrão, vem da hora da mensagem
  modo?: ModoAtendimento;
}

export interface Resposta {
  decisao: Decisao;
  uso: { entrada: number; saida: number };
}

export async function responder(entrada: EntradaMensagem, deps: Dependencias): Promise<Resposta> {
  const agora = deps.agora ?? new Date(entrada.recebidaEm);
  const modo = deps.modo ?? modoEm(agora);
  const story = entrada.storyId ? buscarStory(deps.dados, entrada.storyId) : undefined;

  let bruta: Decisao | null = null;
  let uso = { entrada: 0, saida: 0 };
  try {
    const resposta = await deps.client.messages.parse({
      model: MODELO,
      max_tokens: 4096,
      system: montarSistema(deps.dados),
      messages: [{ role: "user", content: montarMensagemUsuario(entrada, story, agora, modo) }],
      output_config: { effort: "low", format: zodOutputFormat(DecisaoSchema) },
    });
    uso = { entrada: resposta.usage.input_tokens, saida: resposta.usage.output_tokens };
    bruta = resposta.stop_reason === "refusal" ? null : resposta.parsed_output;
  } catch (erro) {
    // JSON cortado ou malformado vira encaminhamento; falha de rede/API sobe para quem chamou.
    if (!String((erro as Error).message).includes("Failed to parse structured output")) throw erro;
  }

  const decisao: Decisao = bruta ?? {
    acao: "encaminhar",
    categoria: "outro",
    respostaCliente: null,
    rascunhoDono: null,
    sugestaoExtra: null,
    motivo: "falha_modelo",
  };

  return {
    decisao: aplicarGuardas(decisao, { story, entrada, modo, precosPermitidos: [deps.dados.info.taxaEntrega] }),
    uso,
  };
}
