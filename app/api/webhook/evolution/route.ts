import { NextRequest, NextResponse } from "next/server";
import { createZapCard } from "@/lib/zap-classifier";
import {
  getAppConfigFromSupabase,
  getUserByWhatsappFromSupabase,
  upsertZapInSupabase,
} from "@/lib/supabase-data";
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

  const remoteJid = data.key.remoteJid;
  const isFromMe = data.key.fromMe;
  
  // Extract phone number from JID (e.g., "5511999999999@s.whatsapp.net" -> "5511999999999")
  const remoteNumber = remoteJid.split("@")[0];

  // Fetch central number to distinguish self-messages
  const centralNumber = await getAppConfigFromSupabase("central_number");

  let targetUserNumber: string | null = null;

  if (isFromMe) {
    // If it's from me, only process if it's sent to myself (central number)
    if (remoteNumber === centralNumber) {
      targetUserNumber = remoteNumber;
    } else {
      return NextResponse.json({ ok: true, skipped: "outgoing message to others" });
    }
  } else {
    // Incoming message: the remoteNumber is the sender
    targetUserNumber = remoteNumber;
  }

  if (!targetUserNumber) {
    return NextResponse.json({ ok: true, skipped: "no target user" });
  }

  const user = await getUserByWhatsappFromSupabase(targetUserNumber);

  if (!user) {
    return NextResponse.json({ ok: true, skipped: "not a registered user" });
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

  await upsertZapInSupabase({ ...card, userId: user.id });

  return NextResponse.json({ ok: true, cardId: card.id, userId: user.id });
}
