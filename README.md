# Nikhil Gautam — Portfolio

Personal portfolio website for Nikhil Gautam, Backend Engineer.

**Live:** [nikhil-gautam-dev.github.io](https://nikhil-gautam-dev.github.io)

---

## Stack

- **Framework:** [Astro](https://astro.build) — static site generation
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Content:** Astro Content Collections + MDX
- **Deployment:** GitHub Pages via GitHub Actions

---

## Local Development

```bash
npm install
npm run dev        # Start dev server at localhost:4321
npm run build      # Build for production
npm run preview    # Preview production build locally
npx astro check    # TypeScript type checking
```

---

## Project Structure

```text
src/
├── components/    # Reusable Astro components
├── content/
│   └── blog/     # Blog posts (.md / .mdx)
├── data/
│   ├── site.ts       # Central site config (email, URLs, name)
│   ├── projects.ts   # Project data
│   └── experience.ts # Work experience data
├── layouts/
│   └── BaseLayout.astro
├── pages/         # Routes
└── styles/
    └── global.css
```

---

## Updating Content

All personal content is stored in data files — update in one place, reflected everywhere:

| File | Content |
|------|---------|
| `src/data/site.ts` | Name, email, GitHub, LinkedIn, site URL |
| `src/data/projects.ts` | Project details, tech, links |
| `src/data/experience.ts` | Work experience, dates, responsibilities |
| `src/content/blog/` | Blog posts in Markdown/MDX |

### Before going live, update:
- `src/data/site.ts` — replace `your-email@gmail.com` and LinkedIn placeholder
- `src/data/experience.ts` — replace the `[2024]` employment start date
- `src/data/projects.ts` — add GitHub repository links when repos are public

---

## Blog

Add new posts to `src/content/blog/` as `.md` or `.mdx` files with the following frontmatter:

```yaml
---
title: "Understanding MongoDB Transactions"
description: "A deep-dive into multi-document ACID transactions in MongoDB."
date: 2026-09-01
tags: ["mongodb", "databases", "backend"]
category: "Databases"
draft: false
readingTime: 8
---
```

---

## Deployment

Deployment is automatic — push to `main` and GitHub Actions will build and deploy to GitHub Pages.

**GitHub Pages setup required:**
1. Go to repository Settings → Pages
2. Set source to **GitHub Actions**

---

## License

MIT
