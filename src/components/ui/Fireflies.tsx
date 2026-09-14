/**
 * Fireflies drifting across the hero.
 *
 * Deliberately not a client component and deliberately not a rAF loop: the
 * whole thing is CSS, so it ships no JavaScript and the drift and the blink
 * both run off the compositor. Forty animated transforms driven from React
 * state would be forty re-renders a frame on the heaviest section of the site.
 *
 * Positions come from a seeded PRNG rather than `Math.random()` — the server
 * and the client have to agree on every value or the whole field is a
 * hydration mismatch.
 */

const COUNT = 24;

/** Palette only. A firefly field wants warm amber; this site has no warm end,
 *  and one honest exception reads better than a colour that belongs elsewhere. */
const COLORS = [
  "var(--color-brand)",
  "var(--color-neon-cyan)",
  "var(--color-electric)",
  "var(--color-violet)",
  "var(--color-magenta)",
  "#a8b4ff",
] as const;

/** mulberry32 — small, fast, and stable across a server/client boundary. */
function makeRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Firefly = {
  left: number;
  top: number;
  size: number;
  color: string;
  /** Drift leg, in px, played out and back over `driftDur`. */
  dx: number;
  dy: number;
  driftDur: number;
  driftDelay: number;
  /** Blink. `min` is what it dims to, not always zero — a field where every
   *  light goes fully out at some point reads as flicker, not as insects. */
  pulseDur: number;
  pulseDelay: number;
  min: number;
  max: number;
};

const FIREFLIES: Firefly[] = (() => {
  const rand = makeRandom(0x5eed1);
  return Array.from({ length: COUNT }, (): Firefly => {
    const size = 2 + rand() * 2.8;
    return {
      left: rand() * 100,
      top: rand() * 100,
      size,
      color: COLORS[Math.floor(rand() * COLORS.length)],
      dx: (rand() - 0.5) * 120,
      dy: (rand() - 0.5) * 90,
      driftDur: 16 + rand() * 20,
      driftDelay: -rand() * 30,
      pulseDur: 3.4 + rand() * 5.5,
      pulseDelay: -rand() * 9,
      // Smaller lights sit further away, so they stay dimmer.
      min: rand() < 0.4 ? 0 : 0.08 + rand() * 0.12,
      max: 0.5 + (size / 4.8) * 0.5,
    };
  });
})();

export default function Fireflies() {
  return (
    <div className="firefly-field" aria-hidden="true">
      {FIREFLIES.map((f, i) => (
        <span
          key={i}
          className="firefly"
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              "--ff-dx": `${f.dx}px`,
              "--ff-dy": `${f.dy}px`,
              "--ff-drift-dur": `${f.driftDur}s`,
              "--ff-drift-delay": `${f.driftDelay}s`,
            } as React.CSSProperties
          }
        >
          <span
            className="firefly-dot"
            style={
              {
                "--ff-size": `${f.size}px`,
                "--ff-color": f.color,
                "--ff-min": f.min,
                "--ff-max": f.max,
                "--ff-pulse-dur": `${f.pulseDur}s`,
                "--ff-pulse-delay": `${f.pulseDelay}s`,
              } as React.CSSProperties
            }
          />
        </span>
      ))}
    </div>
  );
}
