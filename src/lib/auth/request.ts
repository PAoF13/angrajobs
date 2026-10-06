import "server-only";

import type { User } from "@supabase/supabase-js";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export type AccountRole = "candidate" | "company" | "admin" | "moderator";

export type RequestAccount = {
  user: User;
  profile: {
    id: string;
    role: AccountRole;
    display_name: string;
    whatsapp: string | null;
    city: string;
    theme_preference: "light" | "mono";
  };
  company: null | {
    company_id: string;
    member_role: "owner" | "recruiter" | "member";
  };
};

export function bearerToken(request: Request) {
  const value = request.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : "";
}

export async function getRequestAccount(request: Request): Promise<RequestAccount | null> {
  const token = bearerToken(request);
  if (!token) return null;

  const admin = createSupabaseAdmin();
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user) return null;

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id,role,display_name,whatsapp,city,theme_preference")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile) return null;

  let company: RequestAccount["company"] = null;
  if (profile.role === "company") {
    const { data: membership } = await admin
      .from("company_members")
      .select("company_id,role")
      .eq("user_id", authData.user.id)
      .limit(1)
      .maybeSingle();

    if (membership) {
      company = {
        company_id: membership.company_id,
        member_role: membership.role,
      };
    }
  }

  return {
    user: authData.user,
    profile: profile as RequestAccount["profile"],
    company,
  };
}

export function canRecruit(account: RequestAccount | null) {
  return Boolean(account?.company && ["owner", "recruiter"].includes(account.company.member_role));
}

export function isAdmin(account: RequestAccount | null) {
  return Boolean(account && ["admin", "moderator"].includes(account.profile.role));
}
