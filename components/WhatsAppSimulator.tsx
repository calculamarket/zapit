"use client";

import { FormEvent, useState } from "react";
import { Check, ImagePlus, Loader2, MessageCircle, Send, Tags } from "lucide-react";
import { scheduleZapReminder } from "@/app/actions/zap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zapCategories, zapPriorities } from "@/lib/zap-options";
import { useZapStore } from "@/store/zap-store";
import type { ZapCategory, ZapPriority } from "@/types/zap";

type CategoryChoice = ZapCategory | "auto";

export function WhatsAppSimulator() {
  const { addFromWhatsApp, setActiveView, currentUser } = useZapStore();
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [category, setCategory] = useState<CategoryChoice>("auto");
  const [priority, setPriority] = useState<ZapPriority>("media");
  const [reminderAt, setReminderAt] = useState("");
  const [tags, setTags] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text.trim() && !link.trim()) {
      setFeedback("Mande pelo menos um texto ou link. O mural gosta de matéria-prima.");
      return;
    }

    setIsSubmitting(true);

    try {
      const item = await addFromWhatsApp({
        text,
        link,
        previewUrl,
        remoteJid: currentUser ? `${currentUser.whatsappNumber}@s.whatsapp.net` : undefined,
        category: category === "auto" ? undefined : category,
        priority,
        reminderAt,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      let reminderFeedback = "";
      if (item.reminderAt) {
        const reminder = await scheduleZapReminder(item.id);
        reminderFeedback = reminder.success
          ? " Lembrete conectado ao WhatsApp."
          : ` ${reminder.error}`;
      }

      setText("");
      setLink("");
      setPreviewUrl("");
      setCategory("auto");
      setPriority("media");
      setReminderAt("");
      setTags("");
      setActiveView("dashboard");
      setFeedback(`"${item.title}" virou card no mural.${reminderFeedback}`);
    } catch {
      setFeedback("Não consegui criar esse card agora. Tente de novo em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-panel backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-950">Simulador WhatsApp</h2>
          <p className="text-sm text-slate-600">Cole uma mensagem e veja o Zap-it organizar.</p>
        </div>
      </div>

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-xs font-black uppercase text-slate-500">Mensagem</span>
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Ex: lembrar de revisar contrato, artigo sobre IA, ideia de campanha..."
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-black uppercase text-slate-500">Link opcional</span>
          <Input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-xs font-black uppercase text-slate-500">
            <ImagePlus className="h-3.5 w-3.5" />
            Prévia ou mídia opcional
          </span>
          <Input
            value={previewUrl}
            onChange={(event) => setPreviewUrl(event.target.value)}
            placeholder="Imagem, MP3, PDF ou thumbnail"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase text-slate-500">Categoria</span>
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryChoice)}
            >
              <option value="auto">Detectar automaticamente</option>
              {zapCategories.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase text-slate-500">Prioridade</span>
            <Select
              value={priority}
              onChange={(event) => setPriority(event.target.value as ZapPriority)}
            >
              {zapPriorities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-black uppercase text-slate-500">
            Data de lembrete opcional
          </span>
          <Input
            type="datetime-local"
            value={reminderAt}
            onChange={(event) => setReminderAt(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-xs font-black uppercase text-slate-500">
            <Tags className="h-3.5 w-3.5" />
            Tags
          </span>
          <Input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="ia, cliente, campanha"
          />
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isSubmitting ? "Enviando..." : "Enviar para o Zap-it"}
        </Button>
      </form>

      {feedback ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">
          <Check className="mt-0.5 h-4 w-4 shrink-0" />
          {feedback}
        </div>
      ) : null}
    </section>
  );
}
