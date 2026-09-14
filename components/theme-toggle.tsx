"use client";

function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  function toggleTheme() {
    const theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      <span className="theme-icon theme-icon-light" aria-hidden="true">☾</span>
      <span className="theme-icon theme-icon-dark" aria-hidden="true">☀</span>
      <span className="theme-label-light">Dark mode</span>
      <span className="theme-label-dark">Light mode</span>
    </button>
  );
}
