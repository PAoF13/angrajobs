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
