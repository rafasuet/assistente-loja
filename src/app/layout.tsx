import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";

const titulo = Bricolage_Grotesque({ variable: "--font-titulo", subsets: ["latin"], weight: ["500", "700"] });

export const metadata: Metadata = {
  title: "Assistente da loja",
  description:
    "Estudo de caso: um assistente de IA que responde stories de uma loja de cosméticos fora do horário, com o dono no controle.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={titulo.variable}>
      <body>
        <header className={styles.topo}>
          <Link href="/" className={styles.marca}>
            Assistente da loja
          </Link>
          <nav aria-label="Seções" className={styles.nav}>
            <Link href="/proposta">Proposta</Link>
            <Link href="/demo">Demo</Link>
            <Link href="/painel">Painel do dono</Link>
            <Link href="/relatorio">Relatório</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
