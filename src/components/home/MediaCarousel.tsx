"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import PlaceholderMedia, {
  type PlaceholderKind,
  type PlaceholderTone,
} from "@/components/ui/PlaceholderMedia";
import MediaMorph from "@/components/ui/MediaMorph";
import RevealPass from "@/components/ui/RevealPass";

export type MediaCarouselItem = {
  key: string;
  href: string;
  title: string;
  label: string;
  meta?: string;
  year?: string | number;
  tone: PlaceholderTone;
  kind?: PlaceholderKind;
  coverUrl?: string;
  morphName?: string;
};

type MediaCarouselProps = {
  items: MediaCarouselItem[];
  ariaLabel: string;
  cursorLabel?: string;
};

/**
 * Fileira horizontal no estilo streaming: capas A3 em pé lado a lado, rolagem com
 * snap, setas laterais que aparecem ao passar o mouse e card que cresce no
 * hover revelando título e metadados.
 */
export default function MediaCarousel({ items, ariaLabel, cursorLabel = "ver" }: MediaCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const page = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className="group/row relative">
      <ul
        ref={trackRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] py-6 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li
            key={item.key}
            className="w-[46vw] shrink-0 snap-start sm:w-[30vw] md:w-[23vw] lg:w-[17vw] xl:w-[14vw]"
          >
            <Card item={item} cursorLabel={cursorLabel} />
          </li>
        ))}
      </ul>

      <ArrowButton side="left" visible={canPrev} onClick={() => page(-1)} />
      <ArrowButton side="right" visible={canNext} onClick={() => page(1)} />
    </div>
  );
}

/**
 * Mesma linguagem de card da fileira, em grade — para as páginas de listagem,
 * onde o acervo inteiro precisa estar visível sem rolar para o lado.
 */
export function MediaGrid({ items, ariaLabel, cursorLabel = "ver" }: MediaCarouselProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
      {items.map((item, i) => (
        <li key={item.key}>
          <RevealPass from="bottom" index={i % 6} delay={0.03}>
            <Card item={item} cursorLabel={cursorLabel} />
          </RevealPass>
        </li>
      ))}
    </ul>
  );
}

function Card({ item, cursorLabel }: { item: MediaCarouselItem; cursorLabel: string }) {
  const media = (
    <PlaceholderMedia
      label={item.label}
      tone={item.tone}
      kind={item.kind}
      src={item.coverUrl}
      alt={item.title}
      showCaption={false}
      interactive={false}
      className="h-full w-full"
    />
  );

  return (
    <Link
      href={item.href}
      transitionTypes={["nav-forward"]}
      data-cursor-label={cursorLabel}
      className="group/card relative block aspect-[297/420] w-full overflow-hidden rounded-md bg-surface shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)] outline-none ring-brand transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10 hover:scale-[1.06] hover:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.85)] focus-visible:z-10 focus-visible:scale-[1.06] focus-visible:ring-2"
    >
      {item.morphName ? <MediaMorph name={item.morphName}>{media}</MediaMorph> : media}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover/card:opacity-100"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-3 sm:p-4">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-electric">
          {item.label}
        </span>
        <h3 className="line-clamp-2 font-display text-lg leading-[1.02] tracking-tight text-white sm:text-xl">
          {item.title}
        </h3>
        {item.meta || item.year ? (
          <p className="flex max-h-0 items-center justify-between gap-3 overflow-hidden text-xs text-white/75 opacity-0 transition-all duration-300 group-hover/card:max-h-6 group-hover/card:opacity-100 group-focus-visible/card:max-h-6 group-focus-visible/card:opacity-100">
            <span className="truncate">{item.meta}</span>
            {item.year ? <span className="shrink-0 tabular-nums">{item.year}</span> : null}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function ArrowButton({
  side,
  visible,
  onClick,
}: {
  side: "left" | "right";
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label={side === "left" ? "Anterior" : "Próximo"}
      className={clsx(
        "absolute inset-y-6 z-20 hidden w-[var(--gutter)] min-w-10 items-center justify-center text-white transition-opacity duration-300 md:flex",
        side === "left"
          ? "left-0 bg-gradient-to-r from-void/90 to-transparent"
          : "right-0 bg-gradient-to-l from-void/90 to-transparent",
        visible ? "opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={clsx("h-8 w-8 transition-transform duration-200 hover:scale-125", side === "left" && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
