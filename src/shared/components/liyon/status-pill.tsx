import { cn } from "@/shared/lib/utils";

export type StatusPillTone = "ok" | "warn" | "bad" | "info" | "off" | "neutral";

export interface StatusPillProps {
  tone: StatusPillTone;
  children: React.ReactNode;
  className?: string;
}

/**
 * ป้ายสถานะ `.st` ของ Liyon (liyon-shell.css) — primitive เล็ก ๆ ใช้ร่วมกันทุก
 * ตารางฝั่ง admin (ผู้ใช้ คอร์ส ลงทะเบียน ชำระเงิน ใบรับรอง ฯลฯ)
 */
export function StatusPill({ tone, children, className }: StatusPillProps) {
  const resolvedTone = tone === "neutral" ? "off" : tone;
  return <span className={cn("st", resolvedTone, className)}>{children}</span>;
}
