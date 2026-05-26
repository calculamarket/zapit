"use client";

import {
  BookOpen,
  History,
  Inbox,
  LayoutDashboard,
  Lightbulb,
  ListTodo,
  MessageCircle,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { zapViews } from "@/lib/zap-options";
import { useZapStore } from "@/store/zap-store";
import type { ZapView } from "@/types/zap";

const icons: Record<ZapView, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  inbox: Inbox,
  read: BookOpen,
  tasks: ListTodo,
  ideas: Lightbulb,
  history: History,
  settings: Settings,
};

export function Sidebar() {
  const { activeView, setActiveView, items } = useZapStore();
  const inboxCount = items.filter((item) => item.status === "entrada").length;

  return (
    <aside className="border-b border-white/70 bg-white/60 px-4 py-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-5">
      <div className="flex items-center justify-between gap-3 lg:block">
        <button
          className="flex items-center gap-3 rounded-lg text-left"
          onClick={() => setActiveView("dashboard")}
          aria-label="Voltar ao dashboard"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#173f31] text-white shadow-lg shadow-emerald-900/20">
            <Zap className="h-5 w-5 fill-white/20" />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black leading-tight text-slate-950">Zap-it</span>
            <span className="block text-xs font-semibold text-slate-500">
              Seu Post-it inteligente
            </span>
          </span>
        </button>
        <div className="hidden items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 sm:flex lg:mt-5 lg:flex">
          <MessageCircle className="h-4 w-4" />
          WhatsApp pronto para demo
        </div>
      </div>

      <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-soft lg:mt-7 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {zapViews.map((view) => {
          const Icon = icons[view.value];
          const isActive = activeView === view.value;

          return (
            <button
              key={view.value}
              onClick={() => setActiveView(view.value)}
              className={cn(
                "group flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-bold transition lg:w-full lg:min-w-0",
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15"
                  : "text-slate-600 hover:bg-white/90 hover:text-slate-950",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{view.label}</span>
              {view.value === "inbox" && inboxCount > 0 ? (
                <span
                  className={cn(
                    "ml-auto rounded-md px-2 py-0.5 text-[11px] font-black",
                    isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800",
                  )}
                >
                  {inboxCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-7 hidden rounded-lg border border-slate-200 bg-white/70 p-4 text-sm text-slate-700 shadow-sm lg:block">
        <p className="font-black text-slate-950">Fluxo de demo</p>
        <p className="mt-2 leading-relaxed">
          WhatsApp entra como mensagem, o Zap-it classifica, vira card e depois some do mural
          quando você resolve.
        </p>
      </div>
    </aside>
  );
}
