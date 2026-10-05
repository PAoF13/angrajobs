# AngraJobs v0.2: vagas, candidatura e compatibilidade

## O que mudou

A landing continua existindo. O botão **Encontrar vagas** agora aponta para `/vagas`.
O formulário de interesse continua na home como **Quero receber novas vagas**.

Fluxos:

- Encontrar vagas -> `/vagas` -> `/vagas/[slug]` -> candidatura simples.
- Quero receber novas vagas -> `/#form-candidato` -> `candidate_leads`.

## Segurança

- `jobs`: RLS permite ao público somente `status = published` e vaga não expirada.
- `job_applications`: RLS ativada e sem policy pública. O navegador não grava diretamente nesta tabela.
- A candidatura entra por `POST /api/applications`, que valida payload, Turnstile, rate limit e o status da vaga.
- `SUPABASE_SERVICE_ROLE_KEY` permanece somente no servidor.
- A lista pública usa a chave publishable/anon no servidor, portanto a própria RLS também protege a leitura.

## Compatibilidade

O recurso não calcula “chance de contratação”. Ele mostra **compatibilidade com os requisitos informados**.

Critérios profissionais que podem entrar no cálculo:

- área/categoria;
- tipo de contrato;
- modalidade;
- bairro;
- experiência mínima;
- disponibilidade para início;
- tipo de horário;
- habilidades informadas.

O resultado não usa idade, sexo, raça, religião, deficiência, orientação sexual ou outros dados sensíveis. Nesta versão, as respostas usadas para comparar vagas não são persistidas no banco.

A pontuação serve somente para ajudar o candidato a organizar as vagas que ele vê. Ela não deve ser usada pela empresa para rejeitar, bloquear ou ranquear candidatos.

## Como cadastrar uma vaga no Supabase

No **Table Editor -> jobs -> Insert row**, preencha no mínimo:

- `title`: cargo.
- `company_name`: nome público da empresa.
- `description`: descrição da oportunidade.
- `status`: use `published` para aparecer no site; `draft` não aparece.

O `slug` pode ficar vazio. O banco gera automaticamente um slug baseado no cargo, empresa e UUID.

Campos recomendados para cards e compatibilidade:

- `category`: uma das áreas usadas na landing, por exemplo `Atendimento`.
- `neighborhood`: por exemplo `Centro`.
- `region`: `Angra dos Reis`.
- `contract_type`: por exemplo `CLT`.
- `work_mode`: `Presencial`, `Híbrido` ou `Remoto`.
- `salary_min` e `salary_max`: em centavos. Ex.: R$ 1.800 = `180000`.
- `requirements`: texto completo dos requisitos.
- `benefits`: texto opcional.
- `work_schedule`: texto livre, por exemplo `Segunda a sábado, 08h às 17h`.
- `schedule_type`: `Comercial`, `Escala`, `Noturno` ou `Flexível`.
- `experience_min_months`: número inteiro, por exemplo `6`.
- `start_date`: data prevista de início.
- `skills`: array PostgreSQL, por exemplo `{atendimento,vendas,caixa}`.
- `expires_at`: opcional; depois desse instante a vaga para de aparecer publicamente.

Ao mudar `status` para `published`, `published_at` é preenchido automaticamente se estiver vazio.

## SQL para uma vaga de teste

Execute no SQL Editor apenas em staging/teste ou apague depois:

```sql
insert into public.jobs (
  title,
  company_name,
  category,
  neighborhood,
  region,
  contract_type,
  work_mode,
  salary_min,
  salary_max,
  description,
  requirements,
  benefits,
  work_schedule,
  schedule_type,
  experience_min_months,
  start_date,
  skills,
  status
) values (
  'Atendente',
  'Empresa Teste AngraJobs',
  'Atendimento',
  'Centro',
  'Angra dos Reis',
  'CLT',
  'Presencial',
  180000,
  220000,
  'Atendimento ao público e apoio à rotina da operação.',
  'Boa comunicação e disponibilidade para trabalho presencial.',
  'Vale-transporte.',
  'Horário comercial',
  'Comercial',
  6,
  current_date + 7,
  array['atendimento','comunicação'],
  'published'
);
```

## Como testar sem vagas

1. No Supabase, deixe todas as linhas de `jobs` com status `draft`, `paused`, `expired` ou outro status diferente de `published`.
2. Abra `/vagas` em janela anônima.
3. A página deve mostrar o estado vazio e o botão **Quero receber novas vagas**.
4. Nenhuma vaga não publicada pode abrir por URL direta.

## Como testar com vaga publicada

1. Crie a vaga de teste acima ou altere uma vaga para `published`.
2. Abra `/vagas` e atualize a página.
3. O card deve aparecer automaticamente, sem editar código e sem novo deploy.
4. Abra os detalhes.
5. Envie uma candidatura de teste.
6. Confirme a linha em `job_applications` no Supabase.
7. No formulário de compatibilidade, use dados próximos aos requisitos da vaga e confira a pontuação.
8. Troque a disponibilidade para vários meses depois da data de início e veja a pontuação cair.

## Tema

O cabeçalho possui duas opções:

- **Claro**: identidade visual AngraJobs.
- **P&B**: fundo preto e interface em preto/branco.

A preferência fica salva no `localStorage` do navegador e não precisa de conta.
