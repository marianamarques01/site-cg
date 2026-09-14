# FUMEC Criativa — site CG

Site do curso de Computação Gráfica e Design de Games (FUMEC), com painel admin, conteúdo no Supabase e formulário de submissão para alunos.

## Desenvolvimento local

```bash
cp .env.example .env.local   # preencha as chaves do Supabase
npm install
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Setup do banco: veja [`supabase/README.md`](supabase/README.md).

## Deploy na Vercel (recomendado)

A Vercel roda o site **completo**: admin, Supabase em tempo real, formulário de alunos e revalidação de cache.

### 1. Login e link do projeto

```bash
npm install
npm run vercel:login
npm run vercel:link
```

Conecte o repositório GitHub `marianamarques01/site-cg` quando solicitado.

### 2. Variáveis de ambiente

Preencha `.env.local` com as chaves do projeto Supabase **fumec-criativa** e sincronize:

```bash
npm run vercel:env
```

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | URL pública do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | Chave anon/publishable |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Submissões de alunos (server-side) |
| `DATABASE_URL` | Não | Scripts/migrations locais |
| `RESEND_API_KEY` | Não | E-mail ao receber submissão |
| `EMAIL_FROM` | Não | Remetente dos e-mails |
| `NEXT_PUBLIC_SITE_URL` | Não | URL canônica (fallback: `VERCEL_URL`) |

### 3. Deploy

```bash
npm run deploy          # produção
npm run deploy:preview  # preview de branch
```

Ou conecte o repo na [Vercel Dashboard](https://vercel.com/new) — cada push em `main` faz deploy automático **desde que** as variáveis acima estejam configuradas em **Settings → Environment Variables**.

> **Importante:** use `npm run build` (padrão). **Não** use `npm run build:pages` na Vercel — esse comando é só para GitHub Pages estático.

## GitHub Pages (legado / espelho estático)

O workflow `.github/workflows/deploy.yml` publica uma versão **estática** em GitHub Pages:

- Sem admin
- Sem Supabase (dados mock)
- Sem formulário de alunos

Use apenas como espelho estático. Para o site oficial com conteúdo editável, prefira a Vercel.

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor local |
| `npm run build` | Build de produção (Vercel) |
| `npm run build:pages` | Build estático para GitHub Pages |
| `npm run vercel:env` | Sincroniza `.env.local` → Vercel |
| `npm run deploy` | Deploy de produção na Vercel |
