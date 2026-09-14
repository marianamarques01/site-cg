import { type ElementType, type ReactNode } from "react";
import clsx from "clsx";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export default function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag className={clsx("mx-auto w-full max-w-[1680px] px-[var(--gutter)]", className)}>
      {children}
    </Tag>
  );
}
