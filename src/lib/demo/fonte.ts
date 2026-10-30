// De onde as telas leem os dados: "publico" (fictício, vai pro site) ou
// "local" (nome e preços reais, só no computador, para apresentar ao dono).
import { readFileSync } from "node:fs";
import path from "node:path";
import { carregarDados, type OrigemDados } from "../loja/dados";
import type { DadosLoja } from "../loja/tipos";
import type { Avaliacao, Execucao, Metricas } from "../relatorio/tipos";

export type ItemExecucao = Execucao & { avaliacao: Avaliacao };

export interface Resultados {
  execucao: { geradoEm: string; modelo: string; itens: ItemExecucao[] };
  metricas: Metricas;
}

export function origemAtual(): OrigemDados {
  return process.env.DADOS_LOJA === "local" ? "local" : "publico";
}

export function pastaResultados(origem: OrigemDados): string {
  return origem === "local"
    ? path.join(process.cwd(), "eval", "saida-local")
    : path.join(process.cwd(), "public", "resultados");
}

export function carregarResultados(origem: OrigemDados = origemAtual()): Resultados {
  const pasta = pastaResultados(origem);
  return {
    execucao: JSON.parse(readFileSync(path.join(pasta, "execucao.json"), "utf8")),
    metricas: JSON.parse(readFileSync(path.join(pasta, "metricas.json"), "utf8")),
  };
}

export function carregarTudo(origem: OrigemDados = origemAtual()): Resultados & { dados: DadosLoja } {
  return { ...carregarResultados(origem), dados: carregarDados(origem) };
}
