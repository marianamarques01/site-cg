const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixa caminhos de arquivos em /public para deploy com basePath (GitHub Pages). */
export function withBasePath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${basePath}${path}`;
}
