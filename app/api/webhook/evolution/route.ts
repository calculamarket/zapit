import { NextRequest, NextResponse } from "next/server";
import { createZapCard } from "@/lib/zap-classifier";
import { prisma } from "@/lib/prisma";
import { categorizeWithAI } from "@/lib/zap-ai";
import type { WhatsAppMessageInput } from "@/types/zap";

// ─── Evolution API payload types ─────────────────────────────────────────────

type EvolutionData = {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message?: {
    conversation?: string;
    extendedTextMessage?: {
      text?: string;
      canonicalUrl?: string;
      jpegThumbnail?: string;
    };
    audioMessage?: { url?: string };
    imageMessage?: { url?: string; caption?: string };
    documentMessage?: { url?: string; fileName?: string };
    videoMessage?: { url?: string; caption?: string };
  };
  messageType?: string;
};

type EvolutionPayload = {
  event?: string;
  data?: EvolutionData;
};

// ─── Token validation ─────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.EVOLUTION_WEBHOOK_SECRET;
  if (!secret) return true; // dev mode — no secret configured
  const token =
    req.headers.get("apikey") ??
    req.headers.get("authorization")?.replace("Bearer ", "") ??
    req.nextUrl.searchParams.get("token");
  return token === secret;
}

// ─── Message extraction ───────────────────────────────────────────────────────

function toInput(data: EvolutionData): WhatsAppMessageInput | null {
  const msg = data.message;
  if (!msg) return null;

  const remoteJid = data.key.remoteJid;

  if (msg.conversation) {
    return { text: msg.conversation, priority: "media", remoteJid };
  }

  if (msg.extendedTextMessage) {
    const ext = msg.extendedTextMessage;
    const text = ext.text ?? "";
    if (!text && !ext.canonicalUrl) return null;
    return {
      text,
      link: ext.canonicalUrl,
      previewUrl: ext.jpegThumbnail
        ? `data:image/jpeg;base64,${ext.jpegThumbnail}`
        : undefined,
      priority: "media",
      remoteJid,
    };
  }

  if (msg.audioMessage) {
    return { text: "áudio", priority: "media", remoteJid };
  }

  if (msg.imageMessage) {
    return { text: msg.imageMessage.caption || "imagem", priority: "media", remoteJid };
  }

  if (msg.documentMessage) {
    return {
      text: `documento: ${msg.documentMessage.fileName ?? "arquivo"}`,
      priority: "media",
      remoteJid,
    };
  }

  if (msg.videoMessage) {
    return { text: msg.videoMessage.caption || "vídeo", priority: "media", remoteJid };
  }

  return null;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: EvolutionPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.event !== "messages.upsert") {
    return NextResponse.json({ ok: true, skipped: "event" });
  }

  const data = body.data;
  if (!data) return NextResponse.json({ error: "No data" }, { status: 400 });

  // Only capture messages the user sent to themselves
  if (!data.key.fromMe) {
    return NextResponse.json({ ok: true, skipped: "not fromMe" });
  }

  const input = toInput(data);
  if (!input) {
    return NextResponse.json({ ok: true, skipped: "no content" });
  }

  const aiResult = await categorizeWithAI(input.text);
  const card = createZapCard(input);

  if (aiResult) {
    card.type = aiResult.type;
    card.priority = aiResult.priority;
    card.category = aiResult.category;
    card.summary = aiResult.summary;
    card.tags = aiResult.tags;
    card.title = aiResult.title;
    card.important = aiResult.priority === "alta" || aiResult.priority === "urgente";
  }

  await prisma.zapItem.create({
    data: {
      id: card.id,
      title: card.title,
      content: card.content,
      type: card.type,
      category: card.category,
      priority: card.priority,
      status: card.status,
      tags: JSON.stringify(card.tags),
      origin: card.origin,
      remoteJid: card.remoteJid,
      important: card.important,
      createdAt: new Date(card.createdAt),
      updatedAt: new Date(card.updatedAt),
      reminderAt: card.reminderAt ? new Date(card.reminderAt) : null,
      summary: card.summary,
      url: card.url,
      previewUrl: card.previewUrl,
      preview: card.preview ? JSON.stringify(card.preview) : null,
    },
  });

  return NextResponse.json({ ok: true, cardId: card.id });
}
