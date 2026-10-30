import { describe, expect, it } from "vitest";
import type { Story } from "../loja/tipos";
import {
  MENSAGEM_ESPERA,
  aplicarGuardas,
  extrairPrecos,
  deveCumprimentar,
  limitarSugestao,
  mensagemDeEspera,
  temUrgenciaFalsa,
  verificarPrecos,
} from "./guardas";
import type { Decisao, EntradaMensagem } from "./tipos";

const storyAlicates: Story = {
  id: "s-alicates",
  legenda: "Alicates",
  produtos: [
    { id: "a", nome: "Alicate Inox", preco: 38, linha: null },
    { id: "b", nome: "Alicate Inox Profissional", preco: 53, linha: null },
  ],
  complementos: [],
};

const entrada: EntradaMensagem = { texto: "Qual valor?", storyId: "s-alicates", historico: [], recebidaEm: "2026-10-28T22:00:00-03:00" };

const decisao = (parcial: Partial<Decisao>): Decisao => ({
  acao: "responder",
  categoria: "preco",
  respostaCliente: "Boa noite! O Inox sai R$ 38,00 e o Profissional R$ 53,00.",
  rascunhoDono: null,
  sugestaoExtra: null,
  motivo: "preço do story",
  ...parcial,
});

describe("extrairPrecos", () => {
  it("lê valores com R$ e com centavos", () => {
    expect(extrairPrecos("Shampoo R$ 169 Condicionador 180,00")).toEqual([169, 180]);
  });
  it("lê R$38,00 colado e R$ 189,90", () => {
    expect(extrairPrecos("Fica R$38,00 ou R$ 189,90")).toEqual([38, 189.9]);
  });
  it("ignora horários, dias e porcentagens", () => {
    expect(extrairPrecos("Abrimos às 8h30, reservamos por 3 dias, sem 20% de desconto")).toEqual([]);
  });
});

describe("verificarPrecos", () => {
  it("aceita preços que existem no story", () => {
    expect(verificarPrecos("Fica R$ 38,00", storyAlicates)).toBe(true);
  });
  it("recusa preço inventado", () => {
    expect(verificarPrecos("Fica R$ 45", storyAlicates)).toBe(false);
  });
  it("recusa qualquer preço quando não há story", () => {
    expect(verificarPrecos("R$ 10", undefined)).toBe(false);
  });
  it("aceita valores permitidos fora do story, como a taxa de entrega", () => {
    expect(verificarPrecos("A entrega custa R$ 6,00", undefined, [6])).toBe(true);
  });
});

describe("temUrgenciaFalsa", () => {
  it("pega 'corre que são as últimas unidades'", () => {
    expect(temUrgenciaFalsa("Corre que são as últimas unidades!")).toBe(true);
  });
  it("não confunde 'ocorreu' com urgência", () => {
    expect(temUrgenciaFalsa("Ocorreu tudo certo com a entrega")).toBe(false);
  });
});

describe("limitarSugestao", () => {
  it("zera a sugestão se a loja já sugeriu algo na conversa", () => {
    const historico = [{ de: "loja" as const, texto: "Quer a máscara também?", sugestao: true }];
    expect(limitarSugestao(decisao({ sugestaoExtra: "Leva a máscara?" }), historico).sugestaoExtra).toBeNull();
  });
  it("mantém a sugestão na primeira vez", () => {
    expect(limitarSugestao(decisao({ sugestaoExtra: "Leva a máscara?" }), []).sugestaoExtra).toBe("Leva a máscara?");
  });
});

describe("aplicarGuardas", () => {
  const ctx = { story: storyAlicates, entrada, modo: "fora_do_horario" as const, precosPermitidos: [6] };

  it("encaminha quando a resposta inventa preço", () => {
    const r = aplicarGuardas(decisao({ respostaCliente: "Sai por R$ 45!" }), ctx);
    expect(r.acao).toBe("encaminhar");
    expect(r.respostaCliente).toBeNull();
    expect(r.rascunhoDono).toContain("R$ 45");
  });
  it("encaminha quando a sugestão traz preço inventado", () => {
    const r = aplicarGuardas(decisao({ sugestaoExtra: "Leva o lixador por R$ 9,90?" }), ctx);
    expect(r.acao).toBe("encaminhar");
  });
  it("encaminha quando há urgência falsa", () => {
    const r = aplicarGuardas(decisao({ respostaCliente: "R$ 38,00, corre que é só hoje!" }), ctx);
    expect(r.acao).toBe("encaminhar");
  });
  it("deixa passar resposta correta fora do horário", () => {
    expect(aplicarGuardas(decisao({}), ctx).acao).toBe("responder");
  });
  it("em horário comercial também responde sozinho o que é seguro", () => {
    const r = aplicarGuardas(decisao({}), { ...ctx, modo: "horario_comercial" });
    expect(r.acao).toBe("responder");
    expect(r.respostaCliente).toBe("Boa noite! O Inox sai R$ 38,00 e o Profissional R$ 53,00.");
  });
  it("silenciar nunca leva resposta para a cliente", () => {
    const r = aplicarGuardas(decisao({ acao: "silenciar", categoria: "pessoal", respostaCliente: "Obrigada!" }), ctx);
    expect(r.respostaCliente).toBeNull();
  });
  it("encaminhar descarta o texto do modelo para a cliente (ela recebe a mensagem de espera fixa)", () => {
    const r = aplicarGuardas(
      decisao({ acao: "encaminhar", categoria: "outro", respostaCliente: "Vou passar para a dona da loja!", rascunhoDono: "Cliente pediu desconto" }),
      ctx,
    );
    expect(r.respostaCliente).toBeNull();
    expect(r.rascunhoDono).toBe("Cliente pediu desconto");
  });
  it("responder sem texto vira encaminhar", () => {
    expect(aplicarGuardas(decisao({ respostaCliente: null }), ctx).acao).toBe("encaminhar");
  });
});

describe("deveCumprimentar", () => {
  const agora = new Date("2026-10-30T22:00:00-03:00");
  it("cumprimenta quando é a primeira mensagem", () => {
    expect(deveCumprimentar([], agora)).toBe(true);
  });
  it("não cumprimenta se houve mensagem há menos de 3 horas", () => {
    expect(deveCumprimentar([{ de: "loja", texto: "R$ 38,00", em: "2026-10-30T21:10:00-03:00" }], agora)).toBe(false);
  });
  it("cumprimenta de novo se a última mensagem foi há mais de 3 horas", () => {
    expect(deveCumprimentar([{ de: "cliente", texto: "oi", em: "2026-10-30T18:30:00-03:00" }], agora)).toBe(true);
  });
  it("histórico sem horário conta como conversa em andamento", () => {
    expect(deveCumprimentar([{ de: "cliente", texto: "qual valor?" }], agora)).toBe(false);
  });
});

describe("mensagemDeEspera", () => {
  it("no meio da conversa, sem 'Oi!'", () => {
    const texto = mensagemDeEspera(new Date("2026-10-31T20:00:00-03:00"), false);
    expect(texto.startsWith("Oi")).toBe(false);
    expect(texto).toContain("segunda");
  });
  it("com a loja aberta, avisa que vai verificar na loja", () => {
    expect(mensagemDeEspera(new Date("2026-10-29T16:30:00-03:00"))).toBe("Só um momento, vou verificar aqui na loja 😊");
  });
  it("com a loja fechada, diz quando a loja responde", () => {
    expect(mensagemDeEspera(new Date("2026-10-31T20:00:00-03:00"))).toContain("segunda");
  });
});

describe("MENSAGEM_ESPERA", () => {
  it("num sábado à noite avisa que a loja responde na segunda", () => {
    expect(MENSAGEM_ESPERA(new Date("2026-11-02T08:30:00-03:00"))).toContain("segunda");
  });
  it("informa a hora da abertura", () => {
    expect(MENSAGEM_ESPERA(new Date("2026-11-07T09:00:00-03:00"))).toContain("9h");
  });
});
