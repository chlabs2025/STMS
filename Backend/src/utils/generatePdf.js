import fs from "fs";
import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TIMEOUT_MS = 30_000; // 30 second timeout for PDF generation

const isExecutable = (executablePath) => {
  try {
    const stats = fs.statSync(executablePath)
    fs.accessSync(executablePath, fs.constants.X_OK)
    return stats.isFile()
  } catch {
    return false
  }
}

const getExecutablePath = () => {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    process.env.CHROMIUM_PATH,
    puppeteer.executablePath?.(),
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ].filter(Boolean)

  for (const executablePath of candidates) {
    if (isExecutable(executablePath)) {
      return executablePath
    }
    console.warn(`[PDF] Skipping invalid browser path: ${executablePath}`)
  }
  return undefined
}

const generatePdf = async (invoice) => {
  const templatePath = path.join(__dirname, "../templates/invoice.ejs");
  const html = await ejs.renderFile(templatePath, { invoice });

  let browser = null;
  try {
    const executablePath = getExecutablePath()
    const launchConfig = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",   // prevent /dev/shm out-of-space on Docker/Render
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-ipc-flooding-protection",
        "--disable-extensions",
        "--disable-plugins",
        "--disable-images",
        // "--disable-javascript",  // Commented out - might be needed for PDF generation
        "--disable-dev-tools",
        "--disable-hang-monitor",
        "--disable-prompt-on-repost",
        "--force-color-profile=srgb",
        "--metrics-recording-only",
        "--no-first-run",
        "--enable-automation",
        "--password-store=basic",
        "--use-mock-keychain",
        "--no-default-browser-check",
        "--no-pings",
        "--no-zygote",
        "--single-process",  // This is actually safe in containers
        "--memory-pressure-off",
        "--max_old_space_size=4096",
      ],
    }
    if (executablePath) {
      launchConfig.executablePath = executablePath
    }

    browser = await puppeteer.launch(launchConfig);

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