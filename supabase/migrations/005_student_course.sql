ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS student_course TEXT;
