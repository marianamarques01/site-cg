-- Ordem manual dos jogos publicados (arrastar no admin)

ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS sort_order INTEGER;
