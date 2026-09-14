"use client";

import { motion, useReducedMotion } from "framer-motion";

interface CurvedHeroTitleProps {
  topText?: string;
  bottomText?: string;
  className?: string;
}

/**
 * Título empilhado com arco para cima, como na identidade visual.
 * Usa SVG textPath para a curvatura e mantém as cores cream / peach do hero.
 */
export function CurvedHeroTitle({
  topText = "CINECLUBE",
  bottomText = "MELIES",
  className = "",
}: CurvedHeroTitleProps) {
  const reduced = useReducedMotion();
  const uid = "hero-title";

  return (
    <motion.div
      className={`mx-auto w-full max-w-[min(96vw,920px)] ${className}`}
      initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        viewBox="0 0 620 220"
        role="img"
        aria-label={`${topText} ${bottomText}`}
        className="h-auto w-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id={`${uid}-top`}
            d="M 24 98 Q 310 28 596 98"
            fill="none"
          />
          <path
            id={`${uid}-bottom`}
            d="M 8 188 Q 310 118 612 188"
            fill="none"
          />
        </defs>

        <text
          fill="#FBF4E8"
          fontFamily="var(--font-girassol), Girassol, serif"
          fontSize="76"
          letterSpacing="0.04em"
        >
          <textPath
            href={`#${uid}-top`}
            startOffset="50%"
            textAnchor="middle"
          >
            {topText}
          </textPath>
        </text>

        <text
          fill="#FFC585"
          fontFamily="var(--font-girassol), Girassol, serif"
          fontSize="96"
          letterSpacing="0.02em"
        >
          <textPath
            href={`#${uid}-bottom`}
            startOffset="50%"
            textAnchor="middle"
          >
            {bottomText}
          </textPath>
        </text>
      </svg>
    </motion.div>
  );
}
