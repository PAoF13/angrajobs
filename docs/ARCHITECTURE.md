# Arquitetura AngraJobs v0.1

## Objetivo
Validar demanda bilateral em Angra dos Reis sem antecipar a complexidade do produto completo.

## Fluxo

```text
Navegador
  -> Next.js 16
     -> Route Handlers
        -> validação Zod
        -> rate limit por hash de IP
        -> Turnstile, quando configurado
        -> Supabase service role somente no servidor
           -> PostgreSQL
```

## Fronteiras
- `src/components`: interface.
- `src/features/leads`: contratos e validação do domínio de leads.
- `src/lib/analytics`: atribuição e eventos.
- `src/lib/security`: anti-bot e limitação de abuso.
- `src/lib/supabase`: cliente privilegiado somente no servidor.
- `src/app/api`: entrada HTTP e orquestração.
- `supabase/migrations`: schema versionado.

O navegador não grava diretamente nas tabelas de leads. A service role nunca deve ser exposta como variável pública.
