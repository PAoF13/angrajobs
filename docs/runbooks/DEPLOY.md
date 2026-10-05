# Runbook de deploy

1. Confirmar CI verde.
2. Confirmar migrations aplicadas primeiro em staging.
3. Configurar variáveis no ambiente de staging.
4. Publicar preview/staging e testar os dois formulários.
5. Conferir registros no Supabase sem expor PII em screenshots públicos.
6. Conferir eventos de analytics e UTMs.
7. Testar páginas `/privacidade`, `/termos`, `/api/health`, sitemap e robots.
8. Só então promover a mesma revisão para produção.

## Rollback
- Reverter o deploy na Vercel para a última versão funcional.
- Não desfazer migration destrutiva automaticamente.
- Para mudanças de schema, preferir migrations aditivas e compatíveis com rollback de aplicação.
