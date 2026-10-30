import { z } from "zod";

const MensagemHistoricoSchema = z.object({
  de: z.enum(["cliente", "loja"]),
  texto: z.string().min(1),
  sugestao: z.boolean().optional(),
});

export const CasoSchema = z.object({
  id: z.string().min(1),
  descricao: z.string().min(1),
  origem: z.enum(["print", "extra"]),
  entrada: z.object({
    texto: z.string().min(1),
    storyId: z.string().nullable(),
    historico: z.array(MensagemHistoricoSchema),
    recebidaEm: z.iso.datetime({ offset: true }),
  }),
  esperado: z.object({
    acao: z.enum(["responder", "encaminhar", "silenciar"]),
    precos: z.array(z.number().positive()).optional(),
    deveListarOpcoes: z.boolean().optional(),
    naoPodeSugerir: z.boolean().optional(),
  }),
});

export type Caso = z.infer<typeof CasoSchema>;
