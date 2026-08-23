/* ==========================================================================
 * WindStrap docs fetcher
 *
 * Downloads the official Bootstrap 5.3 docs pages and swaps the Bootstrap
 * framework CSS for WindStrap's compiled CSS. The result is a full drop-in
 * compatibility test: every page of Bootstrap's own docs rendered with
 * WindStrap instead of Bootstrap, proving 1:1 class compatibility.
 *
 *   node scripts/fetch-docs.js
 *
 * Output: docs/<section>/<page>.html + docs/index.html
 *
 * Only the framework stylesheet is local (../../dist/windstrap.min.css).
 * The docs chrome (docs.css, docs.js, icons, images) keeps Bootstrap's own
 * files via absolute CDN URLs so the pages render identically from any origin.
 * ========================================================================== */

const fs = require('fs');
const path = require('path');

const VERSION = '5.3.8';
const DOCS_PATH = '5.3';
const BASE = `https://getbootstrap.com/docs/${DOCS_PATH}`;
const OUT_DIR = path.join(__dirname, '..', 'docs');
const CSS_LINK = '../../dist/windstrap.min.css';
const DELAY_MS = 150; // be polite to getbootstrap.com

const SECTIONS = [
  {
    name: 'Customize', slug: 'customize',
    pages: ['overview', 'sass', 'options', 'color', 'components', 'css-variables', 'optimize', 'color-modes'],
  },
  {
    name: 'Layout', slug: 'layout',
    pages: ['breakpoints', 'containers', 'grid', 'css-grid', 'columns', 'gutters', 'utilities', 'z-index'],
  },
  {
    name: 'Content', slug: 'content',
    pages: ['typography', 'images', 'tables', 'figures', 'reboot'],
  },
  {
    name: 'Forms', slug: 'forms',
    pages: ['overview', 'form-control', 'select', 'checks-radios', 'range', 'input-group', 'floating-labels', 'layout', 'validation'],
  },
  {
    name: 'Components', slug: 'components',
    pages: ['accordion', 'alerts', 'badge', 'breadcrumb', 'buttons', 'button-group', 'card', 'carousel', 'close-button', 'collapse', 'dropdowns', 'list-group', 'modal', 'navbar', 'navs-tabs', 'offcanvas', 'pagination', 'placeholders', 'popovers', 'progress', 'scrollspy', 'spinners', 'toasts', 'tooltips'],
  },
  {
    name: 'Helpers', slug: 'helpers',
    pages: ['clearfix', 'color-background', 'colored-links', 'focus-ring', 'icon-link', 'position', 'ratio', 'stacks', 'stretched-link', 'text-truncation', 'vertical-rule', 'visually-hidden'],
  },
  {
    name: 'Utilities', slug: 'utilities',
    pages: ['api', 'background', 'borders', 'colors', 'display', 'flex', 'float', 'interactions', 'link', 'object-fit', 'opacity', 'overflow', 'position', 'shadows', 'sizing', 'spacing', 'text', 'vertical-align', 'visibility', 'z-index'],
  },
];

// Every locally-downloaded page, as `<section>/<slug>` keys.
const LOCAL = new Set();
for (const s of SECTIONS) for (const p of s.pages) LOCAL.add(`${s.slug}/${p}`);

/**
 * Remove Bootstrap's page chrome: skip-link, top navbar (<header>), footer,
 * plus the leftover Bootstrap/third-party branding:
 *   - "View on GitHub" button in .bd-intro (and its now-empty wrapper)
 *   - "Try it on StackBlitz" (.btn-edit) buttons
 *   - Carbon ads + Fathom analytics
 *   - external color-modes.js (its toggle UI lived in the stripped <header>)
 *   - Astro/DocSearch head metadata + Algolia preconnect
 */
function stripChrome(html) {
  return html
    .replace(/<div class="skippy[^>]*>[\s\S]*?<\/div>\s*/i, '')
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>\s*/i, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>\s*/i, '')
    .replace(/<a\b[^>]*>\s*View on GitHub[\s\S]*?<\/a>\s*/i, '')
    .replace(/<div\b[^>]*>\s*<\/div>\s*(?=<h1\b)/i, '')
    .replace(/<button\b[^>]*class="[^"]*btn-edit[^"]*"[^>]*>[\s\S]*?<\/button>\s*/gi, '')
    .replace(/<script[^>]*src="[^"]*cdn\.carbonads\.com[^"]*"[^>]*><\/script>\s*/i, '')
    .replace(/<script[^>]*src="[^"]*cdn\.usefathom\.com[^"]*"[^>]*><\/script>\s*/i, '')
    .replace(/<script[^>]*src="[^"]*color-modes\.js"[^>]*><\/script>\s*/i, '')
    .replace(/<meta name="generator"[^>]*>\s*/i, '')
    .replace(/<meta name="docsearch:[^>]*>\s*/gi, '')
    .replace(/<link rel="preconnect" href="[^"]*algolia\.net"[^>]*>\s*/i, '');
}

/** Point sidebar links at the local downloaded pages when we have them. */
function relinkSidebar(html) {
  const start = html.indexOf('<aside class="bd-sidebar">');
  const end = html.indexOf('</aside>', start);
  if (start === -1 || end === -1) return html;
  const closeLen = '</aside>'.length;
  let aside = html.slice(start, end + closeLen);
  aside = aside.replace(
    /href="https:\/\/getbootstrap\.com\/docs\/5\.3\/([^"#]+?)(?:#[^"]*)?"/g,
    (m, p) => {
      const key = p.replace(/\/$/, '');
      return LOCAL.has(key) ? `href="../${key}.html"` : m;
    }
  );
  return html.slice(0, start) + aside + html.slice(end + closeLen);
}

const BOOTSTRAP_JS = 'https://getbootstrap.com/docs/5.3/dist/js/bootstrap.bundle.min.js';
const LOCAL_JS_DIR = path.join(__dirname, '..', 'docs', 'js');

/** Download Bootstrap's JS bundle once so the docs work from file:// (no SRI/CORS). */
async function ensureLocalJs() {
  fs.mkdirSync(LOCAL_JS_DIR, { recursive: true });
  const js = await fetchText(BOOTSTRAP_JS);
  fs.writeFileSync(path.join(LOCAL_JS_DIR, 'bootstrap.bundle.min.js'), js);
  console.log('✓ docs/js/bootstrap.bundle.min.js');
}

/**
 * Swap Bootstrap's CDN bundle (which has integrity + crossorigin, blocked on
 * file:// origins) for the local copy, loaded in <head> so `bootstrap` is
 * defined before the body's deferred module scripts run.
 */
function relinkBootstrapJs(html) {
  html = html.replace(
    /<script\b[^>]*src="[^"]*bootstrap\.bundle(?:\.min)?\.js"[^>]*><\/script>/i,
    ''
  );
  return html.replace('<head>', '<head><script src="../js/bootstrap.bundle.min.js"></script>');
}

/**
 * Remove every Astro module script emitted by Bootstrap's docs build. Verified
 * (2026-08-22) that the docs fully work without them:
 *   - Scripts.astro     → DocSearch (Algolia) — needs network, searches
 *     Bootstrap's own index; its trigger button lived in the stripped <header>.
 *   - Code.astro        → clipboard.js wiring for the "Copy" buttons.
 *   - DocsScripts.astro → external chunk; the same sidebar/demo init logic is
 *     already inlined in each page's own <script type="module"> block.
 */
function neutralizeAstroScripts(html) {
  return html.replace(/<script type="module" src="[^"]*\.astro[^"]*"><\/script>\s*/gi, '');
}

async function fetchText(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { 'user-agent': 'WindStrap-docs/1.0 (docs fetcher)' },
      });
      if (res.ok) return res.text();
      if (res.status >= 500 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * attempt)); // backoff
        continue;
      }
      throw new Error(`${url} -> HTTP ${res.status}`);
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`${url} -> exhausted retries`);
}

/** Replace the Bootstrap framework stylesheet link with WindStrap's. */
function swapCss(html) {
  const before = (html.match(/<link\b[^>]*dist\/css\/bootstrap[^>]*>/i) || [null])[0];
  if (!before) throw new Error('Bootstrap CSS <link> not found');
  return html.replace(before, `<link rel="stylesheet" href="${CSS_LINK}">`);
}

/** Absolutize Bootstrap's root-relative /docs/5.3/ asset URLs. */
function absolutize(html) {
  return html
    .split(`"/docs/${DOCS_PATH}/`).join(`"${BASE}/`)
    .split(`'/docs/${DOCS_PATH}/`).join(`'${BASE}/`);
}

function buildIndex() {
  const links = SECTIONS.map((s) => {
    const items = s.pages.map((p) => `    <li><a href="${s.slug}/${p}.html">${p}</a></li>`).join('\n');
    return `  <h2>${s.name}</h2>\n  <ul>\n${items}\n  </ul>`;
  }).join('\n');

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WindStrap — Bootstrap ${VERSION} docs with WindStrap CSS</title>
  <link rel="stylesheet" href="../dist/windstrap.min.css">
  <style>
    body { padding: 2rem 1rem; max-width: 960px; margin: 0 auto; }
    h1 { margin-bottom: .25rem; }
    .lead { color: var(--bs-secondary-color); }
    h2 { margin-top: 2rem; font-size: 1.25rem; }
    ul { columns: 3; }
    @media (max-width: 768px) { ul { columns: 2; } }
  </style>
</head>
<body>
  <h1>WindStrap docs</h1>
  <p class="lead">Bootstrap ${VERSION} docs pages rendered with <code>dist/windstrap.min.css</code> instead of Bootstrap's CSS. If these pages render like the originals on getbootstrap.com, WindStrap is a drop-in replacement.</p>
${links}
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html);
}

async function main() {
  await ensureLocalJs();
  let count = 0;
  const failed = [];
  for (const section of SECTIONS) {
    for (const slug of section.pages) {
      const url = `${BASE}/${section.slug}/${slug}/`;
      try {
        const html = await fetchText(url);
        const out = relinkBootstrapJs(neutralizeAstroScripts(relinkSidebar(stripChrome(swapCss(absolutize(html))))));
        const dir = path.join(OUT_DIR, section.slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `${slug}.html`), out);
        count += 1;
        console.log(`✓ ${section.slug}/${slug}.html`);
      } catch (err) {
        failed.push(`${section.slug}/${slug}`);
        console.log(`✗ ${section.slug}/${slug}.html — ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }
  buildIndex();
  console.log(`\nFetched ${count} pages → docs/ (index.html included).`);
  if (failed.length) {
    console.log(`FAILED (${failed.length}): ${failed.join(', ')} — re-run "npm run docs" to retry.`);
  }
  console.log('Verify: open docs/index.html (or docs/components/carousel.html) in a browser.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
