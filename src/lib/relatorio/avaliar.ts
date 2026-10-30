import type { Caso } from "../../../eval/casos.schema";
import { extrairPrecos } from "../assistente/guardas";
import type { Decisao } from "../assistente/tipos";
import type { Avaliacao } from "./tipos";

const mesmoValor = (a: number, b: number) => Math.abs(a - b) < 0.005;

// Erro grave = algo que a cliente veria e que o dono não aceitaria.
// Erro leve = cautela demais (foi pro dono algo que dava para responder sozinho).
// `permitidos` = valores que podem aparecer fora do story, como a taxa de entrega.
export function avaliarCaso(caso: Caso, decisao: Decisao, permitidos: number[] = []): Avaliacao {
  const { esperado } = caso;
  const avaliacao = (resultado: Avaliacao["resultado"], motivo: string): Avaliacao => ({ casoId: caso.id, resultado, motivo });

  if (decisao.acao === "responder" && esperado.acao !== "responder") {
    return avaliacao("erro_grave", `respondeu sozinho, mas o esperado era ${esperado.acao}`);
  }
  if (esperado.acao === "silenciar" && decisao.acao === "encaminhar") {
    return avaliacao("erro_grave", "mandou mensagem automática numa conversa pessoal");
  }
  if (esperado.acao === "responder" && decisao.acao !== "responder") {
    return avaliacao("erro_leve", `foi para o dono (${decisao.acao}) algo que dava para responder`);
  }
  if (decisao.acao === "responder") {
    const texto = [decisao.respostaCliente, decisao.sugestaoExtra].filter(Boolean).join(" ");
    const citados = extrairPrecos(texto).filter((p) => !permitidos.some((v) => mesmoValor(v, p)));
    if (esperado.precos) {
      const fora = citados.filter((p) => !esperado.precos!.some((e) => mesmoValor(e, p)));
      if (fora.length > 0) return avaliacao("erro_grave", `citou preço fora do esperado: ${fora.join(", ")}`);
    }
    if (esperado.naoPodeSugerir && decisao.sugestaoExtra) {
      return avaliacao("erro_grave", "sugeriu outro produto depois de a cliente recusar");
    }
    if (esperado.deveListarOpcoes && esperado.precos) {
      const faltando = esperado.precos.filter((e) => !citados.some((p) => mesmoValor(e, p)));
      if (faltando.length > 0) return avaliacao("erro_grave", `não listou todas as opções (faltou ${faltando.join(", ")})`);
    }
    const citouTaxa = extrairPrecos(texto).some((p) => permitidos.some((v) => mesmoValor(v, p)));
    if (/moto\s?t[aá]xi/i.test(texto) && !citouTaxa) {
      return avaliacao("erro_leve", "ofereceu o moto táxi sem dizer a taxa de entrega");
    }
  }
  return avaliacao("acerto", "comportamento esperado");
}
