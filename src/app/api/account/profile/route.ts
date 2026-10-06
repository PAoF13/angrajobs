import { NextResponse } from "next/server";
import { getRequestAccount } from "@/lib/auth/request";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { z } from "zod";

const schema = z.object({ displayName: z.string().trim().min(2).max(120), whatsapp: z.string().trim().min(10).max(20), city: z.string().trim().min(2).max(120) });

export async function PATCH(request: Request) {
  const account = await getRequestAccount(request);
  if (!account) return NextResponse.json({ error: { message: "Faça login novamente." } }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: { message: "Revise seus dados." } }, { status: 400 });
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("profiles").update({ display_name: parsed.data.displayName, whatsapp: parsed.data.whatsapp, city: parsed.data.city }).eq("id", account.user.id);
  if (error) return NextResponse.json({ error: { message: "Não foi possível salvar." } }, { status: 500 });
  return NextResponse.json({ ok: true });
}
