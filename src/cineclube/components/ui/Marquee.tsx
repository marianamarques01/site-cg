import { cn } from "@/cineclube/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  separator?: string;
}

/**
 * Letreiro infinito estilo marquise de cinema.
 * O conteúdo é duplicado para o loop ser contínuo (aria-hidden na cópia).
 */
export function Marquee({ items, className, separator = "✦" }: MarqueeProps) {
  const strip = (hidden?: boolean) => (
    <div
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-6 pr-6"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-6 whitespace-nowrap">
          {item}
          <span className="text-melies-peach">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("flex overflow-hidden", className)}>
      <div className="flex animate-marquee will-change-transform">
        {strip()}
        {strip(true)}
      </div>
    </div>
  );
}
