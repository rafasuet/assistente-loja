import { preencherMarcadores } from "@/lib/relatorio/marcadores";
import type { Metricas } from "@/lib/relatorio/tipos";
import styles from "./relatorio.module.css";

export default function Numeros({ metricas }: { metricas: Metricas }) {
  const numeros = [
    ["taxaAutomatica", "Resolvido sozinho"],
    ["errosGraves", "Erros graves"],
    ["horasPorMes", "Horas por mês devolvidas ao dono"],
    ["custoMensalBRL", "Custo de IA por mês"],
  ];

  return (
    <section className={styles.resultados} aria-label="Resultados do teste">
      <dl className={styles.numeros}>
        {numeros.map(([campo, rotulo]) => (
          <div className={styles.numero} key={campo}>
            <dt>{rotulo}</dt>
            <dd>{preencherMarcadores(`{{metricas.${campo}}}`, metricas)}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.premissas}>
        {preencherMarcadores(
          "Teste com {{metricas.total}} conversas. Projeções mensais com {{metricas.premissas.mensagensPorMes}} mensagens e {{metricas.premissas.minutosPorMensagem}} minutos por resposta.",
          metricas,
        )}
      </p>
    </section>
  );
}
