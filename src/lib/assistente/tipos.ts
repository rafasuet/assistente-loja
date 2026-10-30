// silenciar = sem resposta automática nenhuma, vai direto pro painel (mensagens pessoais, luto)
export type Acao = "responder" | "encaminhar" | "silenciar";

export type Categoria =
  | "preco"
  | "info_loja"
  | "disponibilidade"
  | "recomendacao"
  | "pessoal"
  | "reclamacao"
  | "outro";

export interface MensagemHistorico {
  de: "cliente" | "loja";
  texto: string;
  sugestao?: boolean;
  em?: string; // ISO; sem horário, conta como conversa em andamento
}

export interface EntradaMensagem {
  texto: string;
  storyId: string | null;
  historico: MensagemHistorico[];
  recebidaEm: string;
}

export interface Decisao {
  acao: Acao;
  categoria: Categoria;
  respostaCliente: string | null;
  rascunhoDono: string | null;
  sugestaoExtra: string | null;
  motivo: string;
}
