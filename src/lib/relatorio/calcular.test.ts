import { describe, expect, it } from "vitest";
import type { Caso } from "../../../eval/casos.schema";
import type { Decisao } from "../assistente/tipos";
import { PREMISSAS_PADRAO, calcularMetricas } from "./calcular";
import type { Avaliacao, Execucao } from "./tipos";

const caso = { id: "x" } as Caso;
const exec = (acao: Decisao["acao"]): Execucao => ({
  caso,
  decisao: { acao, categoria: "preco", respostaCliente: null, rascunhoDono: null, sugestaoExtra: null, motivo: "" },
  uso: { entrada: 3000, saida: 300 },
  ms: 1000,
});

describe("calcularMetricas", () => {
  const execucoes = [exec("responder"), exec("encaminhar")];
  const avaliacoes: Avaliacao[] = [
    { casoId: "a", resultado: "acerto", motivo: "" },
    { casoId: "b", resultado: "erro_grave", motivo: "" },
  ];
  const m = calcularMetricas(execucoes, avaliacoes);

  it("conta acertos e erros", () => {
    expect([m.total, m.acertos, m.errosLeves, m.errosGraves]).toEqual([2, 1, 0, 1]);
  });
  it("taxa automática é a fração respondida sozinha", () => {
    expect(m.taxaAutomatica).toBe(0.5);
  });
  it("horas por mês = 1200 × 0,5 × 3 min / 60 = 30", () => {
    expect(m.horasPorMes).toBe(30);
  });
  it("custo por mensagem = (3000 × 0,10 + 300 × 0,50) / 1e6 = 0,00045", () => {
    expect(m.custoPorMensagemUSD).toBeCloseTo(0.00045, 8);
  });
  it("custo mensal ≈ R$ 2,97", () => {
    expect(m.custoMensalBRL).toBeCloseTo(2.97, 2);
  });
  it("devolve as premissas usadas", () => {
    expect(m.premissas).toEqual(PREMISSAS_PADRAO);
  });
});
