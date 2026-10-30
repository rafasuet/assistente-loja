import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { carregarDados } from "../src/lib/loja/dados";
import { CasoSchema } from "./casos.schema";

const casos = z.array(CasoSchema).parse(
  JSON.parse(readFileSync(path.join(__dirname, "casos.json"), "utf8")),
);

describe("eval/casos.json", () => {
  it("ids são únicos", () => {
    const ids = casos.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todo storyId existe nos stories públicos", () => {
    const ids = new Set(carregarDados("publico").stories.map((s) => s.id));
    const invalidos = casos.filter((c) => c.entrada.storyId && !ids.has(c.entrada.storyId));
    expect(invalidos.map((c) => c.id)).toEqual([]);
  });

  it("contém os casos difíceis exigidos pelo plano", () => {
    const ids = new Set(casos.map((c) => c.id));
    for (const id of ["sem-cadastro", "alicate-ambiguo", "recusa-sugestao", "desconto", "condolencia", "domingo-preco", "sabado-tarde"]) {
      expect(ids.has(id), id).toBe(true);
    }
  });

  const arquivoProibidos = path.join(__dirname, "..", "data", "local", "nomes-proibidos.json");
  it.skipIf(!existsSync(arquivoProibidos))("não contém nomes, @ ou telefones dos prints", () => {
    const proibidos: string[] = JSON.parse(readFileSync(arquivoProibidos, "utf8"));
    const texto = JSON.stringify(casos).toLowerCase();
    const achados = proibidos.filter((p) => texto.includes(p.toLowerCase()));
    expect(achados).toEqual([]);
  });
});
