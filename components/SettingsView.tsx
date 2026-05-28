"use client";

import { BellRing, Database, MessageCircle, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useZapStore } from "@/store/zap-store";

export function SettingsView() {
  const { items, resetSamples, clearAll } = useZapStore();

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-slate-950">Configurações</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ajustes simples para a primeira versão demonstrável.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-lg border border-white/70 bg-white/75 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-950">Base Supabase</h3>
              <p className="text-sm text-slate-600">{items.length} cards carregados no painel.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row xl:flex-col">
            <Button variant="secondary" onClick={resetSamples}>
              <RotateCcw className="h-4 w-4" />
              Restaurar exemplos
            </Button>
            <Button variant="danger" onClick={clearAll}>
              <Trash2 className="h-4 w-4" />
              Limpar mural
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-white/70 bg-white/75 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-950">Entrada WhatsApp</h3>
              <p className="text-sm text-slate-600">A demo cria cards como se viessem do WhatsApp.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            A arquitetura já separa recebimento, classificação e criação do card para integração
            com Evolution API ou WhatsApp Business API.
          </p>
        </section>

        <section className="rounded-lg border border-white/70 bg-white/75 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-950">Lembretes via n8n</h3>
              <p className="text-sm text-slate-600">Workflow ativo com Evolution API.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Cards criados com data de lembrete são enviados para o n8n, que aguarda o horário e
            dispara a mensagem pelo WhatsApp.
          </p>
        </section>
      </div>
    </section>
  );
}
