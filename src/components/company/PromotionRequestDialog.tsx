"use client";

import { useRef } from "react";
import { PromotionRequestForm } from "@/components/company/PromotionRequestForm";

export function PromotionRequestDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button className="button button-secondary" type="button" onClick={() => ref.current?.showModal()}>Montar pedido</button>
      <dialog className="promotion-dialog" ref={ref} onClick={(event) => { if (event.target === ref.current) ref.current?.close(); }}>
        <div className="promotion-dialog-inner">
          <button className="dialog-close" type="button" aria-label="Fechar" onClick={() => ref.current?.close()}>×</button>
          <PromotionRequestForm />
        </div>
      </dialog>
    </>
  );
}
