import type { ZapCategory, ZapItemType, ZapPriority, ZapStatus, ZapView } from "@/types/zap";

export const zapCategories: Array<{ value: ZapCategory; label: string }> = [
  { value: "sem-categoria", label: "Sem categoria" },
  { value: "trabalho", label: "Trabalho" },
  { value: "pessoal", label: "Pessoal" },
  { value: "estudos", label: "Estudos" },
  { value: "marketing", label: "Marketing" },
  { value: "produto", label: "Produto" },
  { value: "financeiro", label: "Financeiro" },
  { value: "inspiracao", label: "Inspiração" },
];

export const zapPriorities: Array<{ value: ZapPriority; label: string }> = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
];

export const zapTypes: Array<{ value: ZapItemType | "todos"; label: string }> = [
  { value: "todos", label: "Todos os tipos" },
  { value: "artigo", label: "Artigo" },
  { value: "video", label: "Vídeo" },
  { value: "tarefa", label: "Tarefa" },
  { value: "ideia", label: "Ideia" },
  { value: "audio", label: "Áudio" },
  { value: "imagem", label: "Imagem" },
  { value: "documento", label: "Documento" },
  { value: "nota", label: "Nota" },
];

export const zapStatuses: Array<{ value: ZapStatus | "todos"; label: string }> = [
  { value: "todos", label: "Todos os status" },
  { value: "entrada", label: "Entrada" },
  { value: "ativo", label: "Ativo" },
  { value: "lido", label: "Lido" },
  { value: "concluido", label: "Concluído" },
  { value: "arquivado", label: "Arquivado" },
];

export const zapViews: Array<{ value: ZapView; label: string; description: string }> = [
  {
    value: "dashboard",
    label: "Dashboard",
    description: "O mural principal para revisar o que chegou.",
  },
  {
    value: "inbox",
    label: "Caixa de Entrada",
    description: "Tudo que acabou de vir do WhatsApp.",
  },
  {
    value: "read",
    label: "Para Ler",
    description: "Links, vídeos e documentos guardados para depois.",
  },
  {
    value: "tasks",
    label: "Tarefas",
    description: "Pendências que viraram ação.",
  },
  {
    value: "ideas",
    label: "Ideias",
    description: "Insights soltos antes que virem fumaça.",
  },
  {
    value: "history",
    label: "Histórico",
    description: "O que já foi lido, concluído ou arquivado.",
  },
  {
    value: "settings",
    label: "Configurações",
    description: "Preferências simples do MVP.",
  },
];

export const categoryCardStyles: Record<ZapCategory, string> = {
  "sem-categoria": "bg-[#fff8d6] border-[#e4d485]",
  trabalho: "bg-[#e7f0ff] border-[#9cb8e8]",
  pessoal: "bg-[#ffe4ec] border-[#ef9db4]",
  estudos: "bg-[#e8f9df] border-[#9dd47d]",
  marketing: "bg-[#ffe8c9] border-[#e6ab63]",
  produto: "bg-[#e7f7f3] border-[#8ccbbb]",
  financeiro: "bg-[#f3e8ff] border-[#c9a4ed]",
  inspiracao: "bg-[#fff0d9] border-[#e6b77a]",
};

export const priorityTones: Record<ZapPriority, "neutral" | "green" | "amber" | "red" | "blue"> = {
  baixa: "green",
  media: "blue",
  alta: "amber",
  urgente: "red",
};
