// Abre a demo com o nome e os preços reais da loja (data/local + eval/saida-local).
// Só funciona no computador que tem esses arquivos; nada disso vai para o git.
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";

for (const arquivo of ["data/local/loja.json", "eval/saida-local/execucao.json"]) {
  if (!existsSync(arquivo)) {
    console.error(`Falta ${arquivo}. Rode antes: npm run eval -- --local`);
    process.exit(1);
  }
}

spawn("npx", ["next", "dev"], { stdio: "inherit", shell: true, env: { ...process.env, DADOS_LOJA: "local" } });
