/* Validates every generated PDF in dist/ stays within the page limit.
   Run after build: node v2/tests/check-pages.js */
'use strict';

const fs = require('fs');
const path = require('path');
const pdfParse = require(path.join(__dirname, '..', '..', 'node_modules', 'pdf-parse'));

const DIST = path.join(__dirname, '..', 'dist');
const MAX_PAGES = 2;

function findPdfs(dir) {
	const results = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) results.push(...findPdfs(full));
		else if (entry.name.endsWith('.pdf')) results.push(full);
	}
	return results;
}

async function main() {
	if (!fs.existsSync(DIST)) {
		console.error('dist/ not found — run the build first (node v2/build.js)');
		process.exit(1);
	}
	const pdfs = findPdfs(DIST);
	if (pdfs.length === 0) {
		console.error('No PDFs in dist/ — build ran with --no-pdf?');
		process.exit(1);
	}

	let failed = false;
	for (const pdf of pdfs) {
		const data = await pdfParse(fs.readFileSync(pdf));
		const ok = data.numpages <= MAX_PAGES;
		console.log(`${ok ? 'PASS' : 'FAIL'} — ${path.relative(DIST, pdf)}: ${data.numpages} page(s) (max ${MAX_PAGES})`);
		if (!ok) failed = true;
	}

	if (failed) {
		console.error('\nFAILED: one or more PDFs exceed the page limit.');
		process.exit(1);
	}
	console.log(`\nAll ${pdfs.length} PDFs within ${MAX_PAGES} pages.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
