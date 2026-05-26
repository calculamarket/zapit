import type {
  WhatsAppMessageInput,
  ZapCategory,
  ZapItem,
  ZapItemType,
  ZapPriority,
} from "@/types/zap";
import { buildZapPreview } from "@/lib/zap-preview";

const taskStarters = ["lembrar", "pagar", "fazer", "comprar", "revisar"];
const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;

type ClassifiedMessage = {
  type: ZapItemType;
  title: string;
  content: string;
  url?: string;
  summary?: string;
  category: ZapCategory;
  priority: ZapPriority;
};

export function classifyIncomingMessage(input: WhatsAppMessageInput): ClassifiedMessage {
  const content = [input.text, input.link].filter(Boolean).join(" ").trim();
  const detectionContent = [content, input.previewUrl].filter(Boolean).join(" ");
  const url = extractUrl(content);
  const normalized = detectionContent.toLowerCase().trim();
  const startsAsTask = taskStarters.some((starter) => normalized.startsWith(starter));
  const type = inferType(detectionContent, startsAsTask, url);
  const category = input.category ?? inferCategory(type, detectionContent);
  const title = buildTitle(content, type, url);
  const summary = url ? generateMockSummary(url, content, type) : undefined;

  return {
    type,
    title,
    content,
    url,
    summary,
    category,
    priority: input.priority,
  };
}

export function createZapCard(input: WhatsAppMessageInput): ZapItem {
  const classified = classifyIncomingMessage(input);
  const now = new Date().toISOString();

  return {
    id: createId(),
    title: classified.title,
    content: classified.content,
    type: classified.type,
    category: classified.category,
    priority: classified.priority,
    status: "entrada",
    tags: input.tags ?? suggestTags(classified.content, classified.type, classified.category),
    origin: "WhatsApp",
    remoteJid: input.remoteJid,
    important: classified.priority === "alta" || classified.priority === "urgente",
    createdAt: now,
    updatedAt: now,
    reminderAt: input.reminderAt || undefined,
    summary: classified.summary,
    url: classified.url,
    previewUrl: input.previewUrl?.trim() || undefined,
    preview: buildZapPreview({
      type: classified.type,
      title: classified.title,
      content: classified.content,
      url: classified.url,
      previewUrl: input.previewUrl,
    }),
  };
}

export function receiveWhatsAppMessage(input: WhatsAppMessageInput) {
  return createZapCard(input);
}

export function archiveZapItem(item: ZapItem): ZapItem {
  return {
    ...item,
    status: "arquivado",
    archivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function generateMockSummary(url: string, content: string, type: ZapItemType) {
  const domain = getDomain(url);
  const typeText =
    type === "video"
      ? "um vídeo salvo para assistir com calma"
      : "um artigo ou link salvo para leitura posterior";

  return `Resumo gerado: este conteúdo de ${domain} parece ser ${typeText}. Revise quando tiver tempo e transforme em ação se fizer sentido para a semana.`;
}

function inferType(content: string, startsAsTask: boolean, url?: string): ZapItemType {
  const normalized = content.toLowerCase();

  if (startsAsTask) {
    return "tarefa";
  }

  if (/youtube\.com|youtu\.be/i.test(normalized)) {
    return "video";
  }

  if (url || urlRegex.test(content)) {
    return "artigo";
  }

  if (normalized.includes("ideia") || normalized.includes("campanha")) {
    return "ideia";
  }

  if (normalized.includes("áudio") || normalized.includes("audio") || normalized.includes("transcrição")) {
    return "audio";
  }

  if (normalized.includes("documento") || normalized.includes("contrato") || normalized.includes("pdf")) {
    return "documento";
  }

  return "nota";
}

function inferCategory(type: ZapItemType, content: string): ZapCategory {
  const normalized = content.toLowerCase();

  if (type === "tarefa" && normalized.includes("pagar")) {
    return "financeiro";
  }

  if (normalized.includes("campanha") || normalized.includes("marketing")) {
    return "marketing";
  }

  if (normalized.includes("produto") || normalized.includes("checkout")) {
    return "produto";
  }

  if (normalized.includes("curso") || normalized.includes("estudo") || normalized.includes("ia")) {
    return "estudos";
  }

  if (type === "ideia") {
    return "inspiracao";
  }

  return "sem-categoria";
}

function buildTitle(content: string, type: ZapItemType, url?: string) {
  const clean = content.replace(urlRegex, "").trim();
  const source = clean || (url ? getDomain(url) : content);
  const compact = source.length > 58 ? `${source.slice(0, 55).trim()}...` : source;

  if (type === "tarefa") {
    return compact.charAt(0).toUpperCase() + compact.slice(1);
  }

  if (type === "video") {
    return compact ? `Assistir: ${compact}` : "Vídeo para assistir depois";
  }

  if (type === "artigo") {
    return compact ? `Ler: ${compact}` : "Link salvo para leitura";
  }

  if (type === "ideia") {
    return compact ? compact.replace(/^ideia[:\s-]*/i, "Ideia: ") : "Ideia capturada";
  }

  return compact || "Nota rápida";
}

function extractUrl(content: string) {
  const match = content.match(urlRegex);

  if (!match) {
    return undefined;
  }

  const raw = match[0];
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "um link externo";
  }
}

function suggestTags(content: string, type: ZapItemType, category: ZapCategory) {
  const tags = new Set<string>([type, category].filter((tag) => tag !== "sem-categoria"));
  const normalized = content.toLowerCase();

  if (normalized.includes("ia")) {
    tags.add("ia");
  }

  if (normalized.includes("urgente")) {
    tags.add("urgente");
  }

  if (normalized.includes("cliente")) {
    tags.add("cliente");
  }

  return Array.from(tags).slice(0, 4);
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `zap-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
