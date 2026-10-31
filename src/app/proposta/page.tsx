import type { Metadata } from "next";
import Link from "next/link";
import { carregarTudo } from "@/lib/demo/fonte";
import { formatarPreco } from "@/lib/assistente/prompt";
import styles from "./proposta.module.css";

export const metadata: Metadata = { title: "Proposta · Assistente da loja" };

const HORA = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

export default function PropostaPage() {
  const { execucao, metricas, dados } = carregarTudo();
  const exemplo =
    execucao.itens.find((i) => i.caso.id === "nutri-madrugada" && i.decisao.acao === "responder") ??
    execucao.itens.find((i) => i.decisao.acao === "responder");
  const legenda = dados.stories.find((s) => s.id === exemplo?.caso.entrada.storyId)?.legenda;
  const porcentagem = `${Math.round(metricas.taxaAutomatica * 100)}%`;
  const custoIA = formatarPreco(metricas.custoMensalBRL);
  const horas = Math.round(metricas.horasPorMes);

  return (
    <main className={styles.pagina}>
      <header className={styles.topo}>
        <h1>Atendimento da {dados.info.nome}: resposta na hora para a cliente, sem você no celular de madrugada</h1>
      </header>

      {exemplo && (
        <section className={styles.cena} aria-label="Exemplo de conversa real">
          <p className={styles.hora}>{HORA.format(new Date(exemplo.caso.entrada.recebidaEm))}</p>
          {legenda && <p className={styles.legenda}>Respondeu ao story: {legenda}</p>}
          <p className={styles.cliente}>{exemplo.caso.entrada.texto}</p>
          <p className={styles.loja}>{exemplo.decisao.respostaCliente}</p>
          {exemplo.decisao.sugestaoExtra && <p className={styles.loja}>{exemplo.decisao.sugestaoExtra}</p>}
          <p className={styles.rodapeCena}>Resposta do assistente, na hora, com a loja fechada.</p>
        </section>
      )}

      <section className={styles.bloco}>
        <h2>O que muda para você</h2>
        <ul className={styles.ganhos}>
          <li>
            <strong>{porcentagem}</strong> das mensagens são respondidas na hora, sozinhas: preço do story, horário, entrega,
            pagamento.
          </li>
          <li>
            O resto chega para você ou para quem estiver na loja <strong>com a resposta já escrita</strong>. A cliente
            recebe na hora: “Só um momento, vou verificar aqui na loja 😊”.
          </li>
          <li>
            Mensagens pessoais ficam com você. O assistente não responde nada sozinho nelas.
          </li>
          <li>
            Cerca de <strong>{horas} horas por mês</strong> de volta, contando 3 minutos por resposta.
          </li>
        </ul>
      </section>

      <section className={styles.bloco}>
        <h2>O que o assistente nunca faz</h2>
        <ul className={styles.nunca}>
          <li>Inventar preço: ele só fala o preço que você cadastrou para o story.</li>
          <li>Dar desconto ou negociar.</li>
          <li>Prometer produto que não está no story, já que o estoque não está no sistema.</li>
          <li>Insistir: sugere no máximo um item da mesma linha e para no primeiro “não”.</li>
          <li>Mostrar preço em público. O preço só vai no privado, para quem perguntou.</li>
        </ul>
      </section>

      <section className={styles.bloco}>
        <h2>O que você precisa fazer</h2>
        <ol className={styles.passos}>
          <li>
            <strong>Ter um WhatsApp só da loja.</strong> Assim ninguém mais precisa passar o celular pessoal.
          </li>
          <li>
            <strong>Ao postar um story de produto, anotar o preço.</strong> Leva uns 10 segundos e é o que deixa o
            assistente responder sozinho.
          </li>
          <li>
            <strong>Olhar o painel</strong> quando chegar um aviso, revisar o rascunho e enviar.
          </li>
        </ol>
      </section>

      <section className={styles.bloco}>
        <h2>Quanto custa por mês</h2>
        <div className={styles.tabela} role="region" aria-label="Custos por mês" tabIndex={0}>
          <table>
            <tbody>
              <tr>
                <th scope="row">Inteligência artificial</th>
                <td>{custoIA}</td>
                <td>Medido no teste, para cerca de {metricas.premissas.mensagensPorMes.toLocaleString("pt-BR")} mensagens.</td>
              </tr>
              <tr>
                <th scope="row">Responder no Instagram</th>
                <td>Grátis</td>
                <td>A Meta não cobra pelas mensagens de contas profissionais.</td>
              </tr>
              <tr>
                <th scope="row">Responder no WhatsApp</th>
                <td>Grátis</td>
                <td>Até 1.000 respostas por mês. Depois, R$ 0,035 cada.</td>
              </tr>
              <tr>
                <th scope="row">Servidor do assistente</th>
                <td>US$ 5 a US$ 20</td>
                <td>Fica ligado 24 horas para receber as mensagens. O plano gratuito da Vercel não permite uso comercial.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.total}>
          No volume de hoje, a IA fica em torno de {custoIA} por mês. A maior parte do custo é o servidor, de US$ 5 a US$ 20 por
          mês, conforme a hospedagem escolhida.
        </p>
      </section>

      <section className={styles.bloco}>
        <h2>Como começar</h2>
        <ol className={styles.fases}>
          <li>
            <span className={styles.quando}>Esta semana, sem custo</span>
            <strong>WhatsApp Business da loja</strong> com mensagem de ausência e respostas prontas. Já resolve as ligações no
            celular pessoal.
          </li>
          <li>
            <span className={styles.quando}>Em algumas semanas</span>
            <strong>O assistente no Instagram</strong> respondendo os stories, com o painel. Depende de uma liberação da Meta,
            que pode levar de dias a algumas semanas.
          </li>
          <li>
            <span className={styles.quando}>Depois</span>
            <strong>Organizar o estoque.</strong> Com ele confiável, o assistente passa a responder se tem produtos que não
            estão nos stories.
          </li>
        </ol>
      </section>

      <nav className={styles.acoes} aria-label="Ver na prática">
        <Link href="/demo" className={styles.principal}>Ver as conversas</Link>
        <Link href="/painel">Ver o painel</Link>
      </nav>
    </main>
  );
}
