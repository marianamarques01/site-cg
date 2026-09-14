import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageTransition from "@/components/ui/PageTransition";
import RevealPass from "@/components/ui/RevealPass";
import ActionLink from "@/components/ui/ActionLink";

export const metadata: Metadata = {
  title: "Enviar trabalho",
  description:
    "Alunos dos cursos de Computação Gráfica e Design de Games podem enviar produções ou jogos para publicação no site.",
};

export default function EnviarProducaoPage() {
  return (
    <PageTransition>
      <section className="pb-[var(--section-y)] pt-32 sm:pt-36 md:pt-40">
        <Container>
          <div className="mx-auto max-w-2xl">
            <RevealPass from="left">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">Alunos</p>
            </RevealPass>
            <RevealPass delay={0.04}>
              <h1 className="mt-4 font-display text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.92] text-foreground">
                Envie seu trabalho
              </h1>
            </RevealPass>
            <RevealPass delay={0.08}>
              <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
                O formulário de envio online está disponível na versão completa do site. Nesta
                publicação estática, entre em contato com a equipe para submeter produções ou jogos.
              </p>
            </RevealPass>
            <RevealPass delay={0.12} className="mt-8">
              <ActionLink href="/contato">Ir para contato</ActionLink>
            </RevealPass>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
