import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TIMEOUT_MS = 30_000;

const generateSlipPdf = async (slip) => {
  const templatePath = path.join(__dirname, "../templates/slip.ejs");
  const html = await ejs.renderFile(templatePath, { slip });

  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
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
      format: "A5",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
      timeout: TIMEOUT_MS,
    });

    return pdf;
  } catch (err) {
    console.error("[generateSlipPdf] Failed:", err.message);
    throw err;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};

export default generateSlipPdf;