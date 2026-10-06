# AngraJobs v0.3, contas e operação profissional

A v0.3 adiciona a camada de contas, propriedade das vagas, painel empresarial e automações necessárias para operar candidaturas sem expor dados privados.

## Fluxos

### Candidato

1. Cria conta em `/cadastro` como candidato.
2. Confirma o e-mail conforme a configuração do Supabase Auth.
3. Completa o perfil profissional em `/candidato/perfil`.
4. Busca oportunidades em `/vagas`.
5. Consulta compatibilidade com base apenas em critérios profissionais informados.
6. Abre a vaga e envia candidatura autenticada.
7. Acompanha as próprias candidaturas em `/candidato/candidaturas`.

O percentual exibido é **compatibilidade com requisitos informados**, nunca probabilidade de contratação.

### Empresa

1. Cria conta em `/cadastro?tipo=empresa`.
2. O banco cria automaticamente `profile`, `company_members`, empresa e assinatura gratuita.
3. Acessa `/empresa`.
4. Publica e gerencia vagas em `/empresa/vagas`.
5. Vê somente candidaturas das vagas da própria empresa.
6. Atualiza o status das candidaturas para recebido, análise, entrevista, contratado ou recusado.
7. Consulta planos em `/empresa/plano` e solicita divulgação em `/empresa/divulgacao`.

## Duração automática das vagas

O banco é a autoridade da duração.

| Entitlement | Vagas ativas | Duração máxima |
| --- | ---: | ---: |
| Básico | 1 | 7 dias |
| Pro | 3 | 180 dias |
| Business | 10 | 180 dias |

A trigger `prepare_job_before_write()` limita a duração conforme o entitlement ativo. Não basta alterar um campo no navegador.

`expire_jobs()` transforma vagas vencidas em `expired`. Além disso, as consultas públicas já excluem vagas cujo `expires_at` passou, portanto uma vaga vencida deixa de aparecer mesmo antes da próxima execução do cron.

A migration `0005_automation_cron.sql` agenda a rotina a cada 15 minutos.

## Planos e cobrança

Preços apresentados nesta versão:

- Básico: R$ 0.
- Vaga destacada: R$ 29 por vaga.
- Pro: R$ 89/mês.
- Business: R$ 199/mês.
- Divulgação: orçamento estimado entre R$ 0 e R$ 50 conforme formato, plataforma e duração.

**Importante:** a v0.3 não inventa uma confirmação de pagamento. `plan_requests` registra a intenção comercial e `subscriptions` representa o entitlement real. Um plano pago só deve ser ativado por:

1. webhook autenticado do provedor de pagamentos; ou
2. aprovação administrativa legítima enquanto a operação estiver em beta.

A tabela `payment_events` já existe para idempotência e auditoria quando Mercado Pago, Stripe ou outro provedor for conectado.

## Segurança e privacidade

- `service_role` continua exclusivamente no servidor.
- Operações críticas usam Route Handlers Next.js, autenticação e autorização no servidor.
- RLS impede uma empresa de ler candidaturas de outra.
- Candidato só lê as próprias candidaturas.
- Vagas públicas continuam sendo somente `published` e não expiradas.
- Denúncias são registradas em `reports`.
- Turnstile e rate limit continuam protegendo formulários públicos e candidaturas.
- Rotas privadas são marcadas como `noindex`.

## Tema

A configuração visual está em `/configuracoes`.

- Claro.
- P&B.

A preferência é salva no navegador e, para usuário autenticado, também em `profiles.theme_preference`.

## Configuração do Supabase Auth

No painel Supabase, configure:

- Site URL: `https://angrajobs.com.br`
- Redirect URLs:
  - `https://angrajobs.com.br/**`
  - `https://www.angrajobs.com.br/**`

Para recuperação de senha em produção, configure SMTP próprio antes de escalar o tráfego. O e-mail padrão do Supabase serve para testes, mas possui limites operacionais.

## Ordem de deploy

1. Fazer backup do banco.
2. Rodar `0004_accounts_companies_plans_reports.sql`.
3. Testar cadastro de candidato e empresa.
4. Rodar `0005_automation_cron.sql` e confirmar o job no Supabase Cron.
5. Configurar Site URL e Redirect URLs no Supabase Auth.
6. Publicar o código na Vercel.
7. Testar candidato, empresa, denúncia, recuperação de senha e tema em mobile e desktop.
8. Criar uma conta administrativa separada somente para operação interna.

## Limitações intencionais desta versão

Ainda não há:

- pagamento real integrado a um provedor;
- convite de múltiplos usuários pelo painel Business;
- MFA dentro do produto;
- e-mail transacional próprio para novas candidaturas;
- app nativo;
- chat;
- IA de contratação;
- ranking automatizado de candidatos para empresas.

Esses itens devem entrar quando a operação real justificar a complexidade.
