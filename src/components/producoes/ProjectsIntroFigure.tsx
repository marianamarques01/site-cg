import Image from "next/image";
import RevealPass from "@/components/ui/RevealPass";
import { withBasePath } from "@/lib/base-path";

/**
 * The creature that lies along the right edge of the Projetos intro.
 *
 * Kept out of the flow entirely: the intro's own grid stays untouched, and the
 * figure is `aria-hidden` + `pointer-events-none` because it carries no
 * information the heading doesn't already give. It only appears from `lg` up —
 * below that the title and the description already fill the width, and a
 * decoration squeezed in beside them reads as clutter rather than as air.
 *
 * The idle drift is CSS, not state: same reasoning as the firefly field, no
 * re-render per frame and no JavaScript shipped for an ambient loop.
 */
export default function ProjectsIntroFigure() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-[var(--gutter)] top-[62%] -z-10 hidden w-[min(34vw,32rem)] -translate-y-1/2 lg:block"
    >
      <RevealPass delay={0.12}>
        <Image
          src={withBasePath("/boneco.png")}
          alt=""
          width={1176}
          height={666}
          sizes="(min-width: 1024px) 34vw, 0px"
          className="projects-figure w-full"
        />
      </RevealPass>
    </div>
  );
}
