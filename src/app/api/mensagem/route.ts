import Anthropic from "@anthropic-ai/sdk";
import { criarHandler } from "@/lib/api/handler";
import { criarLimitador } from "@/lib/api/limite";
import { responder } from "@/lib/assistente/responder";
import { carregarDados } from "@/lib/loja/dados";

let client: Anthropic | undefined;

export const POST = criarHandler({
  responder: (entrada) => {
    client ??= new Anthropic();
    return responder(entrada, { client, dados: carregarDados() });
  },
  codigoAcesso: () => process.env.CODIGO_ACESSO,
  limitador: criarLimitador(30, 60 * 60 * 1000),
  agora: () => new Date(),
});
