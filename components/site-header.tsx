import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/#about", label: "אודות" },
  { href: "/#robot", label: "הרובוט" },
  { href: "/#sponsors", label: "ספונסרים" },
  { href: "/#team", label: "הצוות" },
  { href: "/#links", label: "קישורים" },
  { href: "/#contact", label: "צור קשר" },
];

export function SiteHeader() {
  return (
    <header className="nav home-nav">
      <Link className="co-brand" href="/">
        <Image className="team-logo" src="/brand/superstrika.jpeg" alt="סמל הקבוצה Superstrika#7046" width={68} height={68} priority />
        <span className="co-brand-name">Superstrika#7046</span>
        <span className="co-brand-divider" aria-hidden="true" />
        <Image src="/brand/gvanim.jpg" alt="סמל המועצה האזורית מנשה" width={56} height={56} />
      </Link>
      <nav className="home-nav-links">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
      <div className="home-nav-actions">
        <Link className="button secondary compact" href="/fund">קופת הקבוצה</Link>
        <Link className="button compact" href="/login">כניסת צוות</Link>
      </div>
    </header>
  );
}
