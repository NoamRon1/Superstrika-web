import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata = { title: "Superstrika#7046 Fund Ledger", description: "Contribution and expense ledger for the Superstrika#7046 RoboCup Junior team" };

const themeScript = `
  try {
    const saved = localStorage.getItem("theme");
    const theme = saved === "light" || saved === "dark"
      ? saved
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
`;

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
