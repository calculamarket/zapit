"use client";

import { useMemo, useState } from "react";
import { History, Search } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ZapCard } from "@/components/ZapCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { zapCategories, zapTypes } from "@/lib/zap-options";
import { matchesZapItem } from "@/lib/utils";
import { useZapStore } from "@/store/zap-store";
import type { ZapCategory, ZapItemType } from "@/types/zap";

export function HistoryView() {
  const { items } = useZapStore();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ZapItemType | "todos">("todos");
  const [category, setCategory] = useState<ZapCategory | "todos">("todos");

  const historyItems = useMemo(() => {
    return items
      .filter((item) => ["lido", "concluido", "arquivado"].includes(item.status))
      .filter((item) => matchesZapItem(item, query))
      .filter((item) => (type === "todos" ? true : item.type === type))
      .filter((item) => (category === "todos" ? true : item.category === category))
      .sort((a, b) => (b.archivedAt ?? b.updatedAt).localeCompare(a.archivedAt ?? a.updatedAt));
  }, [category, items, query, type]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Histórico</h2>
          <p className="mt-1 text-sm text-slate-600">
            Tudo que foi lido, concluído ou arquivado continua encontrável.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 xl:w-[680px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Buscar no histórico"
              aria-label="Buscar no histórico"
            />
          </label>
          <Select value={type} onChange={(event) => setType(event.target.value as ZapItemType | "todos")}>
            {zapTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value as ZapCategory | "todos")}
          >
            <option value="todos">Todas as categorias</option>
            {zapCategories.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {historyItems.length ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {historyItems.map((item) => (
            <ZapCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nada encontrado"
          description="Ajuste a busca ou os filtros. O histórico fica mais interessante depois de alguns arquivamentos."
          icon={<History className="h-5 w-5" />}
        />
      )}
    </section>
  );
}
