/** Aceita "@usuario", "usuario" ou URL completa e devolve o link do perfil. */
export function instagramUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://www.instagram.com/${trimmed.replace(/^@/, "")}`;
}

/** Aceita "@canal" ou URL completa e devolve o link do canal. */
export function youtubeUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://www.youtube.com/@${trimmed.replace(/^@/, "")}`;
}
