#!/bin/bash
cd "C:\Users\moham\OneDrive\Documents\GitHub\STMS"
git add Backend/package.json Backend/src/utils/generatePdf.js Backend/src/utils/generateSlipPdf.js
git commit -m "refactor: replace Puppeteer with PDFKit for production PDF generation"
git push origin main
