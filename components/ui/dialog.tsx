"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export function Dialog({
  open,
  title,
  description,
  children,
  onOpenChange,
  className,
}: DialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        className="absolute inset-0 cursor-default bg-slate-950/40 backdrop-blur-sm"
        aria-label="Fechar modal"
        onClick={() => onOpenChange(false)}
      />
      <section
        className={cn(
          "relative z-10 max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-lg border border-white/70 bg-[#fbfaf6] shadow-panel animate-soft-pop",
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" aria-label="Fechar" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[calc(88vh-78px)] overflow-y-auto p-5 scrollbar-soft">{children}</div>
      </section>
    </div>
  );
}
