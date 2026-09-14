"use client";

/**
 * Grão de filme animado cobrindo a tela inteira.
 * Puramente decorativo — invisível para leitores de tela.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="texture-grain pointer-events-none fixed -inset-[100%] z-[90] h-[300%] w-[300%] animate-grain opacity-[0.07]"
    />
  );
}
