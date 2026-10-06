import { createSupabasePublicServer } from "@/lib/supabase/public";
import type { Job } from "./types";

const jobColumns = [
  "id",
  "company_id",
  "slug",
  "title",
  "company_name",
  "category",
  "neighborhood",
  "region",
  "contract_type",
  "work_mode",
  "salary_min",
  "salary_max",
  "salary_text",
  "description",
  "requirements",
  "benefits",
  "work_schedule",
  "schedule_type",
  "experience_min_months",
  "start_date",
  "skills",
  "status",
  "published_at",
  "expires_at",
  "duration_days",
  "is_featured",
  "featured_until",
  "created_at",
  "updated_at",
].join(",");

function activeExpiryFilter() {
  return `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`;
}

export async function listPublishedJobs(): Promise<Job[]> {
  const supabase = createSupabasePublicServer();
  const { data, error } = await supabase
    .from("jobs")
    .select(jobColumns)
    .eq("status", "published")
    .or(activeExpiryFilter())
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("published_jobs_query_failed", { message: error.message });
    return [];
  }

  return (data ?? []) as unknown as Job[];
}

export async function getPublishedJobBySlug(slug: string): Promise<Job | null> {
  const supabase = createSupabasePublicServer();
  const { data, error } = await supabase
    .from("jobs")
    .select(jobColumns)
    .eq("slug", slug)
    .eq("status", "published")
    .or(activeExpiryFilter())
    .maybeSingle();

  if (error) {
    console.error("published_job_query_failed", { slug, message: error.message });
    return null;
  }

  return (data as unknown as Job | null) ?? null;
}
