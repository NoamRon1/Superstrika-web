import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFFont, PDFPage, RGB, rgb } from "pdf-lib";

export type ContributionReceiptData = {
  id: string;
  contributor: string;
  description?: string | null;
  originalAmount: number;
  currency: string;
  ilsAmount: number;
  createdAt: Date;
};

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 54;
const RIGHT = PAGE_WIDTH - MARGIN;
const INK = rgb(0.08, 0.13, 0.24);
const MUTED = rgb(0.36, 0.42, 0.5);
const LINE = rgb(0.87, 0.89, 0.92);
const BRAND = rgb(0.08, 0.48, 0.43);
const BRAND_SOFT = rgb(0.92, 0.97, 0.96);

function drawRight(page: PDFPage, text: string, right: number, y: number, size: number, font: PDFFont, color: RGB) {
  page.drawText(text, { x: right - font.widthOfTextAtSize(text, size), y, size, font, color });
}

function drawMoneyRight(page: PDFPage, value: number, currency: string, right: number, y: number, size: number, font: PDFFont, color: RGB) {
  const names: Record<string, string> = { ILS: "ש״ח", USD: "דולר", EUR: "אירו" };
  const amount = value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const unit = names[currency] || currency;
  const amountWidth = font.widthOfTextAtSize(amount, size);
  const unitWidth = font.widthOfTextAtSize(unit, size);
  page.drawText(amount, { x: right - amountWidth, y, size, font, color });
  page.drawText(unit, { x: right - amountWidth - unitWidth - size * 0.35, y, size, font, color });
}

function date(value: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Jerusalem" }).formatToParts(value);
  const part = (type: string) => parts.find(item => item.type === type)?.value || "";
  return `${part("day")}.${part("month")}.${part("year")}`;
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= width) line = candidate;
      else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    if (!paragraph.trim()) lines.push("");
  }
  return lines;
}

export async function createContributionReceipt(
  data: ContributionReceiptData,
  regularFontBytes: Uint8Array,
  boldFontBytes: Uint8Array,
  logoBytes: Uint8Array
) {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const regular = await document.embedFont(regularFontBytes, { subset: true });
  const bold = await document.embedFont(boldFontBytes, { subset: true });
  const logo = await document.embedJpg(logoBytes);
  const page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 10, width: PAGE_WIDTH, height: 10, color: BRAND });
  const logoSize = logo.scaleToFit(84, 84);
  page.drawImage(logo, { x: RIGHT - logoSize.width, y: 714, width: logoSize.width, height: logoSize.height });
  const headingRight = RIGHT - logoSize.width - 22;
  const teamName = "Superstrika#7046";
  page.drawText(teamName, { x: headingRight - bold.widthOfTextAtSize(teamName, 11), y: 778, size: 11, font: bold, color: BRAND });
  drawRight(page, "אישור על רישום תרומה", headingRight, 739, 25, bold, INK);
  drawRight(page, "קבוצת רובוקאפ ג׳וניור", headingRight, 713, 11, regular, MUTED);

  drawRight(page, "מסמך מידע בלבד. אינו קבלה חוקית או קבלה לצורכי מס.", RIGHT, 671, 10.5, regular, MUTED);
  page.drawLine({ start: { x: MARGIN, y: 655 }, end: { x: RIGHT, y: 655 }, thickness: 0.8, color: LINE });

  page.drawRectangle({ x: MARGIN, y: 525, width: PAGE_WIDTH - MARGIN * 2, height: 105, color: BRAND_SOFT });
  drawRight(page, "סכום התרומה", RIGHT - 20, 603, 9, bold, BRAND);
  drawMoneyRight(page, data.originalAmount, data.currency, RIGHT - 20, 568, 24, bold, INK);
  if (data.currency !== "ILS") {
    drawRight(page, "שווי שנרשם בשקלים", RIGHT - 20, 543, 8.5, regular, MUTED);
    drawMoneyRight(page, data.ilsAmount, "ILS", RIGHT - 20, 529, 9.5, regular, MUTED);
  }

  const rows: Array<[string, string]> = [
    ["שם התורם או התורמת", data.contributor],
    ["תאריך הרישום", date(data.createdAt)],
    ["מזהה התרומה", data.id]
  ];

  let y = 490;
  for (const [label, value] of rows) {
    drawRight(page, label, RIGHT, y, 8.5, bold, MUTED);
    drawRight(page, value, RIGHT, y - 20, 11, regular, INK);
    page.drawLine({ start: { x: MARGIN, y: y - 33 }, end: { x: RIGHT, y: y - 33 }, thickness: 0.7, color: LINE });
    y -= 61;
  }

  if (data.description) {
    drawRight(page, "תיאור", RIGHT, y, 8.5, bold, MUTED);
    const lines = wrap(data.description, regular, 10.5, PAGE_WIDTH - MARGIN * 2).slice(0, 5);
    lines.forEach((line, index) => {
      page.drawText(line, { x: RIGHT - regular.widthOfTextAtSize(line, 10.5), y: y - 23 - index * 15, size: 10.5, font: regular, color: INK });
    });
    y -= 38 + lines.length * 15;
  }

  const disclaimerY = Math.min(y - 95, 220);
  page.drawRectangle({ x: MARGIN, y: disclaimerY, width: PAGE_WIDTH - MARGIN * 2, height: 86, color: rgb(0.97, 0.98, 0.98), borderColor: LINE, borderWidth: 0.7 });
  drawRight(page, "חשוב לדעת", RIGHT - 16, disclaimerY + 62, 9, bold, BRAND);
  const disclaimer = "מסמך זה מאשר שהתרומה נרשמה עבור קבוצת רובוקאפ ג׳וניור שאינה עסק. המסמך מיועד למידע בלבד ואינו קבלה חוקית, קבלה לצורכי מס, קבלה על תרומה או אישור לזיכוי מס.";
  wrap(disclaimer, regular, 9.5, PAGE_WIDTH - MARGIN * 2 - 32).slice(0, 3).forEach((line, index) => {
    page.drawText(line, { x: RIGHT - 16 - regular.widthOfTextAtSize(line, 9.5), y: disclaimerY + 41 - index * 14, size: 9.5, font: regular, color: INK });
  });

  page.drawLine({ start: { x: MARGIN, y: 62 }, end: { x: RIGHT, y: 62 }, thickness: 0.7, color: LINE });
  page.drawText(teamName, { x: RIGHT - regular.widthOfTextAtSize(teamName, 8.5), y: 42, size: 8.5, font: regular, color: MUTED });
  page.drawText(date(new Date()), { x: MARGIN, y: 42, size: 8.5, font: regular, color: MUTED });

  document.setTitle(`אישור על רישום תרומה ${data.id}`);
  document.setSubject("מסמך מידע על תרומה. אינו קבלה חוקית או קבלה לצורכי מס");
  document.setCreator("Superstrika#7046 contribution system");
  return document.save();
}
