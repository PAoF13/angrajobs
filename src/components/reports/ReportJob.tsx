"use client";

import { FormEvent, useCallback, useState } from "react";
import { Turnstile } from "@/components/security/Turnstile";
import { useAccount } from "@/lib/auth/use-account";

export function ReportJob({ jobId }: { jobId: string }) {
  const { account } = useAccount();
  const [open,setOpen]=useState(false); const[loading,setLoading]=useState(false);const[message,setMessage]=useState("");const[error,setError]=useState("");const[token,setToken]=useState("");const[key,setKey]=useState(0);
  const onToken=useCallback((value:string)=>setToken(value),[]);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError("");setMessage("");const f=new FormData(e.currentTarget);const r=await fetch("/api/reports",{method:"POST",headers:{"Content-Type":"application/json",...(account?{Authorization:`Bearer ${account.session.access_token}`}:{})},body:JSON.stringify({jobId,reason:String(f.get("reason")||"other"),details:String(f.get("details")||""),contactEmail:String(f.get("contactEmail")||""),turnstileToken:token})});if(!r.ok){setError("Não foi possível enviar a denúncia agora.");setToken("");setKey(x=>x+1)}else{setMessage("Denúncia recebida. Ela entrará na fila de revisão.")}setLoading(false)}
  return <div className="report-box"><button className="text-button" type="button" onClick={()=>setOpen(v=>!v)}>Denunciar esta vaga</button>{open?<form className="report-form" onSubmit={submit}><label>Motivo<select name="reason" defaultValue="other"><option value="fraud">Suspeita de fraude</option><option value="fee">Cobrança indevida ao candidato</option><option value="misleading">Informação enganosa</option><option value="discrimination">Conteúdo discriminatório</option><option value="expired">Vaga parece encerrada</option><option value="duplicate">Vaga duplicada</option><option value="other">Outro</option></select></label><label>Detalhes<textarea name="details" rows={4} maxLength={2000}/></label>{!account?<label>E-mail para retorno <small>Opcional</small><input name="contactEmail" type="email" maxLength={180}/></label>:null}<Turnstile key={key} action="job_report" onToken={onToken}/>{error?<p className="form-error">{error}</p>:null}{message?<p className="form-success">{message}</p>:null}<button className="button button-secondary" disabled={loading}>{loading?"Enviando...":"Enviar denúncia"}</button></form>:null}</div>
}
