import clsx from "clsx";

type GridIconProps = {
  className?: string;
  /** 3×3 bento grid (default) or 2×2 compact. */
  size?: "sm" | "md";
};

/** 3×3 grid icon — opens the site menu on desktop, per the mockup. */
export default function GridIcon({ className, size = "md" }: GridIconProps) {
  const dot = size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5";

  return (
    <span
      className={clsx("grid grid-cols-3 gap-[3px]", className)}
      aria-hidden="true"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={clsx(dot, "rounded-full bg-current")} />
      ))}
    </span>
  );
}
