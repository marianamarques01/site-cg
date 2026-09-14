import clsx, { type ClassValue } from "clsx";

/** Combina classes condicionalmente (atalho para clsx). */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Formata preço em BRL. */
export function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Gera o número de membro (sequencial fake + ano). Troque quando houver backend. */
export function generateMemberNumber() {
  const seq = Math.floor(1 + Math.random() * 998)
    .toString()
    .padStart(4, "0");
  return `MÉL-${new Date().getFullYear()}-${seq}`;
}
