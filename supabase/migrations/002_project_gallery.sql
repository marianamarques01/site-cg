-- Galeria de imagens por produção
-- Rode no Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.project_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects (id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media (id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (project_id, media_id)
);

CREATE INDEX IF NOT EXISTS project_gallery_project_idx
  ON public.project_gallery (project_id, sort_order);

ALTER TABLE public.project_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_gallery_public_read"
  ON public.project_gallery FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects AS p
      WHERE p.id = project_id
        AND p.status = 'published'
    )
  );

CREATE POLICY "project_gallery_editor_all"
  ON public.project_gallery FOR ALL
  TO authenticated
  USING (public.is_editor())
  WITH CHECK (public.is_editor());
