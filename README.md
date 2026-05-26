# Zap-it

Seu Post-it inteligente para o WhatsApp.

O Zap-it é um MVP de dashboard visual para organizar links, artigos, ideias, lembretes, vídeos, áudios e mensagens que as pessoas normalmente mandam para si mesmas no WhatsApp e depois perdem na conversa.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Para validar uma versão de produção:

```bash
npm run build
```

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Componentes locais inspirados em shadcn/ui
- Lucide React
- Context API para estado local
- LocalStorage para persistência inicial

## Funcionalidades implementadas

- Dashboard visual estilo Post-it digital com seções: Entrada, Hoje, Importante, Para ler, Ideias e Tarefas.
- Simulador WhatsApp para enviar texto, link, URL de prévia/mídia, categoria opcional, prioridade, lembrete e tags.
- Criação automática de cards a partir do fluxo WhatsApp -> Zap-it.
- Detecção simples de tipo:
  - URLs viram artigos ou links.
  - `youtube.com` e `youtu.be` viram vídeos.
  - Mensagens começando com `lembrar`, `pagar`, `fazer`, `comprar` ou `revisar` viram tarefas.
  - O restante vira nota ou ideia.
- Resumo automático mockado para links.
- Prévias inteligentes nos cards:
  - Thumbnail automática para vídeos do YouTube.
  - Visualização em waveform para áudios.
  - Miniatura simulada para PDF e documentos.
  - Prévia visual para imagens.
  - Bloco de domínio para links e artigos.
- Cards com título, conteúdo, tipo, categoria, prioridade, origem, data, status, tags e ações rápidas.
- Ações de marcar como importante, marcar como lido, concluir, arquivar, excluir, editar título/conteúdo/prévia e adicionar/remover tags.
- Histórico com busca por texto, filtro por tipo e filtro por categoria.
- Busca global em cards ativos e históricos.
- Dados iniciais realistas: artigo sobre IA, vídeo do YouTube, boleto, campanha de marketing, link de produto, áudio transcrito e documento para revisar.
- Onboarding com a proposta do produto.
- Métricas rápidas no topo do dashboard.
- Revisão semanal com modal de card por vez e ações de manter, arquivar, concluir e marcar como importante.
- Empty states e microcopy em português brasileiro.
- Layout responsivo para desktop e mobile.

## Organização do código

```text
app/          Rotas e layout do App Router
components/   Componentes de interface e módulos do produto
components/ui Componentes base no estilo shadcn/ui
data/         Cards iniciais de demonstração
lib/          Utilitários, opções e classificação de mensagens
store/        Context API com persistência em LocalStorage
types/        Tipos TypeScript do domínio Zap-it
```

## Pontos preparados para integração futura

As funções principais do domínio já estão separadas em `lib/zap-classifier.ts`:

- `receiveWhatsAppMessage()`
- `classifyIncomingMessage()`
- `createZapCard()`
- `archiveZapItem()`

Em uma próxima etapa, essas funções podem ser chamadas por uma rota de API ou webhook conectado à WhatsApp Business API.

## Workflow n8n

Também existe um workflow importável para disparar lembretes pelo WhatsApp:

```text
n8n/zap-it-whatsapp-reminders.workflow.json
```

Ele recebe lembretes por webhook, aguarda `reminderAt` e envia a mensagem pela WhatsApp Cloud API.
