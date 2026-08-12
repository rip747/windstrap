/* ==========================================================================
 * WindStrap docs builder
 * Assembles site/_layout.html + per-section content fragments into static
 * HTML pages under docs/<section>/ and a docs/index.html overview.
 *
 *   node scripts/build-docs.js
 * ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const LAYOUT = fs.readFileSync(path.join(SITE, '_layout.html'), 'utf8');
const OUT_DIR = path.join(ROOT, 'docs');

/* -------------------------------------------------------------- sections */
// order = Bootstrap's official docs order
const SECTIONS = [
  /*{
    name: 'Getting started', slug: 'getting-started', soon: true,
    items: ['Introduction', 'Quick start', 'CDN links', 'Contents', 'Downloads', 'Browsers & devices', 'JavaScript', 'Webpack', 'Parcel', 'Vite', 'Accessibility', 'RFS', 'RTL', 'Contribute'],
  },*/
  {
    name: 'Customize', slug: 'customize',
    pages: [
      { slug: 'overview', title: 'Overview', lead: 'Customize Bootstrap with our built-in Sass variables and maps to easily style and change components.' },
      { slug: 'sass', title: 'Sass', lead: 'Utilize our source Sass files to take advantage of variables, maps, mixins, and more.' },
      { slug: 'color', title: 'Color', lead: 'Use our Sass maps to add new colors and modify existing ones.' },
      { slug: 'components', title: 'Components', lead: 'Learn how to customize Bootstrap’s components.' },
      { slug: 'css-variables', title: 'CSS variables', lead: 'Use Bootstrap’s CSS custom properties for quick and forward-looking customization.' },
      { slug: 'optimize', title: 'Optimize', lead: 'Optimize Bootstrap for production by removing unused CSS.' },
      { slug: 'dark-mode', title: 'Dark mode', lead: 'Enable, disable, or customize dark mode.' },
    ],
  },
  {
    name: 'Layout', slug: 'layout',
    pages: [
      { slug: 'breakpoints', title: 'Breakpoints', lead: 'Use Bootstrap’s breakpoints and media queries to build responsive layouts.' },
      { slug: 'containers', title: 'Containers', lead: 'Containers are the most basic layout element in Bootstrap.' },
      { slug: 'grid', title: 'Grid', lead: 'Bootstrap’s grid system uses a series of containers, rows, and columns.' },
      { slug: 'columns', title: 'Columns', lead: 'Use Bootstrap’s grid columns to lay out content.' },
      { slug: 'gutters', title: 'Gutters', lead: 'Gutters are the padding between columns.' },
      { slug: 'utilities', title: 'Utilities', lead: 'Bootstrap includes dozens of utility classes for faster, mobile-first development.' },
      { slug: 'z-index', title: 'Z-index', lead: 'Control the stacking order of elements.' },
      { slug: 'css-grid', title: 'CSS grid', lead: 'Bootstrap’s grid system can also be used with CSS Grid.' },
    ],
  },
  {
    name: 'Content', slug: 'content',
    pages: [
      { slug: 'reboot', title: 'Reboot', lead: 'Reboot, a collection of element-specific CSS changes in a single file.' },
      { slug: 'typography', title: 'Typography', lead: 'Documentation and examples for Bootstrap typography.' },
      { slug: 'images', title: 'Images', lead: 'Documentation and examples for opting images into responsive behavior.' },
      { slug: 'tables', title: 'Tables', lead: 'Documentation and examples for styling tables with Bootstrap.' },
      { slug: 'figures', title: 'Figures', lead: 'Documentation and examples for displaying related images and text.' },
      { slug: 'syntax-highlighting', title: 'Syntax highlighting', lead: 'Add syntax highlighting to your documentation with highlight.js.' },
    ],
  },
  {
    name: 'Forms', slug: 'forms',
    pages: [
      { slug: 'overview', title: 'Overview', lead: 'Examples and usage guidelines for form control styles.' },
      { slug: 'form-control', title: 'Form control', lead: 'Give textual form controls like inputs and textareas styling.' },
      { slug: 'select', title: 'Select', lead: 'Customize the native <select>s with custom CSS.' },
      { slug: 'checks-radios', title: 'Checks & radios', lead: 'Create consistent cross-browser, accessible checkbox and radio controls.' },
      { slug: 'range', title: 'Range', lead: 'Create custom range inputs with Bootstrap’s form validation styles.' },
      { slug: 'input-group', title: 'Input group', lead: 'Easily extend form controls by adding text, buttons, or button groups.' },
      { slug: 'floating-labels', title: 'Floating labels', lead: 'Create beautifully simple form labels that float over your inputs.' },
      { slug: 'layout', title: 'Layout', lead: 'Give your forms some structure—from inline to horizontal to custom grid layouts.' },
      { slug: 'validation', title: 'Validation', lead: 'Provide valuable, actionable feedback to your users with form validation.' },
    ],
  },
  {
    name: 'Components', slug: 'components',
    pages: [
      { slug: 'accordion', title: 'Accordion', lead: 'Build vertically collapsing accordions in combination with our Collapse JavaScript plugin.' },
      { slug: 'alerts', title: 'Alerts', lead: 'Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages.' },
      { slug: 'badge', title: 'Badge', lead: 'Documentation and examples for badges, our small count and labeling component.' },
      { slug: 'breadcrumb', title: 'Breadcrumb', lead: 'Indicate the current page’s location within a navigational hierarchy that automatically adds separators via CSS.' },
      { slug: 'buttons', title: 'Buttons', lead: 'Use Bootstrap’s custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.' },
      { slug: 'button-group', title: 'Button group', lead: 'Group a series of buttons together on a single line or stacked in a vertical column.' },
      { slug: 'card', title: 'Card', lead: 'Bootstrap’s cards provide a flexible and extensible content container with multiple variants and options.' },
      { slug: 'carousel', title: 'Carousel', lead: 'A slideshow component for cycling through elements—images or slides of text—like a carousel.' },
      { slug: 'collapse', title: 'Collapse', lead: 'Toggle the visibility of content across your project with a few classes and our JavaScript plugins.' },
      { slug: 'dropdowns', title: 'Dropdowns', lead: 'Toggle contextual overlays for displaying lists of links and more with the Bootstrap dropdown plugin.' },
      { slug: 'list-group', title: 'List group', lead: 'List groups are a flexible and powerful component for displaying a series of content.' },
      { slug: 'modal', title: 'Modal', lead: 'Use Bootstrap’s JavaScript modal plugin to add dialogs to your site for lightboxes, user notifications, or completely custom content.' },
      { slug: 'navs-tabs', title: 'Navs & tabs', lead: 'Documentation and examples for how to use Bootstrap’s included navigation components.' },
      { slug: 'navbar', title: 'Navbar', lead: 'Documentation and examples for Bootstrap’s powerful, responsive navigation header, the navbar.' },
      { slug: 'offcanvas', title: 'Offcanvas', lead: 'Build hidden toggleable sidebars into your project for navigation, shopping carts, and more.' },
      { slug: 'pagination', title: 'Pagination', lead: 'Documentation and examples for showing pagination to indicate a series of related content exists across multiple pages.' },
      { slug: 'placeholders', title: 'Placeholders', lead: 'Use loading placeholders for your components or pages to indicate something may still be loading.' },
      { slug: 'popovers', title: 'Popovers', lead: 'Documentation and examples for adding Bootstrap popovers, like those found in iOS, to any element on your site.' },
      { slug: 'progress', title: 'Progress', lead: 'Documentation and examples for using Bootstrap custom progress bars featuring support for stacked bars, animated backgrounds, and text labels.' },
      { slug: 'scrollspy', title: 'Scrollspy', lead: 'Automatically update Bootstrap navigation or list group components based on scroll position to indicate which link is currently active in the viewport.' },
      { slug: 'spinners', title: 'Spinners', lead: 'Indicate the loading state of a component or page with Bootstrap spinners, built entirely with HTML, CSS, and no JavaScript.' },
      { slug: 'toasts', title: 'Toasts', lead: 'Push notifications to your visitors with a toast, a lightweight and easily customizable alert message.' },
      { slug: 'tooltips', title: 'Tooltips', lead: 'Documentation and examples for adding custom Bootstrap tooltips with CSS and JavaScript using CSS3 for animations and data-bs-attributes for local title storage.' },
    ],
  },
  {
    name: 'Helpers', slug: 'helpers',
    pages: [
      { slug: 'clearfix', title: 'Clearfix', lead: 'Easily clear floats by adding .clearfix to the parent element.' },
      { slug: 'color-background', title: 'Color & background', lead: 'Set the text color and background of elements with color and background utilities.' },
      { slug: 'colored-links', title: 'Colored links', lead: 'Colored links with hover states.' },
      { slug: 'focus-ring', title: 'Focus ring', lead: 'Beautiful and accessible focus ring.' },
      { slug: 'icon-link', title: 'Icon link', lead: 'Quickly place Bootstrap Icons inside a link.' },
      { slug: 'position', title: 'Position', lead: 'Use these shorthand utilities to quickly configure the position of an element.' },
      { slug: 'ratio', title: 'Ratio', lead: 'Use generated pseudo elements to make an element maintain its aspect ratio.' },
      { slug: 'stacks', title: 'Stacks', lead: 'Composition helpers for building vertical and horizontal stacks.' },
      { slug: 'stretched-link', title: 'Stretched link', lead: 'Make any HTML element or Bootstrap component clickable by stretching a nested link.' },
      { slug: 'text-truncation', title: 'Text truncation', lead: 'Truncate long strings of text with an ellipsis.' },
      { slug: 'vertical-rule', title: 'Vertical rule', lead: 'Use the vertical rule helper to create vertical dividers.' },
      { slug: 'visually-hidden', title: 'Visually hidden', lead: 'Hide elements visually while keeping them accessible to assistive technologies.' },
    ],
  },
  {
    name: 'Utilities', slug: 'utilities',
    pages: [
      { slug: 'api', title: 'API', lead: 'The utility API is a Sass-based tool to generate utility classes.' },
      { slug: 'background', title: 'Background', lead: 'Set the background of an element with background utilities.' },
      { slug: 'borders', title: 'Borders', lead: 'Use border utilities to quickly style the border and border-radius of an element.' },
      { slug: 'colors', title: 'Colors', lead: 'Convey meaning through color with a handful of color utility classes.' },
      { slug: 'display', title: 'Display', lead: 'Use display utilities to toggle the display value of components.' },
      { slug: 'flex', title: 'Flex', lead: 'Quickly manage the layout, alignment, and sizing of grid columns, navigation, components, and more.' },
      { slug: 'float', title: 'Float', lead: 'Toggle floats on any element, across any breakpoint.' },
      { slug: 'interactions', title: 'Interactions', lead: 'Utilities for controlling how elements interact with mouse, keyboard, and touch.' },
      { slug: 'link', title: 'Link', lead: 'Utilities for modifying link styles.' },
      { slug: 'object-fit', title: 'Object fit', lead: 'Set how media elements are resized within their containers.' },
      { slug: 'opacity', title: 'Opacity', lead: 'Control the opacity of elements.' },
      { slug: 'overflow', title: 'Overflow', lead: 'Adjust the overflow property on the fly.' },
      { slug: 'position', title: 'Position', lead: 'Set the positioning of elements with the position utilities.' },
      { slug: 'shadows', title: 'Shadows', lead: 'Add or remove shadows to elements with box-shadow utilities.' },
      { slug: 'sizing', title: 'Sizing', lead: 'Easily make an element as wide or as tall with our width and height utilities.' },
      { slug: 'spacing', title: 'Spacing', lead: 'Assign responsive-friendly margin or padding values to an element.' },
      { slug: 'text', title: 'Text', lead: 'Utilities for controlling text alignment, wrapping, word break, and more.' },
      { slug: 'vertical-alignment', title: 'Vertical alignment', lead: 'Easily change the vertical alignment of inline, inline-block, and table cells.' },
      { slug: 'visibility', title: 'Visibility', lead: 'Control the visibility of elements, without modifying their display.' },
      { slug: 'z-index', title: 'Z-index', lead: 'Control the z-index of elements with a few simple classes.' },
    ],
  },
  /*{
    name: 'Extend', slug: 'extend', soon: true,
    items: ['Approach', 'Icons'],
  },
  {
    name: 'About', slug: 'about', soon: true,
    items: ['Overview', 'Team', 'Brand', 'License', 'Translations'],
  },*/
];

const TRANSLATED = SECTIONS.filter((s) => !s.soon);
// Flat ordered list of every translated page (for global prev/next).
const ALL_PAGES = [];
for (const section of TRANSLATED) {
  for (const page of section.pages) {
    ALL_PAGES.push({ section: section.slug, ...page });
  }
}
const INDEX = {};
ALL_PAGES.forEach((p, i) => { INDEX[`${p.section}/${p.slug}`] = i; });

/* ------------------------------------------------------------- sidebar */
function buildSidebar(activeSection, activeSlug) {
  let html = '<ul class="bd-links-nav list-unstyled mb-0 pb-lg-3 pb-4">\n';
  for (const group of SECTIONS) {
    html += `  <li class="bd-links-group py-2">\n`;
    html += `    <strong class="bd-links-heading d-flex w-100 align-items-center fw-semibold">${group.name}`;
    /*if (group.soon) {
      html += ' <span class="bd-links-badge">soon</span>';
    } else {
      html += ' <span class="bd-links-badge">translated</span>';
    }*/
    html += '</strong>\n';
    html += '    <ul class="list-unstyled fw-normal pb-2 small">\n';
    if (group.soon) {
      for (const item of group.items) {
        html += `      <li><span class="bd-links-link d-inline-block rounded opacity-50">${item}</span></li>\n`;
      }
    } else {
      for (const page of group.pages) {
        const active = page.slug === activeSlug && group.slug === activeSection ? ' active' : '';
        const href = relHref(activeSection, { section: group.slug, slug: page.slug });
        html += `      <li><a class="bd-links-link d-inline-block rounded${active}" href="${href}">${page.title}</a></li>\n`;
      }
    }
    html += '    </ul>\n  </li>\n';
  }
  html += '</ul>\n';
  return html;
}

/* -------------------------------------------------------------- TOC */
function extractToc(content) {
  const h2 = [];
  const re = /<h([23])\s+id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const [, level, id, inner] = m;
    // drop the in-heading anchor link ("#") so TOC items don't end with "#"
    const text = inner.replace(/<a[^>]*>.*?<\/a>/g, '').replace(/<[^>]+>/g, '').trim();
    if (level === '2') h2.push({ id, text, children: [] });
    else if (h2.length) h2[h2.length - 1].children.push({ id, text });
  }
  if (!h2.length) return '';
  let html = '<ul>\n';
  for (const h of h2) {
    html += `  <li><a href="#${h.id}">${h.text}</a>\n`;
    if (h.children.length) {
      html += '    <ul>\n';
      for (const c of h.children) html += `      <li><a href="#${c.id}">${c.text}</a></li>\n`;
      html += '    </ul>\n';
    }
    html += '  </li>\n';
  }
  html += '</ul>\n';
  return html;
}

/* -------------------------------------------------- code escaping */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeCodeBlocks(content) {
  const re = /<pre class="highlight" data-escape><code>([\s\S]*?)<\/code><\/pre>/g;
  return content.replace(re, (m, inner) => {
    return `<pre class="highlight"><code>${escapeHtml(inner.trim())}</code></pre>`;
  });
}

/* ---------------------------------------------------------- helpers */
function relHref(fromSection, to) {
  if (!to) return '../index.html';
  return to.section === fromSection ? `${to.slug}.html` : `../${to.section}/${to.slug}.html`;
}

function prevNext(page, i) {
  const prev = ALL_PAGES[i - 1];
  const next = ALL_PAGES[i + 1];
  const prevHtml = `<a class="bd-prev" href="${relHref(page.section, prev)}"><span class="bd-prev-next-label">Previous</span><span class="bd-prev-next-title">${prev ? prev.title : 'Docs home'}</span></a>`;
  const nextHtml = `<a class="bd-next text-end" href="${relHref(page.section, next)}"><span class="bd-prev-next-label">Next</span><span class="bd-prev-next-title">${next ? next.title : 'Docs home'}</span></a>`;
  return { prevHtml, nextHtml };
}

/* --------------------------------------------------------------- main */
function build() {
  for (const section of TRANSLATED) {
    const sectionOut = path.join(OUT_DIR, section.slug);
    if (!fs.existsSync(sectionOut)) fs.mkdirSync(sectionOut, { recursive: true });
    const contentDir = path.join(SITE, 'content', section.slug);

    section.pages.forEach((page, j) => {
      const fragPath = path.join(contentDir, `${page.slug}.html`);
      let content;
      try {
        content = fs.readFileSync(fragPath, 'utf8');
      } catch (e) {
        console.error(`✖ missing content fragment: ${fragPath}`);
        return;
      }
      content = escapeCodeBlocks(content);

      const globalIndex = INDEX[`${section.slug}/${page.slug}`];
      const pn = prevNext(page, globalIndex);

      const html = LAYOUT
        .replace(/\{\{TITLE\}\}/g, page.title)
        .replace(/\{\{LEAD\}\}/g, page.lead)
        .replace(/\{\{SIDEBAR\}\}/g, buildSidebar(section.slug, page.slug))
        .replace(/\{\{ONTHIS\}\}/g, extractToc(content))
        .replace(/\{\{CONTENT\}\}/g, content)
        .replace(/\{\{PREV\}\}/g, pn.prevHtml)
        .replace(/\{\{NEXT\}\}/g, pn.nextHtml);

      fs.writeFileSync(path.join(sectionOut, `${page.slug}.html`), html);
      console.log(`✔ docs/${section.slug}/${page.slug}.html`);
    });
  }

  buildIndex();
}

/* ---------------------------------------------------------- index */
function buildIndex() {
  let sectionCards = '';
  for (const section of TRANSLATED) {
    const first = section.pages[0];
    sectionCards += `
      <div class="col-12 col-sm-6 col-lg-4">
        <a class="d-block text-decoration-none h-100" href="${section.slug}/${first.slug}.html">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title text-primary mb-1">${section.name}</h5>
              <p class="card-text small text-body-secondary mb-0">${section.pages.length} pages translated</p>
            </div>
          </div>
        </a>
      </div>`;
  }

  const index = `<!doctype html>
<html lang="en" data-bs-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WindStrap docs · v5.3.8</title>
  <link rel="stylesheet" href="../dist/windstrap.css">
  <link rel="stylesheet" href="css/docs.css">
</head>
<body class="d-flex flex-column h-100">
  <header class="navbar navbar-expand-lg navbar-dark bd-navbar sticky-top">
    <div class="container-xl">
      <a class="navbar-brand" href="index.html">WindStrap<span class="bd-badge">v5.3.8</span></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bd-navbar" aria-controls="bd-navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="bd-navbar">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link active" href="index.html">Docs</a></li>
          <li class="nav-item"><a class="nav-link" href="https://getbootstrap.com/docs/5.3/" target="_blank" rel="noopener">Bootstrap docs</a></li>
          <li class="nav-item"><a class="nav-link" href="https://github.com/" target="_blank" rel="noopener">GitHub</a></li>
        </ul>
      </div>
    </div>
  </header>

  <main class="container-xl py-5" id="content">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <div class="text-center mb-5">
          <p class="display-6 fw-semibold text-primary mb-2">WindStrap</p>
          <h1 class="display-4 fw-light mb-3">Documentation</h1>
          <p class="lead text-body-secondary mx-auto" style="max-width: 40rem;">
            Bootstrap 5.3.8, translated 1:1 into Tailwind CSS with the
            <code>@apply</code> directive. Rebuilt documentation follows the
            official Bootstrap docs layout. Getting started, Extend and About
            are intentionally not translated.
          </p>
          <a class="btn btn-primary btn-lg" href="components/buttons.html">Get started with Components</a>
        </div>

        <div class="row g-4">
          ${sectionCards}
        </div>

        <div class="bd-callout bd-callout-info mt-5">
          <h5>What is translated?</h5>
          <p class="mb-0">Every rendered example uses the exact Bootstrap class names rebuilt from Tailwind utilities. Interactive behavior (dropdowns, modals, collapse, …) uses Bootstrap’s JavaScript bundle — the WindStrap translation covers the CSS layer.</p>
        </div>
      </div>
    </div>
  </main>

  <footer class="bd-footer py-5 mt-5 mt-auto">
    <div class="container-xl">
      <p class="small text-body-secondary mb-0">WindStrap — Bootstrap 5.3.8 translated 1:1 into Tailwind CSS via the <code>@apply</code> directive. Docs content licensed <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>.</p>
    </div>
  </footer>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), index);
  console.log('✔ docs/index.html');
}

build();
