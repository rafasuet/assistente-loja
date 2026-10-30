# Pesquisa de viabilidade de atendimento com IA no WhatsApp e Instagram no Brasil

Consulta realizada em **30 de outubro de 2026**. Tarifas do WhatsApp com vigência em **1º de outubro de 2026**, conferidas na documentação técnica e nos arquivos oficiais de preços. [Meta: tarifas vigentes](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#rate-cards-and-volume-tiers).

Premissas fornecidas pela loja: cerca de 1.200 mensagens recebidas por mês. Aproximadamente 800 no Instagram e 400 no WhatsApp, pela divisão informada. São mensagens, não necessariamente clientes ou conversas distintas. A parcela recebida fora do expediente não foi informada. Esses volumes são dados do solicitante e cálculos sobre eles.

## Tabela-resumo de custos

Valores de entrega cobrados pela Meta. Para WhatsApp, considera-se destinatária com número brasileiro. Não incluem desenvolvimento, hospedagem, modelo de IA, mensalidade de fornecedor nem tributos aplicáveis. A Meta informa que parceiros podem cobrar serviços adicionais e que tributos entram na fatura. [FAQ oficial](https://business.whatsapp.com/resources/faq).

| Canal ou categoria | Preço atual | Condição e fonte oficial |
| --- | --- | --- |
| WhatsApp: mensagem recebida da cliente | **R$ 0** | A Meta não cobra mensagens de usuários para empresas. [Preços](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#how-meta-charges-for-messages). |
| WhatsApp: resposta de serviço, por pessoa ou IA própria/terceirizada | **R$ 0 nas primeiras 1.000 mensagens de serviço entregues no mês, por número comercial. Depois, R$ 0,0350 por mensagem** | A franquia é mensal e não acumula. A tarifa brasileira equivalente na tabela em dólar é **US$ 0,0068**. [Franquia](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-tier-of-monthly-service-messages) e [tabelas BRL e USD, linha Brazil](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#rate-cards-and-volume-tiers). |
| WhatsApp: modelo de utilidade | **R$ 0,0350 ou US$ 0,0068 por mensagem entregue**, na tarifa de lista | Desde a mudança de outubro, também é cobrado dentro da janela de atendimento. Não usa a franquia de serviço. [Mudança](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#effective-october-1-2026) e [tarifas](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#rate-cards-and-volume-tiers). |
| WhatsApp: modelo de marketing | **R$ 0,3217 ou US$ 0,0625 por mensagem entregue**, na Cloud API | Tarifa de lista para o Brasil. [Tabelas BRL e USD, linha Brazil](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#rate-cards-and-volume-tiers). |
| WhatsApp: modelo de autenticação | **R$ 0,0350 ou US$ 0,0068 por mensagem entregue**, na tarifa de lista | A coluna de autenticação internacional aparece como não aplicável ao Brasil. [Tabelas BRL e USD, linha Brazil](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#rate-cards-and-volume-tiers). |
| Instagram: atendimento por API | **Sem tarifa de uso da plataforma de mensagens da Meta** | A documentação declara gratuidade e inclui mensagens para contas profissionais do Instagram. Isso não inclui IA, infraestrutura ou fornecedor. [Visão geral oficial](https://developers.facebook.com/documentation/business-messaging/messenger-platform/overview/). |
| WhatsApp Business: app e ferramentas básicas | **Grátis** | App gratuito. Ausência, respostas rápidas, catálogo e etiquetas são ferramentas nativas. Serviços opcionais podem ser pagos. [FAQ](https://business.whatsapp.com/resources/faq) e [recursos](https://business.whatsapp.com/products/business-app-features). |
| Instagram: respostas salvas, FAQs e automações básicas do Business Suite | **Sem contratação de API ou ferramenta externa** | O Business Suite é gratuito. Os recursos dependem da conta e dos canais conectados. [Gratuidade](https://www.facebook.com/business/help/205614130852988), [respostas salvas](https://www.facebook.com/business/help/instagram/1264898753662278) e [automações](https://www.facebook.com/business/help/395965998733706). |

**Atenção à atualização de 2026:** a página comercial de preços ainda dizia que mensagens de serviço eram gratuitas sem essa limitação. A documentação técnica informa expressamente a cobrança e a franquia desde outubro. Este relatório usa a documentação técnica e a resposta atualizada da FAQ sobre preços. Não usa a página comercial isoladamente para concluir gratuidade ilimitada. [Página comercial divergente](https://business.whatsapp.com/products/platform-pricing), [documentação técnica](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/) e [FAQ](https://business.whatsapp.com/resources/faq).

## 1. WhatsApp Business Platform e Cloud API no Brasil

### 1.1 Como funciona a cobrança

A cobrança atual é **por mensagem entregue da empresa para a cliente**. Não é por conversa. O modelo por conversa foi substituído em julho de 2025. Enviar uma mensagem sem entrega não gera essa cobrança. O mercado tarifário depende do código de país do telefone da destinatária. A localização da loja, sozinha, não determina a tarifa. [Regra oficial](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#how-meta-charges-for-messages).

As categorias relevantes são:

- **Serviço:** resposta sem modelo aprovado, dentro da janela de atendimento. Pode ser escrita por uma pessoa ou por uma IA de terceiros.
- **Marketing:** modelos promocionais. Por exemplo, campanha de desconto ou recuperação de carrinho.
- **Utilidade:** modelos ligados a uma ação ou transação da cliente. Por exemplo, atualização de pedido.
- **Autenticação:** modelos de verificação de identidade. Por exemplo, código de acesso.

Essas definições e a separação entre mensagens com e sem modelo constam na [documentação de categorias](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#message-categories).

Existe ainda uma categoria separada para o **Meta Business Agent**, produto da própria Meta. Ela tem cobrança por tokens, que abrange o agente e a entrega. Não se deve aplicar essa cobrança a todo chatbot que usa IA. O assistente próprio da loja se enquadra como serviço quando envia respostas sem modelo. [Distinção oficial](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages/).

Também existe uma política específica para provedores de assistentes de IA de uso geral. A Meta esclarece que essa política não muda os preços das demais empresas. Não é correto aplicá-la automaticamente a uma loja que usa IA para seu atendimento. [Política para provedores de IA](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/ai-providers/).

### 1.2 Quanto custa responder quando a cliente escreveu primeiro

A mensagem da cliente abre uma **janela de atendimento de 24 horas**. Cada nova mensagem dela reinicia essa janela. Nesse período, a loja pode responder sem modelo. Fora dele, precisa usar um modelo aprovado para retomar o contato, observadas as regras aplicáveis. [Janela e tipos de mensagem](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#non-template-messages).

**A janela autoriza a resposta, mas não garante gratuidade ilimitada em outubro de 2026.** As respostas sem modelo consomem a franquia de serviço. A cobrança começa na **1.001ª mensagem de serviço entregue no mês**, por número comercial. A franquia considera o serviço enviado pelo número, inclusive atendimento humano. Não é uma franquia exclusiva do bot. [Franquia oficial](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-tier-of-monthly-service-messages).

Há exceções para pontos de entrada gratuitos, como anúncios de clique para WhatsApp. A documentação atual prevê janela de até **7 dias**, sujeita às condições descritas pela Meta. Isso não se aplica automaticamente a uma cliente que escreveu pelo WhatsApp comum ou respondeu a um story no Instagram. O orçamento abaixo não pressupõe essa exceção. [Condições do ponto de entrada gratuito](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-entry-point-window-fep).

**Aplicação ao volume da loja.** Sem campanhas, modelos ou pontos de entrada especiais, considere `S` como o total mensal de respostas de serviço entregues pelo número, somando bot e pessoas:

`Custo de entrega de serviço = máximo(0, S − 1.000) × R$ 0,0350`.

Fórmula derivada da [franquia oficial](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-tier-of-monthly-service-messages) e da [tarifa brasileira em BRL](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#rate-cards-and-volume-tiers).

| Hipótese ilustrativa de saídas de serviço no mês | Custo de entrega de serviço pela Meta |
| --- | --- |
| 400 respostas entregues | **R$ 0**. Cálculo pela [franquia](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-tier-of-monthly-service-messages). |
| 1.200 respostas entregues | **R$ 7,00**: excedente de 200 × R$ 0,0350. Cálculo pela [franquia](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-tier-of-monthly-service-messages) e [tarifa](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#rate-cards-and-volume-tiers). |
| 2.000 respostas entregues | **R$ 35,00**: excedente de 1.000 × R$ 0,0350. Cálculo pela [franquia](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-tier-of-monthly-service-messages) e [tarifa](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#rate-cards-and-volume-tiers). |

São cenários, não uma previsão da fatura. Uma mensagem recebida pode gerar várias respostas. O total recebido não informa quantas saídas haverá nem sua categoria. Modelos cobrados entram à parte. As tabelas em BRL e USD são tabelas próprias da Meta; os valores acima não são conversões por câmbio estimado.

### 1.3 O que é preciso para começar

| Item | Exigência ou distinção |
| --- | --- |
| Cadastro e ativos | Conta de desenvolvedor Meta, app com caso de uso WhatsApp, portfólio empresarial e conta de mensagens do WhatsApp. A nomenclatura atual inclui **Messaging account**; a documentação ainda usa identificadores como `waba_id`. [Guia inicial](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started/). |
| Integração | Token de acesso e servidor de webhook para receber mensagens e eventos. O guia orienta gerar token de usuário do sistema com `whatsapp_business_messaging`, `whatsapp_business_management` e `business_management`. [Guia inicial](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started/). |
| Número | Número controlado pela empresa e apto à confirmação de posse por SMS ou ligação. É necessário registrá-lo para usar a Cloud API. [Números comerciais](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers/). |
| Número dedicado | No cadastro convencional, o número não pode continuar registrado no WhatsApp comum ou Business app. Ele ainda pode servir para ligações e SMS. Portanto, exclusividade no WhatsApp não significa obrigatoriamente comprar uma linha usada só para a API. [Regra convencional](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers/). |
| Usar o mesmo número no app e na API | Existe **Coexistence**, pelo Embedded Signup de um Solution Partner ou Tech Provider, com requisitos próprios. Não se deve presumir que o cadastro direto convencional oferece isso. [Coexistência oficial](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/). |
| Verificação da empresa | Não é pré-requisito universal para o primeiro teste ou para todo uso restrito. Portfólios novos têm limite inicial e podem ampliar capacidade por verificação ou outros caminhos. A verificação é necessária em cenários de acesso avançado e integração de outras empresas. Verificar o negócio é diferente de comprar Meta Verified ou obter selo. [Limites](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits/), [verificação para apps](https://developers.facebook.com/docs/apps/business-verification/) e [distinção do selo](https://www.facebook.com/business/help/2058515294227817). |
| Provedor BSP | **Opcional.** A empresa pode integrar diretamente ou contratar um provedor. O acesso direto não tem taxa adicional de acesso à plataforma. O provedor pode cobrar seus próprios serviços. [FAQ oficial](https://business.whatsapp.com/resources/faq). |
| Pagamento | Recomenda-se cadastrar a forma de pagamento para evitar interrupção após a franquia de serviço. Sem ela, a Meta informa que deixa de entregar as mensagens que excedam a franquia. [Regra de pagamento e franquia](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/#free-tier-of-monthly-service-messages). |

Os limites iniciais documentados referem-se a destinatários únicos alcançados **fora** da janela de atendimento. Não devem ser confundidos com teto mensal de respostas às clientes que escreveram primeiro. [Definição de limites](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits/).

### 1.4 O que o app WhatsApp Business oferece sem API

O app é gratuito. Estas funções básicas podem ser usadas sem contratar Cloud API ou BSP. [Gratuidade do app](https://business.whatsapp.com/resources/faq) e [lista oficial de recursos](https://business.whatsapp.com/products/business-app-features).

| Recurso | Utilidade para a loja |
| --- | --- |
| Mensagem de ausência | Enviar texto automático fora do expediente. Pode avisar quando a equipe volta. |
| Mensagem de saudação | Receber novas clientes com uma mensagem pronta. |
| Respostas rápidas | Atalhos para textos frequentes. A pessoa escolhe e envia a resposta. Não fazem atendimento contextual sozinhas. |
| Catálogo | Exibir cosméticos e compartilhar os produtos pelo chat. |
| Etiquetas | Organizar conversas por situação. Por exemplo, pedido pendente ou pagamento recebido. |

As funções da tabela são descritas na [página oficial de recursos do app](https://business.whatsapp.com/products/business-app-features).

Assim, a loja já pode oferecer um aviso automático de fechamento e organizar o atendimento sem pagar pela API. Esses recursos básicos não equivalem a uma IA que entende o produto de um story e mantém uma conversa. Não se deve concluir que tudo no app é gratuito: há serviços opcionais, como anúncios, Meta Verified e transmissões comerciais pagas. [Recursos e opções](https://business.whatsapp.com/products/business-app-features) e [cobrança de mensagens de marketing no app](https://faq.whatsapp.com/1022626499062292/).

## 2. Instagram Messaging API

### 2.1 Requisitos e diferenças entre os fluxos de login

É necessária uma **conta profissional do Instagram**, de empresa ou criador, e um app da Meta. Conta pessoal não atende aos requisitos. Também é preciso configurar tokens, webhook e permitir acesso às mensagens nas configurações da conta. [Visão geral](https://developers.facebook.com/documentation/instagram-platform/overview/) e [requisitos e solução de problemas](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/eligibility-and-troubleshooting/).

**A Página do Facebook não é uma exigência universal.** A documentação atual apresenta os seguintes fluxos:

| Configuração | Página do Facebook vinculada | Permissões de mensagens e particularidades |
| --- | --- | --- |
| **Instagram API with Unified Login** | **Não exige** | É a configuração recomendada atualmente pela Meta para novas integrações. Exige portfólio empresarial. Usa permissões como `instagram_basic` e `instagram_manage_messages`. `business_management` é necessário para operações de gestão do token e ativos descritas no guia. [Comparação oficial](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/) e [permissões](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/permissions/). |
| **Instagram API with Instagram Login** | **Não exige** | Para enviar e receber mensagens, o guia lista `instagram_business_basic` e `instagram_business_manage_messages`. Usa token de usuário Instagram. [Sem Página](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/) e [permissões de mensagens](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/messaging-api/#requirements). |
| **Instagram API with Facebook Login / integração via Messenger** | **Exige** | Usa `instagram_basic` e `instagram_manage_messages`. A configuração do Messenger também lista permissões de Página, como `pages_show_list`, `pages_manage_metadata` e `pages_read_engagement`, além de `business_management`. Solicitar apenas as dependências do fluxo e dos endpoints usados. [Visão geral e permissões](https://developers.facebook.com/documentation/business-messaging/messenger-platform/overview/). |

Os nomes das permissões dependem do fluxo. Não se deve trocar `instagram_manage_messages` por `instagram_business_manage_messages` sem mudar a configuração correspondente. [Mapeamento oficial](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/permissions/).

### 2.2 Revisão de app e verificação de negócio

A Meta distingue dois cenários:

- **App para uma empresa que o desenvolvedor possui ou administra:** a matriz do Instagram prevê **Standard Access sem App Review** para os cenários próprios descritos. É necessário vincular corretamente os ativos e as funções no app. O guia de mensagens alerta que alguns recursos podem não funcionar plenamente sem Advanced Access. [Matriz de revisão](https://developers.facebook.com/documentation/instagram-platform/app-review/) e [níveis de acesso](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/messaging-api/#requirements).
- **App que conecta contas de outras empresas sem função no app:** precisa de **Advanced Access**, revisão das permissões e verificação empresarial aplicável. No Unified Login, a documentação também exige app em modo Live para conectar esses clientes. [Unified Login: acesso e revisão](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/permissions/#access-levels-and-app-review) e [verificação](https://developers.facebook.com/docs/apps/business-verification/).

Aqui, “usuário do app” é a empresa ou pessoa que autoriza a integração. Não é automaticamente toda cliente que manda uma DM para a loja.

Para o relatório de viabilidade, **não é correto incluir revisão obrigatória em todo projeto de loja única**. Também não é correto prometer que todo recurso funcionará apenas em acesso padrão. O enquadramento depende de quem terá o app e os ativos, e das funções usadas. Isso deve ser confirmado no painel e em teste de ponta a ponta.

Quando houver revisão, a Meta pede app testável, política de privacidade, justificativa das permissões, instruções e gravação demonstrando os recursos solicitados. [Guia oficial de revisão do Instagram](https://developers.facebook.com/documentation/instagram-platform/app-review/).

### 2.3 O webhook identifica a resposta a um story?

**Sim.** A documentação do evento `messages` descreve `message.reply_to.story`, com `id` e `url` do story. Isso permite reconhecer que a mensagem é uma resposta ao story e identificar a mídia correspondente. [Exemplo oficial de webhook](https://developers.facebook.com/documentation/instagram-platform/webhooks/examples/#messages).

Recorte ilustrativo dos campos documentados:

```json
{
  "message": {
    "reply_to": {
      "story": {
        "id": "<STORY_ID>",
        "url": "<CDN_URL_FOR_THE_STORY>"
      }
    }
  }
}
```

O objeto acima é um recorte, não um webhook completo. Os campos são condicionais ao tipo de mensagem. `reply_to.mid` identifica uma resposta a outra mensagem do chat. Uma menção da loja em um story também é um evento diferente de responder ao story da loja. [Campos e exemplos](https://developers.facebook.com/documentation/instagram-platform/webhooks/examples/).

**Implicação para o projeto, por inferência:** o ID do story não é um código de produto. Para responder sobre o cosmético correto, a aplicação precisa relacionar a mídia ao produto. A Meta também informa que URLs de CDN deixam de retornar a mídia quando o conteúdo é apagado ou expira. Não há garantia, nas fontes consultadas, de acesso permanente à imagem de um story expirado. [URLs de mídia](https://developers.facebook.com/documentation/instagram-platform/overview/#content-delivery-network-urls).

### 2.4 Janela de resposta e custo

Para mensagens orgânicas, como as respostas a stories descritas pela loja, a janela padrão é de **24 horas** após a mensagem da cliente. A empresa pode responder por API nesse período, inclusive com automação. A documentação atual prevê uma exceção de até **7 dias** quando a pessoa envia a primeira mensagem depois de clicar em anúncio Click-to-Direct. Não se deve usar essa exceção para todas as DMs. [Regra atual](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/messaging-api/).

Há também uma janela separada de **7 dias para Human Agent**, voltada ao atendimento humano. Ela não é autorização para manter a IA respondendo fora da janela padrão. [Definição de Human Agent](https://developers.facebook.com/documentation/instagram-platform/overview/#features-and-permissions) e [política de mensagens](https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy/).

A Meta declara que a plataforma de mensagens é gratuita e inclui o atendimento de contas profissionais do Instagram. Não há tarifa equivalente às categorias pagas do WhatsApp nesse atendimento documentado. O custo da IA e de qualquer ferramenta contratada continua separado. [Declaração oficial de gratuidade](https://developers.facebook.com/documentation/business-messaging/messenger-platform/overview/).

### 2.5 Recursos nativos que ajudam sem desenvolver API

| Recurso | O que faz | Limite para atendimento fora do expediente |
| --- | --- | --- |
| **Respostas salvas** | Guardam textos e permitem inseri-los por atalho na caixa de mensagem. Disponíveis para contas profissionais no app móvel. [Ajuda oficial](https://www.facebook.com/business/help/instagram/1264898753662278). | A pessoa precisa selecionar e enviar. Não respondem sozinhas a toda mensagem recebida. |
| **Perguntas frequentes no Direct** | Exibem até **4 perguntas**, com respostas automáticas opcionais. [Configuração oficial](https://www.facebook.com/business/help/instagram/4153704678000867) e [funcionamento](https://www.facebook.com/business/help/instagram/502741564466925). | A cliente escolhe uma pergunta. Não é uma resposta contextual para qualquer texto ou produto de story. |
| **Resposta instantânea e mensagem de ausência** | Automações do Inbox do Meta Business Suite. A primeira recebe quem escreve pela primeira vez. A segunda responde quando a empresa não está disponível. [Ajuda oficial](https://www.facebook.com/business/help/395965998733706). | Enviam o conteúdo configurado. A disponibilidade varia conforme a conta, o canal e os recursos conectados. |

O **Meta Business Suite é gratuito**. Requer portfólio empresarial e contas conectadas. Para configurar, o caminho documentado é **Inbox → Automations → Create automation**. Não exige desenvolver um app próprio ou submeter esse app a revisão. [Gratuidade e requisitos do Suite](https://www.facebook.com/business/help/205614130852988) e [configuração de automações](https://www.facebook.com/business/help/318238182723007).

Para esta loja, essas opções permitem um primeiro atendimento com horário de retorno, localização e informações recorrentes. Elas não substituem a integração que cruza o story recebido com o catálogo de cosméticos.

## 3. Quanto tempo leva para colocar a API em funcionamento

**Não há um prazo total oficial para uma pequena loja brasileira sair do zero e ter o assistente em produção.** Cadastro, desenvolvimento, teste, verificação empresarial e revisão de app são etapas diferentes. Algumas podem não ser necessárias no cenário de app próprio. As fontes consultadas não permitem prometer uma data única.

| Etapa | Prazo publicado ou observado | Origem e limite da estimativa |
| --- | --- | --- |
| Primeiro teste da Cloud API | O guia permite criar o app, configurar a conta e enviar mensagem de teste. **Não publica duração garantida.** | [Meta: guia inicial](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started/). Conseguir enviar um teste não equivale a terminar uma integração de produção. |
| Verificação empresarial | A decisão pode levar até **14 dias úteis**. | [Meta: como verificar a empresa](https://www.facebook.com/business/help/2058515294227817). É a referência oficial de análise após o envio, não o tempo de reunir documentos ou corrigir divergências. |
| Verificação empresarial na experiência de fornecedor | **2 a 5 dias úteis**, tipicamente. | [Alibaba Cloud, documentação atualizada em 21/06/2026, seção 3.7](https://www.alibabacloud.com/help/en/chatapp/use-cases/how-to-register-as-a-meta-tech-provider). É uma estimativa do fornecedor para seu fluxo de Tech Provider. Não é garantia da Meta nem amostra específica de pequenas lojas brasileiras. |
| Revisão de app, quando exigida | O guia oficial diz que a decisão deve chegar em cerca de **uma semana** após a submissão. | [Meta: envio para revisão, etapa 6](https://developers.facebook.com/documentation/resp-plat-initiatives/individual-processes/app-review/submission-guide/). A página consultada informa atualização em 30/06/2026. Trata-se de expectativa, não SLA garantido. |
| Revisão de app na experiência de integrador em 2026 | Relato de espera de cerca de **20 dias** para a maioria dos envios. | [bundle.social, artigo de 04/08/2026](https://bundle.social/blog/meta-app-review-20-days). O fornecedor relata experiência própria e um aviso no painel da Meta. O aviso não foi confirmado diretamente no painel nesta pesquisa. O texto não esclarece se são dias úteis e não apresenta amostra auditável. É referência secundária para margem de cronograma. |
| Revisão dispensada no cenário próprio | **Não há espera por essa etapa**, se o app se enquadrar no cenário de Standard Access sem revisão. | [Meta: matriz de cenários](https://developers.facebook.com/documentation/instagram-platform/app-review/). Isso não elimina configuração, teste, limitações de recursos ou outras verificações aplicáveis. |

### Como usar esses prazos no relatório de viabilidade

- **Integração própria para a loja:** primeiro confirmar o cenário de acesso. Não acrescentar automaticamente uma fila de App Review. As fontes oficiais não dão uma duração para desenvolver o bot e validar o atendimento real.
- **Projeto que exige as duas aprovações:** se as etapas ocorrerem em sequência, a referência oficial de planejamento é até **14 dias úteis de verificação mais aproximadamente uma semana de revisão**. É soma das estimativas acima, não prazo máximo garantido do projeto. [Verificação](https://www.facebook.com/business/help/2058515294227817) e [revisão](https://developers.facebook.com/documentation/resp-plat-initiatives/individual-processes/app-review/submission-guide/).
- **Margem baseada em experiência de mercado:** o relato de cerca de **20 dias para revisão** justifica prever várias semanas para as aprovações. Esse número é do integrador, não uma confirmação de prazo oficial atual. [Relato do fornecedor](https://bundle.social/blog/meta-app-review-20-days).
- **Reenvios e implantação:** correções, documentos adicionais e nova submissão podem ampliar a espera. Não há base nas fontes consultadas para quantificar esse acréscimo. A Meta exige uma aplicação pronta e testável antes da revisão. [Orientações de submissão](https://developers.facebook.com/documentation/resp-plat-initiatives/individual-processes/app-review/submission-guide/).

O dado de viabilidade mais relevante é a combinação de dois fatores: o custo depende das **respostas entregues**, e o prazo depende do **tipo de acesso necessário**. O volume de entrada informado permite construir cenários de cobrança. Ele não determina sozinho a fatura nem o tempo de implantação.

## 4. Fontes consultadas

Todas consultadas em 30/10/2026. As fontes secundárias estão identificadas e são usadas apenas para estimativas de prazo. As regras e tarifas vêm das fontes oficiais.

### WhatsApp e custos

1. [Meta for Developers: preços da WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/). Página técnica atualizada em 30/09/2026. Tabelas vigentes em 01/10/2026. Foram lidos os arquivos **BRL list rates** e **USD list rates**, linha **Brazil**, células de preços na linha 9. O índice oficial é preferível aos links temporários de CDN para reencontrar esses arquivos.
2. [WhatsApp Business: página comercial de preços](https://business.whatsapp.com/products/platform-pricing). Consultada para comparação. Contém informação de gratuidade de serviço divergente da documentação técnica vigente.
3. [Meta: preços de mensagens sem modelo](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages/). Distingue serviço de Meta Business Agent.
4. [WhatsApp Business: perguntas frequentes](https://business.whatsapp.com/resources/faq). Integração direta, parceiros, cobrança, serviços adicionais e gratuidade do app. A resposta específica sobre preços foi usada; há trechos antigos sobre cobrança por conversa em outra resposta da mesma página.
5. [Meta: política de preços para provedores de IA](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/ai-providers/). Política específica para assistentes de IA de uso geral.
6. [Meta: primeiros passos com a Cloud API](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started/). Cadastro, ativos, tokens e webhook.
7. [Meta: números de telefone comerciais](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers/). Posse, confirmação e registro do número.
8. [Meta: coexistência com o WhatsApp Business app](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/). Requisitos e preços de app versus API.
9. [Meta: limites de mensagens](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits/). Limites iniciais e caminhos de ampliação.
10. [WhatsApp Business: recursos do app](https://business.whatsapp.com/products/business-app-features). Ausência, saudação, respostas rápidas, catálogo e etiquetas.
11. [WhatsApp Help Center: preços de mensagens de marketing no app](https://faq.whatsapp.com/1022626499062292/). Opções pagas e disponibilidade.

### Instagram, requisitos e recursos nativos

12. [Meta: visão geral da plataforma Instagram](https://developers.facebook.com/documentation/instagram-platform/overview/). Contas profissionais, permissões, Human Agent e mídia.
13. [Meta: Instagram API with Unified Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/). Configuração recomendada e comparação dos fluxos.
14. [Meta: permissões do Unified Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/permissions/). Permissões, acesso padrão, acesso avançado e revisão.
15. [Meta: requisitos e solução de problemas do Unified Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/eligibility-and-troubleshooting/). Ativos, acesso e configuração das mensagens.
16. [Meta: Instagram API with Instagram Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/). Conexão sem Página do Facebook.
17. [Meta: envio de mensagens com Instagram Login](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/messaging-api/). Permissões, acesso e janelas de resposta.
18. [Meta: revisão de app para Instagram](https://developers.facebook.com/documentation/instagram-platform/app-review/). Matriz por cenário e documentação de submissão.
19. [Meta: exemplos de webhooks do Instagram](https://developers.facebook.com/documentation/instagram-platform/webhooks/examples/). Evento `messages`, `reply_to.story.id` e `reply_to.story.url`.
20. [Meta: visão geral da plataforma de mensagens](https://developers.facebook.com/documentation/business-messaging/messenger-platform/overview/). Gratuidade, Instagram e fluxo com Facebook Login.
21. [Meta: política de mensagens](https://developers.facebook.com/documentation/business-messaging/messenger-platform/policy/). Janela padrão, exceção de anúncios e Human Agent.
22. [Meta Help Center: recursos profissionais e respostas salvas](https://www.facebook.com/business/help/instagram/1264898753662278).
23. [Meta Help Center: configurar perguntas frequentes no Direct](https://www.facebook.com/business/help/instagram/4153704678000867).
24. [Meta Help Center: funcionamento das perguntas frequentes](https://www.facebook.com/business/help/instagram/502741564466925).
25. [Meta Help Center: como o Business Suite funciona](https://www.facebook.com/business/help/205614130852988). Gratuidade e portfólio empresarial.
26. [Meta Help Center: automações do Inbox](https://www.facebook.com/business/help/395965998733706). Respostas instantâneas, ausência e variações por canal.
27. [Meta Help Center: configurar automações no computador](https://www.facebook.com/business/help/318238182723007).

### Verificação e prazos

28. [Meta for Developers: verificação da empresa para apps](https://developers.facebook.com/docs/apps/business-verification/). Relação com Advanced Access e funções no app.
29. [Meta Help Center: como verificar a empresa](https://www.facebook.com/business/help/2058515294227817). Prazo de até 14 dias úteis e distinção de Meta Verified.
30. [Meta: guia de submissão para App Review](https://developers.facebook.com/documentation/resp-plat-initiatives/individual-processes/app-review/submission-guide/). Atualizado em 30/06/2026. Expectativa de decisão em uma semana na etapa 6.
31. [Alibaba Cloud: registro de Meta Tech Provider](https://www.alibabacloud.com/help/en/chatapp/use-cases/how-to-register-as-a-meta-tech-provider). **Fonte secundária em relação à Meta.** Atualizada em 21/06/2026. Estimativa de verificação de 2 a 5 dias úteis na seção 3.7.
32. [bundle.social: experiência com App Review em 2026](https://bundle.social/blog/meta-app-review-20-days). **Fonte secundária em relação à Meta.** Publicada em 04/08/2026. Relato de aproximadamente 20 dias, sem garantia de prazo ou amostra auditável.
