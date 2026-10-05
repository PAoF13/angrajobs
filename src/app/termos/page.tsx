import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso | AngraJobs",
  description: "Termos aplicáveis à landing de validação da AngraJobs.",
};

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Termos" title="Termos de Uso" updatedAt="4 de outubro de 2026">
      <p>
        Estes termos regulam o uso da página de validação da AngraJobs. Nesta fase, a plataforma serve principalmente para registrar interesse de candidatos e empresas antes do lançamento das funcionalidades completas.
      </p>

      <h2>1. Fase de validação</h2>
      <p>O cadastro nesta página não garante vaga de emprego, contratação, participação em processo seletivo, publicação imediata de vaga ou acesso antecipado à futura plataforma.</p>

      <h2>2. Candidatos</h2>
      <p>A AngraJobs não cobra do candidato para registrar interesse ou se candidatar às oportunidades básicas previstas para a plataforma. Candidatos devem fornecer informações verdadeiras e não podem usar o serviço para fraude, spam ou abuso.</p>

      <h2>3. Empresas</h2>
      <p>O cadastro de uma empresa representa interesse em conhecer ou testar a AngraJobs. Empresas devem fornecer informações verdadeiras e não podem anunciar oportunidades ilícitas, enganosas, discriminatórias ou incompatíveis com a legislação aplicável.</p>

      <h2>4. Conteúdo e disponibilidade</h2>
      <p>A AngraJobs poderá alterar, testar, interromper ou lançar funcionalidades durante a fase de validação. Recursos descritos como futuros não constituem promessa de disponibilidade em data específica.</p>

      <h2>5. Segurança e uso aceitável</h2>
      <p>É proibido tentar explorar falhas, automatizar cadastros abusivos, interferir na infraestrutura, coletar dados de terceiros sem autorização ou contornar mecanismos de segurança.</p>

      <h2>6. Responsabilidade</h2>
      <p>A AngraJobs pretende facilitar a conexão entre candidatos e empresas. As decisões de contratação, condições de trabalho e informações fornecidas por terceiros permanecem sob responsabilidade das partes envolvidas, observada a legislação aplicável.</p>

      <h2>7. Privacidade</h2>
      <p>O tratamento de dados pessoais é descrito na <a href="/privacidade">Política de Privacidade</a>.</p>

      <h2>8. Contato</h2>
      <p>Dúvidas podem ser enviadas para <a href="mailto:contato.angrajobs@gmail.com">contato.angrajobs@gmail.com</a>.</p>
    </LegalPage>
  );
}
