import Image from "next/image";
import clsx from "clsx";

export type PlaceholderTone = "blue" | "violet" | "electric" | "mix";

/**
 * What the placeholder is standing in for. Six identical 16:9 wireframe
 * rectangles read as a loading skeleton, not as work — so each kind draws the
 * thing its category actually produces.
 */
export type PlaceholderKind = "mesh" | "tilemap" | "timeline" | "layout" | "grid";

export const GRADIENTS: Record<PlaceholderTone, string> = {
  blue: "linear-gradient(160deg, color-mix(in srgb, var(--color-brand) 38%, var(--color-void)) 0%, var(--color-void) 72%)",
  violet:
    "linear-gradient(160deg, color-mix(in srgb, var(--color-violet) 38%, var(--color-void)) 0%, var(--color-void) 72%)",
  electric:
    "linear-gradient(160deg, color-mix(in srgb, var(--color-electric) 38%, var(--color-void)) 0%, var(--color-void) 72%)",
  mix: "linear-gradient(160deg, color-mix(in srgb, var(--color-violet) 32%, var(--color-void)) 0%, color-mix(in srgb, var(--color-brand) 30%, var(--color-void)) 55%, var(--color-void) 100%)",
};

/** Maps the project/hero categories onto a wireframe. */
export const KIND_BY_CATEGORY: Record<string, PlaceholderKind> = {
  "Modelagem 3D": "mesh",
  "Concept Art": "mesh",
  Animação: "timeline",
  Posters: "layout",
  Ilustração: "layout",
  Jogos: "tilemap",
  Produções: "grid",
};

type PlaceholderMediaProps = {
  label: string;
  index?: string;
  tone?: PlaceholderTone;
  kind?: PlaceholderKind;
  src?: string;
  alt?: string;
  className?: string;
  showCaption?: boolean;
  priority?: boolean;
  /** Set false where the parent isn't a `group` (the cursor-following preview). */
  interactive?: boolean;
  /** Where to place the index number when provided. */
  indexPosition?: "caption" | "corner";
};

export default function PlaceholderMedia({
  label,
  index,
  tone = "blue",
  kind,
  src,
  alt,
  className,
  showCaption = true,
  priority = false,
  interactive = true,
  indexPosition = "caption",
}: PlaceholderMediaProps) {
  const resolved = kind ?? KIND_BY_CATEGORY[label] ?? "grid";

  return (
    <div
      className={clsx(
        "relative isolate flex h-full w-full flex-col justify-end overflow-hidden",
        className,
      )}
      style={{ background: "var(--color-surface)" }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? label}
          fill
          priority={priority}
          className="object-cover"
          sizes="(min-width: 1024px) 40vw, 90vw"
        />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{ background: GRADIENTS[tone] }}
            aria-hidden="true"
          />
          <Wireframe kind={resolved} />
        </>
      )}

      {/* Viewport corner marks — the best detail in the visual system, and
          until now a static one. On hover and on keyboard focus they open out
          to frame the whole image: the gesture of selecting an object in a 3D
          viewport, which is this site's own vocabulary. */}
      <CornerMarks interactive={interactive} />

      {index && indexPosition === "corner" && (
        <span className="absolute left-3 top-3 z-10 font-sans text-[0.65rem] tabular-nums text-magenta/90">
          {index}
        </span>
      )}

      {showCaption && (
        <div className="relative z-10 flex items-end justify-between gap-3 p-4">
          <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.14em] text-white/85">
            {label}
          </span>
          {index && indexPosition === "caption" && (
            <span className="font-sans text-[0.7rem] tabular-nums text-white/50">
              {index}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function CornerMarks({ interactive }: { interactive: boolean }) {
  const base =
    "pointer-events-none absolute h-4 w-4 border-white/25 transition-transform duration-[320ms] ease-[cubic-bezier(0.65,0.05,0,1)]";
  const lift = interactive
    ? "group-hover:scale-[2.1] group-focus-visible:scale-[2.1]"
    : "";

  return (
    <div aria-hidden="true">
      <span className={clsx(base, lift, "left-3 top-3 origin-top-left border-l border-t")} />
      <span className={clsx(base, lift, "right-3 top-3 origin-top-right border-r border-t")} />
      <span className={clsx(base, lift, "bottom-3 left-3 origin-bottom-left border-b border-l")} />
      <span className={clsx(base, lift, "bottom-3 right-3 origin-bottom-right border-b border-r")} />
    </div>
  );
}

/* --------------------------------------------------------------------------
   The wireframes. Each is a single inline SVG on a normalised 100x100 box, so
   it stretches with whatever aspect ratio the caller asked for. Stroke only —
   these sit under the caption and must never compete with it.
   -------------------------------------------------------------------------- */

export function Wireframe({ kind, className }: { kind: PlaceholderKind; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className ?? "absolute inset-0 h-full w-full text-foreground opacity-[0.18] mix-blend-screen"}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.4"
      vectorEffect="non-scaling-stroke"
    >
      {kind === "mesh" && <MeshWire />}
      {kind === "tilemap" && <TilemapWire />}
      {kind === "timeline" && <TimelineWire />}
      {kind === "layout" && <LayoutWire />}
      {kind === "grid" && <GridWire />}
    </svg>
  );
}

/** Modelagem 3D / Concept Art — a quad mesh wrapping a volume. */
function MeshWire() {
  const rings = [18, 30, 42, 54, 66, 78];
  return (
    <g>
      {rings.map((y, i) => {
        const r = 30 * Math.sin((Math.PI * (i + 0.7)) / (rings.length + 0.4));
        return <ellipse key={y} cx="50" cy={y} rx={r} ry={r * 0.32} />;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const t = (i / 8) * Math.PI;
        return (
          <path
            key={i}
            d={`M50 12 C ${50 + 34 * Math.cos(t)} 34, ${50 + 34 * Math.cos(t)} 62, 50 88`}
          />
        );
      })}
    </g>
  );
}

/** Jogos — a tile map with a collision box and a path through it. */
function TilemapWire() {
  const step = 100 / 12;
  return (
    <g>
      {Array.from({ length: 13 }, (_, i) => (
        <path key={`v${i}`} d={`M${i * step} 0 V100`} opacity="0.5" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`h${i}`} d={`M0 ${i * (100 / 8)} H100`} opacity="0.5" />
      ))}
      <rect x={step * 2} y="50" width={step * 3} height={100 / 8} strokeWidth="0.9" />
      <rect x={step * 7} y="25" width={step * 2} height={(100 / 8) * 2} strokeWidth="0.9" />
      <path
        d={`M${step} 87 H${step * 4} V62 H${step * 7} V37 H${step * 11}`}
        strokeWidth="0.9"
        strokeDasharray="3 2"
      />
    </g>
  );
}

/** Animação — a dope sheet: tracks, keyframes and an easing curve. */
function TimelineWire() {
  const tracks = [24, 40, 56, 72];
  const keys = [
    [12, 34, 58, 86],
    [20, 50, 74],
    [8, 30, 44, 68, 92],
    [26, 62],
  ];
  return (
    <g>
      <path d="M0 12 H100" opacity="0.6" />
      {Array.from({ length: 21 }, (_, i) => (
        <path key={i} d={`M${i * 5} 8 V12`} opacity="0.45" />
      ))}
      {tracks.map((y, i) => (
        <g key={y}>
          <path d={`M0 ${y} H100`} opacity="0.4" />
          {keys[i].map((x) => (
            <rect
              key={x}
              x={x - 1.4}
              y={y - 1.4}
              width="2.8"
              height="2.8"
              strokeWidth="0.9"
              transform={`rotate(45 ${x} ${y})`}
            />
          ))}
        </g>
      ))}
      <path d="M0 92 C 30 92, 46 80, 62 66 S 84 44, 100 42" strokeWidth="0.9" />
    </g>
  );
}

/** Posters / Ilustração — a print grid with baselines and a bleed margin. */
function LayoutWire() {
  return (
    <g>
      <rect x="6" y="6" width="88" height="88" strokeDasharray="2 2" opacity="0.7" />
      <rect x="12" y="12" width="76" height="76" />
      {[3, 4, 5].map((n) => (
        <path key={n} d={`M${12 + (76 / 6) * n} 12 V88`} opacity="0.45" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M12 ${34 + i * 5} H88`} opacity="0.3" />
      ))}
      <rect x="12" y="12" width={76 / 2} height="18" strokeWidth="0.9" />
    </g>
  );
}

/** The neutral fallback — the original viewport grid. */
function GridWire() {
  const step = 100 / 7;
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`v${i}`} d={`M${i * step} 0 V100`} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`h${i}`} d={`M0 ${i * step} H100`} />
      ))}
    </g>
  );
}
