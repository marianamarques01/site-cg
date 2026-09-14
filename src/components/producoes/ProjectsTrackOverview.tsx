import ActionLink from "@/components/ui/ActionLink";
import RevealPass from "@/components/ui/RevealPass";
import { COURSE_TONE } from "@/lib/mock/courses";

type ProjectsTrackOverviewProps = {
  projectCount: number;
  gameCount: number;
};

const TRACKS = [
  {
    id: "computacao-grafica",
    label: "Computação Gráfica",
    description: "Modelagem 3D, concept art, animação, ilustração e peças gráficas.",
    accent: COURSE_TONE["computacao-grafica"],
    countLabel: (n: number) => `${n} ${n === 1 ? "projeto" : "projetos"}`,
  },
  {
    id: "jogos",
    label: "Design de Games",
    description: "Protótipos e jogos completos produzidos em equipe.",
    accent: COURSE_TONE["design-de-games"],
    countLabel: (n: number) => `${n} ${n === 1 ? "jogo" : "jogos"}`,
  },
] as const;

export default function ProjectsTrackOverview({
  projectCount,
  gameCount,
}: ProjectsTrackOverviewProps) {
  const counts = [projectCount, gameCount];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      {TRACKS.map((track, i) => (
        <RevealPass key={track.id} index={i} from="bottom">
          <a
            href={`#${track.id}`}
            className="group flex h-full flex-col gap-5 border border-border p-6 transition-colors hover:border-foreground/20 focus-visible:border-foreground/20 sm:p-8"
            style={{ borderTopWidth: 3, borderTopColor: track.accent }}
          >
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-medium uppercase tracking-[0.18em]"
                style={{ color: track.accent }}
              >
                {track.label}
              </span>
              <span className="font-display text-3xl leading-none tracking-tight text-foreground sm:text-4xl">
                {counts[i] === 0 ? "Em breve" : track.countLabel(counts[i])}
              </span>
            </div>
            <p className="max-w-sm flex-1 text-sm leading-relaxed text-muted">{track.description}</p>
            <ActionLink active>Explorar</ActionLink>
          </a>
        </RevealPass>
      ))}
    </div>
  );
}
