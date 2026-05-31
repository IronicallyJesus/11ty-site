# 11ty Portfolio v3.0 — Industrial Redesign Plan

> **For Hermes:** Incremental page-by-page rebuild. One branch, merge each completed page.

**Goal:** Full visual and structural redesign — industrial/utilitarian aesthetic, network engineering themed, no fluff.

**Architecture:** Same Eleventy + Tailwind foundation. Gut the CSS, rebuild the design system around solid panels, data tables, status indicators, and clean typography. Restructure pages for a tighter content hierarchy.

**Design direction:**
- **Color:** Dark charcoal/black backgrounds, amber (#f59e0b) primary accent (think: console warning light), muted green (#10b981) secondary (status LED). No gradients, no glassmorphism, no blur effects.
- **Typography:** IBM Plex Sans for body, Red Hat Mono for code/data/meta labels. Larger headings, tighter line-heights.
- **Cards/Panels:** Solid backgrounds with thin borders, subtle shadows — no backdrop-blur. Think server faceplate, not frosted glass.
- **Status indicators:** Colored dots, uptime-style timestamps, label/value pairs like CLI output.
- **Navigation:** Minimal top bar, monospace-style active states, breadcrumb-style hierarchy.

**Tech Stack:** Eleventy 3, Tailwind CSS 3, Nunjucks, plain JS (no frameworks)

---

## New Page Structure

| Current | → | v3.0 | Notes |
|---|---|---|---|
| Home (index.md) | → | **Home** | Hero + "what I do" + featured posts/projects + contact CTA |
| About (about.md) | → | **About** | Keep, restyle, add status "currently" section |
| Experience (experience.njk) | → | **merged into About** | Career timeline lives on About page |
| Projects (projects.njk) | → | **Projects** | Keep data-driven, restyle to rack-elevation card grid |
| Blog listing (blog.njk) | → | **Blog** | Restyle listing, keep tag system |
| Blog tag pages (blog/tag.njk) | → | **Blog tags** | Keep, restyle |
| Blog posts (3 posts) | → | **Blog posts** | Restyle layout |
| Resume (resume.md) | → | **Resume** | Keep PDF, restyle embed page |
| Privacy (privacy.md) | → | **Privacy** | Keep, minimal restyle |
| 404 | → | **404** | Restyle |
| — | → | **NEW: Lab** | Homelab dashboard-inspired page showing infrastructure status |

---

## Implementation Order

### Phase 1: Design System Foundation
Rebuild `input.css` with the new design tokens and component styles. This is the backbone everything else sits on.

### Phase 2: Layout Shell
Rebuild `base.njk`, `header.njk`, `footer.njk` — the chrome that wraps every page. This immediately transforms the whole site visually.

### Phase 3: Pages (incremental, one per merge)
1. **Home** — highest impact, sets the tone
2. **About** (merged with Experience)
3. **Projects**
4. **Blog** (listing + posts + tag pages)
5. **Resume**
6. **Lab** (new)
7. **Privacy + 404**

---

## Task: Phase 1 — Design System Foundation

### Task 1: Audit current CSS to identify what to keep vs replace

**Objective:** Understand what's in `input.css` so we know what to gut vs what to preserve (fonts, variables, some utilities).

**Files:**
- Read: `src/css/input.css`

**Step 1: Read and categorize**
- Font declarations → KEEP
- CSS variables (`:root`, `.light-theme`) → REWRITE
- Component styles (`.card`, `.btn`, `.glass-card`, etc.) → REWRITE
- Article typography → SIMPLIFY
- Utility classes (`.muted-text`, `.article-text`, etc.) → REWRITE
- Prism theme tokens → KEEP

**Step 2: Note decisions in plan**
```
KEEP: fonts, prism tokens, selection styles
REWRITE: everything else
```

---

### Task 2: Write new CSS variable tokens (dark + light)

**Objective:** Define the color palette and spacing tokens for the industrial theme.

**Files:**
- Modify: `src/css/input.css` (replace `:root` and `.light-theme` blocks)

**New token structure:**

```css
:root {
    /* Background hierarchy */
    --bg-primary: #0a0e14;        /* Deepest background */
    --bg-secondary: #11161d;      /* Cards, panels */
    --bg-tertiary: #1a1f2b;       /* Elevated surfaces */
    --bg-input: #161b24;          /* Form inputs */

    /* Text hierarchy */
    --text-primary: #e6edf3;      /* Headings, body */
    --text-secondary: #8b949e;    /* Meta, captions, muted */
    --text-tertiary: #484f58;     /* Disabled, subtle */

    /* Accent — industrial amber (warning light) */
    --accent: #f59e0b;
    --accent-hover: #fbbf24;
    --accent-muted: rgba(245, 158, 11, 0.15);

    /* Secondary — status green (LED indicator) */
    --green: #10b981;
    --green-muted: rgba(16, 185, 129, 0.15);

    /* Status colors */
    --red: #ef4444;
    --blue: #3b82f6;
    --yellow: #f59e0b;

    /* Borders */
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(245, 158, 11, 0.3);

    /* Typography */
    --font-body: 'IBM Plex Sans', sans-serif;
    --font-mono: 'Red Hat Mono', monospace;
    --font-size-sm: 0.8125rem;
    --font-size-base: 0.9375rem;
    --font-size-lg: 1.0625rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 2rem;
    --font-size-4xl: 2.5rem;

    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;

    /* Radii */
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);

    /* Layout */
    --max-width: 1100px;
    --header-height: 56px;
    --nav-width: 240px;

    /* Prism tokens — keep current */
    /* ... */
}

.light-theme {
    --bg-primary: #f6f8fa;
    --bg-secondary: #ffffff;
    --bg-tertiary: #f0f2f5;
    --bg-input: #ffffff;
    --text-primary: #1a1f2b;
    --text-secondary: #57606a;
    --text-tertiary: #8b949e;
    --accent: #d97706;
    --accent-hover: #b45309;
    --accent-muted: rgba(217, 119, 6, 0.1);
    --green: #059669;
    --green-muted: rgba(5, 150, 105, 0.1);
    --border: rgba(0, 0, 0, 0.08);
    --border-hover: rgba(217, 119, 6, 0.3);
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

**Verification:** CSS parses without errors.

---

### Task 3: Write base element styles

**Objective:** Replace current `body`, `a`, headings with the new industrial look.

**Files:**
- Modify: `src/css/input.css`

**Code:**

```css
body {
    font-family: var(--font-body);
    font-size: var(--font-size-base);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.15s ease;
}
a:hover { color: var(--accent-hover); }

h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
}
h1 { font-size: var(--font-size-4xl); letter-spacing: -0.02em; }
h2 { font-size: var(--font-size-3xl); letter-spacing: -0.01em; }
h3 { font-size: var(--font-size-2xl); }
h4 { font-size: var(--font-size-xl); }
```

---

### Task 4: Build new component classes

**Objective:** Replace `.card`, `.btn`, `.glass-card`, `.tag`, `.nav-link` with industrial equivalents.

**Files:**
- Modify: `src/css/input.css`

**Code:**

```css
/* Panel — replaces .card */
.panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    box-shadow: var(--shadow-sm);
}

/* Panel with accent left border (rack-unit style) */
.panel-accent {
    border-left: 3px solid var(--accent);
}

/* Button — replaces .btn */
.btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 0.5rem 1.25rem;
    font-size: var(--font-size-sm);
    font-weight: 600;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid var(--accent);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--accent);
    cursor: pointer;
    transition: all 0.15s ease;
}
.btn:hover {
    background: var(--accent);
    color: var(--bg-primary);
}

/* Tag/badge — replaces tag pills */
.tag {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    padding: 0.15rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    background: var(--bg-tertiary);
}

/* Status dot */
.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
}
.status-dot.active { background: var(--green); }
.status-dot.warning { background: var(--accent); }
.status-dot.offline { background: var(--text-tertiary); }

/* Data table (for skills, certs, etc.) */
.data-table {
    width: 100%;
    border-collapse: collapse;
}
.data-table th {
    font-family: var(--font-mono);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    text-align: left;
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--border);
}
.data-table td {
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--border);
    font-size: var(--font-size-base);
}

/* Label-value pair (CLI output style) */
.kv {
    display: flex;
    gap: var(--space-sm);
    font-size: var(--font-size-sm);
    line-height: 1.6;
}
.kv-label {
    font-family: var(--font-mono);
    color: var(--text-secondary);
    min-width: 120px;
    flex-shrink: 0;
}
.kv-value {
    color: var(--text-primary);
}
```

---

### Task 5: Gut old component styles

**Objective:** Remove ALL old component styles from `input.css` — `.card`, `.glass-card`, `.btn`, `.btnalt`, `.hero-overlay`, `.hero-title-grad`, `.page-title`, `.section-header`, `.card-heading`, `.article-text`, `.muted-text`, `.accent-primary`, `.accent-secondary`, `.meta-info`, `.status-pill`, `.separator`, `.callout-box`, `.callout-title`, `.skill-badge`, `.card-icon-bg`, `.card-icon-static`, `.timeline`, `.like-icon` old styles, `.nav-link` old implementation, old article styles, old scroll-to-top styles.

**Files:**
- Modify: `src/css/input.css`

**Step 1:** Delete everything between the font declarations and the mermaid styles, except Prism token variables.

**Step 2:** Verify the file still has: fonts, new variables, new components, prism, mermaid styles.

**Verification:** `git diff --stat src/css/input.css` shows significant reduction.

---

### Task 6: Remove old Tailwind classes used in templates

**Objective:** Go through every template and replace old utility classes with the new component classes.

**Files:**
- Modify: `src/_includes/layouts/base.njk`
- Modify: `src/_includes/layouts/page.njk`
- Modify: `src/_includes/layouts/blogpost.njk`
- Modify: `src/_includes/partials/header.njk`
- Modify: `src/_includes/partials/footer.njk`
- Modify: `src/_includes/partials/consent.njk`
- Modify: `src/_includes/components/blog-header.njk`
- Modify: `src/_includes/components/experience-card.njk`
- Modify: `src/_includes/components/resume-cta.njk`
- Modify: `src/index.md`
- Modify: `src/about.md`
- Modify: `src/experience.njk`
- Modify: `src/projects.njk`
- Modify: `src/blog.njk`
- Modify: `src/blog/tag.njk`
- Modify: `src/resume.md`
- Modify: `src/privacy.md`
- Modify: All blog posts in `src/blog/`

**Key replacements:**
- `class="card ..."` → `class="panel"`
- `class="glass-card"` → `class="bg-secondary border-b border-border"`
- `class="btn"` → `class="btn"` (keep class name, style changes)
- `class="accent-primary"` → `class="text-accent"` (if we add a Tailwind utility) or inline
- `class="article-text"` → no class needed (body color handles it)
- `class="muted-text"` → `class="text-secondary"`
- `class="text-accent-primary"` → doesn't exist anymore, use `style="color: var(--accent)"` or Tailwind `text-amber-500`

**Step 1:** Start with `base.njk` + `header.njk` + `footer.njk`
**Step 2:** Then layouts (`page.njk`, `blogpost.njk`)
**Step 3:** Then individual pages one by one

**Verification:** `npx @11ty/eleventy` builds without errors. No `accent-primary` or `card` or `glass-card` in output HTML.

---

### Task 7: Build and verify Phase 1 compiles

**Objective:** Make sure the site builds with all Phase 1 changes before proceeding to Phase 2.

**Step 1:** Run `npx @11ty/eleventy`
**Step 2:** Check for 0 errors
**Step 3:** `git add -A && git commit -m "feat(v3): industrial design system foundation"`
**Step 4:** Push and create PR

---

## Phase 2: Layout Shell

(To be detailed after Phase 1 merges)

## Phase 3: Pages

(To be detailed as we go — Home first, then About, etc.)
