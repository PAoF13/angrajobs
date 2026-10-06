"use client";

import Link from "next/link";
import { useState } from "react";
import { Brand } from "./Brand";
import { track } from "@/lib/analytics/track";
import { AccountNav } from "@/components/account/AccountNav";

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
          <AccountNav onNavigate={close} />
        </nav>
      </div>
    </header>
  );
}
