"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { CurvedHeroTitle } from "@/cineclube/components/ui/CurvedHeroTitle";
import { Marquee } from "@/cineclube/components/ui/Marquee";
import { withBasePath } from "@/lib/base-path";

/**
 * HERO — um pôster vivo.
 * A lua mascote flutua e segue o mouse em parallax, os títulos entram
 * letra a letra como créditos, recortes de papel e estrelas orbitam,
 * Tudo sai de cena com o scroll.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  /* Parallax de scroll: o conteúdo sobe e some conforme rolamos */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const moonY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  /* Parallax de mouse: a lua e as estrelas reagem ao ponteiro */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const moonX = useSpring(useTransform(mx, [-0.5, 0.5], [-26, 26]), { stiffness: 60, damping: 18 });
  const moonYm = useSpring(useTransform(my, [-0.5, 0.5], [-18, 18]), { stiffness: 60, damping: 18 });
  const starsX = useSpring(useTransform(mx, [-0.5, 0.5], [14, -14]), { stiffness: 50, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="topo"
      ref={ref}
      onMouseMove={handleMouse}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-melies-purple"
    >
      {/* camadas de fundo: papel + spotlight + meio-tom */}
      <div className="texture-paper absolute inset-0 opacity-40 mix-blend-multiply" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(255,197,133,0.16), transparent 70%)",
        }}
      />
      <div className="texture-halftone absolute inset-x-0 bottom-0 h-64 text-melies-ink/30" aria-hidden />

      {/* estrelas flutuantes com parallax invertido */}
      <motion.div aria-hidden style={{ x: starsX }} className="absolute inset-0">
        {[
          { top: "14%", left: "8%", d: 0, s: "text-2xl" },
          { top: "22%", left: "84%", d: 1.2, s: "text-4xl" },
          { top: "64%", left: "6%", d: 0.6, s: "text-3xl" },
          { top: "72%", left: "88%", d: 1.8, s: "text-xl" },
          { top: "8%", left: "55%", d: 2.4, s: "text-2xl" },
        ].map((star, i) => (
          <motion.span
            key={i}
            className={`absolute text-melies-peach/70 ${star.s}`}
            style={{ top: star.top, left: star.left }}
            animate={{ rotate: [0, 20, -12, 0], scale: [1, 1.25, 0.9, 1] }}
            transition={{ duration: 6, delay: star.d, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
        ))}
      </motion.div>

      {/* tira de película atravessando a tela na diagonal */}
      <div
        aria-hidden
        className="absolute -left-16 top-[58%] hidden h-12 w-[130%] -rotate-6 bg-melies-navy opacity-70 md:block"
      >
        <div className="film-holes absolute inset-x-0 top-0 h-3.5" />
        <div className="film-holes absolute inset-x-0 bottom-0 h-3.5" />
      </div>

      {/* conteúdo principal */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pt-32 text-center md:pt-36"
      >
        {/* carimbo de abertura */}
        <motion.p
          initial={{ opacity: 0, scale: 2, rotate: 6 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
          className="stamp mb-6 text-[11px] text-melies-peach md:text-sm"
        >
          sessão gratuita · toda semana · fumec
        </motion.p>

        {/* a lua, protagonista — nasce do horizonte antes de flutuar */}
        <motion.div style={{ y: moonY }} className="pointer-events-none relative">
          <motion.div style={{ x: moonX, y: moonYm }}>
            {/* entrada: a lua surge de baixo, cresce e desembaça */}
            <motion.div
              initial={{ opacity: 0, y: 130, scale: 0.35, rotate: -18, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.4,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.8 },
                filter: { duration: 1 },
              }}
            >
              {/* flutuação contínua depois da entrada */}
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 6, delay: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src={withBasePath("/cineclube/brand/mascot.png")}
                  alt="Lua de cartola, mascote do Cineclube Méliès"
                  width={210}
                  height={228}
                  priority
                  className="drop-shadow-[0_18px_40px_rgba(33,23,53,0.6)] md:w-[240px]"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* título empilhado e curvado, como na identidade */}
        <CurvedHeroTitle className="mt-8 md:mt-10" />

      </motion.div>

      {/* marquise inferior */}
      <div className="relative z-10">
        <Marquee
          items={Array.from({ length: 6 }, () => "CINECLUBE MELIES")}
          className="border-t-2 border-melies-ink/20 bg-melies-ink/90 py-3 font-melies-display text-lg uppercase tracking-wide text-melies-cream md:text-2xl"
        />
      </div>
    </section>
  );
}
