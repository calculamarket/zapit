import type { ZapItem } from "@/types/zap";
import { daysAgo, daysFromNow } from "@/lib/utils";
import { buildZapPreview } from "@/lib/zap-preview";

export function getInitialZapItems(): ZapItem[] {
  const now = new Date().toISOString();

  const items: ZapItem[] = [
    {
      id: "sample-ai-article",
      title: "Ler: Tendências de IA generativa para operações",
      content:
        "Artigo sobre IA aplicada a produtividade e atendimento: https://hbr.org/ai-operations",
      type: "artigo",
      category: "estudos",
      priority: "alta",
      status: "entrada",
      tags: ["ia", "leitura", "estratégia"],
      origin: "WhatsApp",
      important: true,
      createdAt: daysAgo(1),
      updatedAt: now,
      summary:
        "Resumo gerado: este conteúdo parece ser um artigo salvo para leitura posterior. Revise quando tiver tempo e separe ideias que possam virar experimento.",
      url: "https://hbr.org/ai-operations",
    },
    {
      id: "sample-youtube-video",
      title: "Assistir: Como redes neurais aprendem",
      content:
        "Vídeo para assistir depois https://youtu.be/aircAruvnKk sobre fundamentos de redes neurais e IA.",
      type: "video",
      category: "pessoal",
      priority: "media",
      status: "ativo",
      tags: ["youtube", "organização"],
      origin: "WhatsApp",
      important: false,
      createdAt: daysAgo(4),
      updatedAt: now,
      reminderAt: daysFromNow(1),
      summary:
        "Resumo gerado: este conteúdo de youtu.be parece ser um vídeo salvo para assistir com calma. Revise quando tiver tempo.",
      url: "https://youtu.be/aircAruvnKk",
    },
    {
      id: "sample-boleto",
      title: "Pagar boleto do software de automação",
      content: "Pagar boleto do software de automação até sexta. Valor estimado: R$ 289.",
      type: "tarefa",
      category: "financeiro",
      priority: "urgente",
      status: "entrada",
      tags: ["financeiro", "boleto"],
      origin: "WhatsApp",
      important: true,
      createdAt: daysAgo(0),
      updatedAt: now,
      reminderAt: daysFromNow(2),
    },
    {
      id: "sample-campaign",
      title: "Ideia: campanha 'salvei no WhatsApp, achei no Zap-it'",
      content:
        "Ideia de campanha de marketing: mostrar antes/depois de links perdidos no WhatsApp virando mural visual.",
      type: "ideia",
      category: "marketing",
      priority: "alta",
      status: "ativo",
      tags: ["campanha", "lançamento", "copy"],
      origin: "WhatsApp",
      important: true,
      createdAt: daysAgo(2),
      updatedAt: now,
    },
    {
      id: "sample-product-link",
      title: "Ler: Referência de produto para painel compacto",
      content:
        "Link de produto com boa página de pricing para analisar depois: https://linear.app/pricing",
      type: "artigo",
      category: "produto",
      priority: "media",
      status: "ativo",
      tags: ["produto", "pricing", "referência"],
      origin: "WhatsApp",
      important: false,
      createdAt: daysAgo(5),
      updatedAt: now,
      summary:
        "Resumo gerado: este conteúdo de linear.app parece ser um artigo ou link salvo para leitura posterior. Revise quando tiver tempo e capture padrões úteis.",
      url: "https://linear.app/pricing",
    },
    {
      id: "sample-audio",
      title: "Áudio transcrito: insight do cliente",
      content:
        "Áudio transcrito simulado: cliente disse que salva links no WhatsApp, mas esquece de voltar. Dor central é revisão, não captura.",
      type: "audio",
      category: "produto",
      priority: "alta",
      status: "ativo",
      tags: ["cliente", "insight", "áudio"],
      origin: "WhatsApp",
      important: true,
      createdAt: daysAgo(7),
      updatedAt: now,
    },
    {
      id: "sample-document",
      title: "Revisar proposta comercial em PDF",
      content:
        "Documento para revisar: proposta comercial enviada pelo parceiro. Checar escopo, prazo e cláusula de suporte.",
      type: "documento",
      category: "trabalho",
      priority: "media",
      status: "entrada",
      tags: ["documento", "proposta"],
      origin: "WhatsApp",
      important: false,
      createdAt: daysAgo(3),
      updatedAt: now,
    },
    {
      id: "sample-history",
      title: "Concluir briefing da landing page",
      content: "Fazer checklist do briefing da nova landing page e enviar para o time.",
      type: "tarefa",
      category: "marketing",
      priority: "media",
      status: "concluido",
      tags: ["landing", "time"],
      origin: "WhatsApp",
      important: false,
      createdAt: daysAgo(12),
      updatedAt: daysAgo(8),
      completedAt: daysAgo(8),
      archivedAt: daysAgo(8),
    },
  ];

  return items.map((item) => ({
    ...item,
    preview:
      item.preview ??
      buildZapPreview({
        type: item.type,
        title: item.title,
        content: item.content,
        url: item.url,
        previewUrl: item.previewUrl,
      }),
  }));
}
