// Regras fixas que valem por cima de qualquer resposta do modelo.
import { modoEm, proximaAbertura, type ModoAtendimento } from "../loja/horario";
import type { Story } from "../loja/tipos";
import type { Decisao, EntradaMensagem, MensagemHistorico } from "./tipos";

// Só conta como preço o que tem "R$" ou centavos ("38,00"). Números soltos ficam de fora
// para não confundir com horários ("8h30"), prazos ("3 dias") ou porcentagens.
const PRECO_RE = /R\$\s?(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:,\d{1,2})?)|(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})/g;

function paraNumero(valor: string): number {
  return Number(valor.replace(/\./g, "").replace(",", "."));
}

export function extrairPrecos(texto: string): number[] {
  return [...texto.matchAll(PRECO_RE)].map((m) => paraNumero(m[1] ?? m[2]));
}

export function verificarPrecos(texto: string, story: Story | undefined, permitidos: number[] = []): boolean {
  const validos = [...permitidos, ...(story ? [...story.produtos, ...story.complementos].map((p) => p.preco) : [])];
  return extrairPrecos(texto).every((preco) => validos.some((v) => Math.abs(v - preco) < 0.005));
}

const URGENCIA_RE = /últimas? unidades?|só hoje|\bcorre\b|acabando|promoção relâmpago/i;

export function temUrgenciaFalsa(texto: string): boolean {
  return URGENCIA_RE.test(texto);
}

export function limitarSugestao(decisao: Decisao, historico: MensagemHistorico[]): Decisao {
  const jaSugeriu = historico.some((m) => m.de === "loja" && m.sugestao);
  return jaSugeriu ? { ...decisao, sugestaoExtra: null } : decisao;
}

function juntar(decisao: Decisao): string {
  return [decisao.respostaCliente, decisao.sugestaoExtra].filter(Boolean).join(" ");
}

function paraODono(decisao: Decisao, motivo: string): Decisao {
  return {
    ...decisao,
    acao: "encaminhar",
    respostaCliente: null,
    sugestaoExtra: null,
    rascunhoDono: decisao.rascunhoDono ?? (juntar(decisao) || null),
    motivo: `${motivo} (${decisao.motivo})`,
  };
}

export interface ContextoGuardas {
  story: Story | undefined;
  entrada: EntradaMensagem;
  modo: ModoAtendimento;
  precosPermitidos: number[];
}

export function aplicarGuardas(decisao: Decisao, ctx: ContextoGuardas): Decisao {
  // Quem não responde não fala com a cliente: no encaminhamento ela recebe a MENSAGEM_ESPERA fixa.
  if (decisao.acao === "silenciar" || decisao.acao === "encaminhar") {
    return { ...decisao, respostaCliente: null, sugestaoExtra: null };
  }
  if (decisao.acao === "responder") {
    if (!decisao.respostaCliente) return paraODono(decisao, "guarda: resposta vazia");
    const texto = juntar(decisao);
    if (!verificarPrecos(texto, ctx.story, ctx.precosPermitidos)) {
      return paraODono(decisao, "guarda: preço fora do cadastro");
    }
    if (temUrgenciaFalsa(texto)) return paraODono(decisao, "guarda: urgência falsa");
  }
  return limitarSugestao(decisao, ctx.entrada.historico);
}

const FORMATO_DIA = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "America/Sao_Paulo" });
const FORMATO_HORA = new Intl.DateTimeFormat("pt-BR", { hour: "numeric", minute: "2-digit", timeZone: "America/Sao_Paulo" });

// Mensagem automática quando a conversa é encaminhada fora do horário.
export function MENSAGEM_ESPERA(proxima: Date, cumprimentar = true): string {
  const [h, m] = FORMATO_HORA.format(proxima).split(":");
  const hora = m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
  const texto = `A loja já fechou, mas sua mensagem ficou anotada 😊 A gente te responde ${FORMATO_DIA.format(proxima)} a partir das ${hora}.`;
  return cumprimentar ? `Oi! ${texto}` : texto;
}

export const MENSAGEM_VERIFICANDO = "Só um momento, vou verificar aqui na loja 😊";

// Com a loja aberta, a cliente sabe que alguém já vai olhar; com a loja fechada, sabe quando.
export function mensagemDeEspera(agora: Date, cumprimentar = true): string {
  return modoEm(agora) === "horario_comercial" ? MENSAGEM_VERIFICANDO : MENSAGEM_ESPERA(proximaAbertura(agora), cumprimentar);
}

const TRES_HORAS_MS = 3 * 60 * 60 * 1000;

// Só cumprimenta ("Oi!", "Boa noite!") se não houve mensagem nas últimas 3 horas.
export function deveCumprimentar(historico: MensagemHistorico[], agora: Date): boolean {
  return historico.every((m) => m.em !== undefined && agora.getTime() - new Date(m.em).getTime() >= TRES_HORAS_MS);
}
