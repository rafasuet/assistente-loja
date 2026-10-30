# Notas das rodadas do teste

Modelo: `claude-haiku-5-5`, effort `low`. 38 casos (32 reescritos de prints reais, 6 extras). Nas rodadas 1 a 3, todos foram avaliados como se a loja estivesse fechada; a partir da 4, cada um usa o horário real em que chegou.

## Rodada 1 (interrompida no caso 20)
- O SDK não conseguiu ler um JSON cortado: `max_tokens` de 1.024 era pouco para o raciocínio do modelo mais a resposta.
- **Correção:** `max_tokens` subiu para 4.096 e JSON malformado agora vira encaminhamento ao dono (`falha_modelo`), em vez de derrubar a execução.

## Rodada 2: 21 acertos, 17 erros graves
- **16 dos 17 "erros" eram do avaliador, não do modelo.** O assistente oferecia a entrega por moto táxi (R$ 6,00), que é exatamente o próximo passo pedido no design, e o avaliador contava R$ 6 como preço inventado. **Correção:** a taxa de entrega passou a ser valor permitido na avaliação.
- **`tem-whatsapp`:** o modelo respondeu "ainda não temos um WhatsApp oficial, pode continuar por aqui", que está nas informações fixas. O rótulo é que estava errado e foi trocado para `responder`.
- **Achado de tom em `desconto`:** o modelo encaminhou certo, mas escreveu para a cliente "vou passar para a dona da loja". O dono é homem, e esse texto nem deveria chegar à cliente. **Correção:** em todo encaminhamento, o texto do modelo para a cliente é descartado e ela recebe a mensagem de espera fixa.

## Rodada 3: 38 acertos, 0 erros leves, 0 erros graves
- 55% das mensagens resolvidas sozinho (os 21 casos de preço de story e de informação fixa).
- Custo medido: cerca de US$ 0,0004 por mensagem, ou R$ 2,75 por mês para 1.200 mensagens.
- Custo da rodada inteira: US$ 0,016.

## Rodada 4: 36 acertos, 2 erros leves, 0 erros graves
Mudanças depois de ler as respostas com calma:
- **O assistente funciona a qualquer hora**, não só com a loja fechada. Antes, uma mensagem das 16h30 só seria respondida no dia seguinte na demo. Agora o que precisa de verificação recebe na hora "Só um momento, vou verificar aqui na loja 😊" e vai imediatamente para a equipe.
- **Tom menos robotizado:** no máximo duas frases, o produto pelo nome curto ("o shampoo", não "Shampoo Wella Invigo Nutri-Enrich 1L") e sem despejar prazo de reserva e taxa sem a cliente pedir.

Os 2 erros leves eram cautela demais: "Quantos?" foi lido como quantidade (no Direct, é preço) e um pedido para separar o shampoo do story foi para a equipe por medo do estoque.

## Rodada 5: 38 acertos, 0 erros leves, 0 erros graves
- O prompt explica que "quanto/qto/quantos/valor" num story significa preço e que o produto do story está na loja.
- 55% resolvido sozinho, cerca de R$ 2,55 por mês. Custo da rodada: US$ 0,015.
- Exemplo de resposta: "Bom dia! O shampoo sai R$ 189,90 e o condicionador R$ 199,90 😊 Quer que eu separe pra você ou prefere receber pelo moto táxi?"

## Rodada 6: 38 acertos, 0 erros
- Sempre que falar do moto táxi, citar a taxa de entrega. Virou regra no prompt e no avaliador (moto táxi sem a taxa = erro leve).
- As 16 respostas que citam o moto táxi trazem "(taxa de R$ 6,00)". R$ 2,47 por mês. Custo da rodada: US$ 0,014.

## Rodada 7: 38 acertos (público e dados reais)
- Sem "Oi!" se houve mensagem nas últimas 3 horas. Vale para a mensagem de espera (regra fixa no código) e para as respostas do modelo (aviso no prompt). Ex.: "Pode deixar! Vou separar o shampoo pra você e ele fica reservado por 3 dias."
- Sugestão de venda casada virou padrão quando o story tem complemento (aparece em 7 conversas, nunca depois de um "não").
