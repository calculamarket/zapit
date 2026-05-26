"use client";

import { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import {
  Archive,
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  File,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  Mic,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Star,
  StickyNote,
  Tag,
  Trash2,
  Video,
  X,
  MessageSquareReply,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardPreview } from "@/components/CardPreview";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categoryCardStyles, priorityTones } from "@/lib/zap-options";
import { buildZapPreview } from "@/lib/zap-preview";
import {
  cn,
  formatDateTime,
  formatShortDate,
  getCategoryLabel,
  getPriorityLabel,
  getTypeLabel,
} from "@/lib/utils";
import { useZapStore } from "@/store/zap-store";
import { sendWhatsAppReply } from "@/app/actions/zap";
import type { ZapItem, ZapItemType } from "@/types/zap";

type ZapCardProps = {
  item: ZapItem;
  compact?: boolean;
  readOnly?: boolean;
};

const typeIcons: Record<ZapItemType, typeof StickyNote> = {
  artigo: FileText,
  video: Video,
  tarefa: CheckCircle2,
  ideia: Lightbulb,
  audio: Mic,
  imagem: ImageIcon,
  documento: File,
  nota: StickyNote,
};

export function ZapCard({ item, compact = false, readOnly = false }: ZapCardProps) {
  const {
    updateItem,
    deleteItem,
    toggleImportant,
    markRead,
    completeItem,
    archiveItem,
    keepItem,
    addTag,
    removeTag,
  } = useZapStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [draftTitle, setDraftTitle] = useState(item.title);
  const [draftContent, setDraftContent] = useState(item.content);
  const [draftPreviewUrl, setDraftPreviewUrl] = useState(item.previewUrl ?? "");
  const [tagDraft, setTagDraft] = useState("");
  const Icon = typeIcons[item.type];
  const isHistorical = ["lido", "concluido", "arquivado"].includes(item.status);

  useEffect(() => {
    setDraftTitle(item.title);
    setDraftContent(item.content);
    setDraftPreviewUrl(item.previewUrl ?? "");
  }, [item.content, item.previewUrl, item.title]);

  function saveEdit() {
    updateItem(item.id, {
      title: draftTitle.trim() || item.title,
      content: draftContent.trim() || item.content,
      previewUrl: draftPreviewUrl.trim() || undefined,
      preview: buildZapPreview({
        type: item.type,
        title: draftTitle.trim() || item.title,
        content: draftContent.trim() || item.content,
        url: item.url,
        previewUrl: draftPreviewUrl,
      }),
    });
    setIsEditing(false);
  }

  async function handleSendReply() {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    try {
      const res = await sendWhatsAppReply(item.id, replyText);
      if (res.success) {
        setIsReplying(false);
        setReplyText("");
      } else {
        alert(res.error || "Erro ao enviar resposta.");
      }
    } catch (error) {
      alert("Erro ao enviar resposta.");
    } finally {
      setIsSendingReply(false);
    }
  }

  function submitTag(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTag(item.id, tagDraft);
    setTagDraft("");
  }

  function submitTagWithEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag(item.id, tagDraft);
      setTagDraft("");
    }
  }

  return (
    <article
      className={cn(
        "group relative flex min-h-[240px] flex-col rounded-lg border p-4 shadow-sticky transition duration-200 hover:-translate-y-0.5 hover:shadow-panel",
        categoryCardStyles[item.category],
        compact ? "min-h-0" : "",
      )}
    >
      <div className="absolute inset-x-7 -top-2 h-4 rounded-b-lg bg-black/5 blur-[1px]" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70 text-slate-800 ring-1 ring-black/5">
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <Badge tone={priorityTones[item.priority]}>{getPriorityLabel(item.priority)}</Badge>
          </div>
        </div>
        <button
          title={item.important ? "Remover importante" : "Marcar como importante"}
          aria-label={item.important ? "Remover importante" : "Marcar como importante"}
          onClick={() => !readOnly && toggleImportant(item.id)}
          className={cn(
            "rounded-lg p-1.5 transition hover:bg-white/60",
            item.important ? "text-amber-600" : "text-slate-500",
          )}
          disabled={readOnly}
        >
          <Star className={cn("h-4 w-4", item.important ? "fill-current" : "")} />
        </button>
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-2">
          <Input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
          <Textarea
            value={draftContent}
            onChange={(event) => setDraftContent(event.target.value)}
            className="min-h-24"
          />
          <Input
            value={draftPreviewUrl}
            onChange={(event) => setDraftPreviewUrl(event.target.value)}
            placeholder="URL de prévia, imagem, áudio ou PDF"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={saveEdit}>
              Salvar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="mt-3 break-words text-base font-black leading-snug text-slate-950">
            {item.title}
          </h3>
          <p className="mt-2 max-h-24 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-5 text-slate-700 scrollbar-soft">
            {item.content}
          </p>
          <CardPreview item={item} compact={compact} />
        </>
      )}

      {item.summary && !compact ? (
        <div className="mt-3 rounded-lg bg-white/60 p-3 text-xs font-semibold leading-5 text-slate-700 ring-1 ring-black/5">
          {item.summary}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge>{getTypeLabel(item.type)}</Badge>
        <Badge>{getCategoryLabel(item.category)}</Badge>
        <Badge>{item.origin}</Badge>
        {item.reminderAt ? <Badge tone="amber">Lembrete {formatShortDate(item.reminderAt)}</Badge> : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex max-w-full items-center gap-1 rounded-md bg-white/60 px-2 py-1 text-[11px] font-bold text-slate-700 ring-1 ring-black/5"
          >
            <Tag className="h-3 w-3 shrink-0" />
            <span className="truncate">{tag}</span>
            {!readOnly ? (
              <button
                title={`Remover tag ${tag}`}
                aria-label={`Remover tag ${tag}`}
                onClick={() => removeTag(item.id, tag)}
                className="rounded-sm text-slate-500 hover:text-slate-950"
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </span>
        ))}
      </div>

      {!readOnly ? (
        <form className="mt-3 flex gap-2" onSubmit={submitTag}>
          <Input
            value={tagDraft}
            onKeyDown={submitTagWithEnter}
            onChange={(event) => setTagDraft(event.target.value)}
            placeholder="nova tag"
            className="h-8 bg-white/70 text-xs"
          />
          <Button type="submit" size="icon" variant="secondary" title="Adicionar tag" aria-label="Adicionar tag">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      ) : null}

      {isReplying && (
        <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-1">
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Digite a resposta..."
            className="h-8 bg-white/70 text-xs"
            autoFocus
          />
          <Button 
            size="icon" 
            onClick={handleSendReply} 
            disabled={isSendingReply || !replyText.trim()}
            title="Enviar resposta"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-3">
          <span className="text-[11px] font-bold text-slate-600">
            {formatDateTime(item.createdAt)}
          </span>
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-white/60 px-2 py-1 text-[11px] font-black text-slate-800 ring-1 ring-black/5 transition hover:bg-white"
            >
              Abrir
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </div>

        {!readOnly ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {isHistorical ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => keepItem(item.id)}
                title="Trazer de volta ao mural"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reativar
              </Button>
            ) : (
              <>
                <Button size="icon" variant="secondary" onClick={() => setIsEditing(true)} title="Editar">
                  <Pencil className="h-4 w-4" />
                </Button>
                {item.remoteJid && (
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => setIsReplying(!isReplying)}
                    title="Responder no WhatsApp"
                  >
                    <MessageSquareReply className={cn("h-4 w-4", isReplying && "text-primary")} />
                  </Button>
                )}
                <Button size="icon" variant="secondary" onClick={() => markRead(item.id)} title="Marcar como lido">
                  <BookOpenCheck className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={() => completeItem(item.id)} title="Concluir">
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={() => archiveItem(item.id)} title="Arquivar">
                  <Archive className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button size="icon" variant="danger" onClick={() => deleteItem(item.id)} title="Excluir">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
