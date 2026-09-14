-- Submissões de jogos por alunos + fila de moderação

ALTER TABLE public.games
  DROP CONSTRAINT IF EXISTS games_status_check;

ALTER TABLE public.games
  ADD CONSTRAINT games_status_check
  CHECK (status IN ('draft', 'pending', 'published', 'rejected'));

ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS student_email TEXT,
  ADD COLUMN IF NOT EXISTS student_course TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS external_url TEXT;

CREATE INDEX IF NOT EXISTS games_status_submitted_idx
  ON public.games (status, submitted_at DESC)
  WHERE status = 'pending';
