import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buscarStory, carregarDados } from "./dados";

describe("carregarDados('publico')", () => {
  const dados = carregarDados("publico");

  it("tem pelo menos 8 stories", () => {
    expect(dados.stories.length).toBeGreaterThanOrEqual(8);
  });

  it("todo produto tem preço positivo", () => {
    const precos = dados.stories.flatMap((s) => [...s.produtos, ...s.complementos].map((p) => p.preco));
    expect(precos.every((p) => p > 0)).toBe(true);
  });

  it("tem um story com dois produtos de nome parecido (caso dos alicates)", () => {
    const ambiguo = dados.stories.find(
      (s) => s.produtos.length >= 2 && s.produtos[0].nome.split(" ")[0] === s.produtos[1].nome.split(" ")[0],
    );
    expect(ambiguo).toBeDefined();
  });

  it("tem pelo menos um story com complementos para sugerir", () => {
    expect(dados.stories.some((s) => s.complementos.length > 0)).toBe(true);
  });

  // Os dados reais ficam em data/local/ (fora do git); sem eles, o teste é pulado.
  const arquivoReal = path.join(process.cwd(), "data", "local", "loja.json");
  it.skipIf(!existsSync(arquivoReal))("não usa o nome nem a cidade reais da loja", () => {
    const real = JSON.parse(readFileSync(arquivoReal, "utf8"));
    const texto = JSON.stringify(dados).toLowerCase();
    expect(texto).not.toContain(real.nome.toLowerCase());
    expect(texto).not.toContain(real.cidade.split("/")[0].toLowerCase());
  });
});

describe("buscarStory", () => {
  it("acha pelo id e devolve undefined para id desconhecido", () => {
    const dados = carregarDados("publico");
    expect(buscarStory(dados, dados.stories[0].id)?.id).toBe(dados.stories[0].id);
    expect(buscarStory(dados, "nao-existe")).toBeUndefined();
  });
});

describe("JSON inválido", () => {
  it("gera erro com o nome do arquivo", () => {
    const pasta = mkdtempSync(path.join(tmpdir(), "loja-"));
    mkdirSync(pasta, { recursive: true });
    writeFileSync(path.join(pasta, "loja.json"), JSON.stringify({ nome: 123 }));
    writeFileSync(path.join(pasta, "stories.json"), "[]");
    expect(() => carregarDados("publico", pasta)).toThrow(/loja\.json/);
  });
});
