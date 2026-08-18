# Nikhil Gautam Portfolio - Complete Build Specification

## 1. Project Objective

Build a production-quality personal portfolio website for **Nikhil Gautam**, positioned primarily as a **Backend Engineer**.

The portfolio must not feel like a generic developer template. It should feel like a carefully designed personal engineering publication: minimal, editorial, typography-driven, technically credible, fast, responsive, and easy to extend later with a full technical blogging system.

The visual direction should be inspired by the provided portfolio reference image:

- Minimal editorial aesthetic
- Warm/off-white background
- Near-black typography
- Orange as the primary accent
- Very large display typography
- Strong whitespace
- Thin borders/dividers
- Restrained use of cards
- Subtle, purposeful motion
- High visual polish without excessive decoration

Do **not** copy the reference website's exact design, branding, text, or assets. Use it only as visual inspiration.

The final result should communicate:

> **This is a backend engineer who builds real systems, understands architecture, and likes to write about what he learns.**

---

# 2. Primary Technology Stack

Use the following stack unless there is a strong technical reason not to:

- **Astro**
- **TypeScript**
- **Tailwind CSS**
- **Markdown / MDX**
- **Astro Content Collections**
- **GitHub Actions**
- **GitHub Pages**

The site should be statically generated wherever possible.

There should be no backend server required for the initial portfolio.

The architecture should however make it straightforward to introduce dynamic services later if needed.

---

# 3. Hosting Target

The primary deployment target is GitHub Pages.

The intended user site URL is:

```text
https://<github-username>.github.io
```

The repository is expected to follow the GitHub user-site convention:

```text
<github-username>.github.io
```

Deployment should happen automatically through GitHub Actions whenever changes are pushed to the main branch.

The implementation must be compatible with GitHub Pages' static hosting model.

Do not introduce server-side functionality that requires a persistent Node.js server.

---

# 4. High-Level Site Architecture

The initial site should contain:

```text
/
├── Home
├── Work
├── About
├── Blog
└── Contact
```

The homepage should contain the major portfolio sections rather than requiring every section to have its own route.

Recommended routes:

```text
/
 /work
 /about
 /blog
 /contact
```

Blog routes will eventually follow:

```text
/blog/<slug>
```

Example:

```text
/blog/understanding-mongodb-transactions
/blog/building-centralized-authentication
```

---

# 5. Core Design Philosophy

The site should follow these principles.

## 5.1 Typography over decoration

The design should derive most of its visual identity from typography, spacing, layout, and hierarchy.

Avoid:

- excessive gradients
- excessive glassmorphism
- giant decorative blobs
- unnecessary 3D effects
- generic stock illustrations
- excessive shadows
- excessive rounded cards
- colorful technology-logo walls

## 5.2 Minimal color palette

Primary palette:

- Warm/off-white background
- Near-black text
- Muted gray for secondary information
- Orange accent

Use the orange accent strategically for:

- section markers
- small labels
- active states
- links
- buttons
- hover states
- decorative symbols

Do not make the entire site orange.

## 5.3 Editorial layout

Use:

- generous margins
- large headings
- horizontal rules
- numbered sections
- small uppercase metadata
- asymmetrical layouts where appropriate
- strong alignment
- intentional whitespace

The website should feel closer to a high-end editorial publication than a SaaS landing page.

---

# 6. Global Layout

The site should have a consistent global shell.

Recommended structure:

```text
┌──────────────────────────────────────────────┐
│ NG       WORK   ABOUT   BLOG   CONTACT       │
├──────────────────────────────────────────────┤
│                                              │
│                 PAGE CONTENT                 │
│                                              │
├──────────────────────────────────────────────┤
│ FOOTER                                       │
└──────────────────────────────────────────────┘
```

Use a consistent maximum content width.

The content should not stretch edge-to-edge on large screens.

Recommended conceptual layout:

```text
viewport
│
├── outer horizontal padding
│
└── max-width content container
```

The exact values should be determined responsively.

---

# 7. Navigation

The navigation should be minimal.

Desktop:

```text
NG / NIKHIL GAUTAM                         WORK
                                           ABOUT
                                           BLOG
                                           CONTACT
```

A cleaner implementation can be:

```text
NG

NIKHIL GAUTAM

WORK    ABOUT    BLOG    CONTACT
```

The exact visual arrangement can be refined during implementation.

## Navigation requirements

- Fixed or sticky navigation is acceptable.
- It must not consume excessive vertical space.
- Logo/name should link to `/`.
- Active navigation state should be visually clear.
- Hover states should be subtle.
- Keyboard navigation must work.
- Focus states must be visible.
- Mobile navigation must be implemented properly.

## Mobile navigation

On smaller screens:

```text
NG                                      MENU
```

Opening the menu should reveal:

```text
WORK
ABOUT
BLOG
CONTACT
```

Use a simple animated menu.

Do not over-engineer the mobile navigation.

---

# 8. Hero Section

The hero is the most visually important section.

The hero should immediately establish:

1. Name
2. Professional identity
3. What the person builds
4. Primary action

Suggested visual structure:

```text
✳ BACKEND ENGINEER · BUILDER · PROBLEM SOLVER


NIKHIL
GAUTAM


I build backend systems, APIs and products
with a focus on reliability, scalability and
clean architecture.


VIEW WORK →       GITHUB ↗
```

Do not blindly copy this exact wording if better wording can be produced, but preserve the information hierarchy.

## Hero requirements

The hero must include:

### Identity label

Example:

```text
✳ BACKEND ENGINEER · BUILDER · PROBLEM SOLVER
```

This should be small and uppercase.

### Name

Display:

```text
NIKHIL
GAUTAM
```

Use very large typography.

The name should be one of the strongest visual elements on the entire website.

### Short positioning statement

The statement should communicate backend engineering and system-building.

Avoid generic statements such as:

- "Passionate developer"
- "Tech enthusiast"
- "Coding ninja"
- "Full-stack wizard"

### Primary actions

At minimum:

```text
VIEW WORK
```

and:

```text
GITHUB
```

A secondary LinkedIn link may also be included.

---

# 9. Hero Animation

The hero can have a subtle entrance animation.

Possible sequence:

1. Small identity label fades/slides in.
2. First name reveals.
3. Last name reveals.
4. Description fades in.
5. CTA buttons appear.

Animation must remain fast.

Do not make users wait for content.

Accessibility:

- Respect `prefers-reduced-motion`.
- Users with reduced motion enabled should receive a static version.

---

# 10. Intro / Statement Section

After the hero, introduce a strong statement.

Concept:

```text
I LIKE BUILDING THINGS
THAT ARE HARD TO BREAK.
```

Then a short paragraph.

The paragraph should describe Nikhil as a backend engineer interested in:

- reliable systems
- scalable APIs
- databases
- authentication
- distributed systems
- infrastructure
- architecture

Do not make this section excessively long.

Its purpose is positioning, not biography.

---

# 11. Selected Work Section

This is one of the most important sections.

Heading:

```text
SELECTED WORK
```

Projects should be presented as engineering work, not as generic cards.

Initial project candidates:

1. Centralized Authentication Service
2. HealthTech / Medoc Backend Work
3. PhysXplore
4. Connectify
5. BookNest
6. Experiments / Developer Tools

The final project list should be curated rather than exhaustive.

---

# 12. Project Data Model

Projects should be represented as structured data rather than hardcoded repeatedly throughout components.

Conceptual structure:

```ts
type Project = {
  title: string;
  slug: string;
  number: string;
  shortDescription: string;
  description?: string;
  technologies: string[];
  category: string;
  featured: boolean;
  links?: {
    github?: string;
    live?: string;
  };
  image?: string;
};
```

The exact implementation can use Astro content collections or TypeScript data files.

Prefer content/data separation.

---

# 13. Project 01 - Centralized Authentication Service

This should be one of the strongest technical projects.

Concept:

```text
CENTRALIZED AUTHENTICATION SERVICE
```

Describe it as an authentication infrastructure project for multiple applications.

Relevant concepts:

- JWT
- JWKS
- RSA public/private key cryptography
- centralized authentication
- token verification
- service-to-service verification
- key management
- reusable authentication utilities

Do not claim production capabilities that have not actually been implemented.

The project page should explain:

### Problem

Multiple applications can independently implement authentication, leading to duplication and inconsistent security behavior.

### Approach

Centralize authentication and allow dependent services to verify tokens using public keys/JWKS.

### Architecture

Illustrate something similar to:

```text
                    AUTH SERVICE
                         │
                 JWT / JWKS / KEYS
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
         OPD         PHARMACY         LAB
```

Only include architecture details that are actually applicable.

---

# 14. Project 02 - HealthTech Backend

This should represent professional backend engineering experience.

Use careful wording around proprietary/company information.

Do not expose:

- private source code
- secrets
- internal URLs
- credentials
- patient information
- proprietary implementation details
- confidential architecture
- internal business logic that should not be public

Describe the work at a high level.

Potential areas:

- healthcare APIs
- appointment workflows
- inventory
- pharmacy
- billing
- document management
- MongoDB
- Redis
- RabbitMQ
- authentication
- transactions
- performance optimization
- asynchronous processing

Example positioning:

```text
HEALTHTECH BACKEND

Backend systems supporting healthcare
workflows including appointments,
inventory, billing and document management.
```

This should emphasize engineering problems and responsibilities rather than company marketing.

---

# 15. Project 03 - PhysXplore

Describe PhysXplore as an interactive physics learning application.

Possible technologies:

- React Native
- Node.js
- Express
- MongoDB

Explain:

- educational purpose
- interactive physics concepts
- mobile application
- backend/API architecture

Do not overstate scale.

---

# 16. Project 04 - Connectify

Describe Connectify as an application demonstrating:

- JavaScript
- Express
- MongoDB
- REST APIs
- frontend/backend integration

Focus on what was learned and built.

---

# 17. Project 05 - BookNest

Describe BookNest as a backend/API project.

Relevant technologies:

- Node.js
- Prisma
- PostgreSQL
- REST APIs

Use this project to demonstrate relational database and ORM experience.

---

# 18. Experiments Section

Instead of showing every small project, provide a section:

```text
EXPERIMENTS
```

This can contain smaller projects and technical experiments.

Examples:

- CLI tools
- AI API experiments
- ESP32/hardware projects
- developer utilities
- database experiments
- performance experiments

This section communicates curiosity without making the portfolio feel cluttered.

---

# 19. Project Detail Pages

Featured projects may eventually have dedicated pages.

Example:

```text
/work/authentication-service
```

A project detail page should contain:

```text
PROJECT TITLE

Short description

────────────────────────

OVERVIEW

PROBLEM

APPROACH

ARCHITECTURE

TECHNICAL DECISIONS

CHALLENGES

RESULT

TECHNOLOGIES

LINKS
```

The detail page should prioritize engineering reasoning.

Avoid writing generic marketing copy.

---

# 20. Experience Section

Create an experience section on the homepage.

Concept:

```text
EXPERIENCE

2024 — PRESENT
MEDOC HEALTH IT

Backend Engineering

Building and maintaining backend systems
for healthcare applications.

TypeScript · Node.js · MongoDB · Redis · RabbitMQ
```

The exact dates must be verified before publishing.

Do not invent employment dates.

The experience section should remain concise.

For detailed information, provide a resume link if available.

---

# 21. Technology / Stack Section

Do not create skill percentage bars.

Do not write:

```text
Node.js 95%
MongoDB 90%
```

Instead group technologies semantically.

Example:

```text
LANGUAGES
TypeScript
JavaScript
Python
Java
C++

BACKEND
Node.js
Express
NestJS
REST APIs

DATABASES
MongoDB
PostgreSQL
Redis

MESSAGING
RabbitMQ

INFRASTRUCTURE
Docker
GitHub Actions
Jenkins

OTHER
JWT
JWKS
Prisma
Git
```

Only include technologies that accurately represent current experience.

---

# 22. Engineering Interests

Add a concise section:

```text
ENGINEERING INTERESTS

01  Distributed Systems
02  Backend Architecture
03  Authentication & Security
04  Database Design
05  Event-Driven Systems
06  Infrastructure
07  Developer Tools
```

This section helps communicate career direction.

---

# 23. About Section

The About section should not read like a resume.

It should be personal but professional.

Potential structure:

```text
ABOUT

I'm Nikhil, a backend engineer interested in
building reliable systems and understanding
how software works beneath the surface.

I primarily work with TypeScript, Node.js,
databases and backend infrastructure, with
a particular interest in distributed systems,
authentication and system design.
```

Include:

- engineering focus
- interests
- current learning areas
- personality through engineering interests

Avoid unnecessary personal details.

---

# 24. Resume

A resume link can be included.

Example:

```text
VIEW RESUME ↗
```

The resume should be a separate PDF.

Do not embed the entire resume into the homepage.

The portfolio and resume should complement each other.

---

# 25. Blog Preview

The full blog system will be implemented separately, but the homepage should reserve space for it.

Heading:

```text
LATEST WRITING
```

Display 3 recent articles.

Each item:

```text
Understanding MongoDB Transactions
DATABASES · AUG 2026 · 8 MIN READ
```

The section ends with:

```text
VIEW ALL ARTICLES →
```

The homepage should retrieve the latest posts from the future blog content collection rather than hardcoding them.

If there are no posts yet, provide a graceful empty state.

---

# 26. Contact Section

Keep the contact section simple.

Concept:

```text
LET'S BUILD SOMETHING.

Have a project, opportunity or
interesting problem?

EMAIL ME ↗

GITHUB ↗
LINKEDIN ↗
```

No contact form is required for version 1.

Use direct links.

Email address should be configurable from one central site configuration file.

---

# 27. Footer

Footer should contain:

```text
NG

NIKHIL GAUTAM
BACKEND ENGINEER

GitHub
LinkedIn
Email

© 2026 Nikhil Gautam
Built with Astro
```

Avoid excessive footer content.

---

# 28. Typography

Typography is critical.

Use one strong display font and one highly readable body font, or a carefully chosen font family with multiple weights.

Requirements:

- Large display heading
- Strong contrast between display and metadata
- Uppercase metadata
- Letter spacing for labels
- Comfortable reading width for paragraphs
- Responsive font sizes

Do not use too many fonts.

The design should feel intentional.

---

# 29. Responsive Design

The site must be fully responsive.

Required breakpoints:

- small mobile
- large mobile
- tablet
- laptop
- desktop
- large desktop

Do not simply shrink the desktop layout.

The composition should adapt.

On mobile:

- navigation becomes compact
- hero typography scales down
- multi-column sections become single-column
- project metadata remains readable
- horizontal overflow must never occur
- buttons become easy to tap
- large decorative elements should be reduced

---

# 30. Accessibility

Accessibility is required.

Implement:

- semantic HTML
- correct heading hierarchy
- keyboard navigation
- visible focus states
- sufficient contrast
- alt text for meaningful images
- decorative images marked appropriately
- accessible navigation
- accessible mobile menu
- reduced-motion support
- buttons for button actions
- anchors for navigation links

Do not use clickable `<div>` elements when a semantic element exists.

---

# 31. SEO

Implement basic production-quality SEO.

Every page should have:

- unique `<title>`
- meta description
- canonical URL
- Open Graph metadata
- Twitter/X card metadata where appropriate
- favicon
- semantic HTML

Homepage title example:

```text
Nikhil Gautam — Backend Engineer
```

The exact title can be refined.

Generate:

```text
robots.txt
sitemap.xml
```

Ensure canonical URLs work correctly with the GitHub Pages domain.

---

# 32. Performance

Performance is a major requirement.

The site should be primarily static.

Avoid unnecessary JavaScript.

Use Astro's static rendering capabilities.

JavaScript should only be added where it provides meaningful interaction.

Optimize:

- images
- fonts
- CSS
- client-side JavaScript
- animations

Avoid loading huge libraries for simple interactions.

Target excellent Lighthouse scores.

---

# 33. Animation System

Animation should be subtle.

Use animations for:

- page entrance
- section reveal
- hover interactions
- navigation
- project interactions

Avoid:

- constant movement
- excessive parallax
- distracting cursor effects
- long transitions
- animation on every element

Recommended feel:

```text
fast
subtle
intentional
smooth
```

Every animation should have a reason.

---

# 34. Cursor / Mouse Effects

A custom cursor is optional.

If implemented, it must:

- remain subtle
- not interfere with usability
- not appear on mobile
- not interfere with accessibility
- not cause performance problems

Do not implement a flashy custom cursor merely because it looks trendy.

---

# 35. Image Strategy

The portfolio should not depend on stock imagery.

Prefer:

- project screenshots
- architecture diagrams
- custom illustrations
- terminal screenshots
- generated technical visuals
- carefully designed project covers

Images should have a consistent visual language.

Do not use random Unsplash-style images merely to fill space.

---

# 36. Content Architecture

Separate content from UI.

Recommended structure:

```text
src/
├── components/
│   ├── Navigation.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── SectionHeading.astro
│   ├── ProjectCard.astro
│   ├── ProjectList.astro
│   ├── Experience.astro
│   ├── Stack.astro
│   ├── BlogPreview.astro
│   └── Contact.astro
│
├── content/
│   └── blog/
│
├── layouts/
│   └── BaseLayout.astro
│
├── pages/
│   ├── index.astro
│   ├── work.astro
│   ├── about.astro
│   ├── blog/
│   └── contact.astro
│
├── data/
│   ├── projects.ts
│   ├── experience.ts
│   └── site.ts
│
├── styles/
│   └── global.css
│
└── assets/
```

The exact structure can be adjusted if Astro conventions make another organization better.

---

# 37. Central Site Configuration

Create a central configuration object.

It should contain values such as:

```ts
export const site = {
  name: "Nikhil Gautam",
  role: "Backend Engineer",
  description: "...",
  email: "...",
  github: "...",
  linkedin: "...",
  url: "...",
};
```

Do not hardcode the same information across multiple components.

---

# 38. Design Tokens

Centralize design decisions.

Define tokens for:

- background
- foreground
- muted text
- accent
- border
- spacing
- container width
- typography scale
- border radius

Example conceptual palette:

```text
background: warm off-white
foreground: near-black
muted: gray
accent: orange
border: light neutral
```

The exact color values should be chosen carefully during implementation.

---

# 39. Component Reusability

Components should be reusable without becoming unnecessarily abstract.

Good:

```text
SectionHeading
ProjectCard
SocialLink
Navigation
```

Avoid creating components for trivial one-off fragments unless they improve clarity.

---

# 40. Error / Empty States

Implement graceful states.

For example:

### No blog posts

```text
WRITING

No articles published yet.
```

### Missing project image

Do not render a broken image.

### Missing optional project link

Do not render an empty link/button.

---

# 41. Security

Never put secrets into the repository.

Do not store:

- API keys
- private keys
- database credentials
- tokens
- passwords
- `.env` secrets

The portfolio is a public static website.

Any configuration exposed to the browser must be considered public.

---

# 42. GitHub Actions Deployment

Create a GitHub Actions workflow.

Conceptual pipeline:

```text
push to main
     ↓
checkout repository
     ↓
install dependencies
     ↓
build Astro project
     ↓
upload generated site
     ↓
deploy to GitHub Pages
```

The workflow should:

- use a supported Node.js version
- use deterministic dependency installation
- build the site
- fail clearly if the build fails
- deploy only after a successful build

Do not commit generated build artifacts unless specifically required.

---

# 43. GitHub Pages Configuration

Configure Astro correctly for the final GitHub Pages URL.

If using:

```text
username.github.io
```

the site is hosted at the domain root.

If a custom domain is introduced later, the configuration should be easy to change.

Do not hardcode environment-specific URLs throughout the application.

---

# 44. Development Scripts

The project should provide standard commands:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Optionally:

```bash
npm run check
```

for Astro/TypeScript validation.

The project must build successfully before deployment.

---

# 45. Code Quality

Use TypeScript.

Avoid:

```ts
any
```

unless genuinely necessary.

Maintain:

- readable naming
- small components
- predictable data structures
- clear types
- no dead code
- no unnecessary dependencies

Run formatting/linting/type checks before finalizing.

---

# 46. Mobile-First Testing

Test at minimum:

```text
360px
390px
430px
768px
1024px
1440px
1920px
```

Check:

- navigation
- hero
- typography
- project layout
- links
- animations
- footer
- horizontal overflow
- touch targets

---

# 47. Browser Testing

Verify the site in current versions of:

- Chrome
- Firefox
- Safari
- Edge

At minimum, ensure the layout works correctly in Chromium-based browsers and Safari.

---

# 48. Lighthouse / Quality Targets

Aim for excellent Lighthouse scores:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Do not sacrifice accessibility or performance merely to achieve visual effects.

---

# 49. Content Accuracy Rules

This is extremely important.

Do not invent:

- job titles
- employment dates
- project metrics
- user counts
- performance improvements
- revenue
- production scale
- awards
- certifications
- technologies not actually used
- responsibilities not actually performed

If information is unknown, use a placeholder or ask for confirmation.

The portfolio must be truthful.

---

# 50. Confidentiality Rules

Professional work should be described at a public-safe level.

Never expose:

- private repositories
- internal infrastructure
- internal IP addresses
- internal domain names
- credentials
- API tokens
- patient/user data
- proprietary algorithms
- confidential architecture
- screenshots containing private information

The portfolio is public.

---

# 51. Visual Interaction Details

Use subtle interaction patterns.

## Links

Default:

```text
VIEW PROJECT →
```

Hover:

- arrow moves slightly
- underline/accent changes
- no excessive scaling

## Project rows

Hover can:

- slightly shift title
- reveal arrow
- reveal metadata
- subtly change background
- show project image if appropriate

## Buttons

Use simple border/accent transitions.

Avoid giant pill-shaped CTA buttons unless visually justified.

---

# 52. Page Transition

If implementing page transitions, keep them extremely short.

The user should never feel that navigation is delayed.

Respect reduced motion.

---

# 53. Content Hierarchy

The homepage hierarchy should be:

```text
1. Identity
2. Positioning
3. Selected work
4. Professional experience
5. Technical capability
6. Engineering interests
7. Writing
8. Contact
```

Do not allow secondary content to visually compete with the name and selected work.

---

# 54. What the First Version Must Include

Version 1 must include:

- responsive navigation
- hero
- positioning statement
- selected work
- project data model
- experience
- technical stack
- engineering interests
- about
- blog preview placeholder/integration point
- contact
- footer
- responsive design
- accessibility
- SEO
- GitHub Pages deployment
- GitHub Actions
- README
- clean project structure

---

# 55. What Version 1 Should NOT Include

Do not implement these unless specifically requested later:

- authentication
- admin dashboard
- database
- comments
- contact form backend
- CMS
- analytics requiring invasive tracking
- complex animations
- user accounts
- newsletter system
- search engine for blog
- complex CMS editor

The first version should remain static and maintainable.

---

# 56. Future Blog Integration

The architecture must leave room for:

```text
src/content/blog/
```

with Markdown/MDX posts.

Future blog functionality should support:

- title
- description
- date
- updated date
- tags
- category
- reading time
- cover image
- slug
- draft status

Potential future pages:

```text
/blog
/blog/<slug>
```

Potential future functionality:

- tag filtering
- search
- related posts
- previous/next navigation
- RSS
- syntax highlighting
- table of contents

Do not build all of this now.

Build the portfolio so it can accept the blog later without a major rewrite.

---

# 57. Recommended Homepage Information Architecture

Final homepage:

```text
NAVIGATION

        ↓

HERO
NIKHIL GAUTAM
BACKEND ENGINEER
PRIMARY CTAs

        ↓

STATEMENT
"I LIKE BUILDING THINGS THAT ARE HARD TO BREAK."

        ↓

SELECTED WORK
01 Authentication Service
02 HealthTech Backend
03 PhysXplore
04 Connectify
05 BookNest

        ↓

EXPERIENCE
Medoc Health IT

        ↓

STACK
Languages
Backend
Databases
Messaging
Infrastructure

        ↓

ENGINEERING INTERESTS

        ↓

ABOUT

        ↓

LATEST WRITING
3 latest articles / placeholder

        ↓

CONTACT

        ↓

FOOTER
```

---

# 58. Recommended Build Order

Do not build everything simultaneously.

Build in this order:

## Phase 1 - Project Setup

- Initialize Astro
- Configure TypeScript
- Configure Tailwind
- Configure Git
- Configure basic project structure

## Phase 2 - Design System

- colors
- typography
- spacing
- container
- buttons
- links
- borders
- responsive rules

## Phase 3 - Global Shell

- navigation
- mobile navigation
- footer
- base layout

## Phase 4 - Hero

- identity
- name
- description
- CTAs
- animations

## Phase 5 - Main Content

- statement
- projects
- experience
- stack
- interests
- about

## Phase 6 - Contact

- social links
- email
- footer

## Phase 7 - SEO

- metadata
- canonical
- Open Graph
- sitemap
- robots.txt

## Phase 8 - Accessibility

- keyboard navigation
- focus states
- semantic HTML
- reduced motion
- contrast

## Phase 9 - Performance

- optimize images
- minimize JavaScript
- optimize fonts
- verify build

## Phase 10 - Deployment

- GitHub Actions
- GitHub Pages
- production URL
- deployment verification

## Phase 11 - Blog Foundation

Only after the portfolio is stable:

- content collection
- blog listing
- post page
- Markdown/MDX
- latest posts integration

---

# 59. Definition of Done

The portfolio is considered complete only when:

### Functionality

- [ ] All navigation links work.
- [ ] All project links work.
- [ ] GitHub link works.
- [ ] LinkedIn link works.
- [ ] Email link works.
- [ ] Mobile navigation works.
- [ ] No broken links.
- [ ] No broken images.
- [ ] Site builds successfully.
- [ ] GitHub Pages deployment succeeds.

### Design

- [ ] Design matches the intended minimal editorial direction.
- [ ] Typography has strong hierarchy.
- [ ] Layout has generous whitespace.
- [ ] Orange accent is used intentionally.
- [ ] Desktop layout looks polished.
- [ ] Mobile layout looks intentionally designed rather than merely compressed.

### Engineering

- [ ] TypeScript is used.
- [ ] No unnecessary `any`.
- [ ] No unnecessary dependencies.
- [ ] Components are reusable.
- [ ] Content is separated from presentation.
- [ ] No secrets exist in the repository.
- [ ] Build passes cleanly.

### Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus states exist.
- [ ] Semantic HTML is used.
- [ ] Images have appropriate alt text.
- [ ] Reduced-motion support exists.
- [ ] Color contrast is acceptable.

### SEO

- [ ] Title exists.
- [ ] Description exists.
- [ ] Canonical URL exists.
- [ ] Open Graph metadata exists.
- [ ] Sitemap exists.
- [ ] Robots file exists.

### Performance

- [ ] Minimal client-side JavaScript.
- [ ] Images optimized.
- [ ] Fonts optimized.
- [ ] No unnecessary third-party scripts.
- [ ] Lighthouse performance is strong.

---

# 60. AI Agent Instructions

The AI agent implementing this project must follow these rules.

## Rule 1 - Do not over-engineer

Build the simplest architecture that satisfies the requirements.

## Rule 2 - Do not invent personal information

If content is missing, use clearly marked placeholders or ask for confirmation.

## Rule 3 - Preserve confidentiality

Never expose private company information.

## Rule 4 - Prioritize visual quality

The website is a portfolio, so visual hierarchy and polish are first-class requirements.

## Rule 5 - Prioritize performance

Do not add dependencies simply because they make animations easier.

## Rule 6 - Keep content editable

Project information, experience and social links should be easy to modify without searching through UI components.

## Rule 7 - Design mobile-first

Do not treat mobile as an afterthought.

## Rule 8 - Build for future blogging

Do not implement the complete blog yet, but structure the project so Markdown/MDX content can be introduced without restructuring the entire application.

## Rule 9 - Verify everything

Before declaring the project complete:

```bash
npm run build
```

must succeed.

Also verify the production preview.

## Rule 10 - Do not stop at a generic template

The final result should feel like a custom portfolio designed specifically for a backend engineer.

---

# 61. Final Visual Goal

The final website should feel:

```text
MINIMAL
EDITORIAL
TECHNICAL
CONFIDENT
FAST
PRECISE
PERSONAL
```

It should NOT feel:

```text
GENERIC
CORPORATE
OVER-DESIGNED
COLORFUL
TEMPLATE-LIKE
```

The central visual idea is:

> **Large typography + strong whitespace + restrained color + engineering-focused content + subtle motion.**

The portfolio should make someone browsing it understand within the first 10 seconds:

1. Who Nikhil is.
2. That he is a backend engineer.
3. What kinds of systems he builds.
4. Where he has applied those skills.
5. What technical areas interest him.
6. Where to see his work.
7. Where to read his technical writing.
8. How to contact him.

---

# 62. Important Implementation Constraint

Do not begin by creating a large number of pages.

Start with a polished homepage.

The first milestone should be:

```text
/
```

with the complete visual system and all primary homepage sections.

Once the homepage is approved, implement:

```text
/work
/about
/contact
```

and finally the blog system.

The implementation should be incremental so that visual problems are caught early rather than after the entire application has been built.
