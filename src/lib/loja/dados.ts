import { readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { InfoLojaSchema, StorySchema, type DadosLoja, type Story } from "./tipos";

export type OrigemDados = "publico" | "local";

function lerJson<T>(arquivo: string, schema: z.ZodType<T>): T {
  let bruto: unknown;
  try {
    bruto = JSON.parse(readFileSync(arquivo, "utf8"));
  } catch (erro) {
    throw new Error(`Não foi possível ler ${path.basename(arquivo)}: ${(erro as Error).message}`);
  }
  const resultado = schema.safeParse(bruto);
  if (!resultado.success) {
    throw new Error(`${path.basename(arquivo)} inválido: ${z.prettifyError(resultado.error)}`);
  }
  return resultado.data;
}

// `pasta` existe para os testes apontarem para dados temporários.
export function carregarDados(
  origem: OrigemDados = (process.env.DADOS_LOJA as OrigemDados) || "publico",
  pasta = path.join(process.cwd(), "data", origem),
): DadosLoja {
  return {
    info: lerJson(path.join(pasta, "loja.json"), InfoLojaSchema),
    stories: lerJson(path.join(pasta, "stories.json"), z.array(StorySchema)),
  };
}

export function buscarStory(dados: DadosLoja, id: string): Story | undefined {
  return dados.stories.find((s) => s.id === id);
}
