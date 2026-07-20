// All user-facing UI text lives here so localization is a one-file change.
export const strings = {
  appTitle: "Academic Roots",
  appSubtitle: "The academic genealogy of Vanessa P. Dennen",
  emptyHint: "Click a person to see details",
  youBadge: "you",
  verified: "verified",
  unverified: "unverified",
  anchorLabel: "Anchor of this genealogy",
  advisorsHeading: "Advisor(s)",
  studentsHeading: "Doctoral students",
  dissertationHeading: "Dissertation",
  affiliationHeading: "Current affiliation",
  linksHeading: "Links",
  sourcesHeading: "Sources",
  notesHeading: "Notes",
  legendAdvisor: "advisor",
  legendCoAdvisor: "co-advisor",
  legendUnverifiedEdge: "unverified link",
  legendUnverifiedNode: "unverified person",
  legendDimHint: "click a person to focus their connections",
  closePanel: "Close",
  coAdvisorTag: "co-advisor",
  linkLabels: {
    homepage: "Homepage",
    googleScholar: "Google Scholar",
    wikipedia: "Wikipedia",
  },
  generationAbove: (n: number, anchor: string) =>
    `${n} generation${n > 1 ? "s" : ""} above ${anchor}`,
  generationBelow: (n: number, anchor: string) =>
    `${n} generation${n > 1 ? "s" : ""} below ${anchor}`,
};
