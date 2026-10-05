"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "mono";

const STORAGE_KEY = "angrajobs-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "mono" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial: Theme = saved === "mono" ? "mono" : "light";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div className="theme-switch" role="group" aria-label="Aparência do site">
      <button
        type="button"
        className={theme === "light" ? "theme-option active" : "theme-option"}
        aria-pressed={theme === "light"}
        onClick={() => choose("light")}
      >
        Claro
      </button>
      <button
        type="button"
        className={theme === "mono" ? "theme-option active" : "theme-option"}
        aria-pressed={theme === "mono"}
        onClick={() => choose("mono")}
      >
        P&amp;B
      </button>
    </div>
  );
}
