# Segurança v0.1

## Controles presentes
- RLS ativada nas tabelas públicas de dados.
- Sem policies de leitura/escrita para `anon` e `authenticated` nas tabelas de validação.
- Service role somente em Route Handlers.
- Validação Zod no servidor.
- Honeypot nos formulários.
- Cloudflare Turnstile opcional e validado no servidor.
- Rate limit no PostgreSQL com hash HMAC do IP, sem persistir IP bruto.
- Headers de segurança e CSP inicial.
- Logs de erro sem payload dos formulários.

## Segredos
Nunca commitar `.env.local`, service role, salt de rate limit ou Turnstile secret. Se um segredo aparecer em commit, chat público, screenshot ou frontend, revogar e substituir.

## Antes de produção
- MFA em GitHub, Vercel, Supabase e e-mail.
- Confirmar backup do Supabase.
- Testar RLS negativamente.
- Configurar Turnstile.
- Configurar `RATE_LIMIT_HASH_SALT` longo e aleatório.
- Revisar CSP após inclusão de qualquer novo provedor.
- Revisar Política de Privacidade e Termos com orientação jurídica adequada ao negócio real.
