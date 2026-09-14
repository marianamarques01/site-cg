"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { MemberCardData } from "@/cineclube/types";
import { drawMemberCard } from "@/cineclube/lib/memberCard";
import { letterboxdProfileUrl } from "@/cineclube/lib/letterboxd";

/**
 * Carteirinha digital: renderiza o canvas desenhado por drawMemberCard,
 * com entrada "saindo da máquina de imprimir" e botão de download em PNG.
 */
export function MemberCard({ data }: { data: MemberCardData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    /* espera as fontes carregarem para o canvas usar a tipografia certa */
    document.fonts.ready.then(() => {
      if (canvasRef.current) {
        drawMemberCard(canvasRef.current, data).then(() => setReady(true));
      }
    });
  }, [data]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `carteirinha-melies-${data.memberNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ y: -40, opacity: 0, rotate: -4 }}
        animate={{ y: 0, opacity: ready ? 1 : 0, rotate: -1.5 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="w-full max-w-2xl shadow-poster"
      >
        <canvas
          ref={canvasRef}
          className="h-auto w-full rounded-xl"
          role="img"
          aria-label={`Carteirinha de membro de ${data.name}, número ${data.memberNumber}`}
        />
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={download}
          className="rotate-1 bg-melies-peach px-7 py-4 font-melies-typewriter text-sm font-bold uppercase tracking-widest text-melies-ink shadow-poster transition-transform hover:-rotate-1 hover:scale-105"
        >
          ↓ baixar carteirinha
        </button>
        {data.letterboxd && (
          <a
            href={letterboxdProfileUrl(data.letterboxd)}
            target="_blank"
            rel="noopener noreferrer"
            className="-rotate-1 border-2 border-melies-teal px-6 py-3.5 font-melies-typewriter text-sm uppercase tracking-widest text-melies-teal transition-all hover:rotate-1 hover:bg-melies-teal hover:text-melies-cream"
          >
            ●●● meu letterboxd
          </a>
        )}
      </div>

      <p className="max-w-md text-center font-melies-typewriter text-xs leading-relaxed text-melies-cream/50">
        Mostre a carteirinha (impressa ou no celular) para garantir prioridade
        nas sessões e desconto na lojinha. O QR code carrega seu número de
        membro{data.letterboxd ? " e seu Letterboxd" : ""}.
      </p>
    </div>
  );
}
