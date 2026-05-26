"use client";

import { BookOpen, Inbox, Lightbulb, ListTodo } from "lucide-react";
import { DashboardBoard } from "@/components/DashboardBoard";
import { HistoryView } from "@/components/HistoryView";
import { ItemCollectionView } from "@/components/ItemCollectionView";
import { MetricsRow } from "@/components/MetricsRow";
import { OnboardingBanner } from "@/components/OnboardingBanner";
import { SearchResults } from "@/components/SearchResults";
import { SettingsView } from "@/components/SettingsView";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { WeeklyReview } from "@/components/WeeklyReview";
import { WhatsAppSimulator } from "@/components/WhatsAppSimulator";
import { useZapStore } from "@/store/zap-store";

export function ZapItApp() {
  const { items, activeView, isHydrated } = useZapStore();
  const activeItems = items.filter((item) => item.status === "entrada" || item.status === "ativo");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="min-w-0">
        <TopBar />
        <main className="space-y-5 px-4 py-5 lg:px-8 lg:py-7">
          {!isHydrated ? (
            <div className="rounded-lg border border-white/70 bg-white/70 p-8 text-center font-bold text-slate-600 shadow-sm">
              Preparando seu mural...
            </div>
          ) : (
            <>
              <SearchResults />
              {activeView === "dashboard" ? (
                <DashboardView />
              ) : activeView === "inbox" ? (
                <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
                  <ItemCollectionView
                    title="Caixa de Entrada"
                    description="Mensagens recém-chegadas do WhatsApp, prontas para triagem."
                    items={activeItems.filter((item) => item.status === "entrada")}
                    emptyTitle="Entrada vazia"
                    emptyDescription="Quando você simular uma mensagem, ela aparece aqui primeiro."
                    icon={<Inbox className="h-5 w-5" />}
                  />
                  <WhatsAppSimulator />
                </div>
              ) : activeView === "read" ? (
                <ItemCollectionView
                  title="Para Ler"
                  description="Links, vídeos e documentos que merecem uma leitura com café."
                  items={activeItems.filter((item) => ["artigo", "video", "documento"].includes(item.type))}
                  emptyTitle="Nada na fila de leitura"
                  emptyDescription="Cole um link no simulador para o Zap-it criar esta fila automaticamente."
                  icon={<BookOpen className="h-5 w-5" />}
                />
              ) : activeView === "tasks" ? (
                <ItemCollectionView
                  title="Tarefas"
                  description="Mensagens que começam como lembrete e terminam como ação."
                  items={activeItems.filter((item) => item.type === "tarefa")}
                  emptyTitle="Nenhuma tarefa pendente"
                  emptyDescription="Mensagens começando com lembrar, pagar, fazer, comprar ou revisar viram tarefas."
                  icon={<ListTodo className="h-5 w-5" />}
                />
              ) : activeView === "ideas" ? (
                <ItemCollectionView
                  title="Ideias"
                  description="Um espaço para insights antes que eles desapareçam da conversa."
                  items={activeItems.filter((item) => item.type === "ideia")}
                  emptyTitle="Sem ideias capturadas"
                  emptyDescription="Quando uma mensagem parecer uma ideia, ela ganha uma cor e vem para cá."
                  icon={<Lightbulb className="h-5 w-5" />}
                />
              ) : activeView === "history" ? (
                <HistoryView />
              ) : (
                <SettingsView />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardView() {
  return (
    <>
      <OnboardingBanner />
      <MetricsRow />
      <WeeklyReview />
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <DashboardBoard />
        <aside className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <WhatsAppSimulator />
        </aside>
      </div>
    </>
  );
}
