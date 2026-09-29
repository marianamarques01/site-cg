// Converte links do YouTube/Vimeo em URL de incorporação (iframe).
export function getVideoEmbedUrl(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "").toLowerCase();

  if (host === "youtu.be") {
    const id = url.pathname.split("/")[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (host === "youtube.com" || host === "music.youtube.com") {
    const [, kind, pathId] = url.pathname.split("/");
    const id =
      kind === "watch" ? url.searchParams.get("v") : ["embed", "shorts", "live", "v"].includes(kind) ? pathId : null;
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").find((part) => /^\d+$/.test(part));
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}

export function validateVideoUrl(raw: string): string | null {
  if (!raw.trim()) return null;
  return getVideoEmbedUrl(raw) ? null : "Informe um link válido do YouTube ou Vimeo.";
}

// Aceita o endereço do embed do itch.io (itch.io/embed-upload/123) ou o código
// <iframe ...> inteiro colado, e devolve o endereço normalizado para o iframe.
export function getItchEmbedUrl(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;

  const src = value.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] ?? value;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(src) ? src : `https://${src}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host !== "itch.io") return null;

  const match = url.pathname.match(/^\/embed-upload\/(\d+)/);
  return match ? `https://itch.io/embed-upload/${match[1]}` : null;
}

export function validatePlayEmbedUrl(raw: string): string | null {
  if (!raw.trim()) return null;
  return getItchEmbedUrl(raw)
    ? null
    : "Cole o endereço do embed do itch.io (itch.io/embed-upload/…) ou o código <iframe> do jogo.";
}
