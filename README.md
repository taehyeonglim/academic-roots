# Academic Roots — The Dennen Genealogy

**Live site: https://taehyeonglim.github.io/academic-roots/**

An interactive academic genealogy of [Vanessa P. Dennen](https://vanessadennen.com)
(Professor of Instructional Systems & Learning Technologies, Florida State
University) — tracing her scholarly lineage upward through her doctoral
advisors and downward to the 30+ doctoral students she has graduated.

The current chain of advisors reaches back four generations:

> Lawrence M. Stolurow (PhD, Pittsburgh 1947) → M. David Merrill (PhD, Illinois
> 1964) → Charles M. Reigeluth (PhD, BYU 1977) → **Vanessa P. Dennen** (PhD,
> Indiana 2001) → her doctoral graduates (2009–present)

## Why this exists

Fields like mathematics ([Mathematics Genealogy Project](https://www.mathgenealogy.org/))
and neuroscience ([Neurotree](https://neurotree.org/)) have well-maintained
genealogy databases. Instructional design / educational technology does not —
coverage on academictree.org is sparse. This project documents one lineage
properly: every person and every advisor–student edge carries **source
citations**, and anything that doesn't meet the verification bar is honestly
rendered as *unverified* (dashed) in the UI.

**Verification criterion** — a fact is `verified` with (a) one primary source
(dissertation record, official CV, the person's own statement) or (b) two
independent secondary sources. See [docs/research-notes.md](docs/research-notes.md)
for the full research log, including dead ends.

## Features

- **Generational grid layout** — ancestors stack above the anchor; 30+
  graduates wrap into a year-sorted grid below, so the whole tree fits on
  one screen
- **Focus on click** — selecting a person dims everyone outside their direct
  advisor/student neighborhood and highlights their edges
- **Detail panel** — degree, dissertation title, current affiliation, external
  links, and the actual sources behind every claim, each flagged
  verified/unverified
- **Data-driven** — the app renders whatever is in
  [`src/data/genealogy.json`](src/data/genealogy.json); growing the tree is a
  JSON edit, no code changes

## Tech stack

- [Vite](https://vite.dev) + React + TypeScript, fully static (no server)
- [React Flow](https://reactflow.dev) (`@xyflow/react`) with a custom
  generational grid layout
- [Zod](https://zod.dev) schema + integrity checks (DAG validation, ID
  references, source requirements) — bad data fails the build
- Deployed to GitHub Pages via GitHub Actions on every push to `main`

## Development

```bash
npm install
npm run dev        # dev server at localhost:5173
npm run validate   # schema + integrity check on genealogy.json
npm run build      # validate + typecheck + production build
```

## Contributing data

Edit `src/data/genealogy.json` (schema in `src/data/schema.ts`):

1. Add a person to `people` (kebab-case `id`, at least one source URL) and/or
   an edge to `relationships` (`advisorId` → `studentId`)
2. Mark `confidence` honestly — `unverified` renders dashed, which is fine
3. Run `npm run validate`; commit; push. The site redeploys automatically.

Corrections are welcome — especially from the people in the tree.

## Photo credits

- **M. David Merrill** — photo by Kristina D.C. Hoeppner (ED-MEDIA 2009,
  Honolulu), [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/),
  via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:M._David_Merrill_(3662310676)_(2).jpg)
- **Vanessa P. Dennen** — official faculty photo, © Florida State University
- **Charles M. Reigeluth** — official directory photo, © Indiana University

University photos are used here for a non-commercial academic tribute; rights
remain with their owners. If you own one of these photos and would like it
removed or credited differently, please open an issue.

## Data license

The curated genealogy data (`src/data/genealogy.json`) is factual information
compiled from the cited public sources. Research notes and data are shared in
the spirit of [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) —
attribution appreciated if you build on this work.

---

*Built by [Taehyeong Lim](https://github.com/taehyeonglim) (PhD 2018, one of
the graduates in this tree) with [Claude Code](https://claude.com/claude-code).*
