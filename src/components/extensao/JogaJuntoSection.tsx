import Container from "@/components/ui/Container";
import RevealPass from "@/components/ui/RevealPass";
import MaskedLines from "@/components/ui/MaskedLines";
import PrimaryButton from "@/components/ui/PrimaryButton";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";

/**
 * Banner do Joga Junto — projeto de extensão de Design de Games.
 * TODO: substituir textos, imagem e link pelos oficiais do projeto.
 */
export default function JogaJuntoSection() {
  return (
    <section id="joga-junto" className="relative overflow-hidden border-y border-border bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-magenta/15 blur-[90px]"
      />

      <Container className="relative z-10 py-[var(--section-y)]">
        <div className="grid min-w-0 items-center gap-10 lg:grid-cols-[min(28rem,38vw)_minmax(0,1fr)] lg:gap-12">
          <RevealPass from="bottom" delay={0.08} className="order-2 lg:order-1">
            <PlaceholderMedia
              label="Joga Junto"
              tone="violet"
              kind="tilemap"
              alt="Joga Junto"
              className="aspect-square w-full border-2 border-magenta/60"
            />
          </RevealPass>

          <div className="order-1 flex min-w-0 flex-col gap-6 sm:gap-7 lg:order-2 lg:w-full lg:max-w-xl lg:justify-self-end">
            <div className="flex flex-col">
              <RevealPass from="left">
                <span className="text-xs font-medium uppercase tracking-[0.22em] text-magenta">
                  Projeto de extensão
                </span>
              </RevealPass>

              <MaskedLines
                as="h2"
                lines={["Joga", "Junto."]}
                className="mt-2 font-display text-[10.1vw] leading-[0.95] text-foreground sm:text-[6.5vw] lg:text-[4.2vw]"
              />

              <RevealPass delay={0.06} className="mt-3">
                <p className="font-display text-xl uppercase tracking-wide text-magenta sm:text-2xl">
                  Jogos, comunidade e troca
                </p>
              </RevealPass>
            </div>

            <RevealPass delay={0.1}>
              <p className="max-w-lg text-balance text-sm leading-relaxed text-muted sm:text-base">
                Encontros abertos para jogar, testar e conversar sobre jogos — uma ponte entre os
                alunos de Design de Games e a comunidade.
              </p>
            </RevealPass>

            <RevealPass delay={0.14}>
              <PrimaryButton href="/contato" cursorLabel="explorar" fillColor="var(--color-magenta)">
                Saiba mais
              </PrimaryButton>
            </RevealPass>
          </div>
        </div>
      </Container>
    </section>
  );
}
