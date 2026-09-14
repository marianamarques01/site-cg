import { ViewTransition, type ReactNode } from "react";

/**
 * Names a piece of media so it morphs between the grid and the detail page
 * instead of one image vanishing while another appears.
 *
 * `share` and `default="none"` travel together: with `default="none"` and no
 * explicit `share`, the pair silently stops morphing.
 */
export default function MediaMorph({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition name={name} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
