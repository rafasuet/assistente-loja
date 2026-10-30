import { describe, expect, it, vi, type Mock } from "vitest";
import type { EntradaMensagem } from "../assistente/tipos";
import type { Resposta } from "../assistente/responder";
import { criarHandler } from "./handler";
import { criarLimitador } from "./limite";

type Fn = (entrada: EntradaMensagem) => Promise<Resposta>;

const respostaOk: Resposta = {
  decisao: { acao: "responder", categoria: "preco", respostaCliente: "Sai R$ 43,90!", rascunhoDono: null, sugestaoExtra: null, motivo: "" },
  uso: { entrada: 1, saida: 1 },
};

function montar(opcoes: { responder?: Mock<Fn>; agora?: Date; max?: number } = {}) {
  const responder = opcoes.responder ?? vi.fn<Fn>().mockResolvedValue(respostaOk);
  const handler = criarHandler({
    responder,
    codigoAcesso: () => "segredo",
    limitador: criarLimitador(opcoes.max ?? 30, 60 * 60 * 1000),
    agora: () => opcoes.agora ?? new Date("2026-10-29T22:00:00-03:00"),
  });
  return { handler, responder };
}

const pedido = (corpo: unknown) =>
  new Request("http://localhost/api/mensagem", { method: "POST", body: JSON.stringify(corpo), headers: { "content-type": "application/json" } });

const corpoValido = { codigo: "segredo", entrada: { texto: "Qual valor?", storyId: "s-novex", historico: [] } };

describe("POST /api/mensagem", () => {
  it("401 com código errado, sem chamar o modelo", async () => {
    const { handler, responder } = montar();
    const r = await handler(pedido({ ...corpoValido, codigo: "errado" }));
    expect(r.status).toBe(401);
    expect(responder).not.toHaveBeenCalled();
  });

  it("400 com corpo inválido", async () => {
    const { handler } = montar();
    expect((await handler(pedido({ codigo: "segredo" }))).status).toBe(400);
  });

  it("200 com a decisão, usando a hora real do servidor", async () => {
    const { handler, responder } = montar();
    const r = await handler(pedido(corpoValido));
    expect(r.status).toBe(200);
    expect((await r.json()).decisao.acao).toBe("responder");
    expect(responder.mock.calls[0][0].recebidaEm).toBe(new Date("2026-10-29T22:00:00-03:00").toISOString());
  });

  it("encaminhamento fora do horário traz a mensagem de espera", async () => {
    const encaminha = vi.fn<Fn>().mockResolvedValue({ ...respostaOk, decisao: { ...respostaOk.decisao, acao: "encaminhar", respostaCliente: null } });
    const { handler } = montar({ responder: encaminha });
    const corpo = await (await handler(pedido(corpoValido))).json();
    expect(corpo.mensagemEspera).toContain("8h30");
  });

  it("encaminhamento com a loja aberta responde 'Só um momento' na hora", async () => {
    const encaminha = vi.fn<Fn>().mockResolvedValue({ ...respostaOk, decisao: { ...respostaOk.decisao, acao: "encaminhar", respostaCliente: null } });
    const { handler } = montar({ responder: encaminha, agora: new Date("2026-10-29T16:30:00-03:00") });
    const corpo = await (await handler(pedido(corpoValido))).json();
    expect(corpo.mensagemEspera).toBe("Só um momento, vou verificar aqui na loja 😊");
  });

  it("mensagem de espera sem 'Oi!' quando a conversa já está rolando", async () => {
    const encaminha = vi.fn<Fn>().mockResolvedValue({ ...respostaOk, decisao: { ...respostaOk.decisao, acao: "encaminhar", respostaCliente: null } });
    const { handler } = montar({ responder: encaminha });
    const corpo = { ...corpoValido, entrada: { ...corpoValido.entrada, historico: [{ de: "loja", texto: "Sai R$ 43,90!", em: "2026-10-29T21:50:00-03:00" }] } };
    const resposta = await (await handler(pedido(corpo))).json();
    expect(resposta.mensagemEspera.startsWith("Oi")).toBe(false);
  });

  it("503 com mensagem amigável quando a API falha, sem vazar detalhes", async () => {
    const { handler } = montar({ responder: vi.fn<Fn>().mockRejectedValue(new Error("401 invalid x-api-key chave-secreta-123")) });
    const r = await handler(pedido(corpoValido));
    expect(r.status).toBe(503);
    const texto = await r.text();
    expect(texto).toContain("O assistente está indisponível agora. Tente de novo em instantes.");
    expect(texto).not.toContain("chave-secreta");
  });

  it("429 a partir da 31ª chamada na mesma hora", async () => {
    const { handler } = montar();
    for (let i = 0; i < 30; i++) expect((await handler(pedido(corpoValido))).status).toBe(200);
    expect((await handler(pedido(corpoValido))).status).toBe(429);
  });
});
