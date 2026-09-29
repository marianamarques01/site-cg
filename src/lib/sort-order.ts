// Ordem manual (sort_order) primeiro; itens sem posição vêm antes, na ordem do `fallback`.
export function sortByManualOrder<T extends { sort_order?: number | null }>(
  rows: T[],
  fallback: (a: T, b: T) => number,
): T[] {
  return [...rows].sort((a, b) => {
    const aNull = a.sort_order == null;
    const bNull = b.sort_order == null;
    if (aNull && bNull) return fallback(a, b);
    if (aNull) return -1;
    if (bNull) return 1;
    return (a.sort_order as number) - (b.sort_order as number);
  });
}
