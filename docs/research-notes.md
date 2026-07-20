# Research Notes — Dennen Genealogy

Curation log: every finding, source, and dead end. Verification criterion for
`confidence: "verified"`: (a) one primary source (dissertation acknowledgments,
official CV, university record, the person's own statement) OR (b) two
independent secondary sources.

## R1 — Dennen's doctoral advisor: RESOLVED ✅

- **Charles M. Reigeluth**, confirmed directly by her advisee (site owner) on
  2026-07-20. Counts as a primary source → edge marked `verified`.
- TODO (low priority): add a citable documentary source for the public site —
  ProQuest record for "The design and facilitation of asynchronous discussion
  activities in Web-based courses" (Indiana University, 2001) lists the advisor.
- Dead end: omicsonline bio also named Reigeluth but is low-credibility on its own.

## R2 — Ancestor chain (in progress)

Leads to verify before entering (do NOT add without sources):

- Reigeluth: PhD, Brigham Young University, 1977 — advisor reportedly
  **M. David Merrill**.
- Merrill: PhD, University of Illinois — advisor reportedly
  **Lawrence M. Stolurow**.
- Chain may reach educational-psychology figures 5–8 generations back.

Tools: Wikidata P184/P185, academictree.org Education Tree (CC-BY 3.0, cite
profile URL), Wikipedia, festschrift/interview articles, dissertation records.

## R3 — Descendants: Dennen's PhD graduates (todo)

- ProQuest advanced search: advisor="Dennen", school="Florida State University".
- Her CV's "Doctoral students directed" section at vanessadennen.com.
- FSU ISLT program dissertation lists.
- Estimated ~15–25 graduates since 2003. Add each with year + dissertation
  title + source.

## R4 — Enrichment (low priority)

- Photos only from personal/university pages → `public/photos/`, credit the
  source in the person's `sources`.
- Google Scholar / homepage links.

## Workflow

One finding = one JSON edit + `npm run validate` + one commit.
The graph grows as the JSON grows — no code changes needed.
