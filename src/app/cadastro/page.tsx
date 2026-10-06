import { Header } from "@/components/landing/Header";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SignupPanel } from "@/components/auth/AuthPanel";
export const metadata = { title: "Criar conta | AngraJobs" };
export default function Page(){return <><Header/><main className="account-page"><div className="container account-narrow"><SignupPanel/></div></main><SiteFooter/></>}
