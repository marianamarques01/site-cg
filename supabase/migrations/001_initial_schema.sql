-- FUMEC Criativa — schema inicial
-- Rode no Supabase Dashboard → SQL Editor (ou: supabase db push)

-- ---------------------------------------------------------------------------
-- Perfis de editor (vinculados ao auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
  );
$$;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- Auto-criar profile ao registrar (role definido manualmente depois)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'editor')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Mídia
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  alt TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_public_read"
  ON public.media FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "media_editor_write"
  ON public.media FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- ---------------------------------------------------------------------------
-- Posts (blog)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  published_at DATE,
  excerpt TEXT NOT NULL,
  tone TEXT NOT NULL DEFAULT 'mix',
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  cover_image_id UUID REFERENCES public.media (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_status_published_at_idx
  ON public.posts (status, published_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_public_read"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "posts_editor_all"
  ON public.posts FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- ---------------------------------------------------------------------------
-- Produções (projects)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  student TEXT NOT NULL,
  category TEXT NOT NULL,
  year INTEGER NOT NULL,
  tone TEXT NOT NULL DEFAULT 'blue',
  aspect TEXT NOT NULL DEFAULT 'landscape',
  description TEXT NOT NULL,
  cover_image_id UUID REFERENCES public.media (id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  featured_order INTEGER,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_status_year_idx
  ON public.projects (status, year DESC);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_public_read"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "projects_editor_all"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- ---------------------------------------------------------------------------
-- Jogos
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  team TEXT NOT NULL,
  genre TEXT NOT NULL,
  platform TEXT NOT NULL,
  year INTEGER NOT NULL,
  tone TEXT NOT NULL DEFAULT 'blue',
  description TEXT NOT NULL,
  cover_image_id UUID REFERENCES public.media (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "games_public_read"
  ON public.games FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "games_editor_all"
  ON public.games FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- ---------------------------------------------------------------------------
-- Cursos
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "courses_public_read"
  ON public.courses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "courses_editor_all"
  ON public.courses FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- ---------------------------------------------------------------------------
-- FAQ da home
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "faq_public_read"
  ON public.faq_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "faq_editor_all"
  ON public.faq_items FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- ---------------------------------------------------------------------------
-- Categorias do hero
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  tone TEXT NOT NULL DEFAULT 'blue',
  aspect TEXT NOT NULL DEFAULT 'aspect-square',
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  layout JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_public_read"
  ON public.hero_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "hero_editor_all"
  ON public.hero_categories FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- ---------------------------------------------------------------------------
-- Configurações globais (singleton)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  contact_email TEXT,
  contact_address TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  marquee_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_title TEXT,
  cta_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_public_read"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "settings_editor_all"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_updated_at ON public.posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS games_updated_at ON public.games;
CREATE TRIGGER games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS courses_updated_at ON public.courses;
CREATE TRIGGER courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS hero_categories_updated_at ON public.hero_categories;
CREATE TRIGGER hero_categories_updated_at
  BEFORE UPDATE ON public.hero_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS site_settings_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Storage: bucket de mídia pública
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "media_bucket_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');

CREATE POLICY "media_bucket_editor_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_editor());

CREATE POLICY "media_bucket_editor_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_editor())
  WITH CHECK (bucket_id = 'media' AND public.is_editor());

CREATE POLICY "media_bucket_editor_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND public.is_editor());
