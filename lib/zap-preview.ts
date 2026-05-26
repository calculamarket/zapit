import type { ZapItemType, ZapPreview } from "@/types/zap";

type PreviewInput = {
  type: ZapItemType;
  title: string;
  content: string;
  url?: string;
  previewUrl?: string;
};

const imageRegex = /\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i;
const audioRegex = /\.(mp3|wav|m4a|ogg|aac|flac)(\?.*)?$/i;
const pdfRegex = /\.pdf(\?.*)?$/i;

export function buildZapPreview(input: PreviewInput): ZapPreview | undefined {
  const mediaUrl = cleanUrl(input.previewUrl) ?? cleanUrl(input.url);

  if (input.type === "video") {
    const youtubeThumbnail = mediaUrl ? getYouTubeThumbnail(mediaUrl) : undefined;

    return {
      type: "video",
      title: input.title || "Vídeo salvo",
      description: youtubeThumbnail ? "Thumbnail gerada pelo link do YouTube" : "Prévia de vídeo",
      url: mediaUrl,
      thumbnailUrl: youtubeThumbnail ?? input.previewUrl,
      domain: mediaUrl ? getDomain(mediaUrl) : undefined,
    };
  }

  if (input.type === "audio") {
    return {
      type: "audio",
      title: input.title || "Áudio salvo",
      description: mediaUrl ? "Arquivo de áudio anexado" : "Visualização de áudio transcrito",
      url: mediaUrl,
      domain: mediaUrl ? getDomain(mediaUrl) : undefined,
    };
  }

  if (input.type === "imagem" || (mediaUrl && imageRegex.test(mediaUrl))) {
    return {
      type: "image",
      title: input.title || "Imagem salva",
      description: "Prévia visual anexada ao card",
      url: mediaUrl,
      thumbnailUrl: mediaUrl,
      domain: mediaUrl ? getDomain(mediaUrl) : undefined,
    };
  }

  if (input.type === "documento" || (mediaUrl && pdfRegex.test(mediaUrl))) {
    const documentText = `${input.title} ${input.content}`.toLowerCase();
    const isPdf = mediaUrl ? pdfRegex.test(mediaUrl) : documentText.includes("pdf");

    return {
      type: isPdf ? "pdf" : "document",
      title: input.title || "Documento salvo",
      description: isPdf ? "Prévia simulada de PDF" : "Prévia de documento",
      url: mediaUrl,
      domain: mediaUrl ? getDomain(mediaUrl) : undefined,
      fileName: mediaUrl ? getFileName(mediaUrl) : "proposta-comercial.pdf",
    };
  }

  if (mediaUrl && audioRegex.test(mediaUrl)) {
    return {
      type: "audio",
      title: input.title || "Áudio salvo",
      description: "Arquivo de áudio anexado",
      url: mediaUrl,
      domain: getDomain(mediaUrl),
    };
  }

  if (input.type === "artigo" && mediaUrl) {
    return {
      type: "link",
      title: input.title || getDomain(mediaUrl),
      description: "Prévia do link salvo para leitura",
      url: mediaUrl,
      domain: getDomain(mediaUrl),
    };
  }

  return undefined;
}

export function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return undefined;
  }

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0];
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") ?? undefined;
      }

      const parts = parsed.pathname.split("/").filter(Boolean);

      if (["shorts", "embed", "live"].includes(parts[0])) {
        return parts[1];
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

function cleanUrl(value?: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "link externo";
  }
}

function getFileName(url: string) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] ?? "documento.pdf");
  } catch {
    return "documento.pdf";
  }
}
