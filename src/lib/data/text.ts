/** Quebra um texto do admin em linhas de título (uma por Enter), ignorando linhas vazias. */
export function splitLines(text: string | null | undefined) {
  return text?.split("\n").map((line) => line.trim()).filter(Boolean) ?? [];
}
