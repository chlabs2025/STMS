import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";

const generatePdf = async(invoice)=>{

  const templatePath = path.resolve("src/templates/invoice.ejs");

  const html = await ejs.renderFile(templatePath,{invoice});

  const browser = await puppeteer.launch({
    headless:"new",
    args:["--no-sandbox","--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html,{waitUntil:"networkidle0"});

  const pdf = await page.pdf({
    format:"A4",
    printBackground:true
  });

  await browser.close();
  return pdf;
};

export default generatePdf;