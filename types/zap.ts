export type ZapItemType =
  | "artigo"
  | "video"
  | "tarefa"
  | "ideia"
  | "audio"
  | "imagem"
  | "documento"
  | "nota";

export type ZapStatus = "entrada" | "ativo" | "lido" | "concluido" | "arquivado";

export type ZapPriority = "baixa" | "media" | "alta" | "urgente";

export type ZapCategory =
  | "sem-categoria"
  | "trabalho"
  | "pessoal"
  | "estudos"
  | "marketing"
  | "produto"
  | "financeiro"
  | "inspiracao";

export type ZapOrigin = "WhatsApp" | "Manual";

export type ZapPreviewType = "link" | "video" | "audio" | "image" | "pdf" | "document";

export type ZapPreview = {
  type: ZapPreviewType;
  title: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  domain?: string;
  fileName?: string;
};

export type WhatsAppMessageInput = {
  text: string;
  remoteJid?: string;
  link?: string;
  previewUrl?: string;
  category?: ZapCategory;
  priority: ZapPriority;
  reminderAt?: string;
  tags?: string[];
};

export type ZapItem = {
  id: string;
  title: string;
  content: string;
  type: ZapItemType;
  category: ZapCategory;
  priority: ZapPriority;
  status: ZapStatus;
  tags: string[];
  origin: ZapOrigin;
  remoteJid?: string;
  important: boolean;
  createdAt: string;
  updatedAt: string;
  reminderAt?: string;
  archivedAt?: string;
  completedAt?: string;
  summary?: string;
  url?: string;
  previewUrl?: string;
  preview?: ZapPreview;
  userId?: string;
};

export type User = {
  id: string;
  name: string;
  whatsappNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type ZapView =
  | "dashboard"
  | "inbox"
  | "read"
  | "tasks"
  | "ideas"
  | "history"
  | "settings";
