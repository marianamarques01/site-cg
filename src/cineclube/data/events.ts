import type { AgendaEvent } from "@/cineclube/types";

/** AGENDA — próximos encontros além das sessões. */
export const events: AgendaEvent[] = [
  {
    id: "sessao-viagem",
    day: "05",
    month: "AGO",
    title: "Sessão: Viagem à Lua + curtas Méliès",
    description: "Abertura do ciclo com trilha sonora executada ao vivo.",
    time: "19h30",
    tag: "Sessão",
  },
  {
    id: "oficina-super8",
    day: "09",
    month: "AGO",
    title: "Oficina de Super-8",
    description: "Filme, revele e projete: introdução prática à bitola caseira.",
    time: "14h",
    tag: "Oficina",
  },
  {
    id: "sessao-limite",
    day: "12",
    month: "AGO",
    title: "Sessão: Limite",
    description: "O experimento máximo do cinema brasileiro, em cópia restaurada.",
    time: "19h30",
    tag: "Sessão",
  },
  {
    id: "debate-marginal",
    day: "19",
    month: "AGO",
    title: "Sessão + debate: Cinema Marginal",
    description: "O Bandido da Luz Vermelha seguido de roda de conversa.",
    time: "19h30",
    tag: "Debate",
  },
  {
    id: "mostra-membros",
    day: "30",
    month: "AGO",
    title: "Mostra de curtas dos membros",
    description: "Tela aberta: exiba o filme que você fez (ou começou a fazer).",
    time: "18h",
    tag: "Mostra",
  },
];
