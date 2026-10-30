import { describe, expect, it, vi } from "vitest";
import { carregarDados } from "../loja/dados";
import { montarMensagemUsuario, montarSistema } from "./prompt";
import { responder } from "./responder";
import type { EntradaMensagem } from "./tipos";

const dados = carregarDados("publico");
const entrada: EntradaMensagem = {
  texto: "Qual valor?",
  storyId: "s-novex",
  historico: [],
  recebidaEm: "2026-10-29T03:25:00-03:00",
};

function clienteFalso(parsed: unknown, extras: Record<string, unknown> = {}) {
  const parse = vi.fn().mockResolvedValue({
    parsed_output: parsed,
    stop_reason: "end_turn",
    usage: { input_tokens: 1200, output_tokens: 150 },
    ...extras,
  });
  return { client: { messages: { parse } } as never, parse };
}

const respostaBoa = {
  acao: "responder",
  categoria: "preco",
  respostaCliente: "Oi! O leave-in Blindagem sai R$ 43,90. Quer que eu separe pra retirar ou mando pelo moto táxi (R$ 6,00)?",
  rascunhoDono: null,
  sugestaoExtra: null,
  motivo: "preço do story",
};

describe("responder", () => {
  it("chama o Haiku 5.5 com effort low e saída estruturada", async () => {
    const { client, parse } = clienteFalso(respostaBoa);
    await responder(entrada, { client, dados });
    const args = parse.mock.calls[0][0];
    expect(args.model).toBe("claude-haiku-5-5");
    expect(args.output_config.effort).toBe("low");
    expect(args.output_config.format).toBeDefined();
    expect(args).not.toHaveProperty("temperature");
    expect(args).not.toHaveProperty("thinking");
  });

  it("devolve a decisão e o uso de tokens", async () => {
    const { client } = clienteFalso(respostaBoa);
    const r = await responder(entrada, { client, dados });
    expect(r.decisao.acao).toBe("responder");
    expect(r.uso).toEqual({ entrada: 1200, saida: 150 });
  });

  it("encaminha quando o modelo inventa preço", async () => {
    const { client } = clienteFalso({ ...respostaBoa, respostaCliente: "Sai R$ 29,90!" });
    expect((await responder(entrada, { client, dados })).decisao.acao).toBe("encaminhar");
  });

  it("encaminha com motivo falha_modelo quando não há saída", async () => {
    const { client } = clienteFalso(null);
    const r = await responder(entrada, { client, dados });
    expect(r.decisao.acao).toBe("encaminhar");
    expect(r.decisao.motivo).toContain("falha_modelo");
  });

  it("encaminha com motivo falha_modelo quando o modelo recusa", async () => {
    const { client } = clienteFalso(respostaBoa, { stop_reason: "refusal" });
    expect((await responder(entrada, { client, dados })).decisao.motivo).toContain("falha_modelo");
  });

  it("encaminha com motivo falha_modelo quando o SDK falha ao ler o JSON", async () => {
    const parse = vi.fn().mockRejectedValue(new Error("Failed to parse structured output as JSON: Unterminated string"));
    const r = await responder(entrada, { client: { messages: { parse } } as never, dados });
    expect(r.decisao.acao).toBe("encaminhar");
    expect(r.decisao.motivo).toContain("falha_modelo");
    expect(r.uso).toEqual({ entrada: 0, saida: 0 });
  });

  it("dá folga de tokens para o raciocínio do modelo", async () => {
    const { client, parse } = clienteFalso(respostaBoa);
    await responder(entrada, { client, dados });
    expect(parse.mock.calls[0][0].max_tokens).toBeGreaterThanOrEqual(4096);
  });

  it("com a loja aberta, responde sozinho e informa o modo certo ao modelo", async () => {
    const { client, parse } = clienteFalso(respostaBoa);
    const emHorario = { ...entrada, recebidaEm: "2026-10-29T10:00:00-03:00" };
    expect((await responder(emHorario, { client, dados })).decisao.acao).toBe("responder");
    expect(parse.mock.calls[0][0].messages[0].content).toContain("loja aberta");
  });
});

describe("prompt", () => {
  it("o sistema é estável e não depende da hora (permite cache)", () => {
    expect(montarSistema(dados)).toBe(montarSistema(dados));
    expect(montarSistema(dados)).not.toContain("Agora:");
  });
  it("o sistema exige preço no formato R$ e proíbe urgência falsa", () => {
    const s = montarSistema(dados);
    expect(s).toContain("R$ 0,00");
    expect(s.toLowerCase()).toContain("urgência");
  });
  it("no meio da conversa, avisa o modelo para não cumprimentar de novo", () => {
    const meio = { ...entrada, historico: [{ de: "cliente" as const, texto: "oi", em: "2026-10-29T03:00:00-03:00" }] };
    expect(montarMensagemUsuario(meio, undefined, new Date(entrada.recebidaEm), "fora_do_horario")).toContain("não cumprimente");
    expect(montarMensagemUsuario(entrada, undefined, new Date(entrada.recebidaEm), "fora_do_horario")).not.toContain("não cumprimente");
  });
  it("a mensagem do usuário traz hora, modo e os produtos do story", () => {
    const m = montarMensagemUsuario(entrada, dados.stories.find((s) => s.id === "s-novex"), new Date(entrada.recebidaEm), "fora_do_horario");
    expect(m).toContain("03:25");
    expect(m).toContain("fora do horário");
    expect(m).toContain("R$ 43,90");
  });
});
