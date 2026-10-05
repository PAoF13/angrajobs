"use client";

import Link from "next/link";
import { useState } from "react";
import { Brand } from "./Brand";
import { track } from "@/lib/analytics/track";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand href="/" />

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
          <Link className="nav-link" href="/vagas" onClick={() => { void track("click_find_jobs", { location: "header" }); close(); }}>Vagas</Link>
          <Link className="nav-link" href="/#empresas" onClick={close}>Para Empresas</Link>
          <Link className="nav-link" href="/#como-funciona" onClick={close}>Como funciona</Link>
          <ThemeToggle />
          <div className="nav-actions">
            <Link className="button button-secondary button-small" href="/#form-empresa" onClick={() => { void track("click_company", { location: "header" }); close(); }}>Sou empresa</Link>
            <Link className="button button-primary button-small" href="/vagas" onClick={() => { void track("click_find_jobs", { location: "header_button" }); close(); }}>Encontrar vagas</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
