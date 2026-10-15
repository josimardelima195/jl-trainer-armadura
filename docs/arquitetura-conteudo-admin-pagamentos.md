# Arquitetura recomendada do JL Trainer

## Biblioteca visual de exercícios

A opção mais simples e segura para começar sem custo de licença é o **Free Exercise DB**. O repositório informa mais de 800 exercícios em JSON, imagens e instruções, e está publicado sob Unlicense. O catálogo deve ser importado para uma tabela própria com os campos `name`, `equipment`, `primary_muscles`, `secondary_muscles`, `level`, `category`, `instructions` e `image_path`. A imagem deve ser copiada para o Storage do projeto ou para `public/assets/exercises`, para não depender de links externos.

Fonte: [Free Exercise DB](https://github.com/yuhonas/free-exercise-db).

O GymVisual é visualmente mais próximo dos aplicativos comerciais. A licença oficial permite usar mídia de alta resolução sem marca d’água em aplicativo Android/iOS e website, mas somente depois de comprar a licença do ficheiro. A licença não autoriza copiar thumbnails com marca d’água, redistribuir os ficheiros, vender a biblioteca, sublicenciar a mídia ou usá-la para treinar IA. Usar a marca d’água como se fosse uma solução permanente não é o caminho correto para um produto comercial; a marca d’água é uma demonstração, não a licença do arquivo.

Fonte: [GymVisual — Non-Exclusive Commercial Royalty-Free License](https://gymvisual.com/content/9-license).

A decisão recomendada é: usar Free Exercise DB para a biblioteca básica agora; comprar apenas os GIFs realmente necessários para os exercícios premium; guardar a licença e a nota fiscal no projeto; e registrar em cada exercício a origem e o tipo de licença.

## Organização do catálogo

Cada exercício deve ter uma classificação única. Por exemplo, `Supino com halteres` fica em Peito, com equipamento, halteres, nível iniciante/intermédio, objetivo força/hipertrofia e imagem correspondente. `Flexão` fica em Peito, sem equipamento, nível iniciante/intermédio e objetivo força/resistência. Um exercício não deve usar a imagem de outro equipamento.

Os filtros da aplicação devem ser: modalidade, local, equipamento, grupo muscular, nível, objetivo e plano mínimo. O mesmo movimento pode aparecer em mais de um programa, mas conserva uma única ficha técnica para evitar descrições contraditórias.

## Ganho de massa em 30 dias

O aplicativo pode oferecer um **programa inicial de 30 dias**, mas não deve prometer “mudança brusca” ou ganho garantido. A atualização de 2026 da ACSM destaca consistência, individualização e aproximadamente 10 séries semanais por grupo muscular como referência de volume para hipertrofia em adultos saudáveis. Ela também reforça que peso corporal, elásticos e treinos em casa podem funcionar, desde que haja progressão.

Fonte: [ACSM — Resistance Training Guidelines 2026](https://acsm.org/resistance-training-guidelines-update-2026/).

A meta correta para os primeiros 30 dias é completar sessões, aprender a técnica, registrar cargas/repetições, dormir e alimentar-se adequadamente. O sistema deve aumentar uma variável por vez: repetições dentro da faixa, carga pequena ou uma série adicional, desde que a técnica continue boa. A OMS recomenda fortalecimento dos grandes grupos musculares em pelo menos dois dias por semana para adultos.

Fonte: [OMS — Physical activity](https://www.who.int/initiatives/behealthy/physical-activity).

## Horário e notificações

O utilizador deve escolher horário, dias da semana e tipos de lembrete. No site/PWA, o navegador só mostra notificações depois que a pessoa concede permissão, em HTTPS e normalmente após tocar num botão. No celular, notificações persistentes devem ser entregues por Service Worker/Push; um `setInterval` aberto na página não é confiável quando o navegador está fechado.

Fonte: [MDN — Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API).

Portanto, o botão “Ativar lembretes” pode funcionar enquanto a aplicação está aberta. Para avisos garantidos com o aplicativo fechado, a próxima etapa deve usar Web Push com VAPID ou notificações nativas do APK. Não se deve prometer lembrete garantido apenas com JavaScript no navegador.

## Gestor privado

O gestor atual já está protegido por `profiles.role` e pelas funções `is_staff()`/`is_admin()` do Supabase. A área fica escondida dos clientes e as funções administrativas verificam o papel no banco. Não é seguro criar uma senha fixa dentro do código nem enviar uma senha por chat.

A configuração correta é criar uma conta de proprietário no Supabase Auth, confirmar o e-mail, alterar o papel dessa conta para `admin` uma única vez no SQL Editor e ativar MFA. Depois disso, o gestor pode controlar clientes, assinaturas, pagamentos, conteúdos, planos, provas e estatísticas. O acesso deve ser feito pela mesma tela de login, abrindo a aba Gestão somente para `admin` ou `coach`.

## Comprovativo e WhatsApp

O upload do comprovativo já pode entrar na tabela `payments` e no bucket privado `payment-proofs`. O gestor deve visualizar a imagem, comparar nome, valor, referência e plano e confirmar. A função `admin_confirm_payment` cria uma assinatura ativa por 30 dias e suspende a anterior.

A confirmação automática por WhatsApp não pode ler mensagens de um WhatsApp pessoal. Para isso é necessário migrar o número para o WhatsApp Business Platform/Cloud API, criar uma aplicação Meta, configurar token, número de negócio e webhook HTTPS. A Meta envia eventos JSON para o webhook, incluindo mensagens recebidas e estados de mensagens, e exige permissões próprias.

Fonte: [Meta — WhatsApp Webhooks](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview).

Mesmo com webhook, uma foto de comprovativo não deve liberar plano apenas por OCR. O sistema pode extrair número, valor e referência para criar uma fila “sugerida”, mas a confirmação final deve comparar com o extrato/gateway ou ser aprovada pelo proprietário. A integração M-Pesa/e-Mola automática exige credenciais empresariais e documentação do provedor; sem isso o fluxo correto é comprovativo + aprovação manual.

## Próximas conexões necessárias

Para ativar a versão profissional, são necessários: conta Meta Business e WhatsApp Cloud API; conta empresarial/gateway M-Pesa ou e-Mola com API; licença GymVisual caso sejam usados GIFs comerciais; domínio HTTPS para webhook; VAPID/Web Push para lembretes com a aplicação fechada; e MFA ativo na conta administrativa.

Nunca devem ser colocados no frontend: token Meta, chave secreta de M-Pesa/e-Mola, service-role key do Supabase, senha do gestor ou qualquer segredo de webhook.
