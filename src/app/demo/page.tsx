import type { Metadata } from "next";
import { carregarTudo } from "@/lib/demo/fonte";
import { Chat } from "./Chat";
import styles from "./demo.module.css";

export const metadata: Metadata = { title: "Demo · Assistente da loja" };

export default function DemoPage() {
  const { execucao, dados } = carregarTudo();
  return (
    <main className={styles.pagina}>
      <div className={styles.intro}>
        <h1>Como a sua cliente é atendida, a qualquer hora</h1>
        <p>
          Escolha uma situação. São conversas reais da loja, sem os nomes das clientes. O assistente responde na hora o que
          é seguro e chama a equipe para o resto.
        </p>
      </div>
      <Chat stories={dados.stories} itens={execucao.itens} nomeLoja={dados.info.nome} />
    </main>
  );
}
