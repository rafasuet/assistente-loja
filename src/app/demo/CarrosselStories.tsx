"use client";

import type { Story } from "@/lib/loja/tipos";
import styles from "./demo.module.css";

// Cores das embalagens, para o card lembrar o produto sem usar foto real da loja.
const CORES: Record<string, string> = {
  "s-nutri-enrich": "#f07a3a",
  "s-fusion": "#b5835a",
  "s-mascaras-wella": "#d9895b",
  "s-alicates": "#8fbf5a",
  "s-novex": "#3b4a63",
  "s-serums": "#e39a2f",
  "s-gummy": "#d1477a",
  "s-tutano": "#7a5c3e",
  "s-escudo": "#2f4f8f",
  "s-cronograma": "#f2a51a",
  "s-truss": "#4a6d8c",
  "s-pessoal": "#9a8fb0",
};

export function corDoStory(id: string | null): string {
  return (id && CORES[id]) || "#9a8fb0";
}

interface Props {
  stories: Story[];
  selecionado: string | null;
  aoEscolher: (id: string | null) => void;
}

export function CarrosselStories({ stories, selecionado, aoEscolher }: Props) {
  return (
    <div className={styles.carrossel} role="radiogroup" aria-label="Story que a cliente está respondendo">
      <button
        type="button"
        role="radio"
        aria-checked={selecionado === null}
        className={styles.storyCard}
        style={{ background: "var(--cliente)", color: "var(--tinta)" }}
        onClick={() => aoEscolher(null)}
      >
        Sem story
      </button>
      {stories.map((s) => (
        <button
          key={s.id}
          type="button"
          role="radio"
          aria-checked={selecionado === s.id}
          className={styles.storyCard}
          style={{ background: corDoStory(s.id) }}
          onClick={() => aoEscolher(s.id)}
        >
          {s.legenda.replace(/^Tem na [^:]+: /, "").replace("Chegou! ", "")}
        </button>
      ))}
    </div>
  );
}
