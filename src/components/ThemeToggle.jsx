import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// The initial theme is applied by the inline script in index.html.
const ThemeToggle = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Storage unavailable: the choice lasts for this visit only.
    }
    setDark(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
};

export default ThemeToggle;
