"use client";

import { Archive, BookOpen, CheckSquare, Flame, Inbox } from "lucide-react";
import { useZapStore } from "@/store/zap-store";

export function MetricsRow() {
  const { items } = useZapStore();
  const active = items.filter((item) => item.status === "entrada" || item.status === "ativo");
  const metrics = [
    {
      label: "Itens ativos",
      value: active.length,
      detail: "no mural",
      icon: Inbox,
      tone: "bg-emerald-100 text-emerald-800",
    },
    {
      label: "Importantes",
      value: active.filter((item) => item.important).length,
      detail: "merecem carinho",
      icon: Flame,
      tone: "bg-amber-100 text-amber-800",
    },
    {
      label: "Para ler",
      value: active.filter((item) => ["artigo", "video", "documento"].includes(item.type)).length,
      detail: "links e docs",
      icon: BookOpen,
      tone: "bg-sky-100 text-sky-800",
    },
    {
      label: "Tarefas pendentes",
      value: active.filter((item) => item.type === "tarefa").length,
      detail: "para resolver",
      icon: CheckSquare,
      tone: "bg-violet-100 text-violet-800",
    },
    {
      label: "Arquivados",
      value: items.filter((item) => ["lido", "concluido", "arquivado"].includes(item.status)).length,
      detail: "no histórico",
      icon: Archive,
      tone: "bg-slate-200 text-slate-800",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="rounded-lg border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur animate-fade-up"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-500">{metric.label}</p>
                <p className="mt-1 text-3xl font-black text-slate-950">{metric.value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.tone}`}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold text-slate-500">{metric.detail}</p>
          </div>
        );
      })}
    </section>
  );
}
