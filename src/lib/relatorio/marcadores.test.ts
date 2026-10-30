import { describe, expect, it } from "vitest";
import { preencherMarcadores } from "./marcadores";
import type { Metricas } from "./tipos";

const metricas: Metricas = {
  total: 1200,
  acertos: 1100,
  errosGraves: 1000,
  errosLeves: 2000,
  taxaAutomatica: 0.55,
  horasPorMes: 33,
  custoMensalBRL: 2.75,
  custoPorMensagemUSD: 0.000386,
  premissas: {
    mensagensPorMes: 1200,
    minutosPorMensagem: 3,
    dolar: 5.5,
    precoEntradaPorMTok: 0.1,
    precoSaidaPorMTok: 0.5,
  },
};

describe("preencherMarcadores", () => {
  it.each([
    ["taxaAutomatica", "55%"],
    ["custoMensalBRL", "R$ 2,75"],
    ["custoPorMensagemUSD", "US$ 0,0004"],
    ["horasPorMes", "33"],
    ["total", "1.200"],
    ["acertos", "1.100"],
    ["errosGraves", "1.000"],
    ["errosLeves", "2.000"],
    ["premissas.mensagensPorMes", "1.200"],
    ["premissas.minutosPorMensagem", "3"],
  ])("formata %s em português do Brasil", (campo, esperado) => {
    expect(preencherMarcadores(`{{metricas.${campo}}}`, metricas)).toBe(esperado);
  });

  it.each([
    [32.5, "32,5"],
    [32.56, "32,6"],
    [0, "0"],
  ])("formata %s horas com no máximo uma casa decimal", (valor, esperado) => {
    expect(preencherMarcadores("{{metricas.horasPorMes}}", {
      ...metricas, horasPorMes: valor,
    })).toBe(esperado);
  });

  it("arredonda a porcentagem sem casas decimais", () => {
    expect(preencherMarcadores("{{metricas.taxaAutomatica}}", {
      ...metricas, taxaAutomatica: 0.556,
    })).toBe("56%");
  });

  it("mantém duas casas em reais e quatro em dólares, inclusive no zero", () => {
    expect(preencherMarcadores(
      "{{metricas.custoMensalBRL}} / {{metricas.custoPorMensagemUSD}}",
      { ...metricas, custoMensalBRL: 0, custoPorMensagemUSD: 0 },
    )).toBe("R$ 0,00 / US$ 0,0000");
  });

  it("aplica o separador de milhar também aos minutos", () => {
    expect(preencherMarcadores("{{metricas.premissas.minutosPorMensagem}}", {
      ...metricas, premissas: { ...metricas.premissas, minutosPorMensagem: 1200 },
    })).toBe("1.200");
  });

  it("substitui todas as ocorrências e preserva o texto ao redor", () => {
    expect(preencherMarcadores(
      "**{{metricas.total}}** casos; {{metricas.total}} no total; {{ metricas.taxaAutomatica }} sozinhos.",
      metricas,
    )).toBe("**1.200** casos; 1.200 no total; 55% sozinhos.");
  });

  it("preserva texto sem marcadores", () => {
    expect(preencherMarcadores("a loja abre amanhã {às 9h}.", metricas))
      .toBe("a loja abre amanhã {às 9h}.");
  });

  it.each([
    "metricas.inexistente",
    "metricas.premissas.inexistente",
    "metricas.toString",
    "outro.campo",
  ])("informa o marcador desconhecido %s no erro", (marcador) => {
    expect(() => preencherMarcadores(`{{${marcador}}}`, metricas))
      .toThrow(`marcador desconhecido: ${marcador}`);
  });
});
