# JL Trainer Armadura — versão final

PWA fitness premium para cliente, coach e administração. A interface segue o conceito preto/grafite/dourado: sidebar no desktop, navegação inferior no celular, cards de métricas, treino interativo, evolução, plano e Assistente JL.

## Estado real da aplicação

- Login, cadastro, recuperação e troca de senha usam Supabase Auth.
- Conta nova começa como `client`, sem assinatura paga.
- Assinaturas só são ativadas por função SQL administrativa.
- Cliente não consegue alterar role, plano, vencimento ou pagamento pelo navegador.
- RLS separa dados próprios e dados da equipe.
- Uploads usam Storage privado e caminhos por usuário.
- Após o primeiro acesso, o onboarding recolhe peso, altura, objetivo e modalidade, calculando IMC estimado, meta de água e meta inicial de movimento.
- No celular e em janelas pequenas, o menu de três linhas abre todas as áreas da versão desktop, incluindo modalidades, calendário, ranking, cardio e gestão.
- A página de planos compara benefícios com ✓/× e aceita referência e foto de comprovativo para confirmação manual por M-Pesa/e-Mola/transferência via WhatsApp `868787572`.
- Há páginas-base para ranking e corrida/cardio; a ligação real a mapas, localização e desafios com câmera depende das chaves, consentimentos e backend específicos.
- Chat START/PRO/PREMIUM é guiado e persistido; a rota para IA futura fica no servidor (`guided_chat`), sem API key no frontend.
- Prévia sem Supabase existe apenas para verificar layout; ela exibe um aviso e não representa dados de produção.

## Publicar em 3 passos

### 1. GitHub

Crie um repositório vazio e, dentro desta pasta, execute:

```bash
git init
git add .
git commit -m "JL Trainer Armadura"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/jl-trainer-armadura.git
git push -u origin main
```

Não envie `.env` nem chaves privadas. O arquivo `.env.example` é seguro para versionar.

### 2. Vercel

Importe o repositório em **Add New Project**:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

Adicione em **Settings → Environment Variables**:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

### 3. Supabase

1. Crie o projeto.
2. No SQL Editor, execute `supabase/migrations/001_initial.sql` e depois `supabase/migrations/002_onboarding_progress.sql`.
3. Em Authentication → URL Configuration, adicione o domínio local e o domínio da Vercel.
4. Confirme o email de uma conta criada para testar.
5. Para criar o primeiro administrador, crie uma conta normal e, no SQL Editor, altere somente o papel da conta escolhida:

```sql
update public.profiles set role = 'admin' where email = 'seu-email-admin@exemplo.com';
```

6. Crie conteúdos, exercícios, treinos e datas na área de gestão. Os buckets privados são criados pela migration.

O cliente não deve receber `SUPABASE_SERVICE_ROLE_KEY`. Para produção, configure também SMTP do Supabase e uma política de privacidade com os dados da sua entidade.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Para uma prévia sem Supabase, clique em **Explorar prévia sem cadastro**; para login real, preencha o `.env`.

## Build

```bash
npm run build
npm run preview
```

## APK Android depois da PWA

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "JL Trainer Armadura" com.jltrainer.armadura
npm run build
npx cap add android
npx cap copy
npx cap open android
```

## Limites importantes

O Assistente JL inicial é uma conversa guiada, não uma IA generativa nem diagnóstico. O proprietário deve revisar o texto legal, os preços, dados do coach e regras locais de pagamentos antes de abrir para clientes reais.
