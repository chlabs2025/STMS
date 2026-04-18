import fs from "fs";
import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TIMEOUT_MS = 30_000;

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

const generateSlipPdf = async (slip) => {
  console.log("[PDF] Starting slip PDF generation for slip:", slip.slipNumber);
  const templatePath = path.join(__dirname, "../templates/slip.ejs");
  console.log("[PDF] Template path:", templatePath);

  const html = await ejs.renderFile(templatePath, { slip });
  console.log("[PDF] HTML rendered, length:", html.length);

  let browser = null;
  try {
    const executablePath = getExecutablePath()
    console.log("[PDF] Using executable path:", executablePath);

    const launchConfig = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    }
    if (executablePath) {
      launchConfig.executablePath = executablePath
    }

    console.log("[PDF] Launching browser with config:", { executablePath: launchConfig.executablePath, args: launchConfig.args.slice(0, 3) });
    browser = await puppeteer.launch(launchConfig);
    console.log("[PDF] Browser launched successfully");

    const page = await browser.newPage();
    console.log("[PDF] New page created");

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: TIMEOUT_MS,
    });
    console.log("[PDF] HTML content set");

    const pdf = await page.pdf({
      format: "A5",
      printBackground: true,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
      timeout: TIMEOUT_MS,
    });
    console.log("[PDF] PDF generated, size:", pdf.length);

    return pdf;
  } catch (err) {
    console.error("[PDF] Failed to generate slip PDF:", err.message);
    console.error("[PDF] Error stack:", err.stack);
    throw new Error(`PDF generation failed: ${err.message}`);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};

export default generateSlipPdf;