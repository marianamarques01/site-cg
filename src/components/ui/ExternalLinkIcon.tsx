import clsx from "clsx";

type ExternalLinkIconProps = {
  className?: string;
};

export default function ExternalLinkIcon({ className }: ExternalLinkIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={clsx("h-[1em] w-[1em] shrink-0", className)}
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
