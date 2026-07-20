# Research Notes — Dennen Genealogy

Curation log: every finding, source, and dead end. Verification criterion for
`confidence: "verified"`: (a) one primary source (dissertation acknowledgments,
official CV, university record, the person's own statement) OR (b) two
independent secondary sources.

## R1 — Dennen's doctoral advisor: RESOLVED ✅

- **Charles M. Reigeluth**, confirmed directly by her advisee (site owner) on
  2026-07-20. Counts as a primary source → edge marked `verified`.
- TODO (low priority): add a citable documentary source for the public site —
  ProQuest record for her 2001 Indiana University dissertation lists the advisor.
- Dead end: omicsonline bio also named Reigeluth but is low-credibility on its own.

## R2 — Ancestor chain: RESOLVED to a documented dead end ✅ (2026-07-20)

Chain (advisor → student), all edges primary-sourced:

- **Lawrence M. Stolurow → M. David Merrill** (PhD Illinois 1964). Primary:
  Merrill, "A 50+ Year Search for Effective, Efficient and Engaging
  Instruction," Education Review 24 (2017): "he became the chairman of my PhD
  committee and the advisor for my PhD dissertation." Corroborated by his 2010
  interview (ERIC ED542979) and a 1966 co-authored tech report (ED130653).
- **M. David Merrill → Charles M. Reigeluth** (PhD BYU 1977). Primary:
  Reigeluth interview, Contemporary Educational Technology 2013 (ERIC
  ED542982): "Dave Merrill was my primary advisor at Brigham Young University."
- **Reigeluth → Dennen** (R1), **Dennen → site owner**.

**Dead end: Stolurow's own advisor.** PhD Experimental Psychology, University
of Pittsburgh, 1947 (source: 2009 La Jolla Light family obituary — the ONLY
source for his education; career facts are multi-sourced). No source names his
advisor or dissertation title. Exhausted: psychtree/neurotree (no profile),
Wikidata (no entity), Pitt D-Scholarship (starts later), Illinois/Iowa/Harvard
archives, Google Books. Next leads if pushed further: ProQuest record for
Stolurow 1947; Univ. of Pittsburgh Archives; acknowledgments of his 1948 JCPP
paper "Rodent behavior in the presence of barriers" (APA PsycNet, paywalled).

Not found (open records): dissertation titles for Reigeluth (1977 BYU — topic
known: TICCIT CAI experiment) and Merrill (1964 Illinois — published as
Merrill 1965, J. Educational Psychology 56(5), 225-234).

## R3 — Descendants: 34 graduates found ✅ (2026-07-20)

- **Primary source**: Dennen's official FSU vita (RTF, FSU CV database),
  Wayback capture 2023-08-02 — its "Doctoral Committee Chair" section is
  authoritative through mid-2023 (25 graduates):
  http://web.archive.org/web/20230802210823/https://www.fsu.edu/cvdb/VDENNEN.rtf
- Post-2023 graduates reconstructed from DigiNole ETD records via Google,
  Google Scholar profiles, the MEME lab site (meme.create.fsu.edu/people/),
  and personal/faculty pages.
- Included only major-professor relationships; committee-only names excluded
  (e.g., Phillips 2021 → Klein; Pearson 2022 → Bertrand Jones; plus the ~44
  "Doctoral Committee Member" CV entries).
- Her college profile says "more than 30 doctoral students" graduated —
  consistent with the 34 in the dataset.

**Full names resolved for all 12 initials-only entries (2026-07-20)** via ERIC
dissertation records, FSU commencement program PDFs (registrar.fsu.edu
archive — excellent source: full name + title + "Major Professor" in one
document), co-authored publications (Crossref), and Wayback-archived DigiNole
records. Notable corrections: Sota's and Wieland's CV-listed titles were
working titles — the deposited dissertations carry different final titles (see
dataset notes); Myers' is a minor variant. Beauford confirmed EdD 2023 and
upgraded to verified via archived ETD record.

**Re-verify when FSU repository is back up** (it returned 504 all session;
archived snapshots used where available): exact titles / degree type / semester
for He, Word, Shi, Park, Jung, Crombie, Khamitova, Cates, Jones. Marked
`unverified` or noted in the dataset where applicable.

**Known in-progress (NOT included)**: Young B. K., Adolfson, Lott (chaired
candidates still listed as current students, July 2026); Tang (may be MS
alumna). Late 2025–2026 graduates may be missing — recheck DigiNole
periodically.

## R4 — Photos: 3 of 4 collected ✅ (2026-07-20)

All resized to 400px max via sips.

| person | file | source | license |
|---|---|---|---|
| Dennen | vanessa-dennen.jpg | FSU Anne's College faculty page | © FSU — permission needed for public deployment |
| Reigeluth | charles-reigeluth.jpg | IU School of Education directory | © Indiana University — permission needed for public deployment |
| Merrill | david-merrill.jpg | Wikimedia Commons (used on his Wikipedia article) | CC BY-SA 2.0, photographer Kristina D.C. Hoeppner — attribution required. NOTE: the file's embedded EXIF says CC BY-NC 3.0; the Commons page statement (BY-SA 2.0) is authoritative for the Commons copy, but keep both in mind. |
| Stolurow | — (initials avatar) | none found — pre-web era; obituary page is Cloudflare-blocked | — |

Deployment caveat: only the Merrill photo is freely licensed. The FSU/IU
official photos are fine for a personal/academic project but formally
copyrighted — seek permission (or replace) before wide public deployment.

## Workflow

One finding = one JSON edit + `npm run validate` + one commit.
The graph grows as the JSON grows — no code changes needed.
