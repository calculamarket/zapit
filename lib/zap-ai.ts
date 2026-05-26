import { GoogleGenerativeAI } from "@google/generative-ai";
import { ZapCategory, ZapPriority, ZapItemType } from "@/types/zap";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export type AICategorization = {
  type: ZapItemType;
  priority: ZapPriority;
  category: ZapCategory;
  summary: string;
  tags: string[];
  title: string;
};

export async function categorizeWithAI(content: string): Promise<AICategorization | null> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return null;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analise a seguinte mensagem do WhatsApp e extraia informações estruturadas em JSON.
    Os tipos possíveis (type) são: artigo, video, tarefa, ideia, audio, imagem, documento, nota.
    As prioridades (priority) são: baixa, media, alta, urgente.
    As categorias de negócio (category) são: sem-categoria, trabalho, pessoal, estudos, marketing, produto, financeiro, inspiracao.

    Mensagem: "${content}"

    Retorne APENAS o JSON puro, sem blocos de código markdown, no formato:
    {
      "type": "tipo_extraido",
      "priority": "prioridade_extraida",
      "category": "categoria_negocio_extraida",
      "summary": "resumo curto em uma frase",
      "tags": ["tag1", "tag2"],
      "title": "título curto e conciso"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0];
    if (jsonStr) {
      return JSON.parse(jsonStr) as AICategorization;
    }
  } catch (error) {
    console.error("AI Categorization failed:", error);
  }
  return null;
}
