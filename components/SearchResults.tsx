"use client";

import { Search } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ZapCard } from "@/components/ZapCard";
import { Button } from "@/components/ui/button";
import { matchesZapItem } from "@/lib/utils";
import { useZapStore } from "@/store/zap-store";

export function SearchResults() {
  const { globalSearch, setGlobalSearch, items } = useZapStore();
  const query = globalSearch.trim();

  if (!query) {
    return null;
  }

  const results = items.filter((item) => matchesZapItem(item, query));

  return (
    <section className="space-y-4 rounded-lg border border-white/70 bg-white/70 p-4 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            <Search className="h-5 w-5" />
            Busca global
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {results.length} resultado{results.length === 1 ? "" : "s"} para &quot;{query}&quot;
            em cards ativos e históricos.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setGlobalSearch("")}>
          Limpar busca
        </Button>
      </div>

      {results.length ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {results.map((item) => (
            <ZapCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum card encontrado"
          description="Tente procurar por título, tag, categoria, tipo, trecho da mensagem ou link."
          icon={<Search className="h-5 w-5" />}
        />
      )}
    </section>
  );
}
