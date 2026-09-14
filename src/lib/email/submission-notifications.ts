import { getSiteSettings } from "@/lib/data/settings";
import { getSiteUrl } from "@/lib/email/env";
import { canSendEmail, sendEmail } from "@/lib/email/send";
import type { DbGame, DbProject } from "@/lib/supabase/database.types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function contactEmail(): Promise<string> {
  const settings = await getSiteSettings();
  return settings.contact_email ?? "criativa@fumec.br";
}

const SUBMIT_URL = () => `${getSiteUrl()}/enviar-producao`;

export async function notifySubmissionApproved(project: DbProject): Promise<void> {
  if (!project.student_email || !canSendEmail()) return;

  const siteUrl = getSiteUrl();
  const projectUrl = `${siteUrl}/producoes/${project.slug}`;
  const replyTo = await contactEmail();
  const student = escapeHtml(project.student);
  const title = escapeHtml(project.title);

  const result = await sendEmail({
    to: project.student_email,
    subject: `Sua produção "${project.title}" foi publicada`,
    text: [
      `Olá, ${project.student}!`,
      "",
      `Sua produção "${project.title}" foi aprovada e já está na galeria do site FUMEC Criativa.`,
      "",
      `Ver no site: ${projectUrl}`,
      "",
      `Dúvidas? ${replyTo}`,
    ].join("\n"),
    html: `
      <p>Olá, ${student}!</p>
      <p>Sua produção <strong>${title}</strong> foi aprovada e já está na galeria do site FUMEC Criativa.</p>
      <p><a href="${projectUrl}">Ver no site</a></p>
      <p style="color:#666;font-size:14px;">Dúvidas? ${escapeHtml(replyTo)}</p>
    `,
  });

  if (!result.ok) console.error("[email] aprovação:", result.error);
}

export async function notifySubmissionRejected(
  project: DbProject,
  reason: string,
): Promise<void> {
  if (!project.student_email || !canSendEmail()) return;

  const replyTo = await contactEmail();
  const student = escapeHtml(project.student);
  const title = escapeHtml(project.title);
  const safeReason = escapeHtml(reason);

  const result = await sendEmail({
    to: project.student_email,
    subject: `Atualização sobre sua produção "${project.title}"`,
    text: [
      `Olá, ${project.student}!`,
      "",
      `Sua produção "${project.title}" não foi publicada desta vez.`,
      "",
      `Motivo: ${reason}`,
      "",
      `Se tiver dúvidas ou quiser reenviar com ajustes, fale com a equipe: ${replyTo}`,
      "",
      `Enviar novo trabalho: ${SUBMIT_URL()}`,
    ].join("\n"),
    html: `
      <p>Olá, ${student}!</p>
      <p>Sua produção <strong>${title}</strong> não foi publicada desta vez.</p>
      <p><strong>Motivo:</strong> ${safeReason}</p>
      <p>Se tiver dúvidas ou quiser reenviar com ajustes, fale com a equipe: ${escapeHtml(replyTo)}</p>
      <p><a href="${SUBMIT_URL()}">Enviar novo trabalho</a></p>
    `,
  });

  if (!result.ok) console.error("[email] rejeição:", result.error);
}

export async function notifyGameSubmissionApproved(game: DbGame): Promise<void> {
  if (!game.student_email || !canSendEmail()) return;

  const siteUrl = getSiteUrl();
  const gameUrl = `${siteUrl}/producoes/${game.slug}`;
  const replyTo = await contactEmail();
  const team = escapeHtml(game.team);
  const title = escapeHtml(game.title);

  const result = await sendEmail({
    to: game.student_email,
    subject: `Seu jogo "${game.title}" foi publicado`,
    text: [
      `Olá, ${game.team}!`,
      "",
      `Seu jogo "${game.title}" foi aprovado e já está no showcase do site FUMEC Criativa.`,
      "",
      `Ver no site: ${gameUrl}`,
      "",
      `Dúvidas? ${replyTo}`,
    ].join("\n"),
    html: `
      <p>Olá, ${team}!</p>
      <p>Seu jogo <strong>${title}</strong> foi aprovado e já está no showcase do site FUMEC Criativa.</p>
      <p><a href="${gameUrl}">Ver no site</a></p>
      <p style="color:#666;font-size:14px;">Dúvidas? ${escapeHtml(replyTo)}</p>
    `,
  });

  if (!result.ok) console.error("[email] aprovação jogo:", result.error);
}

export async function notifyGameSubmissionRejected(game: DbGame, reason: string): Promise<void> {
  if (!game.student_email || !canSendEmail()) return;

  const replyTo = await contactEmail();
  const team = escapeHtml(game.team);
  const title = escapeHtml(game.title);
  const safeReason = escapeHtml(reason);

  const result = await sendEmail({
    to: game.student_email,
    subject: `Atualização sobre seu jogo "${game.title}"`,
    text: [
      `Olá, ${game.team}!`,
      "",
      `Seu jogo "${game.title}" não foi publicado desta vez.`,
      "",
      `Motivo: ${reason}`,
      "",
      `Se tiver dúvidas ou quiser reenviar com ajustes, fale com a equipe: ${replyTo}`,
      "",
      `Enviar novo trabalho: ${SUBMIT_URL()}`,
    ].join("\n"),
    html: `
      <p>Olá, ${team}!</p>
      <p>Seu jogo <strong>${title}</strong> não foi publicado desta vez.</p>
      <p><strong>Motivo:</strong> ${safeReason}</p>
      <p>Se tiver dúvidas ou quiser reenviar com ajustes, fale com a equipe: ${escapeHtml(replyTo)}</p>
      <p><a href="${SUBMIT_URL()}">Enviar novo trabalho</a></p>
    `,
  });

  if (!result.ok) console.error("[email] rejeição jogo:", result.error);
}
