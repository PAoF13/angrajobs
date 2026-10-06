"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

type ClientAccount = {
  session: Session;
  profile: {
    id: string;
    role: "candidate" | "company" | "admin" | "moderator";
    display_name: string;
    whatsapp: string | null;
    city: string;
    theme_preference: "light" | "mono";
  };
  company: null | {
    company_id: string;
    role: "owner" | "recruiter" | "member";
    trade_name?: string;
  };
};

export function useAccount() {
  const [account, setAccount] = useState<ClientAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    let active = true;

    async function load() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!active) return;
      if (!session) {
        setAccount(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id,role,display_name,whatsapp,city,theme_preference")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active || !profile) {
        setAccount(null);
        setLoading(false);
        return;
      }

      let company: ClientAccount["company"] = null;
      if (profile.role === "company") {
        const { data: membership } = await supabase
          .from("company_members")
          .select("company_id,role,companies(trade_name)")
          .eq("user_id", session.user.id)
          .limit(1)
          .maybeSingle();

        if (membership) {
          const companies = membership.companies as unknown as { trade_name?: string } | null;
          company = {
            company_id: membership.company_id,
            role: membership.role,
            trade_name: companies?.trade_name,
          };
        }
      }

      if (active) {
        setAccount({ session, profile: profile as ClientAccount["profile"], company });
        setLoading(false);
      }
    }

    void load();
    const { data: listener } = supabase.auth.onAuthStateChange(() => void load());

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { account, loading };
}
