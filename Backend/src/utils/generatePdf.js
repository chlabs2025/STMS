import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TIMEOUT_MS = 30_000; // 30 second timeout for PDF generation

const generatePdf = async (invoice) => {
  const templatePath = path.join(__dirname, "../templates/invoice.ejs");
  const html = await ejs.renderFile(templatePath, { invoice });

  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",   // prevent /dev/shm out-of-space on Docker/Render
        "--disable-gpu",
        // NOTE: --single-process removed — it is Linux-only and crashes Chromium on Windows
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: TIMEOUT_MS,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      timeout: TIMEOUT_MS,
    });

    return pdf;
  } catch (err) {
    console.error("[generatePdf] Failed:", err.message);
    throw err;
  } finally {
    // ALWAYS close browser — even on error, prevents zombie processes
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};

export default generatePdf;