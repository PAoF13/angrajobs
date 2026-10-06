import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade | AngraJobs",
  description: "Como a AngraJobs trata dados de candidatos, empresas e usuários da plataforma.",
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacidade" title="Política de Privacidade" updatedAt="5 de outubro de 2026">
      <p>Esta política descreve como a AngraJobs trata dados pessoais usados para contas, candidaturas, publicação de vagas, suporte, segurança e validação do produto.</p>
      <h2>1. Dados de conta</h2>
      <p>Podemos tratar nome, e-mail, WhatsApp, cidade, tipo de conta e informações necessárias para autenticação. Senhas são gerenciadas pelo serviço de autenticação e não devem ser registradas em logs da AngraJobs.</p>
      <h2>2. Dados de candidatos</h2>
      <p>Podemos tratar área profissional, bairro, experiência, disponibilidade, preferências profissionais, habilidades, candidaturas, mensagens enviadas às vagas e histórico de status.</p>
      <p>A compatibilidade de vagas usa critérios profissionais informados pelo candidato e cadastrados na vaga. Ela não representa probabilidade de contratação e não deve ser usada para decisão automática de contratação.</p>
      <h2>3. Dados de empresas</h2>
      <p>Podemos tratar nome da empresa, responsável, contato, dados cadastrais, vagas, candidaturas recebidas, plano, solicitações comerciais, divulgação e registros de segurança.</p>
      <h2>4. Denúncias e moderação</h2>
      <p>Ao denunciar uma vaga, podemos tratar motivo, detalhes, vínculo com a vaga, usuário autenticado e e-mail opcional para retorno. Esses dados são usados para revisão, prevenção de fraude e segurança da plataforma.</p>
      <h2>5. Analytics e segurança</h2>
      <p>Podemos registrar eventos de navegação, origem, UTMs, tentativas bloqueadas, dados técnicos minimizados e identificadores necessários para medir uso e combater abuso. Não registramos senhas, chaves secretas ou conteúdo integral de dados privados em logs operacionais.</p>
      <h2>6. Compartilhamento</h2>
      <p>Dados podem ser processados por fornecedores necessários para hospedagem, autenticação, banco de dados, proteção anti-bot e operação técnica. Não vendemos dados pessoais cadastrados.</p>
      <h2>7. Retenção e exclusão</h2>
      <p>Os dados são mantidos pelo período necessário às finalidades informadas, segurança, obrigações aplicáveis e defesa de direitos. Pedidos de correção ou exclusão podem ser feitos pelo canal de contato.</p>
      <h2>8. Seus direitos</h2>
      <p>Você pode solicitar acesso, correção, atualização, oposição, revogação de consentimento ou exclusão quando aplicável, observada a legislação brasileira.</p>
      <h2>9. Contato</h2>
      <p>Para assuntos de privacidade, use <a href="mailto:contato.angrajobs@gmail.com">contato.angrajobs@gmail.com</a>.</p>
      <h2>10. Atualizações</h2>
      <p>Esta política pode ser atualizada conforme a plataforma evoluir. A data da versão vigente permanece indicada nesta página.</p>
    </LegalPage>
  );
}
