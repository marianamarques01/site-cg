/**
 * Integração (futura) com o Letterboxd.
 *
 * A API oficial do Letterboxd é fechada; enquanto o acesso não sai,
 * este módulo isola tudo que depende dela. Quando a integração chegar,
 * basta implementar `fetchMemberDiary` — nenhum componente precisa mudar.
 */

export interface LetterboxdEntry {
  filmTitle: string;
  rating?: number; // 0.5 a 5
  watchedAt?: string;
  reviewUrl?: string;
}

/** Monta a URL pública do perfil a partir do @usuario. */
export function letterboxdProfileUrl(handle: string) {
  const clean = handle.replace(/^@/, "").trim();
  return `https://letterboxd.com/${encodeURIComponent(clean)}`;
}

/**
 * Stub: retorna vazio até a API estar disponível.
 * Futuramente: chamar a API/feed RSS do Letterboxd aqui.
 */
export async function fetchMemberDiary(
  _handle: string
): Promise<LetterboxdEntry[]> {
  return [];
}
