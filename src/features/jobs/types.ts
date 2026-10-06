export const jobStatuses = [
  "draft",
  "pending_review",
  "published",
  "rejected",
  "paused",
  "expired",
] as const;

export type JobStatus = (typeof jobStatuses)[number];

export type Job = {
  id: string;
  company_id?: string | null;
  slug: string;
  title: string;
  company_name: string;
  category: string | null;
  neighborhood: string | null;
  region: string | null;
  contract_type: string | null;
  work_mode: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_text: string | null;
  description: string;
  requirements: string | null;
  benefits: string | null;
  work_schedule: string | null;
  schedule_type: string | null;
  experience_min_months: number | null;
  start_date: string | null;
  skills: string[] | null;
  status: JobStatus;
  published_at: string | null;
  expires_at: string | null;
  duration_days?: number;
  is_featured?: boolean;
  featured_until?: string | null;
  created_at: string;
  updated_at: string;
};

export type JobMatchProfile = {
  category: string;
  neighborhood: string;
  contractType: string;
  workMode: string;
  experienceMonths: number;
  availableFrom: string;
  scheduleType: string;
  skills: string[];
};

export type MatchReason = {
  label: string;
  result: "match" | "partial" | "mismatch" | "neutral";
  text: string;
};

export type JobMatchResult = {
  job: Job;
  score: number;
  label: string;
  reasons: MatchReason[];
};
