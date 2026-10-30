// Teste rápido ao vivo: manda um caso só para o Claude e mostra a decisão e o custo.
// Uso: npx tsx --env-file=.env.local scripts/fumaca.ts [id-do-caso]
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { carregarDados } from "../src/lib/loja/dados";
import { responder } from "../src/lib/assistente/responder";
import type { Caso } from "../eval/casos.schema";

const id = process.argv[2] ?? "alicate-ambiguo";
const caso = (JSON.parse(readFileSync("eval/casos.json", "utf8")) as Caso[]).find((c) => c.id === id);
if (!caso) throw new Error(`Caso ${id} não encontrado`);

async function main(c: Caso) {
  const { decisao, uso } = await responder(c.entrada, {
    client: new Anthropic(),
    dados: carregarDados("publico"),
  });
  const custo = (uso.entrada * 0.1 + uso.saida * 0.5) / 1e6;
  console.log(JSON.stringify(decisao, null, 2));
  console.log(`tokens: ${uso.entrada} entrada / ${uso.saida} saída · custo: US$ ${custo.toFixed(5)}`);
}

main(caso);
