"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setTheme(stored === "dark" ? "dark" : "light");
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className={theme}>
      <button onClick={toggleTheme} className="fixed top-4 right-4">
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      {children}
    </div>
  );
}
