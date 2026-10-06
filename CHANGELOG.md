# Changelog

## 0.1.0 - 2026-10-04
- Landing mobile first de validação.
- Funis separados de candidato e empresa.
- Persistência segura no Supabase.
- Analytics first-party e atribuição UTM.
- Páginas de sucesso.
- Política de Privacidade e Termos.
- Turnstile opcional, rate limit e headers de segurança.
- Manifest, robots, sitemap, health check e documentação operacional.

## 0.2.0 - Vagas, candidatura simples, compatibilidade e tema

- Nova rota pública `/vagas` alimentada diretamente pelo Supabase.
- Nova rota `/vagas/[slug]` para detalhes completos da oportunidade.
- Apenas vagas `published` e não expiradas ficam públicas.
- Candidatura simples e privada por vaga, validada no servidor com Turnstile e rate limit.
- Compatibilidade candidato-vaga baseada somente em critérios profissionais informados.
- O percentual é apresentado como compatibilidade, nunca como chance de contratação.
- Alternância visual Claro / P&B com preferência salva no navegador.
- Landing preservada, com `Encontrar vagas` separado do formulário `Quero receber novas vagas`.

## 0.3.0 - Contas, painel empresarial e operação profissional

- Cadastro e login separados para candidatos e empresas via Supabase Auth.
- Recuperação e redefinição de senha.
- Perfil persistente de candidato e dados persistentes da empresa.
- Dashboard de candidato com perfil e candidaturas.
- Dashboard empresarial com vagas, candidaturas e atualização de status.
- Propriedade segura de vagas por empresa e isolamento por RLS.
- Vagas gratuitas limitadas a 7 dias e expiração automática.
- Planos Pro e Business preparados para permitir até 180 dias conforme entitlement ativo.
- Planos Básico R$ 0, Pro R$ 89/mês e Business R$ 199/mês.
- Solicitação de vaga destacada por R$ 29.
- Solicitação de divulgação com vídeo/live/collab, plataforma, duração e estimativa limitada a R$ 50.
- Configurações de conta, empresa e tema Claro/P&B.
- Denúncia de vagas e painel interno de moderação.
- Notificações internas de candidaturas e expiração próxima.
- Estrutura de pagamento preparada para webhook idempotente, sem ativar plano pago por retorno do navegador.
- Rotina Supabase Cron para expiração de vagas, assinaturas e alertas.
