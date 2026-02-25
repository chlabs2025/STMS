import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";

const generateSlipPdf = async (slip) => {

  const templatePath = path.join(process.cwd(),"src/templates/slip.ejs");

  const html = await ejs.renderFile(templatePath,{slip});

  const browser = await puppeteer.launch({
    headless:"new",
    args:["--no-sandbox","--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html,{waitUntil:"networkidle0"});

  const pdf = await page.pdf({
    format:"A5",
    printBackground:true,
    margin:{ top:"10mm",bottom:"10mm",left:"10mm",right:"10mm"}
  });

  await browser.close();
  return pdf;
};

export default generateSlipPdf;