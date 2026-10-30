import { z } from "zod";

export const InfoLojaSchema = z.object({
  nome: z.string().min(1),
  cidade: z.string().min(1),
  bairro: z.string().min(1),
  taxaEntrega: z.number().positive(),
  horarioEntrega: z.string().min(1),
  pagamentos: z.array(z.string()).min(1),
  diasReserva: z.number().int().positive(),
  telefoneLoja: z.string().nullable(),
});

export const ProdutoStorySchema = z.object({
  id: z.string().min(1),
  nome: z.string().min(1),
  preco: z.number().positive(),
  linha: z.string().nullable(),
});

export const StorySchema = z.object({
  id: z.string().min(1),
  legenda: z.string(),
  produtos: z.array(ProdutoStorySchema),
  // itens da mesma linha que o assistente pode sugerir (venda casada)
  complementos: z.array(ProdutoStorySchema),
});

export type InfoLoja = z.infer<typeof InfoLojaSchema>;
export type ProdutoStory = z.infer<typeof ProdutoStorySchema>;
export type Story = z.infer<typeof StorySchema>;

export interface DadosLoja {
  info: InfoLoja;
  stories: Story[];
}
