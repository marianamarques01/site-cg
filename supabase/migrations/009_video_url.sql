-- Vídeo incorporado (YouTube/Vimeo) em projetos e jogos

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS video_url TEXT;
