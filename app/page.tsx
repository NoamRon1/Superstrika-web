import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { siteContent } from "@/lib/site-content";

export const metadata = {
  title: "Superstrika#7046",
  description: "קבוצת RoboCup Junior מהמועצה האזורית מנשה — הרובוט, הצוות והדרך להיות שותפים.",
};

export default function Home() {
  return (
    <div dir="rtl" lang="he" className="home">
      <SiteHeader />
      <main className="container">
        <section id="about" className="home-section public-heading">
          <div>
            <span className="eyebrow">RoboCup Junior</span>
            <h1>{siteContent.name}</h1>
            <p>{siteContent.about}</p>
          </div>
        </section>

        <section className="home-section card section-card">
          <header className="section-heading">
            <div>
              <span className="eyebrow">התחרות</span>
              <h2>{siteContent.tournament.name}</h2>
            </div>
          </header>
          <p>{siteContent.tournament.description}</p>
        </section>

        <section id="robot" className="home-section section-card">
          <header className="section-heading">
            <div>
              <span className="eyebrow">החומרה שלנו</span>
              <h2>גרסאות הרובוט</h2>
              <p>תצוגה תלת-ממדית של כל גרסת רובוט, כולל מה השתנה בדרך.</p>
            </div>
          </header>
          <Link className="card robot-teaser-card" href="/robot">
            <div>
              <h3>לצפייה בכל הגרסאות ←</h3>
              <p className="muted">מודלים תלת-ממדיים אינטראקטיביים של הרובוט, גרסה אחר גרסה.</p>
            </div>
          </Link>
        </section>

        <section id="sponsors" className="home-section section-card">
          <header className="section-heading">
            <div>
              <span className="eyebrow">תודה מראש</span>
              <h2>ספונסרים</h2>
            </div>
          </header>
          {siteContent.sponsors.length === 0 ? (
            <p className="empty-state">אנחנו עדיין מחפשים ספונסרים לעונה הזו — מעוניינים לתמוך בנו? נשמח לשמוע מכם.</p>
          ) : (
            <div className="sponsor-grid">
              {siteContent.sponsors.map((sponsor) => (
                <a key={sponsor.name} className="card sponsor-card" href={sponsor.href} target="_blank" rel="noreferrer">
                  {sponsor.logo && <Image src={sponsor.logo} alt={sponsor.name} width={120} height={80} style={{ objectFit: "contain" }} />}
                  <span>{sponsor.name}</span>
                </a>
              ))}
            </div>
          )}
        </section>

        <section id="team" className="home-section section-card">
          <header className="section-heading">
            <div>
              <span className="eyebrow">מי אנחנו</span>
              <h2>הצוות</h2>
            </div>
          </header>
          <div className="team-grid">
            {siteContent.team.map((member) => (
              <div key={member.name} className="card team-card">
                {member.photo ? (
                  <Image className="team-card-photo" src={member.photo} alt={member.name} width={96} height={96} />
                ) : (
                  <div className="team-card-photo team-card-photo-placeholder" aria-hidden="true">{member.name.slice(0, 1)}</div>
                )}
                <h3>{member.name}</h3>
                <span className="eyebrow">{member.role}</span>
                <p className="muted">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="links" className="home-section section-card">
          <header className="section-heading">
            <div>
              <span className="eyebrow">עקבו אחרינו</span>
              <h2>קישורים</h2>
            </div>
          </header>
          <div className="links-grid">
            {siteContent.links.map((link) => (
              <a key={link.label} className="card" href={link.href} target="_blank" rel="noreferrer">
                <h3>{link.label}</h3>
                <p className="muted">{link.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="contact" className="home-section card contact-card">
          <header className="section-heading">
            <div>
              <span className="eyebrow">נשמח לשמוע מכם</span>
              <h2>צור קשר</h2>
            </div>
          </header>
          <p>
            <a href={`mailto:${siteContent.contact.email}`}>{siteContent.contact.email}</a>
            {siteContent.contact.phone && <> · <span dir="ltr">{siteContent.contact.phone}</span></>}
          </p>
          {siteContent.contact.socials.length > 0 && (
            <p className="muted">
              {siteContent.contact.socials.map((social, i) => (
                <span key={social.href}>
                  {i > 0 && " · "}
                  <a href={social.href} target="_blank" rel="noreferrer">{social.label}</a>
                </span>
              ))}
            </p>
          )}
        </section>

        <footer className="public-footer">
          <span>{siteContent.name} · RoboCup Junior</span>
          <span>המועצה האזורית מנשה</span>
        </footer>
      </main>
    </div>
  );
}
