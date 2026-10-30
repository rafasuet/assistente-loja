import type { Caso } from "../../../eval/casos.schema";
import type { Decisao } from "../assistente/tipos";

export type Resultado = "acerto" | "erro_leve" | "erro_grave";

export interface Avaliacao {
  casoId: string;
  resultado: Resultado;
  motivo: string;
}

export interface Execucao {
  caso: Caso;
  decisao: Decisao;
  uso: { entrada: number; saida: number };
  ms: number;
}

export interface Premissas {
  mensagensPorMes: number;
  minutosPorMensagem: number;
  dolar: number;
  precoEntradaPorMTok: number;
  precoSaidaPorMTok: number;
}

export interface Metricas {
  total: number;
  acertos: number;
  errosLeves: number;
  errosGraves: number;
  taxaAutomatica: number;
  horasPorMes: number;
  custoPorMensagemUSD: number;
  custoMensalBRL: number;
  premissas: Premissas;
}
