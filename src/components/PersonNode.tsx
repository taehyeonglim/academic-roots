import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { PersonFlowNode } from "../lib/graph";
import { strings } from "../strings";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function resolvePhoto(photo: string): string {
  if (/^https?:\/\//.test(photo)) return photo;
  return `${import.meta.env.BASE_URL}photos/${photo}`;
}

export function PersonNode({ data }: NodeProps<PersonFlowNode>) {
  const { person, isSelected } = data;
  const classes = ["person-node"];
  if (person.role === "anchor") classes.push("is-anchor");
  if (person.role === "self") classes.push("is-self");
  if (person.confidence === "unverified") classes.push("is-unverified");
  if (isSelected) classes.push("is-selected");

  const meta = [person.degree, person.year].filter(Boolean).join(" · ");

  return (
    <div className={classes.join(" ")}>
      <Handle type="target" position={Position.Top} className="person-handle" />
      <div className="person-avatar" aria-hidden="true">
        {person.photo ? (
          <img src={resolvePhoto(person.photo)} alt="" />
        ) : (
          <span>{initials(person.name)}</span>
        )}
      </div>
      <div className="person-info">
        <div className="person-name">{person.name}</div>
        {meta && <div className="person-meta">{meta}</div>}
        {person.institution && <div className="person-inst">{person.institution}</div>}
      </div>
      {person.role === "self" && <span className="person-badge">{strings.youBadge}</span>}
      <Handle type="source" position={Position.Bottom} className="person-handle" />
    </div>
  );
}
