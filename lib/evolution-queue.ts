import type { ZapItem } from "@/types/zap";

// In-memory queue for cards arriving via Evolution API webhook.
// Works correctly in dev and in single-process deployments (VPS, Docker).
// On serverless platforms (Vercel, etc.) each function instance has its own
// memory — use a database queue there instead.
const pending: ZapItem[] = [];

export function enqueueCard(card: ZapItem) {
  pending.push(card);
}

export function drainCards(): ZapItem[] {
  return pending.splice(0, pending.length);
}
