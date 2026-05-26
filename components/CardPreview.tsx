"use client";

import {
  AudioLines,
  ExternalLink,
  FileText,
  Globe2,
  Image as ImageIcon,
  Link2,
  Play,
} from "lucide-react";
import { buildZapPreview } from "@/lib/zap-preview";
import { cn } from "@/lib/utils";
import type { ZapItem, ZapPreview } from "@/types/zap";

type CardPreviewProps = {
  item: ZapItem;
  compact?: boolean;
};

const waveformBars = [34, 58, 42, 76, 48, 66, 86, 52, 38, 70, 46, 62, 82, 44, 56, 72];

export function CardPreview({ item, compact = false }: CardPreviewProps) {
  const preview =
    buildZapPreview({
      type: item.type,
      title: item.title,
      content: item.content,
      url: item.url,
      previewUrl: item.previewUrl,
    }) ?? item.preview;

  if (!preview) {
    return null;
  }

  if (preview.type === "video") {
    return <VideoPreview preview={preview} compact={compact} />;
  }

  if (preview.type === "audio") {
    return <AudioPreview preview={preview} compact={compact} />;
  }

  if (preview.type === "image") {
    return <ImagePreview preview={preview} compact={compact} />;
  }

  if (preview.type === "pdf" || preview.type === "document") {
    return <DocumentPreview preview={preview} compact={compact} />;
  }

  return <LinkPreview preview={preview} compact={compact} />;
}

function VideoPreview({ preview, compact }: { preview: ZapPreview; compact: boolean }) {
  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-lg border border-black/10 bg-slate-950 text-white shadow-sm",
        compact ? "h-28" : "h-36",
      )}
    >
      <div
        className="relative flex h-full items-end bg-cover bg-center"
        style={{
          backgroundImage: preview.thumbnailUrl
            ? `linear-gradient(180deg, rgba(15, 23, 42, 0.12), rgba(15, 23, 42, 0.78)), url(${preview.thumbnailUrl})`
            : "linear-gradient(135deg, #0f172a, #14532d)",
        }}
        role="img"
        aria-label={`Prévia de vídeo: ${preview.title}`}
      >
        <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-emerald-900 shadow-lg">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </div>
        <div className="w-full p-3">
          <p className="line-clamp-1 text-xs font-black uppercase text-white/78">
            {preview.domain ?? "Vídeo"}
          </p>
          {!compact ? <p className="mt-1 line-clamp-2 text-sm font-black">{preview.title}</p> : null}
        </div>
      </div>
    </div>
  );
}

function AudioPreview({ preview, compact }: { preview: ZapPreview; compact: boolean }) {
  return (
    <div
      className={cn(
        "mt-3 rounded-lg border border-black/10 bg-[#122e28] p-3 text-white shadow-sm",
        compact ? "min-h-24" : "min-h-32",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-emerald-950">
            <AudioLines className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase text-emerald-100">
              {preview.description ?? "Visualização de áudio"}
            </p>
            {!compact ? <p className="truncate text-sm font-black">{preview.title}</p> : null}
          </div>
        </div>
        <span className="rounded-md bg-white/12 px-2 py-1 text-[11px] font-black">0:42</span>
      </div>

      <div className="mt-4 flex h-12 items-center gap-1">
        {waveformBars.map((height, index) => (
          <span
            key={`${preview.title}-${index}`}
            className="w-full rounded-full bg-emerald-200/85"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ImagePreview({ preview, compact }: { preview: ZapPreview; compact: boolean }) {
  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-lg border border-black/10 bg-white/70 shadow-sm",
        compact ? "h-28" : "h-36",
      )}
    >
      {preview.thumbnailUrl ? (
        <div
          className="relative h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${preview.thumbnailUrl})` }}
          role="img"
          aria-label={`Prévia de imagem: ${preview.title}`}
        >
          <div className="absolute left-3 top-3 rounded-md bg-white/88 px-2 py-1 text-[11px] font-black text-slate-800 shadow-sm">
            Imagem
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-700">
          <ImageIcon className="h-6 w-6" />
          <span className="text-xs font-black">Imagem anexada</span>
        </div>
      )}
    </div>
  );
}

function DocumentPreview({ preview, compact }: { preview: ZapPreview; compact: boolean }) {
  return (
    <div
      className={cn(
        "mt-3 overflow-hidden rounded-lg border border-black/10 bg-[#f8fafc] p-3 shadow-sm",
        compact ? "min-h-28" : "min-h-36",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-black uppercase text-slate-500">
              {preview.type === "pdf" ? "Prévia PDF" : "Documento"}
            </p>
            <p className="truncate text-sm font-black text-slate-950">
              {preview.fileName ?? preview.title}
            </p>
          </div>
        </div>
        {preview.url ? <ExternalLink className="h-4 w-4 shrink-0 text-slate-500" /> : null}
      </div>

      <div className="mt-3 rounded-md border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="h-2 w-16 rounded-full bg-red-200" />
          <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-black text-red-700">
            {preview.type === "pdf" ? "PDF" : "DOC"}
          </span>
        </div>
        <span className="mb-1 block h-2 w-full rounded-full bg-slate-200" />
        <span className="mb-1 block h-2 w-10/12 rounded-full bg-slate-200" />
        {!compact ? <span className="block h-2 w-7/12 rounded-full bg-slate-200" /> : null}
      </div>
    </div>
  );
}

function LinkPreview({ preview, compact }: { preview: ZapPreview; compact: boolean }) {
  return (
    <div className="mt-3 rounded-lg border border-black/10 bg-white/62 p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
          <Globe2 className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-black uppercase text-slate-500">
            {preview.domain ?? "link salvo"}
          </p>
          {!compact ? <p className="mt-1 line-clamp-2 text-sm font-black text-slate-950">{preview.title}</p> : null}
          <p className="mt-1 flex items-center gap-1 truncate text-xs font-bold text-slate-600">
            <Link2 className="h-3 w-3 shrink-0" />
            {preview.description ?? "Prévia do conteúdo"}
          </p>
        </div>
      </div>
    </div>
  );
}
