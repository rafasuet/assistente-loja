import Link from "next/link";
import { carregarResultados } from "@/lib/demo/fonte";
import Numeros from "./relatorio/Numeros";
import styles from "./page.module.css";

export default function Inicio() {
  const { metricas } = carregarResultados();
  return (
    <main className={styles.pagina}>
      <header className={styles.intro}>
        <h1>
          Um assistente que responde os stories da loja na hora, até de madrugada
        </h1>
        <p className={styles.problema}>
          A cliente pergunta o preço no Instagram à noite. A resposta só chega de
          manhã. O dono acumula mensagens e atende até pelo celular pessoal.
        </p>
      </header>

      <section className={styles.solucao} aria-labelledby="solucao">
        <h2 id="solucao">Como funciona</h2>
        <ol>
          <li>A loja cadastra o produto e o preço do story.</li>
          <li>O assistente responde o preço no privado, na hora, a qualquer horário.</li>
          <li>O que exige cuidado vai na hora para a equipe, com um rascunho pronto.</li>
        </ol>
      </section>

      <Numeros metricas={metricas} />

      <nav className={styles.links} aria-label="Partes do projeto">
        <Link className={styles.principal} href="/demo">Ver a demo</Link>
        <Link href="/painel">Painel do dono</Link>
        <Link href="/relatorio">Ler o relatório</Link>
      </nav>

      <p className={styles.nota}>
        Esta demo simula o Instagram. Os custos e as horas são estimativas;
        o teste ainda não mede vendas reais.
      </p>
    </main>
  );
}
