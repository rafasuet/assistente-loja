Recomendação curta: **sim, em fases**. Começa sem IA nenhuma, pelo canal oficial da loja, e o assistente entra para responder preço de story a qualquer hora e passar todo o resto para a equipe na hora, com um rascunho pronto.

## O problema

A loja é uma loja de cosméticos de bairro. O atendimento chega por telefone, WhatsApp e Direct do Instagram, cerca de {{metricas.premissas.mensagensPorMes}} mensagens por mês. O dono reclama de três coisas:

- mensagens fora do horário comercial;
- clientes ligando no WhatsApp pessoal dele;
- mensagens do Instagram respondidas com atraso, com clientes reclamando da demora.

## O que as conversas reais mostram

Analisei 32 conversas reais (prints cedidos pela loja, que não saem do meu computador):

- **18 de 32 (56%) eram respostas a um story da própria loja**, quase sempre a mesma pergunta: "qual valor?", "qto?", "valor por favor".
- **12 de 32 (37%) chegaram com a loja fechada**, de 18h38 a 3h25, e só foram respondidas na manhã seguinte.
- Uma cliente perguntou "vocês não têm WhatsApp?" e recebeu dois celulares pessoais e um telefone fixo.
- Algumas mensagens são pessoais: condolências, agradecimento por um brinde. Elas pedem o dono, não um robô.

Duas restrições mudaram o desenho da solução:

- **O controle de estoque é fraco.** Um assistente que responde "tem sim!" erraria. Mas, se o produto está no story, a loja acabou de mostrar que tem.
- **A loja não mostra preço em público**, para a concorrência não ver. O preço só pode sair em conversa privada.

## A solução

1. Ao postar um story, a loja registra produto e preço em um formulário de poucos segundos. É uma tabela privada.
2. Quando uma cliente responde ao story, a qualquer hora, o assistente manda o preço no privado, no tom da loja, e oferece o próximo passo: separar para retirar ou mandar pelo moto táxi.
3. Ele pode sugerir **um** item da mesma linha (a máscara que completa o shampoo), nunca insiste e nunca cria urgência falsa.
4. Todo o resto vai para a equipe na hora, com um rascunho pronto: disponibilidade, indicação, reclamação, desconto. A cliente recebe "Só um momento, vou verificar aqui na loja 😊" ou, com a loja fechada, quando a loja vai responder. Mensagens pessoais não recebem resposta automática nenhuma.
5. Regras fixas no código barram qualquer resposta com preço fora do cadastro ou com urgência falsa, mesmo que o modelo erre.

## Resultado do teste

O assistente (Claude Haiku 5.5) rodou nas {{metricas.total}} conversas: as 32 reais reescritas sem dados pessoais e 6 casos difíceis criados de propósito (pedido de desconto, cliente que recusa a sugestão, domingo, sábado à tarde).

- **{{metricas.acertos}} de {{metricas.total}}** tiveram o comportamento esperado.
- **{{metricas.errosGraves}} erros graves**, ou seja, nenhuma resposta com preço inventado, nenhuma resposta automática a mensagem pessoal e nenhuma sugestão depois de um "não".
- **{{metricas.taxaAutomatica}}** das mensagens o assistente resolve sozinho. O resto vai para a equipe, com rascunho.

Cada rodada do teste e o que mudou nela estão documentados. O maior aprendizado: a primeira avaliação apontou 17 "erros graves", mas 16 eram do avaliador, que contava a taxa de entrega oferecida como preço inventado. Medir também exige revisão.

## Quanto custa e quanto devolve

| | Valor |
|---|---|
| Custo de IA por mensagem | {{metricas.custoPorMensagemUSD}} (medido no teste) |
| Custo de IA por mês, com {{metricas.premissas.mensagensPorMes}} mensagens | **{{metricas.custoMensalBRL}}** |
| Tempo devolvido ao dono por mês | **{{metricas.horasPorMes}} horas**, supondo {{metricas.premissas.minutosPorMensagem}} minutos por resposta |

O custo da IA é irrelevante perto do tempo devolvido. O custo que importa está na próxima seção.

## Quanto custa colocar em produção

Pesquisa feita na documentação oficial da Meta em 30/10/2026.

| Item | Custo | Observação |
|---|---|---|
| Instagram: responder DMs por API | **Grátis** | A plataforma de mensagens da Meta não cobra pelo atendimento de contas profissionais. ([Meta](https://developers.facebook.com/documentation/business-messaging/messenger-platform/overview/)) |
| WhatsApp: respostas a quem escreveu primeiro | **Grátis até 1.000 por mês**, depois R$ 0,035 cada | Regra nova de outubro de 2026, por número da loja, somando bot e pessoas. ([Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-tier-of-monthly-service-messages)) |
| App WhatsApp Business, respostas salvas e mensagem de ausência | **Grátis** | É a Fase 0. Não entende o story, mas resolve o aviso de horário e o número oficial. ([WhatsApp](https://business.whatsapp.com/products/business-app-features)) |
| Hospedagem do assistente | **US$ 5 a US$ 20 por mês** | O servidor fica ligado 24 horas para receber as mensagens da Meta. O plano gratuito da Vercel aguenta o volume, mas não permite uso comercial ([Vercel](https://vercel.com/docs/limits/fair-use-guidelines)). Em produção: Vercel Pro (cerca de US$ 20) ou uma hospedagem mais barata (a partir de cerca de US$ 5). |

O que torna o projeto tecnicamente viável: quando a cliente responde a um story, o webhook do Instagram informa **qual story** ela respondeu (`reply_to.story.id`). Basta ligar esse id ao produto cadastrado. ([Meta](https://developers.facebook.com/documentation/instagram-platform/webhooks/examples/#messages))

**Prazo:**
- Um app feito só para a própria loja pode usar o acesso padrão, **sem a revisão de app** da Meta. ([Meta](https://developers.facebook.com/documentation/instagram-platform/app-review/))
- Se a revisão for necessária, a verificação da empresa leva até 14 dias úteis e a revisão cerca de uma semana. Integradores relatam até 20 dias. Vale planejar algumas semanas.

**Janela de resposta:** pela API, a loja pode responder até 24 horas depois da última mensagem da cliente. Para a Fase 1, isso basta: o assistente responde na hora.

## Riscos

- **Ninguém cadastrar o preço do story.** É o risco principal, e é cultural, não técnico. Sem a tabela, o assistente só encaminha. O formulário precisa ser mais rápido que responder à mão.
- **Story com produtos parecidos**, como os dois alicates (Inox e Inox Profissional): o assistente lista as duas opções em vez de adivinhar. Coberto no teste.
- **Erro do modelo:** mitigado pelas regras fixas no código e pelo modo de aprovação no horário comercial.
- **Perder a proximidade com as clientes:** mensagens pessoais nunca recebem resposta automática, e o tom foi calibrado com as mensagens reais da loja.

## Recomendação em fases

1. **Fase 0, sem IA, custo zero:** um WhatsApp Business só da loja, com mensagem de ausência e respostas rápidas. Resolve as ligações no celular pessoal.
2. **Fase 1:** o assistente de stories, mais o painel da equipe. Mede-se por um mês: mensagens respondidas sozinho, vendas fechadas de madrugada, tempo do dono.
3. **Fase 2:** organizar o estoque. Só depois disso o assistente passa a responder disponibilidade de produtos fora dos stories.

## Como medir a venda casada

O teste não mede conversão real. Depois de implantado, comparar por quatro semanas:

- taxa de aceite da sugestão;
- ticket médio das conversas com e sem sugestão;
- reclamações de "insistência".

## Limites desta demo

- A demo simula o Direct; não está ligada ao Instagram de verdade.
- Nome da loja, cidade e preços são fictícios na versão pública.
- Cada conversa do teste usa o horário real em que a mensagem chegou.
