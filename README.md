# Assistente da loja

Um assistente de IA que responde, na hora, as clientes que respondem aos stories de uma loja de cosméticos de bairro. O que precisa de cuidado vai para a equipe com um rascunho pronto.

**Demo:** [assistente-loja.vercel.app](https://assistente-loja.vercel.app). **Proposta para o dono:** [`/proposta`](https://assistente-loja.vercel.app/proposta). **Relatório de viabilidade:** [`content/relatorio.md`](content/relatorio.md)

## O problema

Uma loja de cosméticos de bairro atende por telefone, WhatsApp e Direct do Instagram, cerca de 1.200 mensagens por mês. O dono reclamava de três coisas:

- mensagens fora do horário;
- clientes ligando no celular pessoal dele;
- demora no Instagram.

Analisei 32 conversas reais:

- **56% eram respostas a stories da própria loja**, quase sempre "qual valor?".
- **37% chegaram com a loja fechada**, entre 18h38 e 3h25.
- Algumas eram pessoais (condolências, agradecimentos) e pedem o dono, não um robô.

Duas restrições moldaram a solução:

- **O estoque não é confiável.** Mas, se o produto está no story, a loja acabou de mostrar que tem.
- **A loja não mostra preço em público**, para a concorrência não ver. O preço só pode sair em conversa privada.

## A solução

1. A loja registra produto e preço de cada story numa tabela privada.
2. Quando a cliente responde ao story, o assistente manda o preço no privado, no tom da loja, e oferece o próximo passo: separar ou mandar pelo moto táxi, sempre com a taxa.
3. Pode sugerir **um** item da mesma linha, nunca insiste e nunca cria urgência falsa.
4. O resto (disponibilidade, indicação, reclamação, desconto) recebe "Só um momento, vou verificar aqui na loja 😊" e vai na hora para a equipe, com rascunho pronto. Mensagens pessoais não recebem resposta automática.
5. Regras fixas no código barram resposta com preço fora do cadastro ou com urgência falsa, mesmo que o modelo erre.

## Resultados

Teste com 38 conversas: as 32 reais, reescritas sem dados pessoais, e 6 casos difíceis.

| | |
|---|---|
| Comportamento esperado | **38 de 38** |
| Erros graves (preço inventado, resposta a mensagem pessoal, insistência) | **0** |
| Mensagens resolvidas sozinho | **55%** |
| Custo de IA por mês (1.200 mensagens, Claude Haiku 5.5) | **cerca de R$ 2,50** |
| Tempo devolvido ao dono | **cerca de 33 horas por mês** (premissa: 3 minutos por resposta) |

Cada rodada do teste e o que mudou nela está em [`eval/NOTAS.md`](eval/NOTAS.md). Na primeira avaliação, 16 dos 17 "erros graves" eram do avaliador, não do modelo.

Pela pesquisa na documentação da Meta ([`docs/pesquisa-meta.md`](docs/pesquisa-meta.md)):

- a API de mensagens do Instagram é gratuita;
- o webhook informa qual story a cliente respondeu.

A recomendação é implantar em fases, começando sem IA (WhatsApp Business oficial da loja).

## Como foi construído

- **Next.js 16 + TypeScript**, publicado na Vercel.
- **Claude Haiku 5.5** com saída estruturada (`responder`, `encaminhar` ou `silenciar`) em [`src/lib/assistente/`](src/lib/assistente/).
- **Guardas determinísticas** em [`guardas.ts`](src/lib/assistente/guardas.ts): preço fora do story, urgência falsa, uma sugestão por conversa, mensagem de espera conforme o horário.
- **Horário da loja** em [`horario.ts`](src/lib/loja/horario.ts), incluindo o primeiro sábado do mês, que fecha mais tarde.
- **Avaliação** em [`eval/`](eval/): casos rotulados, avaliador automático e métricas de custo e tempo.
- **109 testes** (Vitest).

O raciocínio completo (evidência, custos, riscos e recomendação em fases) está no [relatório](content/relatorio.md).

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # coloque ANTHROPIC_API_KEY e um CODIGO_ACESSO
npm test
npm run eval                 # roda os 38 casos no Claude (cerca de US$ 0,015)
npm run dev                  # http://localhost:3000
npm run eval -- --local      # opcional: roda com os dados reais (data/local, fora do git)
npm run apresentar           # abre a demo com o nome e os preços reais, para mostrar ao dono
```

## Privacidade e limites

- **Dados fictícios:** nome da loja, cidade e preços são fictícios. Os dados reais e os prints nunca entraram no repositório.
- **Sem integração real:** a demo simula o Direct e não está ligada ao Instagram.
- **Vendas não medidas:** o teste mede decisões e custo, não vendas.
