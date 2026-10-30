"use client";

import { useState } from "react";
import type { Decisao } from "@/lib/assistente/tipos";
import type { Execucao } from "@/lib/relatorio/tipos";
import styles from "./painel.module.css";

type ItemPainel = Pick<Execucao, "caso" | "decisao"> & { storyLegenda: string | null; clienteRecebeu: string | null };
type Conclusao = { estado: "enviada"; texto: string } | { estado: "descartada" };

const categorias: Record<Decisao["categoria"], string> = {
  preco: "preço",
  info_loja: "informação da loja",
  disponibilidade: "disponibilidade",
  recomendacao: "indicação",
  pessoal: "pessoal",
  reclamacao: "reclamação",
  outro: "outro",
};

const hora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const dia = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  weekday: "long",
});

function Mensagem({ item }: { item: ItemPainel }) {
  const recebidaEm = new Date(item.caso.entrada.recebidaEm);

  return (
    <>
      <div className={styles.meta}>
        <time dateTime={item.caso.entrada.recebidaEm}>
          <span className={styles.hora}>{hora.format(recebidaEm)}</span>
          <span>, {dia.format(recebidaEm)}</span>
        </time>
        <span className={styles.categoria}>{categorias[item.decisao.categoria]}</span>
      </div>
      {item.storyLegenda && (
        <div className={styles.story}>
          <p className={styles.rotulo}>Respondeu ao story</p>
          <p>{item.storyLegenda}</p>
        </div>
      )}
      <p className={styles.rotulo}>Mensagem da cliente</p>
      <blockquote className={styles.mensagem}>{item.caso.entrada.texto}</blockquote>
    </>
  );
}

function Pendencia({ item }: { item: ItemPainel }) {
  const [texto, setTexto] = useState(item.decisao.rascunhoDono ?? "");
  const [conclusao, setConclusao] = useState<Conclusao | null>(null);
  const pessoal = item.decisao.acao === "silenciar";
  const campoId = `resposta-${item.caso.id}`;

  return (
    <article className={`${styles.cartao} ${pessoal ? styles.pessoal : styles.pendencia}`}>
      <Mensagem item={item} />
      {item.clienteRecebeu && (
        <div className={styles.jaRecebeu}>
          <p className={styles.rotulo}>A cliente já recebeu, na hora</p>
          <p>{item.clienteRecebeu}</p>
        </div>
      )}
      {pessoal && <p className={styles.seloPessoal}>Mensagem pessoal: não recebeu resposta automática. Responda você mesmo.</p>}
      <div role="status" className={conclusao ? styles.conclusao : undefined}>
        {conclusao && (
          <>
            <p className={styles.resultado}>
              {conclusao.estado === "enviada" ? "Enviada" : "Descartada"}
            </p>
            {conclusao.estado === "enviada" && <p className={styles.textoFinal}>{conclusao.texto}</p>}
          </>
        )}
      </div>
      {!conclusao && (
        <form
          className={styles.compositor}
          onSubmit={(event) => {
            event.preventDefault();
            if (texto.trim()) setConclusao({ estado: "enviada", texto: texto.trim() });
          }}
        >
          <label htmlFor={campoId} className={styles.rotulo}>Sua resposta</label>
          <textarea
            id={campoId}
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            placeholder="Escreva sua resposta"
            rows={4}
          />
          <div className={styles.acoes}>
            <button type="submit" className={styles.enviar} disabled={!texto.trim()}>
              Enviar resposta
            </button>
            <button type="button" className={styles.descartar} onClick={() => setConclusao({ estado: "descartada" })}>
              Descartar
            </button>
          </div>
        </form>
      )}
    </article>
  );
}

export default function Painel({ itens, nomeLoja }: { itens: ItemPainel[]; nomeLoja: string }) {
  const pendencias = itens.filter(({ decisao }) => decisao.acao === "encaminhar" || decisao.acao === "silenciar");
  const respondidas = itens.filter(({ decisao }) => decisao.acao === "responder");

  return (
    <main className={styles.pagina}>
      <header className={styles.intro}>
        <p className={styles.sobretitulo}>{nomeLoja}: resumo da noite</p>
        <h1>Bom dia!</h1>
        <p className={styles.resumo}>
          Enquanto a loja estava fechada: <strong>{itens.length} mensagens.</strong>{" "}
          <span className={styles.automatico}>{respondidas.length} respondidas sozinhas</span>,{" "}
          <span className={styles.dono}>{pendencias.length} esperam você.</span>
        </p>
      </header>

      <section aria-labelledby="pendencias-titulo" className={styles.secao}>
        <div className={styles.tituloSecao}>
          <h2 id="pendencias-titulo">Esperando você</h2>
          <span className={styles.contagem}>{pendencias.length}</span>
        </div>
        <p className={styles.ajuda}>A cliente já foi avisada. O rascunho está pronto: ajuste se quiser e envie.</p>
        <div className={styles.lista}>
          {pendencias.map((item) => <Pendencia key={item.caso.id} item={item} />)}
          {pendencias.length === 0 && <p className={styles.ajuda}>Tudo em dia. Nenhuma mensagem espera sua resposta.</p>}
        </div>
      </section>

      <details className={styles.respondidas}>
        <summary>
          <h2>Respondidas sozinhas <span className={styles.contagem}>{respondidas.length}</span></h2>
        </summary>
        <div className={styles.listaAutomaticas}>
          {respondidas.map((item) => (
            <article key={item.caso.id} className={`${styles.cartao} ${styles.respostaAutomatica}`}>
              <Mensagem item={item} />
              <div className={styles.resposta}>
                <p className={styles.rotulo}>Resposta do assistente</p>
                <p>{item.decisao.respostaCliente}</p>
                {item.decisao.sugestaoExtra && (
                  <div className={styles.sugestao}>
                    <p className={styles.rotulo}>Sugestão extra</p>
                    <p>{item.decisao.sugestaoExtra}</p>
                  </div>
                )}
              </div>
            </article>
          ))}
          {respondidas.length === 0 && <p className={styles.ajuda}>Nenhuma resposta automática nesta noite.</p>}
        </div>
      </details>

      <footer className={styles.nota}>
        Demonstração com conversas reais reescritas sem dados pessoais. Nada aqui é enviado ao Instagram.
      </footer>
    </main>
  );
}
