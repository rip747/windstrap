# WindStrap

**Bootstrap 5.3.8 → Tailwind CSS**, translated 1:1 by composing Tailwind utilities with the **`@apply`** directive.

WindStrap is a drop-in stylesheet that gives you Bootstrap's exact class names (`.btn-primary`, `.col-md-6`, `.d-flex`, `.text-bg-success`, …) built on top of Tailwind's utility engine — so you get Bootstrap's API with Tailwind's pipeline (JIT output, PurgeCSS-style tree-shaking, familiar utility syntax for custom tweaks).

## How it works

Every Bootstrap class is re-declared as plain CSS that pulls in Tailwind utilities via `@apply`:

```css
/* src/sections/buttons.css */
.btn-primary {
  @apply bg-primary text-white border-primary
    hover:bg-[#0b5ed7] hover:border-[#0a58ca]
    active:bg-[#0a58ca] active:border-[#0a53be]
    active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.125)];
  --bs-btn-focus-shadow-rgb: 49, 132, 253;
}
```

```css
/* src/generated/grid.css  (machine-generated, but real @apply CSS) */
.col-sm-6 { @apply sm:w-1/2; }          /* → @media (min-width: 576px) { width: 50% } */
.mt-sm-3 { @apply sm:mt-[1rem] !important; }
.d-md-none { @apply md:hidden !important; }
```

To make the responsive variants line up **exactly** with Bootstrap, the Tailwind theme's `screens` are set to Bootstrap's breakpoints:

| Name | Bootstrap | Tailwind `screens` |
|------|-----------|--------------------|
| `sm` | 576px | 576px |
| `md` | 768px | 768px |
| `lg` | 992px | 992px |
| `xl` | 1200px | 1200px |
| `xxl` | 1400px | 1400px |

Bootstrap's full CSS custom-property design tokens (`--bs-primary`, `--bs-body-bg`, …) are preserved in `src/sections/root.css`, including the `[data-bs-theme="dark"]` overrides, so Bootstrap's theming and dark mode keep working.

## What's translated

- **Layout** — containers, `.row`, `.col-*`, `.col-sm…xxl-*`, `.row-cols-*`, `.offset-*`, gutters (`.g-*`, `.gx-*`, `.gy-*`) across all 6 breakpoints
- **Content** — headings, `.display-*`, `.lead`, lists, blockquotes, images, figures, tables (incl. striped/hover/bordered/thematic variants + responsive wrappers)
- **Forms** — `.form-control` (± sm/lg/plaintext/color), `.form-select`, checks/radios/switches, `.form-range`, `.form-floating`, `.input-group`, validation states
- **Components** — buttons (all solid/outline/link variants, sizes, groups), dropdowns, nav & navbar (incl. `.navbar-expand-*`), cards, accordion, breadcrumb, pagination, badges, alerts, progress, list-groups (incl. thematic + horizontal), close buttons, toasts
- **Overlays** — modal (incl. fullscreen variants), tooltips, popovers, carousel, spinners, offcanvas, placeholders
- **Helpers** — `.text-bg-*`, `.link-*` helpers, focus rings, icon links, ratios, fixed/sticky positioning, h/v-stack, `.visually-hidden`, `.stretched-link`, `.text-truncate`, `.vr`
- **Utilities** — alignment, float, object-fit, opacity, overflow, display, shadows, position/translate, borders, sizing, flexbox (all justify/align/order utilities), spacing (`m/p/g` incl. `auto`), typography (`.fs-*`, `.fw-*`, `.lh-*`, text transform/decoration), text/background colors incl. subtle & emphasis variants and `*-opacity` modifiers, user-select, rounded corners (all sides/sizes), visibility, z-index
- **Responsive variants** — every utility family at `sm`/`md`/`lg`/`xl`/`xxl`, plus `.d-print-*`

A few classes (e.g. `.border`, `.m-0`, `.w-auto`, `.overflow-hidden`, `.shadow`, `.opacity-25`, `.rounded`, `.visible`) would create a circular dependency if the class name matched the applied utility name, so they are written as the equivalent raw declaration — their values are byte-for-byte Bootstrap's.

## Project layout

```
WindStrap/
├─ .github/workflows/pages.yml  # GitHub Pages build + deploy
├─ tailwind.config.js        # Bootstrap screens + palette, fonts
├─ postcss.config.js
├─ scripts/
│  ├─ generate-utilities.js  # generates the repetitive grid/utility/responsive CSS
│  └─ build-docs.js          # assembles the docs site from site/ fragments
├─ src/
│  ├─ windstrap.css          # entry point (imports Tailwind + sections)
│  └─ sections/              # hand-authored @apply translations
│     ├─ root.css            # design tokens + reboot
│     ├─ layout.css          # containers, row base
│     ├─ content.css         # typography, images, tables
│     ├─ forms.css
│     ├─ buttons.css
│     ├─ nav.css
│     ├─ components.css
│     ├─ overlays.css
│     └─ helpers.css
│  └─ generated/             # produced by scripts/generate-utilities.js
│     ├─ grid.css
│     ├─ utilities.css
│     └─ responsive.css
├─ site/                     # docs sources (layout shell + content fragments)
│  ├─ _layout.html
│  └─ content/               # one folder per section
│     ├─ customize/          # 7 pages
│     ├─ layout/             # 8 pages
│     ├─ content/            # 6 pages
│     ├─ forms/              # 9 pages
│     ├─ components/         # 23 pages
│     ├─ helpers/            # 12 pages
│     └─ utilities/          # 20 pages
├─ docs/                     # built docs site (85 pages)
│  ├─ index.html             # section overview
│  ├─ css/docs.css           # docs layout (mirrors getbootstrap.com)
│  ├─ js/docs.js             # copy buttons, TOC scrollspy, demo init
│  └─ <section>/*.html       # one folder per translated section
├─ index.html                # redirects to docs/index.html
├─ demo.html                 # demo of the translated classes
└─ dist/
   └─ windstrap.css          # compiled output
```

## Build

```bash
npm install
npm run build      # regenerate + compile  →  dist/windstrap.css
npm run docs       # assemble docs pages   →  docs/
npm run build:all  # both
npm run watch      # rebuild CSS on change
```

Use it by linking the compiled file:

```html
<link rel="stylesheet" href="dist/windstrap.css">
```

## Docker (no Node/npm on your machine)

The project ships with a `Dockerfile` + `compose.yaml` so you can build it
entirely inside a container — no need to install Node.js or npm locally.

```bash
# one-time image build (installs node_modules inside the container)
docker compose build

# run the npm scripts through Docker
docker compose run --rm build      # -> dist/windstrap.css
docker compose run --rm docs       # -> docs/ pages
docker compose run --rm build-all  # both
docker compose up watch            # watch mode (foreground; Ctrl+C to stop)
```

On Windows/PowerShell you can use the convenience wrapper (same commands):

```powershell
.\windstrap.ps1            # build:all
.\windstrap.ps1 docs       # -> docs/ pages
.\windstrap.ps1 watch
.\windstrap.ps1 shell      # open a shell inside the container
```

How it works: your project folder is bind-mounted at `/app`, and
`node_modules` lives in a named Docker volume — so generated files
(`dist/`, `docs/`) appear on your disk while the container keeps its own
Linux-installed dependencies. The image is `node:20-alpine` (Node 20, matching
the project's tooling).

## Publish to GitHub Pages

The repo ships with a GitHub Actions workflow (`.github/workflows/pages.yml`)
that builds the CSS + docs and publishes them to GitHub Pages on every push to
`main` (it also builds the docs from source, so `site/` stays the source of
truth).

1. Push the repo to GitHub.
2. In the repo go to **Settings → Pages → Source** and choose
   **“GitHub Actions”** (do **not** pick “Deploy from a branch” — the
   workflow handles the build and deploy itself).
3. The first deploy publishes the site to
   `https://<user>.github.io/<repo>/`.

How it's served: the workflow stages `index.html`, `demo.html`, `dist/` and
`docs/` into the Pages root, mirroring the repo layout. `index.html` redirects
straight to `docs/index.html`, and because `dist/` is included at the root,
all the docs pages keep their styling (their `../../dist/windstrap.css`
relative paths resolve correctly).

Open `docs/index.html` in a browser to browse the translated docs — all of
**Customize** (7), **Layout** (8), **Content** (6), **Forms** (9),
**Components** (23), **Helpers** (12) and **Utilities** (20) are translated
(85 pages, `docs/<section>/<page>.html`). Getting Started, Extend and About are
intentionally not translated.

> The bundled `dist/windstrap.css` is the full translation. Because every class is defined via `@apply`, Tailwind only emits rules that are actually used — if you want a trimmed build, add your own HTML/JS files to `content` in `tailwind.config.js` (keep the `.css` files out of `content`, see the note there).

## Notes & caveats

- Tailwind `screens` are redefined to Bootstrap's breakpoints — this is intentional and scoped to this stylesheet.
- Component color systems (buttons, alerts, list-groups, `text-bg-*`, links) intentionally reuse Bootstrap's RGB/token CSS variables so `--bs-*-opacity` modifiers and `[data-bs-theme]` dark mode keep working.
- Pseudo-elements, keyframes, and child-targeting selectors (e.g. `.row-cols-2 > *`) are written as plain CSS — `@apply` cannot express those.
- The `docs/` site is the official docs layout rebuilt on WindStrap. It includes Bootstrap's JS bundle (and Popper) so interactive demos (dropdowns, modals, collapse, carousel…) work — the WindStrap translation itself covers the CSS layer only.

## License

MIT
