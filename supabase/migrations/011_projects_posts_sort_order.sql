-- Ordem manual (arrastar no admin) para produções e posts

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order INTEGER;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS sort_order INTEGER;
