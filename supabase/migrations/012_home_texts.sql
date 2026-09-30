-- Textos editáveis das seções da home (títulos, descrições, links)

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS home_texts JSONB NOT NULL DEFAULT '{}'::jsonb;
