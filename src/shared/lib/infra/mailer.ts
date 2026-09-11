import "server-only";
import nodemailer from "nodemailer";
import { env, smtpConfigured } from "./env";
import { logger } from "./logger";
import { prisma } from "./prisma";

export interface MailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  tenantId?: string;
}

export interface SmtpTransportConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

export async function resolveSmtpConfig(tenantId?: string): Promise<SmtpTransportConfig | null> {
  try {
    const tenant = tenantId
      ? await prisma.tenant.findUnique({ where: { id: tenantId }, select: { settings: true } })
      : await prisma.tenant.findFirst({ orderBy: { createdAt: "asc" }, select: { settings: true } });

    const smtp = (tenant?.settings as { smtp?: { enabled?: boolean; host?: string; port?: number; secure?: boolean; user?: string; pass?: string; from?: string } } | null)?.smtp;
    if (smtp && smtp.enabled && smtp.user && smtp.pass) {
      return {
        host: smtp.host || "smtp.gmail.com",
        port: smtp.port || 465,
        secure: smtp.secure !== false,
        user: smtp.user,
        pass: smtp.pass,
        from: smtp.from || smtp.user,
      };
    }
  } catch (err) {
    logger.warn("resolveSmtpConfig error reading tenant", { err: err instanceof Error ? err.message : String(err) });
  }

  if (smtpConfigured()) {
    const e = env();
    return {
      host: e.SMTP_HOST,
      port: e.SMTP_PORT,
      secure: e.SMTP_PORT === 465,
      user: e.SMTP_USER,
      pass: e.SMTP_PASS,
      from: e.SMTP_FROM,
    };
  }

  return null;
}

/** ไม่มี SMTP → เขียนลง log ระดับ info แล้วคืน delivered:false — ระบบต้องไม่ล้มเพราะส่งอีเมลไม่ได้ */
export async function sendMail(input: MailInput): Promise<{ delivered: boolean; error?: string }> {
  const config = await resolveSmtpConfig(input.tenantId);
  if (!config) {
    logger.info("mail (no SMTP, logged only)", { to: input.to, subject: input.subject, text: input.text });
    return { delivered: false };
  }
  try {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    });
    await transport.sendMail({
      from: config.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { delivered: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("mail send failed", { to: input.to, err: errorMsg });
    return { delivered: false, error: errorMsg };
  }
}
