import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { carregarResultados } from "@/lib/demo/fonte";
import { preencherMarcadores } from "@/lib/relatorio/marcadores";
import Numeros from "./Numeros";
import styles from "./relatorio.module.css";

export const metadata = { title: "Relatório · Assistente da loja" };

export default function Relatorio() {
  const { metricas } = carregarResultados();
  const texto = fs.readFileSync(
    path.join(process.cwd(), "content", "relatorio.md"),
    "utf8",
  );
  const relatorio = preencherMarcadores(texto, metricas);

  return (
    <main className={styles.pagina}>
      <header className={styles.cabecalho}>
        <h1 className={styles.abertura}>Vale a pena colocar um assistente de IA no atendimento da loja?</h1>
      </header>

      <Numeros metricas={metricas} />

      <article className={styles.texto} aria-label="Relatório completo">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          skipHtml
          components={{
            table: ({ children }) => (
              <div
                className={styles.tabela}
                role="region"
                aria-label="Tabela do relatório"
                tabIndex={0}
              >
                <table>{children}</table>
              </div>
            ),
          }}
        >
          {relatorio}
        </ReactMarkdown>
      </article>

      <nav className={styles.rodape} aria-label="Outras páginas do estudo de caso">
        <Link href="/">Voltar ao estudo de caso</Link>
        <Link href="/demo">Ver a demo</Link>
        <Link href="/painel">Painel do dono</Link>
      </nav>
    </main>
  );
}
