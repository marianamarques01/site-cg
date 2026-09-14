import Container from "@/components/ui/Container";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealPass from "@/components/ui/RevealPass";

type PageIntroProps = {
  kicker: string;
  /** One string per visual line. */
  titleLines: string[];
  description?: string;
};

/**
 * The inner pages used to have no motion at all — not a single reveal in the
 * whole of src/app — so every click out of the Home landed on something inert.
 * They now share the Home's vocabulary: kicker wiped in, title uncovered.
 */
export default function PageIntro({ kicker, titleLines, description }: PageIntroProps) {
  return (
    <div className="pb-16 pt-40 sm:pt-48 md:pb-24">
      <Container className="flex flex-col gap-6">
        <RevealPass from="left">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
            {kicker}
          </span>
        </RevealPass>

        <MaskedLines
          as="h1"
          lines={titleLines}
          className="max-w-4xl font-display text-[14vw] leading-[0.88] text-foreground sm:text-[9vw] md:text-[6.5vw]"
        />

        {description && (
          <RevealPass delay={0.08}>
            <p className="max-w-lg text-balance text-sm leading-relaxed text-muted sm:text-base">
              {description}
            </p>
          </RevealPass>
        )}
      </Container>
    </div>
  );
}
