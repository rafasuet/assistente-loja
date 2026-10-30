// Os rótulos dos casos usam os preços fictícios. Para avaliar com os dados reais
// (modo --local), cada preço esperado vira o preço real do mesmo produto.
import type { Story } from "../src/lib/loja/tipos";
import type { Caso } from "./casos.schema";

const mesmoValor = (a: number, b: number) => Math.abs(a - b) < 0.005;
const itens = (s: Story | undefined) => (s ? [...s.produtos, ...s.complementos] : []);

export function traduzirCaso(caso: Caso, publico: Story[], local: Story[]): Caso {
  const { storyId } = caso.entrada;
  const storyPublico = publico.find((s) => s.id === storyId);
  const storyLocal = local.find((s) => s.id === storyId);

  if (storyId && storyLocal && storyLocal.produtos.length === 0 && caso.esperado.acao === "responder") {
    return { ...caso, esperado: { acao: "encaminhar" } };
  }
  if (!caso.esperado.precos) return caso;

  const precos = caso.esperado.precos.map((preco) => {
    const produto = itens(storyPublico).find((p) => mesmoValor(p.preco, preco));
    const real = produto && itens(storyLocal).find((p) => p.id === produto.id);
    return real ? real.preco : preco;
  });
  return { ...caso, esperado: { ...caso.esperado, precos } };
}
