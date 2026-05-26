import type { ZapCategory, ZapItem, ZapItemType, ZapPriority } from "@/types/zap";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function isToday(value?: string) {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function getPriorityLabel(priority: ZapPriority) {
  const labels: Record<ZapPriority, string> = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
    urgente: "Urgente",
  };

  return labels[priority];
}

export function getCategoryLabel(category: ZapCategory) {
  const labels: Record<ZapCategory, string> = {
    "sem-categoria": "Sem categoria",
    trabalho: "Trabalho",
    pessoal: "Pessoal",
    estudos: "Estudos",
    marketing: "Marketing",
    produto: "Produto",
    financeiro: "Financeiro",
    inspiracao: "Inspiração",
  };

  return labels[category];
}

export function getTypeLabel(type: ZapItemType) {
  const labels: Record<ZapItemType, string> = {
    artigo: "Artigo",
    video: "Vídeo",
    tarefa: "Tarefa",
    ideia: "Ideia",
    audio: "Áudio",
    imagem: "Imagem",
    documento: "Documento",
    nota: "Nota",
  };

  return labels[type];
}

export function matchesZapItem(item: ZapItem, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return [
    item.title,
    item.content,
    item.summary ?? "",
    item.category,
    item.type,
    item.priority,
    item.status,
    item.tags.join(" "),
    item.url ?? "",
    item.previewUrl ?? "",
    item.preview?.title ?? "",
    item.preview?.description ?? "",
    item.preview?.domain ?? "",
    item.preview?.fileName ?? "",
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}
