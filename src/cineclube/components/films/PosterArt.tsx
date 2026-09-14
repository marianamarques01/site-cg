import type { Film } from "@/cineclube/types";

/**
 * Pôster "serigrafado" gerado em SVG a partir dos dados do filme.
 * Cada `motif` é uma composição gráfica diferente (lua, mar, alvo, estrada, asas),
 * na paleta definida em /data/films.ts — como cartazes de mostra impressos em riso.
 * Troque por imagens reais adicionando `posterUrl` ao tipo Film, se preferir.
 */
export function PosterArt({ film }: { film: Film }) {
  const { bg, fg, accent } = film.palette;
  const uid = `poster-${film.id}`;

  return (
    <svg
      viewBox="0 0 300 420"
      className="h-full w-full"
      role="img"
      aria-label={`Pôster de ${film.title}`}
    >
      <defs>
        <filter id={`${uid}-rough`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.5" />
        </filter>
        <pattern id={`${uid}-dots`} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill={fg} opacity="0.35" />
        </pattern>
      </defs>

      {/* fundo + moldura irregular */}
      <rect width="300" height="420" fill={bg} />
      <rect x="10" y="10" width="280" height="400" fill="none" stroke={fg} strokeWidth="3" filter={`url(#${uid}-rough)`} />

      <g filter={`url(#${uid}-rough)`}>
        {film.motif === 0 && (
          <g>
            {/* lua com cápsula no olho — homenagem ao plano do Méliès */}
            <circle cx="150" cy="165" r="85" fill={fg} />
            <circle cx="120" cy="140" r="16" fill={bg} />
            <circle cx="182" cy="150" r="20" fill={bg} />
            <rect x="168" y="128" width="30" height="10" rx="5" fill={accent} transform="rotate(-35 183 133)" />
            <path d="M110 205 Q150 232 195 200" stroke={bg} strokeWidth="6" fill="none" />
            {Array.from({ length: 9 }).map((_, i) => (
              <text key={i} x={30 + (i * 97) % 240} y={50 + (i * 61) % 330} fill={accent} fontSize="14">✦</text>
            ))}
          </g>
        )}
        {film.motif === 1 && (
          <g>
            {/* mar e horizonte — Limite */}
            {Array.from({ length: 7 }).map((_, i) => (
              <path
                key={i}
                d={`M0 ${210 + i * 26} Q75 ${196 + i * 26} 150 ${210 + i * 26} T300 ${210 + i * 26}`}
                stroke={fg}
                strokeWidth="5"
                fill="none"
              />
            ))}
            <circle cx="150" cy="120" r="52" fill={accent} />
            <rect x="138" y="60" width="24" height="120" fill={bg} opacity="0.25" />
          </g>
        )}
        {film.motif === 2 && (
          <g>
            {/* alvo + raio — cinema marginal */}
            {[95, 72, 49, 26].map((r, i) => (
              <circle key={r} cx="150" cy="170" r={r} fill={i % 2 ? bg : fg} />
            ))}
            <path d="M150 40 L128 175 L165 160 L120 330 L200 150 L158 168 L190 60 Z" fill={accent} stroke={bg} strokeWidth="4" />
          </g>
        )}
        {film.motif === 3 && (
          <g>
            {/* estrada ao pôr do sol — road movie */}
            <circle cx="150" cy="150" r="70" fill={accent} />
            <rect x="0" y="150" width="300" height="6" fill={fg} />
            <path d="M150 420 L110 160 L190 160 Z" fill={fg} />
            <path d="M150 420 L143 165 L157 165 Z" fill={bg} />
            {Array.from({ length: 5 }).map((_, i) => (
              <rect key={i} x="146" y={190 + i * 45} width="8" height="22" fill={accent} />
            ))}
          </g>
        )}
        {film.motif === 4 && (
          <g>
            {/* asas sobre a cidade */}
            <path d="M150 150 Q80 60 30 110 Q90 120 110 160 Q60 150 40 190 Q105 185 150 210 Z" fill={fg} />
            <path d="M150 150 Q220 60 270 110 Q210 120 190 160 Q240 150 260 190 Q195 185 150 210 Z" fill={fg} />
            <circle cx="150" cy="190" r="18" fill={accent} />
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={22 + i * 34} y={300 - ((i * 37) % 60)} width="22" height={120 + ((i * 37) % 60)} fill={fg} opacity={i % 2 ? 0.5 : 0.8} />
            ))}
          </g>
        )}
      </g>

      {/* faixa de meio-tom no rodapé */}
      <rect x="10" y="340" width="280" height="70" fill={`url(#${uid}-dots)`} />

      {/* título e créditos com tipografia de cartaz */}
      <text
        x="150"
        y="372"
        textAnchor="middle"
        fill={fg}
        fontSize={film.title.length > 16 ? 19 : 26}
        fontFamily="var(--font-girassol), serif"
        style={{ textTransform: "uppercase" }}
      >
        {film.title}
      </text>
      <text x="150" y="394" textAnchor="middle" fill={accent} fontSize="12" fontFamily="var(--font-melies-typewriter), monospace">
        {film.director} · {film.year}
      </text>
    </svg>
  );
}
