# CV site v2

Data-driven CV generator. The published site IS the CV; every page also ships pre-rendered PDFs.

## Structure

```
v2/
  content/
    cv.json              # master content — ALL text lives here, EN+FR side by side.
                         # Bullets/projects have stable IDs + tags.
    roles/*.json         # role templates: pick headline, profile paragraph,
                         # bullet order, project order. qa-tools = default.
    applications.json    # one entry per job application (~5 lines):
                         # { path, company, role, jobTitle } → page at /<path>/
  templates/cv.html      # HTML shell (placeholders filled by build.js)
  assets/cv.css          # screen + print styles. PRINT BLOCK IS LOAD-BEARING:
                         # tests enforce every PDF ≤ 2 pages.
  assets/cv.js           # runtime renderer: builds DOM from content.js,
                         # EN default, FR toggle, print + PDF download buttons
  build.js               # generates dist/: pages, per-page content.js, PDFs
                         # (puppeteer), robots.txt. --no-pdf for fast builds.
  tests/check-pages.js   # fails if any generated PDF exceeds 2 pages
  dist/                  # build output (gitignored)
```

## Commands (from repo root)

```
npm run v2:build        # full build incl. PDFs
npm run v2:build:fast   # skip PDFs
npm run v2:test         # page-count check on all PDFs in dist/
```

## Adding a job application

Append to `content/applications.json`:

```json
{
  "path": "somecompany/tools-programmer",
  "company": "Some Company",
  "role": "image-processing",
  "jobTitle": { "en": "Tools Programmer", "fr": "Programmeur Outils" }
}
```

Rebuild → page at `/somecompany/tools-programmer/` (noindex) with PDFs named
`pierre-laclaverie-cv-somecompany-tools-programmer-{en,fr}.pdf`.
Need a new angle? Add a role template in `content/roles/` instead of editing bullets inline.

## Facts source

CV wording derives from `../../source_of_truth/ubisoft.txt` (facts, nuances, what's
deliberately off-CV). Update that file first, then reflect changes in `cv.json`.

## Open door: portfolio (not built yet)

Planned as a sibling page, not a rework:

- `templates/portfolio.html` + `content/portfolio.json` (same EN/FR `{en,fr}` text
  convention, project entries reuse the tag vocabulary from `cv.json`).
- `build.js` writes it to `dist/portfolio/`; nav link added in both templates.
- CV pages stay print-focused; portfolio is web-only (no PDF, no page-limit test).
- Old portfolio content to mine: `../docs/v1/` (HTML5UP site) + repo root `README.md`
  (project list with tags/links).
