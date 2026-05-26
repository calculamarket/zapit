"use server";

import { prisma } from "@/lib/prisma";
import { ZapItem, ZapItemType, ZapStatus, ZapPriority, ZapCategory, ZapOrigin } from "@/types/zap";
import { revalidatePath } from "next/cache";

function serializeItem(item: any): ZapItem {
  return {
    ...item,
    tags: JSON.parse(item.tags || "[]"),
    preview: item.preview ? JSON.parse(item.preview) : undefined,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    reminderAt: item.reminderAt?.toISOString(),
    archivedAt: item.archivedAt?.toISOString(),
    completedAt: item.completedAt?.toISOString(),
  };
}

export async function getZaps() {
  const items = await prisma.zapItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return items.map(serializeItem);
}

export async function upsertZap(item: Partial<ZapItem> & { id: string }) {
  const data = {
    title: item.title,
    content: item.content,
    type: item.type,
    category: item.category,
    priority: item.priority,
    status: item.status,
    tags: JSON.stringify(item.tags || []),
    origin: item.origin,
    remoteJid: item.remoteJid,
    important: item.important,
    reminderAt: item.reminderAt ? new Date(item.reminderAt) : null,
    archivedAt: item.archivedAt ? new Date(item.archivedAt) : null,
    completedAt: item.completedAt ? new Date(item.completedAt) : null,
    summary: item.summary,
    url: item.url,
    previewUrl: item.previewUrl,
    preview: item.preview ? JSON.stringify(item.preview) : null,
  };

  const updated = await prisma.zapItem.upsert({
    where: { id: item.id },
    update: data,
    create: {
      id: item.id,
      ...data,
      title: item.title || "Sem título",
      content: item.content || "",
      type: item.type || "nota",
      category: item.category || "sem-categoria",
      priority: item.priority || "media",
      status: item.status || "entrada",
      origin: item.origin || "Manual",
    },
  });

  revalidatePath("/");
  return serializeItem(updated);
}

export async function sendWhatsAppReply(id: string, text: string) {
  const item = await prisma.zapItem.findUnique({ where: { id } });
  if (!item || !item.remoteJid) {
    throw new Error("Não é possível responder: identificador do WhatsApp não encontrado.");
  }

  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE_NAME;

  if (!apiUrl || !apiKey || !instance) {
    console.warn("Evolution API configuration missing in .env");
    return { success: false, error: "Configuração da Evolution API ausente." };
  }

  try {
    const res = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: item.remoteJid,
        text: text,
        delay: 1200,
        linkPreview: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Evolution API error:", err);
      return { success: false, error: "Erro ao enviar mensagem via Evolution API." };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error);
    return { success: false, error: "Falha na conexão com a Evolution API." };
  }
}

export async function deleteZap(id: string) {
  await prisma.zapItem.delete({ where: { id } });
  revalidatePath("/");
}

export async function updateZapStatus(id: string, status: ZapStatus, archivedAt?: string, completedAt?: string) {
  const now = new Date();
  const updated = await prisma.zapItem.update({
    where: { id },
    data: {
      status,
      archivedAt: archivedAt ? new Date(archivedAt) : (status === "lido" || status === "arquivado" || status === "concluido" ? now : null),
      completedAt: completedAt ? new Date(completedAt) : (status === "concluido" ? now : null),
    },
  });
  revalidatePath("/");
  return serializeItem(updated);
}
