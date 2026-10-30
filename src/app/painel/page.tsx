import { deveCumprimentar, mensagemDeEspera } from "@/lib/assistente/guardas";
import { carregarTudo } from "@/lib/demo/fonte";
import { modoEm } from "@/lib/loja/horario";
import Painel from "./Painel";

export const metadata = { title: "Painel do dono · Assistente da loja" };

export default function PainelPage() {
  const { execucao, dados } = carregarTudo();
  const itens = execucao.itens
    .filter(({ caso }) => modoEm(new Date(caso.entrada.recebidaEm)) === "fora_do_horario")
    .sort((a, b) => Date.parse(a.caso.entrada.recebidaEm) - Date.parse(b.caso.entrada.recebidaEm))
    .map(({ caso, decisao }) => ({
      caso,
      decisao,
      storyLegenda: dados.stories.find((story) => story.id === caso.entrada.storyId)?.legenda ?? null,
      // o que a cliente já recebeu automaticamente antes de o dono abrir o painel
      clienteRecebeu:
        decisao.acao === "encaminhar"
          ? mensagemDeEspera(new Date(caso.entrada.recebidaEm), deveCumprimentar(caso.entrada.historico, new Date(caso.entrada.recebidaEm)))
          : null,
    }));

  return <Painel itens={itens} nomeLoja={dados.info.nome} />;
}
