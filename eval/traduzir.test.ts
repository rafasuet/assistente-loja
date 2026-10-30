import { describe, expect, it } from "vitest";
import type { Story } from "../src/lib/loja/tipos";
import type { Caso } from "./casos.schema";
import { traduzirCaso } from "./traduzir";

const produto = (id: string, preco: number) => ({ id, nome: id, preco, linha: null });
const publico: Story[] = [
  { id: "s-a", legenda: "", produtos: [produto("x", 42.9), produto("y", 59.9)], complementos: [produto("z", 74.9)] },
  { id: "s-vazio", legenda: "", produtos: [produto("w", 26.9)], complementos: [] },
];
const local: Story[] = [
  { id: "s-a", legenda: "", produtos: [produto("x", 38), produto("y", 53)], complementos: [produto("z", 66)] },
  { id: "s-vazio", legenda: "", produtos: [], complementos: [] },
];

const caso = (storyId: string | null, esperado: Caso["esperado"]): Caso => ({
  id: "c",
  descricao: "",
  origem: "print",
  entrada: { texto: "qual valor?", storyId, historico: [], recebidaEm: "2026-10-29T03:25:00-03:00" },
  esperado,
});

describe("traduzirCaso", () => {
  it("troca os preços públicos pelos reais do mesmo produto", () => {
    const r = traduzirCaso(caso("s-a", { acao: "responder", precos: [42.9, 59.9, 74.9] }), publico, local);
    expect(r.esperado.precos).toEqual([38, 53, 66]);
  });
  it("mantém valores que não são do story, como a taxa de entrega", () => {
    expect(traduzirCaso(caso(null, { acao: "responder", precos: [6] }), publico, local).esperado.precos).toEqual([6]);
  });
  it("story sem produtos reais cadastrados passa a esperar encaminhamento", () => {
    const r = traduzirCaso(caso("s-vazio", { acao: "responder", precos: [26.9] }), publico, local);
    expect(r.esperado.acao).toBe("encaminhar");
    expect(r.esperado.precos).toBeUndefined();
  });
});
