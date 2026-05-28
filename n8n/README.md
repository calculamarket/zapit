# Workflow n8n: lembretes Zap-it pela Evolution API

Arquivo para importar no n8n:

```text
n8n/zap-it-whatsapp-reminders.workflow.json
```

## O que ele faz

1. Recebe um lembrete do Zap-it por webhook.
2. Valida telefone e data do lembrete.
3. Confirma o recebimento do webhook.
4. Aguarda o horário definido em `reminderAt`.
5. Envia a mensagem pela Evolution API na sua VPS.

## Configuração necessária no n8n

No workflow ativo, a Evolution API está configurada com:

- URL da sua VPS no node `Enviar WhatsApp Evolution API`.
- Instância da Evolution no caminho `/message/sendText/{instance}`.
- Credencial `HTTP Header Auth` com o header `apikey`.

Para importar este JSON em outro n8n, crie uma credencial `HTTP Header Auth`, use `apikey`
como nome do header e selecione essa credencial no node de envio.

## Payload esperado

Envie um `POST` para o webhook do workflow:

```json
{
  "phone": "5511999999999",
  "cardUrl": "https://zap-it.app/cards/sample-boleto",
  "item": {
    "id": "sample-boleto",
    "title": "Pagar boleto do software de automação",
    "content": "Pagar boleto até sexta. Valor estimado: R$ 289.",
    "priority": "urgente",
    "category": "financeiro",
    "reminderAt": "2026-05-25T15:00:00-03:00"
  }
}
```

## Observações

- Use telefone em formato internacional, sem `+`.
- O workflow foi montado para Evolution API v2, usando `POST /message/sendText/{instance}` com header `apikey`.
- Se sua VPS estiver em Evolution API v1, altere o corpo do node `Enviar WhatsApp Evolution API` para:

```json
{
  "number": "={{$json.phone}}",
  "textMessage": {
    "text": "={{$json.message}}"
  },
  "options": {
    "delay": 1200,
    "presence": "composing",
    "linkPreview": false
  }
}
```

- O Zap-it chama esse webhook automaticamente quando um card é criado com data de lembrete.
