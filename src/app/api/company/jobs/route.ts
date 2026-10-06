import { NextResponse } from "next/server";
import { companyJobSchema } from "@/features/company/schemas";
import { canRecruit, getRequestAccount } from "@/lib/auth/request";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function splitSkills(value:string){return value.split(",").map(v=>v.trim()).filter(Boolean).slice(0,40)}

export async function POST(request:Request){
  const account=await getRequestAccount(request);
  if(!account?.company||!canRecruit(account)) return NextResponse.json({error:{message:"Acesso negado."}},{status:403});
  if(!account.user.email_confirmed_at) return NextResponse.json({error:{message:"Confirme seu e-mail antes de publicar vagas."}},{status:403});
  const parsed=companyJobSchema.safeParse(await request.json());
  if(!parsed.success) return NextResponse.json({error:{message:"Revise os campos da vaga."}},{status:400});
  const admin=createSupabaseAdmin(); const d=parsed.data;
  const {data:company}=await admin.from("companies").select("trade_name,status").eq("id",account.company.company_id).maybeSingle();
  if(!company||company.status!=="active") return NextResponse.json({error:{message:"A empresa não está habilitada para publicar."}},{status:403});
  if(d.status==="published"){
    const {data:limit}=await admin.rpc("company_active_job_limit",{target_company:account.company.company_id});
    const {count}=await admin.from("jobs").select("id",{count:"exact",head:true}).eq("company_id",account.company.company_id).eq("status","published").or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);
    if((count||0)>=Number(limit||1)) return NextResponse.json({error:{message:"Seu plano atingiu o limite de vagas ativas. Pause uma vaga ou solicite um upgrade."}},{status:409});
  }
  const {data,error}=await admin.from("jobs").insert({company_id:account.company.company_id,created_by:account.user.id,company_name:company.trade_name,title:d.title,category:d.category||null,neighborhood:d.neighborhood||null,region:d.region,contract_type:d.contractType||null,work_mode:d.workMode||null,salary_min:d.salaryMin===""?null:d.salaryMin,salary_max:d.salaryMax===""?null:d.salaryMax,salary_text:d.salaryText||null,description:d.description,requirements:d.requirements||null,benefits:d.benefits||null,work_schedule:d.workSchedule||null,schedule_type:d.scheduleType||null,experience_min_months:d.experienceMinMonths||0,start_date:d.startDate||null,skills:splitSkills(d.skills),status:d.status,duration_days:d.durationDays}).select("id").single();
  if(error) return NextResponse.json({error:{message:"Não foi possível criar a vaga."}},{status:500});
  await admin.from("audit_logs").insert({actor_id:account.user.id,action:"job.created",entity_type:"job",entity_id:data.id,metadata:{status:d.status}});
  return NextResponse.json({ok:true,id:data.id},{status:201});
}
