import type { Avaliacao, Execucao, Metricas, Premissas } from "./tipos";

export const PREMISSAS_PADRAO: Premissas = {
  mensagensPorMes: 1200,
  minutosPorMensagem: 3,
  dolar: 5.5,
  precoEntradaPorMTok: 0.1,
  precoSaidaPorMTok: 0.5,
};

export function calcularMetricas(
  execucoes: Execucao[],
  avaliacoes: Avaliacao[],
  p: Premissas = PREMISSAS_PADRAO,
): Metricas {
  const total = execucoes.length;
  const contar = (r: Avaliacao["resultado"]) => avaliacoes.filter((a) => a.resultado === r).length;
  const taxaAutomatica = total === 0 ? 0 : execucoes.filter((e) => e.decisao.acao === "responder").length / total;
  const custoPorMensagemUSD =
    total === 0
      ? 0
      : execucoes.reduce((soma, e) => soma + e.uso.entrada * p.precoEntradaPorMTok + e.uso.saida * p.precoSaidaPorMTok, 0) /
        1e6 /
        total;

  return {
    total,
    acertos: contar("acerto"),
    errosLeves: contar("erro_leve"),
    errosGraves: contar("erro_grave"),
    taxaAutomatica,
    horasPorMes: (p.mensagensPorMes * taxaAutomatica * p.minutosPorMensagem) / 60,
    custoPorMensagemUSD,
    custoMensalBRL: custoPorMensagemUSD * p.mensagensPorMes * p.dolar,
    premissas: p,
  };
}
