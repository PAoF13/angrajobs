# Modelo de dados v0.1

## candidate_leads
PII: nome, WhatsApp, e-mail opcional. Dados de negócio: área de interesse. Consentimento: `marketing_consent`, `consent_at`, `privacy_version`. Aquisição: source e UTM.

## company_leads
PII: nome do responsável, WhatsApp, e-mail opcional. Dados de negócio: empresa, segmento, previsão e função. Consentimento: `contact_consent`, `consent_at`, `privacy_version`. Aquisição: source e UTM.

## analytics_events
Não deve receber nome, telefone ou e-mail. Guarda evento, sessão aleatória do navegador, origem, UTM, caminho e metadata limitada.

## rate_limit_buckets
Armazena somente HMAC do identificador de rede, ação, janela e contagem. IP bruto não é persistido.

## Retenção
A política operacional de retenção deve ser definida antes de produção conforme a finalidade real e orientação jurídica/LGPD. Não usar a base de validação como arquivo permanente sem necessidade.
