/* Build script: generates dist/ from content JSON + role templates + applications.
   - dist/index.html            → default CV (role: qa-tools), indexable
   - dist/<company>/<role>/     → per-application variants, noindex
   - cv-en.pdf / cv-fr.pdf next to each page (skip with --no-pdf)
   Usage: node v2/build.js [--no-pdf] */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const PORT = 9877;
const NO_PDF = process.argv.includes('--no-pdf');
const DEFAULT_ROLE = 'qa-tools';

function readJson(p) {
	return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const content = readJson(path.join(ROOT, 'content', 'cv.json'));
const applications = readJson(path.join(ROOT, 'content', 'applications.json'));
const template = fs.readFileSync(path.join(ROOT, 'templates', 'cv.html'), 'utf8');

const roles = {};
for (const file of fs.readdirSync(path.join(ROOT, 'content', 'roles'))) {
	const role = readJson(path.join(ROOT, 'content', 'roles', file));
	roles[role.id] = role;
}

function resolveVariant(roleId, application) {
	const role = roles[roleId];
	if (!role) throw new Error(`Unknown role template: ${roleId}`);

	const bulletIndex = {};
	for (const job of content.experience) {
		for (const b of job.bullets) bulletIndex[`${job.id}/${b.id}`] = b;
	}
	const projectIndex = {};
	for (const p of content.projects) projectIndex[p.id] = p;

	const experience = content.experience.map((job) => {
		const ids = role.experience[job.id];
		if (!ids) return null;
		return {
			...job,
			bullets: ids.map((id) => {
				const b = bulletIndex[`${job.id}/${id}`];
				if (!b) throw new Error(`Unknown bullet "${id}" for job "${job.id}" (role ${roleId})`);
				return b;
			}),
		};
	}).filter(Boolean);

	const projects = role.projects.map((id) => {
		const p = projectIndex[id];
		if (!p) throw new Error(`Unknown project "${id}" (role ${roleId})`);
		return p;
	});

	return {
		pdfBaseName: null, // set by writePage
		meta: content.meta,
		labels: content.labels,
		headline: role.headline,
		profile: content.profiles[role.profile],
		skills: content.skills,
		highlights: role.highlights === false ? [] : content.highlights,
		teamNote: content.teamNote,
		experience,
		projects,
		education: content.education,
		application: application
			? { company: application.company, jobTitle: application.jobTitle }
			: null,
	};
}

const DESCRIPTION = 'Pierre Laclaverie — Test Automation Programmer / Tools Programmer. CV available in English and French (PDF).';
const FAVICON = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Crect%20width='100'%20height='100'%20rx='20'%20fill='%230056b3'/%3E%3Ctext%20x='50'%20y='50'%20font-family='Arial,sans-serif'%20font-size='48'%20font-weight='bold'%20fill='white'%20text-anchor='middle'%20dominant-baseline='central'%3EPL%3C/text%3E%3C/svg%3E";

function writePage(dir, variant, { noindex, pdfBaseName, pageUrl }) {
	variant.pdfBaseName = pdfBaseName;
	fs.mkdirSync(dir, { recursive: true });
	const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
	const html = template
		.replaceAll('{{TITLE}}', `${content.meta.name} - CV`)
		.replaceAll('{{DESCRIPTION}}', esc(DESCRIPTION))
		.replaceAll('{{PAGE_URL}}', pageUrl)
		.replaceAll('{{ROBOTS}}', noindex ? '<meta name="robots" content="noindex, nofollow" />' : '');
	fs.writeFileSync(path.join(dir, 'index.html'), html);
	fs.writeFileSync(
		path.join(dir, 'content.js'),
		'window.CV_CONTENT = ' + JSON.stringify(variant, null, '\t') + ';\n'
	);
}

function copyAssets() {
	fs.cpSync(path.join(ROOT, 'assets'), path.join(DIST, 'assets'), { recursive: true });
}

// ---- PDF generation ----

const MIME = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.pdf': 'application/pdf',
	'.woff2': 'font/woff2',
};

function startServer() {
	const server = http.createServer((req, res) => {
		const urlPath = decodeURIComponent(req.url.split('?')[0]);
		let filePath = path.join(DIST, urlPath);
		if (filePath !== DIST && !filePath.startsWith(DIST + path.sep)) { res.writeHead(403); res.end(); return; }
		if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
			filePath = path.join(filePath, 'index.html');
		}
		fs.readFile(filePath, (err, data) => {
			if (err) { res.writeHead(404); res.end(); return; }
			res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
			res.end(data);
		});
	});
	return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

function chromePath() {
	if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
	const winChrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
	if (process.platform === 'win32' && fs.existsSync(winChrome)) return winChrome;
	return undefined; // let puppeteer use its bundled browser
}

async function generatePdfs(pages) {
	const puppeteer = require(path.join(ROOT, '..', 'node_modules', 'puppeteer'));
	const server = await startServer();
	const browser = await puppeteer.launch({
		headless: 'new',
		executablePath: chromePath(),
		args: ['--no-sandbox'],
	});
	try {
		const page = await browser.newPage();
		for (const { dir, urlPath, pdfBaseName } of pages) {
			for (const lang of ['en', 'fr']) {
				await page.goto(`http://localhost:${PORT}${urlPath}?lang=${lang}`, {
					waitUntil: 'networkidle0',
					timeout: 20000,
				});
				await page.evaluate(() => document.fonts.ready);
				const pdf = await page.pdf({
					format: 'Letter',
					printBackground: false,
					margin: { top: '0.5in', bottom: '0.5in', left: '0.5in', right: '0.5in' },
				});
				const pdfPath = path.join(dir, `${pdfBaseName}-${lang}.pdf`);
				fs.writeFileSync(pdfPath, pdf);
				console.log(`  PDF: ${path.relative(DIST, pdfPath)}`);
			}
		}
	} finally {
		await browser.close();
		server.close();
	}
}

// ---- Main ----

async function main() {
	fs.rmSync(DIST, { recursive: true, force: true });
	fs.mkdirSync(DIST, { recursive: true });
	copyAssets();

	const pages = [];

	const defaultBase = 'pierre-laclaverie-cv';
	writePage(DIST, resolveVariant(DEFAULT_ROLE, null), { noindex: false, pdfBaseName: defaultBase, pageUrl: 'https://laclaverie.github.io/' });
	pages.push({ dir: DIST, urlPath: '/', pdfBaseName: defaultBase });
	console.log('Page: / (default, role ' + DEFAULT_ROLE + ')');

	for (const app of applications) {
		const dir = path.join(DIST, ...app.path.split('/'));
		const base = `pierre-laclaverie-cv-${app.path.split('/').join('-')}`;
		writePage(dir, resolveVariant(app.role, app), { noindex: true, pdfBaseName: base, pageUrl: `https://laclaverie.github.io/${app.path}/` });
		pages.push({ dir, urlPath: '/' + app.path + '/', pdfBaseName: base });
		console.log(`Page: /${app.path}/ (${app.company}, role ${app.role})`);
	}

	fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\n');
	fs.writeFileSync(path.join(DIST, '404.html'), `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="noindex" />
	<title>Page not found</title>
	<link rel="icon" href="${FAVICON}" />
	<style>
		body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
		main { text-align: center; }
		a { color: #0056b3; }
	</style>
</head>
<body>
	<main>
		<h1>Page not found</h1>
		<p><a href="/">Go to CV</a></p>
	</main>
</body>
</html>
`);

	if (!NO_PDF) {
		console.log('\nGenerating PDFs...');
		await generatePdfs(pages);
	}

	console.log(`\nBuild done: ${pages.length} page(s) in ${path.relative(process.cwd(), DIST)}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
