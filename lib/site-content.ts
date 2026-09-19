/** Update this file to maintain the public site. */
export const siteContent = {
  name: "Superstrika#7046",
  tagline: "רובוטיקה, פרויקטים, והאנשים שמאחוריהם.",
  about:
    "Superstrika#7046 היא קבוצת RoboCup Junior מהמועצה האזורית מנשה. אנחנו בונים, לומדים ומתחרים יחד — ומאמינים בשקיפות מלאה סביב איך אנחנו ממומנים ולאן הכסף הולך.",
  tournament: {
    name: "RoboCup Junior Soccer — Open Weight",
    description:
      "אנחנו מתחרים ב-RoboCup Junior Soccer, בקטגוריית Open Lightweight — תחרות כדורגל רובוטים אוטונומיים שבה שני רובוטים מכל קבוצה משחקים אחד נגד השני ללא שליטה אנושית.",
  },
  supportUrl: "", // Paste a donation / payment link here.

  sponsors: [
    // Add sponsors: { name: "שם החברה", logo: "/sponsors/logo.png", href: "https://..." }
  ] as Sponsor[],

  team: [
    { name: "תומר עוזר", role: "תלמיד/ה — קפטן הנבחרת", bio: "כמה מילים על התלמיד/ה, תחומי עניין ותרומה לקבוצה." },
    { name: "נועם רון", role: "תלמיד/ה — מתכנת ראשי", bio: "כמה מילים על התלמיד/ה, תחומי עניין ותרומה לקבוצה." },
    { name: "איתמר חוטר ישי", role: "תלמיד/ה — מעצב מכני", bio: "כמה מילים על התלמיד/ה, תחומי עניין ותרומה לקבוצה." },
    { name: "יואב אהרוני", role: "תלמיד/ה — מעצב מכני", bio: "כמה מילים על התלמיד/ה, תחומי עניין ותרומה לקבוצה." },
    { name: "גל ארבל", role: "מנטור/ית ומורה מלווה", bio: "כמה מילים על המנטור/ית ועל הליווי של הקבוצה." },
  ] as TeamMember[],

  links: [
    { label: "GitHub", href: "https://github.com/Superstrika/Superstrika-new", description: "קוד הרובוט" },
    { label: "OSHW Lab", href: "https://oshwlab.com/tomer_ozer/works", description: "הכרטיסים האלקטרונים שבנינו" },
    { label: "אתר בית הספר", href: "https://gvanim-school.co.il/", description: "בית הספר גוונים - מ.א מנשה" },
    { label: "פוסטר התחרות", href: "https://example.com/poster.pdf", description: "פוסטר התחרות" },
    { label: "תיקיית Drive", href: "https://drive.google.com/", description: "תיעוד, תמונות וקבצים נוספים" },
  ] as SiteLink[],

  contact: {
    email: "superstrika7046@gmail.com",
    phone: "+972 54 804 1428",
    socials: [
      {label: "Linkedin", href: "https://www.linkedin.com/in/super-strika-8b6349437/"},
      {label: "Instagram", href: "https://www.instagram.com/"}
      // { label: "Instagram", href: "https://instagram.com/..." },
    ],
  } as ContactInfo,

  gallery: [
    // Add images: { type: "image", src: "/gallery/robot.jpg", alt: "Description", title: "Build day" }
    // Add YouTube: { type: "youtube", src: "https://www.youtube.com/watch?v=VIDEO_ID", title: "Our robot in action" }
    { type: "image", src: "/brand/superstrika.jpeg", alt: "Superstrika#7046 team mark", title: "Superstrika#7046" },
  ] as GalleryItem[],
};

export type GalleryItem =
  | { type: "image"; src: string; alt: string; title: string }
  | { type: "youtube"; src: string; title: string };

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
};

export type Sponsor = {
  name: string;
  logo?: string;
  href?: string;
};

export type SiteLink = {
  label: string;
  href: string;
  description: string;
};

export type ContactInfo = {
  email: string;
  phone?: string;
  socials: { label: string; href: string }[];
};

export function youtubeEmbedUrl(url: string) {
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
