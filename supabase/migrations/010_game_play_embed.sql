-- Jogo jogável incorporado (itch.io) na página do jogo

ALTER TABLE public.games ADD COLUMN IF NOT EXISTS play_embed_url TEXT;
