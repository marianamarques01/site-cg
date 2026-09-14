import Image from "next/image";
import { site } from "@/cineclube/data/site";
import { Marquee } from "@/cineclube/components/ui/Marquee";
import { withBasePath } from "@/lib/base-path";

/**
 * Rodapé: marquise final + créditos, como a última cartela de um filme.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-melies-ink pb-10 pt-6">
      <Marquee
        items={Array.from({ length: 6 }, () => "CINECLUBE MELIES")}
        className="border-y-2 border-melies-purple/40 py-3 font-melies-display text-xl uppercase text-melies-cream/60"
      />

      <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
        <Image
          src={withBasePath("/cineclube/brand/lockup-vertical.png")}
          alt="Cineclube Méliès"
          width={140}
          height={225}
          className="animate-float-slow"
        />
        <p className="max-w-md font-melies-typewriter text-xs leading-relaxed text-melies-cream/50">
          {site.name} — {site.university}. {site.building}, {site.address}.
        </p>
        <p className="font-melies-typewriter text-[10px] uppercase tracking-[0.3em] text-melies-purple">
{new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
