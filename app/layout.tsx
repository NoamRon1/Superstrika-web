import "./globals.css";
export const metadata = { title: "Fund Ledger", description: "Transparent fund accounting" };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
