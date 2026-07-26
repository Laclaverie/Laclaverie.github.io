/* Local preview of dist/ exactly as GitHub Pages will serve it.
   Usage: node v2/serve.js   →   http://localhost:9880/
   (own port — 9877 is used by build.js during PDF generation) */
'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const DIST = path.join(__dirname, 'dist');
const PORT = 9880;

const MIME = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.pdf': 'application/pdf',
	'.txt': 'text/plain',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.woff2': 'font/woff2',
};

if (!fs.existsSync(DIST)) {
	console.error('dist/ not found — run a build first: npm run v2:build (or v2:build:fast)');
	process.exit(1);
}

http.createServer((req, res) => {
	const urlPath = decodeURIComponent(req.url.split('?')[0]);
	let filePath = path.join(DIST, urlPath);
	if (filePath !== DIST && !filePath.startsWith(DIST + path.sep)) { res.writeHead(403); res.end(); return; }
	if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
		filePath = path.join(filePath, 'index.html');
	}
	fs.readFile(filePath, (err, data) => {
		if (err) {
			// mimic GitHub Pages: serve 404.html with status 404
			fs.readFile(path.join(DIST, '404.html'), (err2, notFound) => {
				res.writeHead(404, { 'Content-Type': 'text/html' });
				res.end(err2 ? 'Not found' : notFound);
			});
			return;
		}
		res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
		res.end(data);
	});
}).listen(PORT, () => {
	console.log(`Serving v2/dist at http://localhost:${PORT}/`);
	console.log('Pages:');
	console.log(`  http://localhost:${PORT}/            (default CV)`);
	for (const app of JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'applications.json'), 'utf8'))) {
		console.log(`  http://localhost:${PORT}/${app.path}/`);
	}
	console.log('Ctrl+C to stop.');
});
