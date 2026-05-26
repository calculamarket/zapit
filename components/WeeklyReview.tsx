"use client";

import { useMemo, useState } from "react";
import { Archive, CheckCircle2, Layers3, RotateCcw, Star } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZapCard } from "@/components/ZapCard";
import { EmptyState } from "@/components/EmptyState";
import { useZapStore } from "@/store/zap-store";

export function WeeklyReview() {
  const { items, archiveItem, completeItem, keepItem, toggleImportant } = useZapStore();
  const activeItems = useMemo(
    () => items.filter((item) => item.status === "entrada" || item.status === "ativo"),
    [items],
  );
  const [open, setOpen] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const current = items.find((item) => item.id === queue[index]);

  function openReview() {
    setQueue(activeItems.map((item) => item.id));
    setIndex(0);
    setOpen(true);
  }

  function next() {
    if (index >= queue.length - 1) {
      setOpen(false);
      return;
    }

    setIndex((currentIndex) => currentIndex + 1);
  }

  function act(action: "keep" | "archive" | "complete" | "important") {
    if (!current) {
      return;
    }

    if (action === "keep") {
      keepItem(current.id);
    }

    if (action === "archive") {
      archiveItem(current.id);
    }

    if (action === "complete") {
      completeItem(current.id);
    }

    if (action === "important") {
      toggleImportant(current.id);
    }

    next();
  }

  return (
    <section className="rounded-lg border border-white/70 bg-[#fff9df] p-4 shadow-sticky">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
          <Layers3 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black text-slate-950">Revisão Semanal</h2>
          <p className="mt-1 text-sm text-slate-700">
            {activeItems.length} {activeItems.length === 1 ? "item acumulado" : "itens acumulados"} para
            decidir com calma.
          </p>
        </div>
      </div>

      <Button className="mt-4 w-full" onClick={openReview} disabled={!activeItems.length}>
        Revisar agora
      </Button>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Revisão semanal"
        description="Um card por vez, uma decisão por vez."
      >
        {current ? (
          <div className="space-y-4">
            <div className="text-sm font-bold text-slate-600">
              Card {index + 1} de {queue.length}
            </div>
            <ZapCard item={current} readOnly />
            <div className="grid gap-2 sm:grid-cols-4">
              <Button variant="secondary" onClick={() => act("keep")}>
                <RotateCcw className="h-4 w-4" />
                Manter
              </Button>
              <Button variant="secondary" onClick={() => act("archive")}>
                <Archive className="h-4 w-4" />
                Arquivar
              </Button>
              <Button variant="secondary" onClick={() => act("complete")}>
                <CheckCircle2 className="h-4 w-4" />
                Concluir
              </Button>
              <Button variant="secondary" onClick={() => act("important")}>
                <Star className="h-4 w-4" />
                Importante
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Revisão zerada"
            description="Você passou por todos os itens desta rodada."
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
        )}
      </Dialog>
    </section>
  );
}
