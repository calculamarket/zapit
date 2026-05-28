"use server";

import { revalidatePath } from "next/cache";
import {
  deleteZapFromSupabase,
  getUsersFromSupabase,
  getZapWithUserFromSupabase,
  getZapsFromSupabase,
  updateZapStatusInSupabase,
  upsertZapInSupabase,
} from "@/lib/supabase-data";
import type { ZapItem, ZapStatus } from "@/types/zap";

const DEFAULT_REMINDERS_WEBHOOK_URL =
  "https://n8n-n8n.simduh.easypanel.host/webhook/zap-it/reminders/whatsapp";

export async function getZaps(userId?: string) {
  return getZapsFromSupabase(userId);
}

export async function getUsers() {
  return getUsersFromSupabase();
}

export async function upsertZap(item: Partial<ZapItem> & { id: string }) {
  const saved = await upsertZapInSupabase(item);
  revalidatePath("/");
  return saved;
}

function getReminderPhone(payload: Awaited<ReturnType<typeof getZapWithUserFromSupabase>>) {
  if (!payload) return null;

  const userPhone = payload.user?.whatsappNumber?.replace(/\D/g, "");
  if (userPhone) return userPhone;

  const remotePhone = payload.item.remoteJid?.split("@")[0]?.replace(/\D/g, "");
  return remotePhone || null;
}

export async function scheduleZapReminder(id: string) {
  const payload = await getZapWithUserFromSupabase(id);

  if (!payload) {
    return { success: false, error: "Card não encontrado." };
  }

  if (!payload.item.reminderAt) {
    return { success: true, skipped: true, message: "Card sem data de lembrete." };
  }

  const phone = getReminderPhone(payload);
  if (!phone) {
    return { success: false, error: "Defina um telefone para receber o lembrete." };
  }

  const webhookUrl = process.env.ZAPIT_REMINDERS_WEBHOOK_URL || DEFAULT_REMINDERS_WEBHOOK_URL;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        item: {
          id: payload.item.id,
          title: payload.item.title,
          content: payload.item.content,
          type: payload.item.type,
          category: payload.item.category,
          priority: payload.item.priority,
          reminderAt: payload.item.reminderAt,
          tags: payload.item.tags,
        },
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: "O card foi salvo, mas o n8n não confirmou o lembrete.",
      };
    }

    return { success: true, message: "Lembrete enviado para o n8n." };
  } catch (error) {
    console.error("Failed to schedule reminder in n8n:", error);
    return {
      success: false,
      error: "O card foi salvo, mas não foi possível chamar o n8n.",
    };
  }
}

export async function sendWhatsAppReply(id: string, text: string) {
  const payload = await getZapWithUserFromSupabase(id);
  const remoteJid = payload?.item.remoteJid;

  if (!payload || !remoteJid) {
    throw new Error("Não é possível responder: identificador do WhatsApp não encontrado.");
  }

  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE_NAME || process.env.EVOLUTION_INSTANCE;

  if (!apiUrl || !apiKey || !instance) {
    return { success: false, error: "Configuração da Evolution API ausente." };
  }

  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, "")}/message/sendText/${instance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: remoteJid.split("@")[0],
        text,
        delay: 1200,
        linkPreview: true,
      }),
    });

    if (!res.ok) {
      return { success: false, error: "Erro ao enviar mensagem via Evolution API." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    return { success: false, error: "Falha na conexão com a Evolution API." };
  }
}

export async function deleteZap(id: string) {
  await deleteZapFromSupabase(id);
  revalidatePath("/");
}

export async function updateZapStatus(id: string, status: ZapStatus, archivedAt?: string, completedAt?: string) {
  const updated = await updateZapStatusInSupabase(id, status, archivedAt, completedAt);
  revalidatePath("/");
  return updated;
}
