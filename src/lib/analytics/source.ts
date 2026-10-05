export type Attribution = {
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
};

function classifySource(params: URLSearchParams, referrer: string): string {
  const utmSource = (params.get("utm_source") || "").toLowerCase();
  const utmMedium = (params.get("utm_medium") || "").toLowerCase();
  const ref = referrer.toLowerCase();

  if (utmMedium.includes("qrcode") || utmSource.includes("qr")) return "QR Code";
  if (utmSource.includes("instagram") || ref.includes("instagram.com")) return "Instagram";
  if (utmSource.includes("tiktok") || ref.includes("tiktok.com")) return "TikTok";
  if (utmSource.includes("whatsapp") || ref.includes("whatsapp")) return "WhatsApp";
  if (utmSource.includes("google") || ref.includes("google.")) return "Google";
  if (!utmSource && !referrer) return "Acesso direto";
  return "Outros";
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") {
    return { source: "Acesso direto", utmSource: "", utmMedium: "", utmCampaign: "" };
  }

  const params = new URLSearchParams(window.location.search);

  return {
    source: classifySource(params, document.referrer),
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
  };
}
