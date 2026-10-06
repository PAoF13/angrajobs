import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = { title: "Termos de Uso | AngraJobs", description: "Termos de uso da AngraJobs." };

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Termos" title="Termos de Uso" updatedAt="5 de outubro de 2026">
      <p>Estes termos regulam o uso da AngraJobs por candidatos, empresas e demais usuários.</p>
      <h2>1. Contas</h2>
      <p>Usuários devem fornecer informações verdadeiras, proteger suas credenciais e usar o tipo de conta adequado. Contas empresariais são responsáveis pelas ações de seus usuários autorizados.</p>
      <h2>2. Candidatos</h2>
      <p>A AngraJobs não cobra do candidato para se candidatar às oportunidades básicas. O envio de candidatura não garante entrevista ou contratação.</p>
      <h2>3. Empresas e vagas</h2>
      <p>Empresas devem publicar oportunidades verdadeiras, lícitas e não discriminatórias. Vagas podem ser pausadas, expiradas, recusadas ou removidas por política, segurança, denúncia ou término do período contratado.</p>
      <h2>4. Duração das vagas</h2>
      <p>No plano gratuito, a duração padrão é de até 7 dias. Planos ou adicionais pagos ativos podem permitir duração maior, limitada a até 180 dias conforme as regras comerciais vigentes.</p>
      <h2>5. Compatibilidade</h2>
      <p>A pontuação de compatibilidade compara critérios profissionais. Ela não representa chance de contratação, não garante entrevista e não substitui a decisão humana da empresa. A AngraJobs não usa atributos sensíveis para essa pontuação.</p>
      <h2>6. Planos e preços</h2>
      <p>Preços exibidos durante a fase de validação são hipóteses comerciais e podem mudar. Recursos pagos só devem ser liberados após confirmação administrativa ou pagamento validado por um provedor autorizado.</p>
      <h2>7. Divulgação</h2>
      <p>Pedidos de divulgação podem receber estimativa preliminar. O valor final, formato, data, disponibilidade e conformidade com regras de Instagram, TikTok ou outras plataformas devem ser confirmados antes da execução.</p>
      <h2>8. Denúncias e moderação</h2>
      <p>Usuários podem denunciar vagas suspeitas. A AngraJobs pode revisar conteúdo, solicitar informações, restringir publicação, suspender contas ou remover vagas quando necessário.</p>
      <h2>9. Uso aceitável</h2>
      <p>É proibido fraude, spam, coleta indevida de dados, tentativa de explorar falhas, contorno de segurança ou uso da plataforma para atividades ilícitas.</p>
      <h2>10. Responsabilidade</h2>
      <p>A AngraJobs facilita a conexão entre candidatos e empresas. Condições de trabalho, seleção e decisão de contratação permanecem sob responsabilidade das partes, observada a legislação aplicável.</p>
      <h2>11. Privacidade</h2>
      <p>O tratamento de dados pessoais está descrito na <a href="/privacidade">Política de Privacidade</a>.</p>
      <h2>12. Contato</h2>
      <p>Dúvidas podem ser enviadas para <a href="mailto:contato.angrajobs@gmail.com">contato.angrajobs@gmail.com</a>.</p>
    </LegalPage>
  );
}
