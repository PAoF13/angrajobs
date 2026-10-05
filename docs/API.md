# API v0.1

## POST /api/leads/candidate
Cria um lead de candidato. Valida campos, consentimento, anti-bot e rate limit. Retorna `201` em sucesso, `400` em payload/anti-bot inválido, `429` em excesso e `500` em falha interna.

## POST /api/leads/company
Cria um lead de empresa com o mesmo fluxo de proteção.

## POST /api/events
Registra eventos de funil. Analytics não deve bloquear o fluxo principal do usuário.

## GET /api/health
Health check mínimo do serviço. Não expõe segredos nem estado do banco.
