"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

type Theme = "light" | "mono";
const STORAGE_KEY = "angrajobs-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "mono" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    let active = true;
    async function load() {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "mono" || saved === "light") {
        if (active) { setTheme(saved); applyTheme(saved); }
        return;
      }
      const supabase = createSupabaseBrowser();
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) return;
      const { data } = await supabase.from("profiles").select("theme_preference").eq("id", userId).maybeSingle();
      const initial: Theme = data?.theme_preference === "mono" ? "mono" : "light";
      if (active) { setTheme(initial); applyTheme(initial); window.localStorage.setItem(STORAGE_KEY, initial); }
    }
    void load();
    return () => { active = false; };
  }, []);

  async function choose(next: Theme) {
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    const supabase = createSupabaseBrowser();
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (userId) void supabase.from("profiles").update({ theme_preference: next }).eq("id", userId);
  }

  return (
    <div className="theme-switch" role="group" aria-label="Aparência do site">
      <button type="button" className={theme === "light" ? "theme-option active" : "theme-option"} aria-pressed={theme === "light"} onClick={() => void choose("light")}>Claro</button>
      <button type="button" className={theme === "mono" ? "theme-option active" : "theme-option"} aria-pressed={theme === "mono"} onClick={() => void choose("mono")}>P&amp;B</button>
    </div>
  );
}
