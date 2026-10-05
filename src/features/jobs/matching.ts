import type { Job, JobMatchProfile, JobMatchResult, MatchReason } from "./types";

function normalize(value: string | null | undefined) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function compareFlexible(candidate: string, required: string | null, label: string, weight: number) {
  if (!required) return null;
  if (!candidate || normalize(candidate) === "qualquer") {
    return { weight, points: weight, reason: { label, result: "neutral" as const, text: `Você aceita qualquer opção de ${label.toLowerCase()}.` } };
  }
  const match = normalize(candidate) === normalize(required);
  return {
    weight,
    points: match ? weight : 0,
    reason: {
      label,
      result: match ? ("match" as const) : ("mismatch" as const),
      text: match ? `${required} combina com sua preferência.` : `A vaga informa ${required}, diferente da sua preferência (${candidate}).`,
    },
  };
}

function monthDiff(dateA: string, dateB: string) {
  const a = new Date(`${dateA}T12:00:00`);
  const b = new Date(`${dateB}T12:00:00`);
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

function labelForScore(score: number) {
  if (score >= 85) return "Compatibilidade muito alta";
  if (score >= 70) return "Boa compatibilidade";
  if (score >= 50) return "Compatibilidade moderada";
  return "Compatibilidade baixa";
}

export function scoreJobMatch(job: Job, profile: JobMatchProfile): JobMatchResult {
  let possible = 0;
  let earned = 0;
  let scoreCap = 100;
  const reasons: MatchReason[] = [];

  if (job.category) {
    const weight = 28;
    possible += weight;
    const match = normalize(job.category) === normalize(profile.category);
    earned += match ? weight : 0;
    if (!match) scoreCap = Math.min(scoreCap, 65);
    reasons.push({
      label: "Área",
      result: match ? "match" : "mismatch",
      text: match ? `Sua área (${profile.category}) é a mesma da vaga.` : `A vaga está em ${job.category}; você informou ${profile.category}.`,
    });
  }

  const contract = compareFlexible(profile.contractType, job.contract_type, "Contrato", 14);
  if (contract) {
    possible += contract.weight;
    earned += contract.points;
    reasons.push(contract.reason);
  }

  const workMode = compareFlexible(profile.workMode, job.work_mode, "Modalidade", 10);
  if (workMode) {
    possible += workMode.weight;
    earned += workMode.points;
    reasons.push(workMode.reason);
  }

  if (job.neighborhood) {
    const weight = 8;
    possible += weight;
    const noPreference = !profile.neighborhood;
    const match = noPreference || normalize(job.neighborhood).includes(normalize(profile.neighborhood)) || normalize(profile.neighborhood).includes(normalize(job.neighborhood));
    earned += match ? weight : 0;
    reasons.push({
      label: "Local",
      result: noPreference ? "neutral" : match ? "match" : "mismatch",
      text: noPreference ? `Você não restringiu bairro; a vaga fica em ${job.neighborhood}.` : match ? `${job.neighborhood} combina com sua preferência.` : `A vaga fica em ${job.neighborhood}; você informou ${profile.neighborhood}.`,
    });
  }

  if ((job.experience_min_months ?? 0) > 0) {
    const required = job.experience_min_months ?? 0;
    const weight = 18;
    possible += weight;
    const ratio = profile.experienceMonths / required;
    let factor = 0.15;
    let result: MatchReason["result"] = "mismatch";
    if (ratio >= 1) {
      factor = 1;
      result = "match";
    } else if (ratio >= 0.75) {
      factor = 0.75;
      result = "partial";
    } else if (ratio >= 0.5) {
      factor = 0.5;
      result = "partial";
    }
    earned += weight * factor;
    if (ratio < 0.5) scoreCap = Math.min(scoreCap, 70);
    reasons.push({
      label: "Experiência",
      result,
      text: ratio >= 1 ? "Sua experiência atende ao mínimo informado pela vaga." : `A vaga pede cerca de ${required} meses; você informou ${profile.experienceMonths}.`,
    });
  }

  if (job.start_date) {
    const weight = 14;
    possible += weight;
    const daysLate = monthDiff(profile.availableFrom, job.start_date);
    let factor = 1;
    let result: MatchReason["result"] = "match";
    if (daysLate > 90) {
      factor = 0;
      result = "mismatch";
    } else if (daysLate > 30) {
      factor = 0.2;
      result = "mismatch";
    } else if (daysLate > 7) {
      factor = 0.5;
      result = "partial";
    } else if (daysLate > 0) {
      factor = 0.8;
      result = "partial";
    }
    earned += weight * factor;
    if (daysLate > 90) scoreCap = Math.min(scoreCap, 60);
    else if (daysLate > 30) scoreCap = Math.min(scoreCap, 72);
    reasons.push({
      label: "Disponibilidade",
      result,
      text: daysLate <= 0 ? "Sua disponibilidade atende à data prevista para início." : `Você estaria disponível ${daysLate} dias depois da data prevista pela vaga.`,
    });
  }

  const schedule = compareFlexible(profile.scheduleType, job.schedule_type, "Horário", 8);
  if (schedule) {
    possible += schedule.weight;
    earned += schedule.points;
    reasons.push(schedule.reason);
  }

  if ((job.skills?.length ?? 0) > 0 && profile.skills.length > 0) {
    const weight = 10;
    possible += weight;
    const candidateSkills = new Set(profile.skills.map(normalize));
    const matched = (job.skills || []).filter((skill) => candidateSkills.has(normalize(skill)));
    const factor = matched.length / (job.skills?.length || 1);
    earned += weight * factor;
    reasons.push({
      label: "Habilidades",
      result: factor >= 0.75 ? "match" : factor > 0 ? "partial" : "mismatch",
      text: matched.length ? `${matched.length} de ${job.skills?.length} habilidades informadas pela vaga aparecem no seu perfil.` : "Nenhuma das habilidades informadas pela vaga apareceu na sua lista.",
    });
  } else if ((job.skills?.length ?? 0) > 0) {
    reasons.push({
      label: "Habilidades",
      result: "neutral",
      text: "Habilidades não foram avaliadas porque você não informou nenhuma.",
    });
  }

  const rawScore = possible > 0 ? Math.round((earned / possible) * 100) : 50;
  const score = Math.min(rawScore, scoreCap);

  return {
    job,
    score,
    label: labelForScore(score),
    reasons,
  };
}
