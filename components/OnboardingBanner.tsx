import { ArrowRight, MessageCircle, StickyNote, WandSparkles } from "lucide-react";

export function OnboardingBanner() {
  return (
    <section className="overflow-hidden rounded-lg border border-white/70 bg-[#143d31] text-white shadow-panel">
      <div className="relative grid gap-6 p-5 md:grid-cols-[1.35fr_.65fr] md:p-7">
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.32)_1px,transparent_1px)] [background-size:26px_26px]" />
        <div className="relative">
          <p className="text-xs font-black uppercase text-emerald-100">Zap-it</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-black leading-tight text-balance md:text-4xl">
            Transforme mensagens, links e ideias do WhatsApp em cards organizados para revisar depois.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 md:text-base">
            Envie qualquer coisa pelo WhatsApp. O Zap-it transforma em cards visuais para você
            revisar, resolver ou arquivar depois.
          </p>
        </div>

        <div className="relative grid grid-cols-[auto_auto_auto] items-center justify-start gap-2 md:justify-end">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-emerald-900 shadow-lg">
            <MessageCircle className="h-7 w-7" />
          </div>
          <ArrowRight className="h-5 w-5 text-emerald-100" />
          <div className="rotate-2 rounded-lg border border-[#e8cd72] bg-[#fff4ac] p-4 text-slate-950 shadow-sticky">
            <div className="flex items-center gap-2 text-sm font-black">
              <StickyNote className="h-4 w-4" />
              Card pronto
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-700">
              <WandSparkles className="h-3.5 w-3.5" />
              classificado automaticamente
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
