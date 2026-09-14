import { withBasePath } from "@/lib/base-path";

const HERO_BG = withBasePath("/hero-bg.png");

export default function CinemaPageBackground() {
  return (
    <div
      className="cinema-page-field pointer-events-none absolute inset-0 overflow-hidden bg-void"
      aria-hidden="true"
    >
      <div
        className="cinema-page-photo hero-scene-base absolute inset-0"
        style={{ backgroundImage: `url("${HERO_BG}")` }}
      />
      <div className="hero-scene-tint absolute inset-0" />
      <div className="hero-scene-overlay absolute inset-0" />
      <div className="hero-scene-vignette absolute inset-0" />
    </div>
  );
}
