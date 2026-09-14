-- Submissões de produções por alunos + fila de moderação

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_status_check;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_status_check
  CHECK (status IN ('draft', 'pending', 'published', 'rejected'));

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS student_email TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

CREATE INDEX IF NOT EXISTS projects_status_submitted_idx
  ON public.projects (status, submitted_at DESC)
  WHERE status = 'pending';

-- Requer 002_project_gallery.sql. Atualiza policy só se a tabela existir.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'project_gallery'
  ) THEN
    DROP POLICY IF EXISTS "project_gallery_public_read" ON public.project_gallery;
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
  END IF;
END $$;
