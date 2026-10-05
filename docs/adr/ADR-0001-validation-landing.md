# ADR-0001: Landing de validação antes do produto completo

Data: 2026-10-04

## Contexto

A AngraJobs precisa validar demanda de candidatos e empresas antes de construir autenticação, currículo, dashboards, chat, IA, apps nativos ou cobrança.

## Decisão

Construir uma única aplicação Next.js 16 + TypeScript como monólito modular. A primeira versão terá landing page, formulários de leads, eventos de analytics e persistência em PostgreSQL/Supabase.

Os formulários não escrevem diretamente no banco. O navegador envia dados para Route Handlers do Next.js. O servidor valida com Zod e grava usando credencial exclusiva do servidor.

## Consequências

Positivas:

- Menor tempo até validação real.
- Código já está no stack definido para a plataforma futura.
- Banco e analytics permitem medir intenção por área, segmento, momento de contratação e origem.
- Evita criar autenticação e dashboards antes de saber se há demanda.

Limites:

- Não existe login na v0.1.
- Não existe publicação real de vaga na v0.1.
- Não existe candidatura real na v0.1.
- Links de termos, privacidade e denúncia ainda precisam de páginas próprias antes de produção pública.
