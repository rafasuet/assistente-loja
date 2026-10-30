import { z } from "zod";
import { deveCumprimentar, mensagemDeEspera } from "../assistente/guardas";
import type { Resposta } from "../assistente/responder";
import type { EntradaMensagem } from "../assistente/tipos";
import type { Limitador } from "./limite";

export const ERRO_INDISPONIVEL = "O assistente está indisponível agora. Tente de novo em instantes.";

const CorpoSchema = z.object({
  codigo: z.string(),
  entrada: z.object({
    texto: z.string().trim().min(1).max(500),
    storyId: z.string().nullable(),
    historico: z
      .array(
        z.object({
          de: z.enum(["cliente", "loja"]),
          texto: z.string().max(1000),
          sugestao: z.boolean().optional(),
          em: z.iso.datetime({ offset: true }).optional(),
        }),
      )
      .max(12),
  }),
});

export interface DependenciasHandler {
  responder: (entrada: EntradaMensagem) => Promise<Resposta>;
  codigoAcesso: () => string | undefined;
  limitador: Limitador;
  agora: () => Date;
}

export function criarHandler(deps: DependenciasHandler) {
  return async function POST(request: Request): Promise<Response> {
    let corpo: z.infer<typeof CorpoSchema>;
    try {
      corpo = CorpoSchema.parse(await request.json());
    } catch {
      return Response.json({ erro: "Pedido inválido." }, { status: 400 });
    }

    const codigo = deps.codigoAcesso();
    if (!codigo || corpo.codigo !== codigo) {
      return Response.json({ erro: "Código de acesso incorreto." }, { status: 401 });
    }
    if (!deps.limitador.permitir()) {
      return Response.json({ erro: "Muitas mensagens nesta hora. Tente mais tarde." }, { status: 429 });
    }

    const agora = deps.agora();
    try {
      const { decisao } = await deps.responder({ ...corpo.entrada, recebidaEm: agora.toISOString() });
      const mensagemEspera =
        decisao.acao === "encaminhar" ? mensagemDeEspera(agora, deveCumprimentar(corpo.entrada.historico, agora)) : null;
      return Response.json({ decisao, mensagemEspera });
    } catch (erro) {
      console.error("Falha ao chamar o assistente:", (erro as Error).name);
      return Response.json({ erro: ERRO_INDISPONIVEL }, { status: 503 });
    }
  };
}
