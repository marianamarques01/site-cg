import QRCode from "qrcode";
import type { MemberCardData } from "@/cineclube/types";

/**
 * Desenha a carteirinha de membro num <canvas> (1050×600) seguindo a
 * identidade visual: fundo roxo, moldura pêssego, lua mascote, QR code
 * e dados do membro. Retorna quando terminar de desenhar.
 *
 * Mantido fora do React para ser testável e reutilizável (ex.: gerar
 * a carteirinha no servidor futuramente).
 */

const W = 1050;
const H = 600;

/** Resolve o nome real da família tipográfica a partir da CSS var do next/font. */
function fontFamily(cssVar: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.body).getPropertyValue(cssVar).trim();
  return value || fallback;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Retângulo de cantos arredondados (compatível com browsers sem roundRect). */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function drawMemberCard(
  canvas: HTMLCanvasElement,
  data: MemberCardData
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = W;
  canvas.height = H;

  const display = fontFamily("--font-girassol", "serif");
  const body = fontFamily("--font-josefin", "sans-serif");
  const type = fontFamily("--font-melies-typewriter", "monospace");

  /* fundo roxo + "papel" (ruído leve) */
  ctx.fillStyle = "#614582";
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(33,23,53,${Math.random() * 0.08})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }

  /* estrelinhas decorativas */
  ctx.fillStyle = "rgba(255,197,133,0.35)";
  ctx.font = `26px ${body}`;
  [[70, 90], [960, 120], [900, 520], [120, 500], [530, 60]].forEach(([x, y]) => {
    ctx.fillText("✦", x, y);
  });

  /* moldura dupla pêssego */
  ctx.strokeStyle = "#FFC585";
  ctx.lineWidth = 6;
  roundRect(ctx, 18, 18, W - 36, H - 36, 24);
  ctx.stroke();
  ctx.lineWidth = 2;
  roundRect(ctx, 32, 32, W - 64, H - 64, 16);
  ctx.stroke();

  /* mascote */
  try {
    const mascot = await loadImage("/cineclube/brand/mascot.png");
    ctx.drawImage(mascot, 58, 64, 170, 185);
  } catch {
    /* sem mascote, segue o baile */
  }

  /* cabeçalho */
  ctx.fillStyle = "#FFC585";
  ctx.font = `54px ${display}`;
  ctx.fillText("CINECLUBE MÉLIÈS", 260, 122);
  ctx.fillStyle = "#FBF4E8";
  ctx.font = `20px ${type}`;
  ctx.fillText("CARTEIRINHA DE MEMBRO · UNIVERSIDADE FUMEC", 262, 158);

  /* linha pontilhada divisória */
  ctx.strokeStyle = "rgba(251,244,232,0.4)";
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(58, 210);
  ctx.lineTo(W - 58, 210);
  ctx.stroke();
  ctx.setLineDash([]);

  /* foto do membro (se enviada) ou lua reserva, em círculo */
  const photoX = 150;
  const photoY = 380;
  const photoR = 105;
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = "#4A3266";
  ctx.fill();
  ctx.clip();
  try {
    const photo = await loadImage(data.photoDataUrl || "/cineclube/brand/mascot.png");
    /* cover: preenche o círculo mantendo proporção */
    const scale = Math.max((photoR * 2) / photo.width, (photoR * 2) / photo.height);
    const pw = photo.width * scale;
    const ph = photo.height * scale;
    ctx.drawImage(photo, photoX - pw / 2, photoY - ph / 2, pw, ph);
  } catch {
    /* círculo roxo vazio já serve de fallback */
  }
  ctx.restore();
  ctx.strokeStyle = "#FFC585";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(photoX, photoY, photoR, 0, Math.PI * 2);
  ctx.stroke();

  /* dados do membro */
  const infoX = 300;
  ctx.fillStyle = "#FBF4E8";
  ctx.font = `16px ${type}`;
  ctx.fillText("NOME", infoX, 280);
  ctx.font = `44px ${display}`;
  const name = data.name.length > 26 ? `${data.name.slice(0, 25)}…` : data.name;
  ctx.fillText(name.toUpperCase(), infoX, 326);

  ctx.font = `16px ${type}`;
  ctx.fillText("CURSO", infoX, 380);
  ctx.font = `26px ${body}`;
  ctx.fillText(`${data.course} · ${data.semester}º período`, infoX, 410);

  ctx.font = `16px ${type}`;
  ctx.fillText("Nº DE MEMBRO", infoX, 462);
  ctx.fillStyle = "#FFC585";
  ctx.font = `36px ${display}`;
  ctx.fillText(data.memberNumber, infoX, 502);

  ctx.fillStyle = "rgba(251,244,232,0.6)";
  ctx.font = `14px ${type}`;
  ctx.fillText(`emitida em ${data.issuedAt} · válida enquanto houver cinema`, infoX, 540);

  /* QR code (aponta para o perfil do membro / letterboxd) */
  const qrPayload = JSON.stringify({
    club: "cineclube-melies",
    member: data.memberNumber,
    name: data.name,
    letterboxd: data.letterboxd || null,
  });
  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 190,
    margin: 1,
    color: { dark: "#211735", light: "#FBF4E8" },
  });
  const qr = await loadImage(qrDataUrl);
  ctx.save();
  ctx.translate(880, 385);
  ctx.rotate(-0.04);
  ctx.fillStyle = "#FBF4E8";
  roundRect(ctx, -105, -105, 210, 210, 12);
  ctx.fill();
  ctx.drawImage(qr, -95, -95, 190, 190);
  ctx.restore();

  /* carimbo torto de autenticidade */
  ctx.save();
  ctx.translate(880, 160);
  ctx.rotate(-0.18);
  ctx.strokeStyle = "#FFC585";
  ctx.lineWidth = 3;
  roundRect(ctx, -95, -30, 190, 60, 8);
  ctx.stroke();
  ctx.fillStyle = "#FFC585";
  ctx.font = `20px ${type}`;
  ctx.textAlign = "center";
  ctx.fillText("MEMBRO OFICIAL ✦", 0, 7);
  ctx.restore();
  ctx.textAlign = "left";
}
