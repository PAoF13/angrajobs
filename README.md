# AngraJobs, Landing de Validação v0.1

Versão funcional para validar demanda de candidatos e empresas em Angra dos Reis antes de construir o produto completo.

## Stack

- Node.js 24 LTS em produção.
- Next.js 16, App Router e TypeScript.
- PostgreSQL via Supabase.
- Route Handlers para gravações no servidor.
- Zod para validação.
- Cloudflare Turnstile opcional.
- Rate limit persistido no PostgreSQL com identificador de rede armazenado apenas como HMAC.
- Vercel para deploy.
- Vitest para testes unitários iniciais.

A arquitetura segue o Manual Técnico 2: monólito modular, segredos somente no servidor, migrations versionadas, RLS, staging separado e complexidade adicionada apenas quando métricas reais exigirem.

## Implementado

- Landing mobile first com o briefing completo.
- Header e menu responsivo.
- Hero, candidatos, empresas, como funciona, confiança, CTA e rodapé.
- Formulários separados de candidato e empresa.
- Validação de navegador e servidor.
- Páginas de sucesso específicas.
- Persistência no Supabase com RLS default-deny.
- Eventos de analytics do briefing.
- Captura de Instagram, TikTok, Google, WhatsApp, QR Code, acesso direto e UTM.
- Honeypot, Turnstile opcional e rate limit.
- Versão do aviso de privacidade e timestamp de consentimento no banco.
- Política de Privacidade e Termos de Uso.
- Security headers e CSP inicial.
- Manifest PWA, robots e sitemap.
- Health check em `/api/health`.
- GitHub Actions para qualidade e build.
- Documentação de arquitetura, dados, segurança, API, onboarding e deploy.
- Consultas SQL para medir os critérios de sucesso da validação.

## Banco

Aplique em ordem:

```text
supabase/migrations/0001_validation_landing.sql
supabase/migrations/0002_launch_hardening.sql
```

Nunca use o banco de produção para testar migrations.

## Ambiente local

1. Instale Node.js 24 LTS.
2. Copie `.env.example` para `.env.local`.
3. Preencha as credenciais do Supabase de staging.
4. Aplique as migrations em staging.
5. Instale as dependências.
6. Versione o `package-lock.json` gerado antes do primeiro deploy.
7. Rode os checks e o projeto.

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
npm run dev
```

## Variáveis

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RATE_LIMIT_HASH_SALT=

NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_TIKTOK_URL=
NEXT_PUBLIC_WHATSAPP_URL=

TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY`, `RATE_LIMIT_HASH_SALT` e `TURNSTILE_SECRET_KEY` são somente servidor.

Se Turnstile for usado, configure a chave pública e a secreta juntas. Sem elas, o componente fica desativado para facilitar o desenvolvimento local.

## Métricas

Use `docs/VALIDATION_METRICS.sql` no SQL Editor do Supabase para acompanhar:

- candidatos cadastrados;
- empresas cadastradas;
- áreas mais procuradas;
- segmentos mais ativos;
- urgência de contratação;
- origem dos cadastros;
- início e conclusão dos formulários;
- conversão aproximada por sessões únicas.

## Deploy recomendado

```text
GitHub
  -> CI
  -> Vercel Preview / Staging
  -> testes manuais dos dois funis
  -> Produção

Supabase staging separado de Supabase production
```

Consulte `docs/runbooks/DEPLOY.md`.

## Itens externos ainda necessários para produção

Estes pontos dependem de contas ou ativos que não estão no código:

1. Projeto Supabase de staging e production.
2. Credenciais/variáveis de ambiente reais.
3. Domínio `angrajobs.com.br` apontado para a Vercel e HTTPS ativo.
4. Logo/símbolo AJ oficial e hex finais da identidade visual. O código usa fallback tipográfico e tokens provisórios.
5. URLs oficiais de Instagram, TikTok e WhatsApp.
6. Chaves Cloudflare Turnstile antes de distribuição em escala ou tráfego pago.
7. MFA nas contas operacionais.
8. Revisão jurídica final de Termos e Privacidade conforme a pessoa jurídica e operação real da AngraJobs.
9. Primeiro backup e teste de restore do ambiente de produção.

## Documentação

- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/SECURITY.md`
- `docs/API.md`
- `docs/ONBOARDING.md`
- `docs/runbooks/DEPLOY.md`
- `docs/VALIDATION_METRICS.sql`
- `docs/adr/ADR-0001-validation-landing.md`
- `CHANGELOG.md`
