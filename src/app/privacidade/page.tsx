import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade | AngraJobs",
  description: "Como a AngraJobs trata dados pessoais na landing de validação.",
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privacidade" title="Política de Privacidade" updatedAt="4 de outubro de 2026">
      <p>
        Esta política explica como a AngraJobs trata os dados informados por candidatos e empresas durante a fase de validação da plataforma em Angra dos Reis.
      </p>

      <h2>1. Dados coletados</h2>
      <p>Para candidatos, podemos coletar nome, WhatsApp, e-mail opcional, área de interesse, consentimento de comunicação e dados técnicos de origem do acesso.</p>
      <p>Para empresas, podemos coletar nome da empresa, nome do responsável, WhatsApp, e-mail profissional opcional, segmento, previsão de contratação, função pretendida e autorização de contato.</p>
      <p>Também podemos registrar dados de navegação e campanha, como página acessada, origem, UTM e eventos de interação, para medir a validação do produto.</p>

      <h2>2. Para que usamos os dados</h2>
      <p>Usamos os dados para operar a lista inicial da AngraJobs, entrar em contato sobre vagas ou contratação, entender a demanda local, medir a efetividade dos canais de divulgação, melhorar a plataforma e proteger os formulários contra abuso.</p>

      <h2>3. Comunicações</h2>
      <p>O envio de comunicações promocionais ou de novidades depende do consentimento informado no formulário. O consentimento não é marcado automaticamente.</p>

      <h2>4. Compartilhamento</h2>
      <p>Podemos usar fornecedores de infraestrutura necessários para operar a página, banco de dados, hospedagem e proteção contra abuso. Não vendemos os dados cadastrados.</p>

      <h2>5. Segurança e retenção</h2>
      <p>Aplicamos controles técnicos compatíveis com esta fase do produto, incluindo validação no servidor, restrição de acesso ao banco e proteção anti-bot quando configurada. Os dados devem ser mantidos apenas pelo período necessário para a finalidade informada, obrigações aplicáveis e defesa de direitos.</p>

      <h2>6. Seus direitos</h2>
      <p>Você pode solicitar informações, correção, atualização, oposição, revogação do consentimento ou exclusão quando aplicável. A análise do pedido observará a legislação brasileira de proteção de dados.</p>

      <h2>7. Contato</h2>
      <p>Para assuntos de privacidade, use <a href="mailto:contato.angrajobs@gmail.com">contato.angrajobs@gmail.com</a>.</p>

      <h2>8. Atualizações</h2>
      <p>Esta política poderá ser atualizada conforme a AngraJobs evoluir. A data da versão vigente ficará indicada nesta página.</p>
    </LegalPage>
  );
}
