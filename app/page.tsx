import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { siteContent, faviconFor } from "@/lib/site-content";

export const metadata = {
  title: "Superstrika#7046",
  description: "קבוצת RoboCup Junior מהמועצה האזורית מנשה — הרובוט, הצוות והדרך להיות שותפים.",
};

export default function Home() {
  return (
    <div dir="rtl" lang="he" className="home">
      <SiteHeader />
      <main>
        <section id="about" className="home-band">
          <div className="container hero">
            <div className="hero-copy">
              <span className="eyebrow">RoboCup Junior</span>
              <h1>{siteContent.name}</h1>
              <p className="lede">{siteContent.about}</p>
            </div>
            <div className="hero-mark">
              <Image src="/brand/superstrika.jpeg" alt="הסמל של Superstrika#7046" width={240} height={240} priority />
            </div>
          </div>
        </section>

        <section className="home-band alt">
          <div className="container">
            <header className="section-heading">
              <div>
                <span className="eyebrow">התחרות</span>
                <h2>{siteContent.tournament.name}</h2>
              </div>
            </header>
            <p className="lede">{siteContent.tournament.description}</p>
          </div>
        </section>

        <section id="robot" className="home-band">
          <div className="container">
            <header className="section-heading">
              <div>
                <span className="eyebrow">החומרה שלנו</span>
                <h2>גרסאות הרובוט</h2>
                <p className="lede">תצוגה תלת-ממדית של כל גרסת רובוט, כולל מה השתנה בדרך.</p>
              </div>
            </header>
            <Link className="card robot-teaser-card" href="/robot">
              <div>
                <h3>לצפייה בכל הגרסאות ←</h3>
                <p className="muted">מודלים תלת-ממדיים אינטראקטיביים של הרובוט, גרסה אחר גרסה.</p>
              </div>
            </Link>
          </div>
        </section>

        <section id="sponsors" className="home-band alt">
          <div className="container">
            <header className="section-heading">
              <div>
                <span className="eyebrow">תמיכה חיצונית</span>
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
          </div>
        </section>

        <section id="team" className="home-band">
          <div className="container">
            <header className="section-heading">
              <div>
                <span className="eyebrow">מי אנחנו</span>
                <h2>הצוות</h2>
              </div>
            </header>
            <div className="team-grid">
              {siteContent.team.map((member) => {
                const body = (
                  <>
                    <div className="team-card-photo-wrap">
                      {member.photo ? (
                        <Image src={member.photo} alt={member.name} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div className="team-card-photo-placeholder" aria-hidden="true">{member.name.slice(0, 1)}</div>
                      )}
                    </div>
                    <div className="team-card-body">
                      <h3>{member.name}</h3>
                      <span className="eyebrow">{member.role}</span>
                    </div>
                  </>
                );
                return member.link ? (
                  <a key={member.name} className="card team-card" href={member.link} target="_blank" rel="noreferrer">{body}</a>
                ) : (
                  <div key={member.name} className="card team-card">{body}</div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="links" className="home-band alt">
          <div className="container">
            <header className="section-heading">
              <div>
                <span className="eyebrow">עקבו אחרינו</span>
                <h2>קישורים</h2>
              </div>
            </header>
            <div className="links-grid">
              {siteContent.links.map((link) => {
                const logo = link.logo || faviconFor(link.href);
                return (
                  <a key={link.label} className="card link-card" href={link.href} target="_blank" rel="noreferrer">
                    {logo && <img className="link-card-logo" src={logo} alt="" width={44} height={44} />}
                    <div>
                      <h3>{link.label}</h3>
                      <p className="muted">{link.description}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="home-band">
          <div className="container">
            <div className="card contact-card">
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
            </div>
          </div>
        </section>

        <footer className="public-footer container">
          <span>{siteContent.name} · RoboCup Junior</span>
          <span>בית הספר מקיף גוונים, מ.א מנשה</span>
        </footer>
      </main>
    </div>
  );
}
