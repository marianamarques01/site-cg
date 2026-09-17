export function normalizeExternalUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // `new URL()` silently percent/punycode-encodes free text (ex.: "não é
  // uma url") into a bogus hostname instead of rejecting it — URLs de
  // verdade não têm espaço, então isso barra esse caso antes do parse.
  if (/\s/.test(trimmed)) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateExternalUrl(raw: string): string | null {
  if (!raw.trim()) return null;
  if (!normalizeExternalUrl(raw)) {
    return "Informe um link válido (YouTube, Drive, itch.io etc.).";
  }
  return null;
}

export function externalLinkLabel(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();

  if (host.includes("youtube.com") || host === "youtu.be") return "Ver no YouTube";
  if (host.includes("drive.google.com")) return "Abrir no Google Drive";
  if (host.includes("itch.io")) return "Jogar no itch.io";
  if (host.includes("vimeo.com")) return "Ver no Vimeo";
  if (host.includes("artstation.com")) return "Ver no ArtStation";
  if (host.includes("behance.net")) return "Ver no Behance";

  return "Abrir link externo";
}
