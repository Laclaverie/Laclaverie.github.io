const puppeteer = require('puppeteer');
const pdfParse = require('pdf-parse');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PORT = 9876;
const LANGS = ['fr', 'en'];
const MAX_PAGES = 2;
const SAVE_PDFS = process.argv.includes('--save-pdfs');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function startServer() {
  const server = http.createServer((req, res) => {
    let filePath = path.join(DOCS_DIR, req.url === '/' ? 'index.html' : req.url);
    if (!filePath.startsWith(DOCS_DIR)) { res.writeHead(403); res.end(); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end(); return; }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function checkLang(lang) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle0', timeout: 15000 });

    await page.evaluate((l) => {
      localStorage.setItem('language', l);
    }, lang);
    await page.reload({ waitUntil: 'networkidle0', timeout: 15000 });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: false,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
    });

    if (SAVE_PDFS) {
      const outPath = path.join(__dirname, `cv-${lang}.pdf`);
      fs.writeFileSync(outPath, pdfBuffer);
      console.log(`    Saved: ${outPath}`);
    }

    const data = await pdfParse(pdfBuffer);
    return data.numpages;
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log(`Checking PDF page count (local: docs/index.html)\n`);
  const server = await startServer();
  let failed = false;

  for (const lang of LANGS) {
    process.stdout.write(`  [${lang.toUpperCase()}] Generating PDF... `);
    try {
      const pages = await checkLang(lang);
      const ok = pages <= MAX_PAGES;
      console.log(`${ok ? 'PASS' : 'FAIL'} — ${pages} page(s) (max ${MAX_PAGES})`);
      if (!ok) failed = true;
    } catch (err) {
      console.log(`ERROR — ${err.message}`);
      failed = true;
    }
  }

  server.close();
  console.log();
  if (failed) {
    console.error('FAILED: one or more languages exceed the page limit.');
    process.exit(1);
  } else {
    console.log('All checks passed.');
  }
}

main();
