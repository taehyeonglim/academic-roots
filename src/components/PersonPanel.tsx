import { useEffect, useMemo } from "react";
import { computeGenerations } from "../lib/graph";
import { strings } from "../strings";
import type { Genealogy, Person, Relationship } from "../types";

interface Props {
  data: Genealogy;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function byId(data: Genealogy, id: string): Person | undefined {
  return data.people.find((p) => p.id === id);
}

function RelationList({
  heading,
  items,
  onSelect,
}: {
  heading: string;
  items: { rel: Relationship; person: Person | undefined }[];
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="panel-section">
      <h3>{heading}</h3>
      <ul className="relation-list">
        {items.map(({ rel, person }) =>
          person ? (
            <li key={person.id}>
              <button type="button" className="relation-link" onClick={() => onSelect(person.id)}>
                {person.name}
              </button>
              {rel.type === "co-advisor" && <span className="tag">{strings.coAdvisorTag}</span>}
              {rel.confidence === "unverified" && (
                <span className="tag tag-unverified">{strings.unverified}</span>
              )}
            </li>
          ) : null,
        )}
      </ul>
    </section>
  );
}

export function PersonPanel({ data, selectedId, onSelect }: Props) {
  const person = selectedId ? byId(data, selectedId) : undefined;
  const anchor = data.people.find((p) => p.role === "anchor");
  const generations = useMemo(() => computeGenerations(data), [data]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSelect(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  if (!person) {
    return <div className="panel-hint">{strings.emptyHint}</div>;
  }

  const advisors = data.relationships
    .filter((r) => r.studentId === person.id)
    .map((rel) => ({ rel, person: byId(data, rel.advisorId) }));
  const students = data.relationships
    .filter((r) => r.advisorId === person.id)
    .map((rel) => ({ rel, person: byId(data, rel.studentId) }));

  const gen = generations.get(person.id);
  let genLabel: string | null = null;
  if (anchor && gen != null) {
    if (gen === 0 && person.role === "anchor") genLabel = strings.anchorLabel;
    else if (gen < 0) genLabel = strings.generationAbove(-gen, anchor.name);
    else if (gen > 0) genLabel = strings.generationBelow(gen, anchor.name);
  }

  const degreeLine = [
    person.degree,
    person.degreeField,
    person.institution,
    person.year != null ? String(person.year) : undefined,
  ]
    .filter(Boolean)
    .join(" · ");

  const links = Object.entries(person.links ?? {}) as [
    keyof typeof strings.linkLabels,
    string,
  ][];

  return (
    <div className="panel-body">
      <div className="panel-top">
        <h2 className="panel-name">{person.name}</h2>
        <button
          type="button"
          className="panel-close"
          aria-label={strings.closePanel}
          onClick={() => onSelect(null)}
        >
          ×
        </button>
      </div>
      {genLabel && <p className="panel-gen">{genLabel}</p>}
      <p className="panel-degree">{degreeLine}</p>
      <span
        className={`chip ${person.confidence === "verified" ? "chip-verified" : "chip-unverified"}`}
      >
        {person.confidence === "verified" ? strings.verified : strings.unverified}
      </span>

      {person.dissertationTitle && (
        <section className="panel-section">
          <h3>{strings.dissertationHeading}</h3>
          <p className="dissertation">“{person.dissertationTitle}”</p>
        </section>
      )}

      {person.currentAffiliation && (
        <section className="panel-section">
          <h3>{strings.affiliationHeading}</h3>
          <p>{person.currentAffiliation}</p>
        </section>
      )}

      <RelationList heading={strings.advisorsHeading} items={advisors} onSelect={onSelect} />
      <RelationList heading={strings.studentsHeading} items={students} onSelect={onSelect} />

      {links.length > 0 && (
        <section className="panel-section">
          <h3>{strings.linksHeading}</h3>
          <ul className="link-list">
            {links.map(([key, url]) => (
              <li key={key}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {strings.linkLabels[key] ?? key}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {person.sources.length > 0 && (
        <section className="panel-section">
          <h3>{strings.sourcesHeading}</h3>
          <ul className="source-list">
            {person.sources.map((s) => (
              <li key={s.url + (s.label ?? "")}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label ?? s.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {person.notes && (
        <section className="panel-section">
          <h3>{strings.notesHeading}</h3>
          <p className="panel-notes">{person.notes}</p>
        </section>
      )}
    </div>
  );
}
