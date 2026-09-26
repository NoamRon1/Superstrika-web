/** Update this file to maintain the public site. */
export const siteContent = {
  name: "Superstrika#7046",
  tagline: "רובוטיקה, פרויקטים, והאנשים שמאחוריהם.",
  about:
    "Superstrika#7046 היא קבוצת RoboCup Junior מהמועצה האזורית מנשה.",
  tournament: {
    name: "RoboCup Junior Soccer — Open Weight",
    description:
      "אנחנו מתחרים ב-RoboCup Junior Soccer, בקטגוריית Open Lightweight — תחרות כדורגל רובוטים אוטונומיים שבה שני רובוטים מכל קבוצה משחקים אחד נגד השני ללא שליטה אנושית.",
  },
  supportUrl: "", // Paste a donation / payment link here.

  sponsors: [
    // Add sponsors: { name: "שם החברה", logo: "/sponsors/logo.png", href: "https://..." }
  ] as Sponsor[],

  // Add a photo via "photo" (path under /public) and a github/linkedin url via "link" for each member.
  team: [
    { name: "תומר עוזר", role: "תלמיד/ה — אחראי אלקטרוניקה", photo: "/team/tomer.jpg", link: "https://oshwlab.com/tomer_ozer/works"},
    { name: "נועם רון", role: "תלמיד/ה — אחראי תוכנה", photo: "/team/noam.jpg", link: "https://github.com/NoamRon1"},
    { name: "איתמר חוטר ישי", role: "תלמיד/ה — אחראי מכניקה", photo: "/team/itamar.jpg"},
    { name: "יואב אהרוני", role: "תלמיד/ה — קפטן הנבחרת", photo: "/team/yoav.jpg"},
    { name: "גל ארבל", role: "מנטור/ית ומורה מלווה", photo: "/team/gal.jpeg"},
  ] as TeamMember[],

  // Logos are fetched automatically from each site; add "logo" (path under /public) to override with your own.
  links: [
    { label: "GitHub", href: "https://github.com/Superstrika/Superstrika-new", description: "קוד הרובוט" },
    { label: "OSHW Lab", href: "https://oshwlab.com/tomer_ozer/works", description: "הכרטיסים האלקטרונים שבנינו" },
    { label: "אתר בית הספר", href: "https://gvanim-school.co.il/", description: "בית הספר גוונים - מ.א מנשה" },
    { label: "פוסטר התחרות", href: "https://canva.link/uu3wjxl87jdu86g", description: "פוסטר התחרות" },
    { label: "Youtube", href: "https://www.youtube.com/@superstrika7046", description: "לסרטונים נוספים"}
  ] as SiteLink[],

  contact: {
    email: "superstrika7046@gmail.com",
    phone: "+972 54 804 1428",
    socials: [
      {label: "Linkedin", href: "https://www.linkedin.com/in/super-strika-8b6349437/"},
      {label: "Whatsapp", href: "http://wa.me/972548041428"}
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
  photo?: string;
  link?: string;
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
  logo?: string;
};

export function faviconFor(href: string) {
  try {
    return `https://www.google.com/s2/favicons?sz=128&domain=${new URL(href).hostname}`;
  } catch {
    return null;
  }
}

export type ContactInfo = {
  email: string;
  phone?: string;
  socials: { label: string; href: string }[];
};

export function youtubeEmbedUrl(url: string) {
  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
