import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://angrajobs.com.br"),
  title: "AngraJobs | Vagas e empregos em Angra dos Reis",
  description: "Encontre oportunidades de trabalho em Angra dos Reis ou cadastre sua empresa para contratar profissionais da região.",
  openGraph: {
    title: "AngraJobs | Vagas de Angra em um só lugar",
    description: "Uma plataforma local para conectar empresas e talentos de Angra dos Reis.",
    url: "https://angrajobs.com.br",
    siteName: "AngraJobs",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071D33",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
