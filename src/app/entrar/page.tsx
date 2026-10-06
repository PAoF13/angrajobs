import { Header } from "@/components/landing/Header";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { LoginPanel } from "@/components/auth/AuthPanel";
export const metadata = { title: "Entrar | AngraJobs" };
export default function Page(){return <><Header/><main className="account-page"><div className="container account-narrow"><LoginPanel/></div></main><SiteFooter/></>}
