# laclaverie.github.io — data-driven CV

My personal CV site, and the small system that generates it. The published page **is**
the CV; every version also ships as a print-ready PDF (English and French).

Live: **https://laclaverie.github.io/**

## The idea

I apply to a range of roles, and a good CV is tailored to each one. Rather than maintain a
pile of copy-pasted documents, I keep **one source of content** and describe each tailored
version as a small **role template**. A build script renders every version to a static page
and a matched pair of PDFs, and a test fails the build if any PDF spills past two pages.

I'm a tools programmer, not a web developer — so I built this with **Claude Code** as a
pragmatic way to get a clean result in a domain I don't work in daily, instead of
hand-rolling a worse site myself.

## How it works

```
v2/
  content/
    cv.json            # single source of truth — every line of content, EN + FR.
                       # Experience bullets and projects have stable IDs + tags.
    roles/*.json       # one template per kind of role: picks the headline, profile,
                       # which bullets/projects appear (and their order), and an
                       # optional role-specific skills line.
    applications.json  # one entry per job application (~6 lines): path, company,
                       # role template, job title -> its own page + named PDFs.
  templates/cv.html    # HTML shell (meta, favicon, placeholders)
  assets/cv.css        # screen + print styles (print block is enforced by the test)
  assets/cv.js         # renders the page from content at runtime; EN/FR toggle
  assets/fonts/        # self-hosted Inter (identical PDF render on every OS / CI)
  build.js             # content + role -> dist/: pages, per-page data, PDFs (puppeteer)
  tests/check-pages.js # fails if any generated PDF exceeds two pages
  serve.js             # local preview of dist/ exactly as GitHub Pages serves it
```

A per-company page lives at `/<company>/<role>/` (set to `noindex`), with PDFs named
`pierre-laclaverie-cv-<company>-<role>-{en,fr}.pdf`. The default CV is at `/`.

## Commands

```bash
npm ci             # install (puppeteer + pdf-parse)
npm run build      # generate dist/ (pages + PDFs)
npm run build:fast # skip PDFs (quick content preview)
npm run test       # assert every PDF is <= 2 pages
npm run serve      # preview dist/ at http://localhost:9880/
```

## Adding a tailored version

Append one entry to `v2/content/applications.json`:

```json
{
  "path": "acme/backend-engineer",
  "company": "Acme",
  "role": "cpp-systems",
  "jobTitle": { "en": "Backend Engineer", "fr": "Ingénieur Backend" }
}
```

Rebuild -> a new page at `/acme/backend-engineer/` with its own PDFs. Need a new emphasis?
Add a `roles/*.json` template instead of editing shared content.

## Deployment

Push to `main`. GitHub Actions (`.github/workflows/deploy.yml`) installs, builds, runs the
page-count test, and publishes `v2/dist` to GitHub Pages.

## Archive

The previous hand-built version of this site and older experiments live in
[`.archive/`](.archive/) — kept for reference, not served.
