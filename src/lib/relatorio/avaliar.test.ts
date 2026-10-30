import { describe, expect, it } from "vitest";
import type { Caso } from "../../../eval/casos.schema";
import type { Decisao } from "../assistente/tipos";
import { avaliarCaso } from "./avaliar";

const caso = (esperado: Caso["esperado"]): Caso => ({
  id: "c1",
  descricao: "teste",
  origem: "extra",
  entrada: { texto: "Qual valor?", storyId: "s-alicates", historico: [], recebidaEm: "2026-10-28T22:00:00-03:00" },
  esperado,
});

const decisao = (parcial: Partial<Decisao>): Decisao => ({
  acao: "responder",
  categoria: "preco",
  respostaCliente: "O Inox sai R$ 42,90 e o Profissional R$ 59,90.",
  rascunhoDono: null,
  sugestaoExtra: null,
  motivo: "",
  ...parcial,
});

describe("avaliarCaso", () => {
  it("acerto quando responde com os preços esperados", () => {
    expect(avaliarCaso(caso({ acao: "responder", precos: [42.9, 59.9] }), decisao({})).resultado).toBe("acerto");
  });
  it("erro grave quando responde algo que devia ir para o dono", () => {
    expect(avaliarCaso(caso({ acao: "encaminhar" }), decisao({})).resultado).toBe("erro_grave");
  });
  it("erro grave quando manda mensagem de espera numa condolência", () => {
    expect(avaliarCaso(caso({ acao: "silenciar" }), decisao({ acao: "encaminhar", respostaCliente: null })).resultado).toBe("erro_grave");
  });
  it("erro grave quando cita preço fora do esperado", () => {
    expect(avaliarCaso(caso({ acao: "responder", precos: [42.9] }), decisao({})).resultado).toBe("erro_grave");
  });
  it("erro grave quando sugere depois de a cliente recusar", () => {
    const r = avaliarCaso(
      caso({ acao: "responder", precos: [42.9, 59.9], naoPodeSugerir: true }),
      decisao({ sugestaoExtra: "Leva a máscara?" }),
    );
    expect(r.resultado).toBe("erro_grave");
  });
  it("erro grave quando devia listar as opções e listou só uma", () => {
    const r = avaliarCaso(
      caso({ acao: "responder", precos: [42.9, 59.9], deveListarOpcoes: true }),
      decisao({ respostaCliente: "O Inox sai R$ 42,90." }),
    );
    expect(r.resultado).toBe("erro_grave");
  });
  it("erro leve quando encaminha algo que podia responder (cautela demais)", () => {
    expect(avaliarCaso(caso({ acao: "responder" }), decisao({ acao: "encaminhar", respostaCliente: null })).resultado).toBe("erro_leve");
  });
  it("a taxa de entrega oferecida no próximo passo não conta como preço fora do esperado", () => {
    const r = avaliarCaso(
      caso({ acao: "responder", precos: [42.9, 59.9] }),
      decisao({ respostaCliente: "O Inox sai R$ 42,90 e o Profissional R$ 59,90. Mando pelo moto táxi por R$ 6,00?" }),
      [6],
    );
    expect(r.resultado).toBe("acerto");
  });
  it("erro leve quando cita o moto táxi sem a taxa de entrega", () => {
    const r = avaliarCaso(
      caso({ acao: "responder", precos: [42.9, 59.9] }),
      decisao({ respostaCliente: "O Inox sai R$ 42,90 e o Profissional R$ 59,90. Mando pelo moto táxi?" }),
      [6],
    );
    expect(r.resultado).toBe("erro_leve");
  });
  it("acerto quando encaminha o que devia encaminhar", () => {
    expect(avaliarCaso(caso({ acao: "encaminhar" }), decisao({ acao: "encaminhar", respostaCliente: null })).resultado).toBe("acerto");
  });
});
