"use client";

import { useEffect, useMemo, useState } from "react";
import { deveCumprimentar, mensagemDeEspera } from "@/lib/assistente/guardas";
import type { Decisao, MensagemHistorico } from "@/lib/assistente/tipos";
import { modoEm } from "@/lib/loja/horario";
import type { Story } from "@/lib/loja/tipos";
import { CarrosselStories, corDoStory } from "./CarrosselStories";
import styles from "./demo.module.css";

import type { ItemExecucao } from "@/lib/demo/fonte";
import { iniciais } from "@/lib/demo/nome";

type Etiqueta = "auto" | "dono" | "pessoal";

interface Bolha {
  de: "cliente" | "loja" | "nota";
  texto: string;
  etiqueta?: Etiqueta;
  story?: string;
  sugestao?: boolean;
  em?: string;
}

const ROTULO: Record<Etiqueta, string> = {
  auto: "Respondido automaticamente",
  dono: "Encaminhado à equipe",
  pessoal: "Mensagem pessoal: o dono responde",
};

const HORA = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
const DIA = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "America/Sao_Paulo" });

function etiquetaDe(acao: Decisao["acao"]): Etiqueta {
  return acao === "responder" ? "auto" : acao === "silenciar" ? "pessoal" : "dono";
}

// Transforma a decisão do assistente nas bolhas que a cliente (e o dono) veriam.
function bolhasDaDecisao(decisao: Decisao, mensagemEspera: string | null): Bolha[] {
  if (decisao.acao === "responder") {
    const bolhas: Bolha[] = [{ de: "loja", texto: decisao.respostaCliente ?? "", etiqueta: "auto" }];
    if (decisao.sugestaoExtra) bolhas.push({ de: "loja", texto: decisao.sugestaoExtra, etiqueta: "auto", sugestao: true });
    return bolhas;
  }
  if (decisao.acao === "silenciar") {
    return [{ de: "nota", texto: "Nenhuma resposta automática. A conversa aparece no painel para o dono responder pessoalmente.", etiqueta: "pessoal" }];
  }
  const bolhas: Bolha[] = [];
  if (mensagemEspera) bolhas.push({ de: "loja", texto: mensagemEspera, etiqueta: "dono" });
  bolhas.push({ de: "nota", texto: "Foi para a equipe da loja, com um rascunho de resposta pronto.", etiqueta: "dono" });
  return bolhas;
}

function bolhasDoReplay(item: ItemExecucao, stories: Story[]): Bolha[] {
  const { entrada } = item.caso;
  const legenda = stories.find((s) => s.id === entrada.storyId)?.legenda;
  const recebidaEm = new Date(entrada.recebidaEm);
  const espera = mensagemDeEspera(recebidaEm, deveCumprimentar(entrada.historico, recebidaEm));
  return [
    ...entrada.historico.map((m): Bolha => ({ de: m.de, texto: m.texto, sugestao: m.sugestao })),
    { de: "cliente", texto: entrada.texto, story: legenda },
    ...bolhasDaDecisao(item.decisao, espera),
  ];
}

interface Props {
  stories: Story[];
  itens: ItemExecucao[];
  nomeLoja: string;
}

// Situações que contam a história para o dono, nesta ordem.
const DESTAQUES: Array<[string, string]> = [
  ["nutri-madrugada", "Às 3h25, pergunta o preço do story"],
  ["fusion-valor", "Pergunta o preço e recebe uma sugestão"],
  ["alicate-ambiguo", "Story com dois alicates parecidos"],
  ["base-escudo-foto", "Loja aberta: precisa verificar"],
  ["recusa-sugestao", "Recusa a sugestão e pede para separar"],
  ["desconto", "Pede desconto"],
  ["condolencia", "Mensagem pessoal"],
];

export function Chat({ stories, itens, nomeLoja }: Props) {
  const [modo, setModo] = useState<"replay" | "aovivo">("replay");
  const [casoId, setCasoId] = useState(() => itens.find((i) => i.caso.id === "nutri-madrugada")?.caso.id ?? itens[0]?.caso.id);
  const [visiveis, setVisiveis] = useState(0);

  // modo ao vivo
  const [codigo, setCodigo] = useState("");
  const [storyId, setStoryId] = useState<string | null>("s-nutri-enrich");
  const [texto, setTexto] = useState("");
  const [conversa, setConversa] = useState<Bolha[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [agora, setAgora] = useState<Date | null>(null);

  const item = itens.find((i) => i.caso.id === casoId);
  const bolhasReplay = useMemo(() => (item ? bolhasDoReplay(item, stories) : []), [item, stories]);

  // Mostra as mensagens uma a uma, como numa conversa de verdade.
  useEffect(() => {
    if (modo !== "replay") return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzir) {
      setVisiveis(bolhasReplay.length);
      return;
    }
    setVisiveis(1);
    const timer = setInterval(() => setVisiveis((v) => (v >= bolhasReplay.length ? v : v + 1)), 900);
    return () => clearInterval(timer);
  }, [bolhasReplay, modo]);

  useEffect(() => {
    if (modo === "aovivo") setAgora(new Date());
  }, [modo]);

  const relogio = modo === "replay" ? (item ? new Date(item.caso.entrada.recebidaEm) : null) : agora;
  const fechada = relogio ? modoEm(relogio) === "fora_do_horario" : true;
  const bolhas = modo === "replay" ? bolhasReplay.slice(0, visiveis) : conversa;

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (!texto.trim() || enviando) return;
    const legenda = stories.find((s) => s.id === storyId)?.legenda;
    const historico: MensagemHistorico[] = conversa
      .filter((b) => b.de !== "nota")
      .map((b) => ({ de: b.de as "cliente" | "loja", texto: b.texto, sugestao: b.sugestao, em: b.em }));
    const nova: Bolha = { de: "cliente", texto: texto.trim(), story: conversa.length === 0 ? legenda : undefined, em: new Date().toISOString() };
    setConversa((c) => [...c, nova]);
    setTexto("");
    setAviso(null);
    setEnviando(true);
    setAgora(new Date());
    try {
      const resposta = await fetch("/api/mensagem", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ codigo, entrada: { texto: nova.texto, storyId, historico } }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setAviso(corpo.erro ?? "Não foi possível enviar. Tente de novo.");
        setConversa((c) => c.slice(0, -1));
        setTexto(nova.texto);
        return;
      }
      const em = new Date().toISOString();
      setConversa((c) => [...c, ...bolhasDaDecisao(corpo.decisao, corpo.mensagemEspera).map((b) => ({ ...b, em }))]);
    } catch {
      setAviso("Sem conexão com o servidor. Confira a internet e tente de novo.");
      setConversa((c) => c.slice(0, -1));
      setTexto(nova.texto);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={styles.palco}>
      <section className={styles.celular} aria-label="Conversa no Direct da loja">
        <div className={styles.statusBar}>
          <span className={styles.relogio}>{relogio ? HORA.format(relogio) : "--:--"}</span>
          {relogio && <span className={styles.diaSemana}>{DIA.format(relogio)}</span>}
          <span className={fechada ? styles.fechada : styles.aberta}>{fechada ? "Loja fechada" : "Loja aberta"}</span>
        </div>
        <div className={styles.cabecalhoDm}>
          <span className={styles.avatar} aria-hidden>{iniciais(nomeLoja)}</span>
          <span>{nomeLoja}</span>
        </div>

        <ol className={styles.mensagens} aria-live="polite">
          {bolhas.length === 0 && modo === "aovivo" && (
            <li className={styles.vazio}>Escolha um story abaixo e mande uma mensagem como se fosse uma cliente.</li>
          )}
          {bolhas.map((b, i) => (
            <li key={i} className={styles[b.de]}>
              {b.story && (
                <span className={styles.respondeuStory}>
                  <span className={styles.miniStory} style={{ background: corDoStory(stories.find((s) => s.legenda === b.story)?.id ?? null) }} aria-hidden />
                  Respondeu ao story: {b.story}
                </span>
              )}
              <span className={styles.texto}>{b.texto}</span>
              {b.etiqueta && <span className={`${styles.etiqueta} ${styles[`etiqueta_${b.etiqueta}`]}`}>{b.sugestao ? "Sugestão: " : ""}{ROTULO[b.etiqueta]}</span>}
            </li>
          ))}
        </ol>

        {modo === "aovivo" && (
          <form className={styles.compositor} onSubmit={enviar}>
            <CarrosselStories stories={stories} selecionado={storyId} aoEscolher={setStoryId} />
            {aviso && <p className={styles.aviso} role="alert">{aviso}</p>}
            <div className={styles.linhaEnvio}>
              <label htmlFor="mensagem" className={styles.somenteLeitor}>Mensagem da cliente</label>
              <input
                id="mensagem"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Ex.: qual valor?"
                maxLength={500}
                autoComplete="off"
              />
              <button type="submit" disabled={enviando || !texto.trim() || !codigo}>
                {enviando ? "Enviando" : "Enviar"}
              </button>
            </div>
          </form>
        )}
      </section>

      <aside className={styles.lateral}>
        <div className={styles.abas} role="tablist" aria-label="Modo da demo">
          <button role="tab" aria-selected={modo === "replay"} onClick={() => setModo("replay")}>
            Conversas reais
          </button>
          <button role="tab" aria-selected={modo === "aovivo"} onClick={() => setModo("aovivo")}>
            Testar ao vivo
          </button>
        </div>

        {modo === "replay" ? (
          <>
            <p className={styles.nota}>
              Cada conversa usa o horário real em que a mensagem chegou.
            </p>
            <ul className={styles.destaques}>
              {DESTAQUES.filter(([id]) => itens.some((i) => i.caso.id === id)).map(([id, titulo]) => {
                const item = itens.find((i) => i.caso.id === id)!;
                return (
                  <li key={id}>
                    <button type="button" aria-pressed={id === casoId} className={styles.destaque} onClick={() => setCasoId(id)}>
                      <span className={styles.destaqueTitulo}>{titulo}</span>
                      <span className={`${styles.etiqueta} ${styles[`etiqueta_${etiquetaDe(item.decisao.acao)}`]}`}>
                        {ROTULO[etiquetaDe(item.decisao.acao)]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <details className={styles.todas}>
              <summary>Ver todas as {itens.length} conversas</summary>
            <ul className={styles.lista}>
              {itens.map((i) => (
                <li key={i.caso.id}>
                  <button
                    type="button"
                    aria-pressed={i.caso.id === casoId}
                    className={styles.itemLista}
                    onClick={() => setCasoId(i.caso.id)}
                  >
                    <span className={styles.itemHora}>{HORA.format(new Date(i.caso.entrada.recebidaEm))}</span>
                    <span className={styles.itemTexto}>“{i.caso.entrada.texto}”</span>
                    <span className={`${styles.etiqueta} ${styles[`etiqueta_${etiquetaDe(i.decisao.acao)}`]}`}>
                      {ROTULO[etiquetaDe(i.decisao.acao)]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            </details>
          </>
        ) : (
          <div className={styles.aoVivo}>
            <p className={styles.nota}>
              O modo ao vivo chama o modelo de verdade e usa a hora atual. Para não gastar os créditos da API, ele pede um
              código de acesso.
            </p>
            <label htmlFor="codigo">Código de acesso</label>
            <input id="codigo" type="password" value={codigo} onChange={(e) => setCodigo(e.target.value)} autoComplete="off" />
            <button type="button" className={styles.limpar} onClick={() => { setConversa([]); setAviso(null); }}>
              Começar outra conversa
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
