# Workflow n8n: lembretes Zap-it pelo WhatsApp

Arquivo para importar no n8n:

```text
n8n/zap-it-whatsapp-reminders.workflow.json
```

## O que ele faz

1. Recebe um lembrete do Zap-it por webhook.
2. Valida telefone e data do lembrete.
3. Responde imediatamente com `202 scheduled`.
4. Aguarda o horário definido em `reminderAt`.
5. Envia a mensagem pelo WhatsApp Cloud API.

## Variáveis necessárias no n8n

Configure no ambiente do n8n:

```bash
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_token_da_meta
```

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
- O workflow usa mensagem de texto livre. Para contas WhatsApp que exigem template fora da janela de 24h, troque o corpo do node `Enviar WhatsApp Cloud API` para `type: "template"`.
- Como o Zap-it ainda é local e sem backend real, este workflow fica pronto para ser conectado por webhook quando a integração sair do LocalStorage.
