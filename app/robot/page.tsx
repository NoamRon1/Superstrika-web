import { SiteHeader } from "@/components/site-header";
import { RobotViewer } from "@/components/robot-viewer";
import { getRobotVersions } from "@/lib/robot-versions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "גרסאות הרובוט — Superstrika#7046",
};

export default async function RobotPage() {
  const versions = await getRobotVersions();

  return (
    <div dir="rtl" lang="he" className="home">
      <SiteHeader />
      <main className="container">
        <header className="home-section public-heading">
          <div>
            <span className="eyebrow">החומרה שלנו</span>
            <h1>גרסאות הרובוט</h1>
            <p>כל גרסה של הרובוט שלנו, בתצוגה תלת-ממדית אינטראקטיבית, יחד עם מה שהשתנה מהגרסה הקודמת.</p>
          </div>
        </header>

        {versions.length === 0 && (
          <p className="empty-state">עדיין אין גרסאות רובוט להצגה.</p>
        )}

        {versions.map((version) => (
          <section key={version.slug} className="home-section card section-card">
            <header className="section-heading">
              <div>
                <span className="eyebrow">{new Intl.DateTimeFormat("he").format(new Date(version.date))}</span>
                <h2>{version.displayName}</h2>
              </div>
            </header>
            {version.hasModel ? (
              <RobotViewer modelUrl={`/api/robot-versions/${encodeURIComponent(version.slug)}/model.stl`} />
            ) : (
              <div className="robot-canvas"><p className="muted">המודל התלת-ממדי יתווסף בקרוב.</p></div>
            )}
            <p className="robot-changelog">{version.changelog}</p>
          </section>
        ))}
      </main>
    </div>
  );
}
