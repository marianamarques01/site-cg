import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import PageTransition from "@/components/ui/PageTransition";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SectionRule from "@/components/ui/SectionRule";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com os cursos de Computação Gráfica e Design de Games da FUMEC.",
};

export default async function ContatoPage() {
  const settings = await getSiteSettings();
  const email = settings.contact_email ?? "criativa@fumec.br";
  const addressLines = (settings.contact_address ?? "Universidade FUMEC\nBelo Horizonte, MG").split("\n");
  const instagram = settings.social_links?.instagram ?? "@computacaograficabh";

  return (
    <PageTransition>
      <PageIntro
        kicker="Contato"
        titleLines={["Fala com", "a gente"]}
        description="Dúvidas sobre os cursos, parcerias ou quer indicar um projeto para o site? É por aqui."
      />
      <Container className="flex flex-col gap-16 pb-[var(--section-y)] md:gap-24">
        <SectionRule />
      </Container>
      <Container className="grid gap-16 pb-[var(--section-y)] md:grid-cols-[1fr_1.3fr] md:gap-24">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              E-mail
            </span>
            <a
              href={`mailto:${email}`}
              data-cursor="copy"
              className="w-fit text-lg text-foreground transition-colors hover:text-brand"
            >
              {email}
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              Endereço
            </span>
            <p className="text-lg text-foreground">
              {addressLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < addressLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              Redes
            </span>
            <p data-cursor="copy" className="w-fit text-lg text-foreground">
              {instagram}
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              Nome
            </span>
            <input
              type="text"
              name="name"
              className="border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-brand"
              placeholder="Seu nome"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              E-mail
            </span>
            <input
              type="email"
              name="email"
              className="border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-brand"
              placeholder="seuemail@exemplo.com"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              Mensagem
            </span>
            <textarea
              name="message"
              rows={4}
              className="resize-none border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-brand"
              placeholder="Conta pra gente"
            />
          </label>
          <PrimaryButton type="submit" className="mt-2">
            Enviar mensagem
          </PrimaryButton>
        </form>
      </Container>
    </PageTransition>
  );
}
