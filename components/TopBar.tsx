"use client";

import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useZapStore } from "@/store/zap-store";

export function TopBar() {
  const { globalSearch, setGlobalSearch, items } = useZapStore();
  const historyCount = items.filter((item) =>
    ["lido", "concluido", "arquivado"].includes(item.status),
  ).length;

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-[#f8f6ef]/80 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white/75 px-3 py-1 text-xs font-black text-emerald-800 ring-1 ring-emerald-100">
            <Sparkles className="h-3.5 w-3.5" />
            MVP visual para organizar o que você manda para si mesmo
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-normal text-slate-950 md:text-3xl">
            Seu Post-it inteligente para o WhatsApp.
          </h1>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row xl:max-w-xl">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              className="pl-9"
              placeholder="Buscar em cards ativos e históricos..."
              aria-label="Busca global"
            />
          </label>
          <div className="flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white/80 px-3 text-xs font-bold text-slate-600">
            {historyCount} no histórico
          </div>
        </div>
      </div>
    </header>
  );
}
