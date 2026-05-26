"use client";

import { BookOpen, CalendarDays, Flame, Inbox, Lightbulb, ListTodo } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ZapCard } from "@/components/ZapCard";
import { isToday } from "@/lib/utils";
import { useZapStore } from "@/store/zap-store";
import type { ZapItem } from "@/types/zap";

type BoardColumn = {
  title: string;
  description: string;
  icon: typeof Inbox;
  items: ZapItem[];
};

export function DashboardBoard() {
  const { items } = useZapStore();
  const activeItems = items.filter((item) => item.status === "entrada" || item.status === "ativo");
  const columns: BoardColumn[] = [
    {
      title: "Entrada",
      description: "Chegou agora, ainda sem triagem.",
      icon: Inbox,
      items: activeItems.filter((item) => item.status === "entrada"),
    },
    {
      title: "Hoje",
      description: "Criados ou lembrados para hoje.",
      icon: CalendarDays,
      items: activeItems.filter((item) => isToday(item.createdAt) || isToday(item.reminderAt)),
    },
    {
      title: "Importante",
      description: "O que merece passar na frente.",
      icon: Flame,
      items: activeItems.filter((item) => item.important),
    },
    {
      title: "Para ler",
      description: "Artigos, vídeos e docs para consumir.",
      icon: BookOpen,
      items: activeItems.filter((item) => ["artigo", "video", "documento"].includes(item.type)),
    },
    {
      title: "Ideias",
      description: "Faíscas para lapidar depois.",
      icon: Lightbulb,
      items: activeItems.filter((item) => item.type === "ideia"),
    },
    {
      title: "Tarefas",
      description: "Itens que já viraram ação.",
      icon: ListTodo,
      items: activeItems.filter((item) => item.type === "tarefa"),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">Mural inteligente</h2>
          <p className="text-sm text-slate-600">
            Seções vivas para dar destino ao que normalmente ficaria perdido no WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {columns.map((column) => (
          <BoardSection key={column.title} column={column} />
        ))}
      </div>
    </section>
  );
}

function BoardSection({ column }: { column: BoardColumn }) {
  const Icon = column.icon;

  return (
    <section className="min-h-[360px] rounded-lg border border-white/70 bg-white/50 p-3 shadow-sm backdrop-blur">
      <div className="mb-3 flex items-start justify-between gap-3 px-1">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-black text-slate-950">
            <Icon className="h-4 w-4" />
            {column.title}
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">{column.description}</p>
        </div>
        <span className="rounded-md bg-slate-950 px-2 py-1 text-xs font-black text-white">
          {column.items.length}
        </span>
      </div>

      {column.items.length ? (
        <div className="grid gap-3">
          {column.items.map((item) => (
            <ZapCard key={`${column.title}-${item.id}`} item={item} compact={column.title !== "Entrada"} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nada por aqui"
          description="Quando um item combinar com esta seção, ele aparece automaticamente."
          icon={<Icon className="h-5 w-5" />}
          className="min-h-[260px]"
        />
      )}
    </section>
  );
}
