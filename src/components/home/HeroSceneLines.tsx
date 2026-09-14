/**
 * Sparse editorial construction lines for the hero field.
 *
 * Deliberately not a grid — a full blueprint read as moire behind 14vw type.
 * A center cross, one horizontal guide, and two diagonals at low opacity
 * give depth without competing with the wordmark.
 */
export default function HeroSceneLines() {
  return (
    <svg
      className="hero-scene-lines"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line x1="0" y1="34" x2="100" y2="34" className="hero-scene-line" />
      <line x1="50" y1="0" x2="50" y2="100" className="hero-scene-line" />
      <line x1="0" y1="100" x2="38" y2="62" className="hero-scene-line hero-scene-line-accent" />
      <line x1="100" y1="0" x2="62" y2="38" className="hero-scene-line hero-scene-line-accent" />
      <line x1="8" y1="8" x2="22" y2="8" className="hero-scene-line hero-scene-line-tick" />
      <line x1="8" y1="8" x2="8" y2="22" className="hero-scene-line hero-scene-line-tick" />
      <line x1="92" y1="92" x2="78" y2="92" className="hero-scene-line hero-scene-line-tick" />
      <line x1="92" y1="92" x2="92" y2="78" className="hero-scene-line hero-scene-line-tick" />
    </svg>
  );
}
