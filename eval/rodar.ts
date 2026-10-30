// Roda todos os casos contra o Claude, avalia e grava os resultados que o site lê.
// Uso: npm run eval            (dados públicos → public/resultados/)
//      npm run eval -- --local (dados reais    → eval/saida-local/, fora do git)
import Anthropic from "@anthropic-ai/sdk";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { responder, MODELO } from "../src/lib/assistente/responder";
import { carregarDados } from "../src/lib/loja/dados";
import { avaliarCaso } from "../src/lib/relatorio/avaliar";
import { PREMISSAS_PADRAO, calcularMetricas } from "../src/lib/relatorio/calcular";
import type { Avaliacao, Execucao } from "../src/lib/relatorio/tipos";
import { CasoSchema, type Caso } from "./casos.schema";
import { traduzirCaso } from "./traduzir";

const LIMITE_USD = 0.2;
const PARALELO = 2;

const local = process.argv.includes("--local");
const pastaSaida = local ? path.join("eval", "saida-local") : path.join("public", "resultados");
const dados = carregarDados(local ? "local" : "publico");
const casosPublicos = z.array(CasoSchema).parse(JSON.parse(readFileSync(path.join("eval", "casos.json"), "utf8")));
// com dados reais, os preços esperados viram os preços reais dos mesmos produtos
const casos = local
  ? casosPublicos.map((c) => traduzirCaso(c, carregarDados("publico").stories, dados.stories))
  : casosPublicos;
const client = new Anthropic();

const custoDe = (uso: Execucao["uso"]) =>
  (uso.entrada * PREMISSAS_PADRAO.precoEntradaPorMTok + uso.saida * PREMISSAS_PADRAO.precoSaidaPorMTok) / 1e6;

async function rodarCaso(caso: Caso): Promise<Execucao> {
  const inicio = Date.now();
  const { decisao, uso } = await responder(caso.entrada, { client, dados });
  return { caso, decisao, uso, ms: Date.now() - inicio };
}

async function main() {
  const itens: Array<Execucao & { avaliacao: Avaliacao }> = [];
  let gasto = 0;

  for (let i = 0; i < casos.length; i += PARALELO) {
    if (gasto > LIMITE_USD) throw new Error(`Abortado: custo acumulado US$ ${gasto.toFixed(4)} passou de US$ ${LIMITE_USD}`);
    const lote = await Promise.all(casos.slice(i, i + PARALELO).map(rodarCaso));
    for (const execucao of lote) {
      gasto += custoDe(execucao.uso);
      itens.push({ ...execucao, avaliacao: avaliarCaso(execucao.caso, execucao.decisao, [dados.info.taxaEntrega]) });
    }
    process.stdout.write(`\r${itens.length}/${casos.length} casos`);
  }
  process.stdout.write("\n");

  const metricas = calcularMetricas(itens, itens.map((i) => i.avaliacao));
  mkdirSync(pastaSaida, { recursive: true });
  writeFileSync(
    path.join(pastaSaida, "execucao.json"),
    JSON.stringify({ geradoEm: new Date().toISOString(), modelo: MODELO, itens }, null, 2),
  );
  writeFileSync(path.join(pastaSaida, "metricas.json"), JSON.stringify(metricas, null, 2));

  for (const item of itens) {
    const marca = { acerto: "✓", erro_leve: "~", erro_grave: "✗" }[item.avaliacao.resultado];
    console.log(`${marca} ${item.caso.id.padEnd(28)} ${item.decisao.acao.padEnd(10)} ${item.avaliacao.motivo}`);
  }
  console.log(
    `\n${metricas.acertos} acertos · ${metricas.errosLeves} erros leves · ${metricas.errosGraves} erros graves` +
      ` · ${(metricas.taxaAutomatica * 100).toFixed(0)}% resolvido sozinho` +
      ` · R$ ${metricas.custoMensalBRL.toFixed(2)}/mês estimado`,
  );
  console.log(`Custo desta execução: US$ ${gasto.toFixed(4)} → ${pastaSaida}`);
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
