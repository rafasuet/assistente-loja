import { describe, expect, it } from "vitest";
import { carregarResultados, pastaResultados } from "./fonte";

describe("fonte dos dados da demo", () => {
  it("modo público lê public/resultados", () => {
    expect(pastaResultados("publico").replace(/\\/g, "/")).toMatch(/public\/resultados$/);
  });

  it("modo local lê eval/saida-local (fora do git)", () => {
    expect(pastaResultados("local").replace(/\\/g, "/")).toMatch(/eval\/saida-local$/);
  });

  it("carrega execução e métricas públicas", () => {
    const { execucao, metricas } = carregarResultados("publico");
    expect(execucao.itens.length).toBe(metricas.total);
  });
});
