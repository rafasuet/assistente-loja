import type { Metricas } from "./tipos";

const inteiro = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const horas = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const porcentagem = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});
const reais = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const dolares = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

export function preencherMarcadores(texto: string, metricas: Metricas): string {
  return texto.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (_, marcador: string) => {
    switch (marcador) {
      case "metricas.taxaAutomatica":
        return porcentagem.format(metricas.taxaAutomatica);
      case "metricas.custoMensalBRL":
        return reais.format(metricas.custoMensalBRL).replace(/\u00a0/g, " ");
      case "metricas.custoPorMensagemUSD":
        return dolares.format(metricas.custoPorMensagemUSD).replace(/\u00a0/g, " ");
      case "metricas.horasPorMes":
        return horas.format(metricas.horasPorMes);
      case "metricas.total":
        return inteiro.format(metricas.total);
      case "metricas.acertos":
        return inteiro.format(metricas.acertos);
      case "metricas.errosGraves":
        return inteiro.format(metricas.errosGraves);
      case "metricas.errosLeves":
        return inteiro.format(metricas.errosLeves);
      case "metricas.premissas.mensagensPorMes":
        return inteiro.format(metricas.premissas.mensagensPorMes);
      case "metricas.premissas.minutosPorMensagem":
        return inteiro.format(metricas.premissas.minutosPorMensagem);
      default:
        throw new Error(`marcador desconhecido: ${marcador}`);
    }
  });
}
