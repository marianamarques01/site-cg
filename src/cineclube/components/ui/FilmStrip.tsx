import { cn } from "@/cineclube/lib/utils";

/**
 * Tira de película decorativa (horizontal), com furos de arrasto.
 * Usada como divisor entre seções — cor herdada via `className`.
 */
export function FilmStrip({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative h-10 w-full bg-melies-navy", className)}
    >
      <div className="film-holes absolute inset-x-0 top-0 h-3" />
      <div className="film-holes absolute inset-x-0 bottom-0 h-3" />
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-around">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className="h-4 w-10 bg-melies-ink/30" />
        ))}
      </div>
    </div>
  );
}
