# Supabase — FUMEC Criativa

## Setup (uma vez)

1. **Rodar o schema**  
   Supabase Dashboard → **SQL Editor** → cole e execute:
   - `migrations/001_initial_schema.sql`

2. **Galeria de produções** (refinamento)  
   Execute também:
   - `migrations/002_project_gallery.sql`

2b. **Submissões de alunos** (fila de moderação)  
   Execute também:
   - `migrations/003_project_submissions.sql`

2c. **Hero completo** (5 categorias)  
   Execute também:
   - `migrations/004_hero_categories_seed.sql`

3. **Popular dados iniciais**  
   No mesmo SQL Editor, execute:
   - `seed.sql`

4. **Criar usuário admin**  
   Dashboard → **Authentication** → **Users** → **Add user** (e-mail + senha).

5. **Promover a admin**  
   SQL Editor:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'seu-email@exemplo.com';
   ```

6. **Variáveis de ambiente**  
   Copie `.env.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (publishable key)
   - `SUPABASE_SERVICE_ROLE_KEY` (opcional, para scripts server-side)

## Acessar o painel

- Login: `/admin/login`
- Dashboard: `/admin`

Seções disponíveis: Posts, Produções, Jogos, Cursos, FAQ, Hero, Mídia, Configurações.

## Estrutura

| Tabela | Conteúdo |
|--------|----------|
| `posts` | Blog |
| `projects` | Produções |
| `games` | Jogos |
| `courses` | Páginas de curso |
| `faq_items` | FAQ da home |
| `hero_categories` | Cards do hero |
| `site_settings` | Contato, marquee, CTA |
| `media` | Metadados de uploads |
| `profiles` | Roles de editor |

Storage bucket `media` — imagens públicas (upload só para editores autenticados).
