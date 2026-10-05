"use client";

import { useState } from "react";
import { Brand } from "./Brand";
import { track } from "@/lib/analytics/track";

export function Header() {
  const [open, setOpen] = useState(false);

  function goTo(id: string, event?: "click_find_jobs" | "click_company") {
    if (event) void track(event, { location: "header" });
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand href="#top" />

        <button
          className="menu-toggle"
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? "nav-open" : ""}`} aria-label="Navegação principal">
          <button type="button" className="nav-link" onClick={() => goTo("#candidatos")}>Vagas</button>
          <button type="button" className="nav-link" onClick={() => goTo("#empresas")}>Para Empresas</button>
          <button type="button" className="nav-link" onClick={() => goTo("#como-funciona")}>Como funciona</button>
          <div className="nav-actions">
            <button type="button" className="button button-secondary button-small" onClick={() => goTo("#form-empresa", "click_company")}>Sou empresa</button>
            <button type="button" className="button button-primary button-small" onClick={() => goTo("#form-candidato", "click_find_jobs")}>Encontrar vagas</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
