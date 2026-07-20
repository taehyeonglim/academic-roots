import type { Edge, Node } from "@xyflow/react";
import type { Genealogy, Person } from "../types";
import type { Variant } from "./layout";

export interface PersonNodeData extends Record<string, unknown> {
  person: Person;
  generation: number | null;
  variant: Variant;
  isSelected: boolean;
}

export type PersonFlowNode = Node<PersonNodeData, "personNode">;

/**
 * Generation depth relative to the anchor: negative = ancestors,
 * 0 = anchor, positive = descendants. BFS over advisor edges in both
 * directions; first assignment wins (fine for a DAG this size).
 */
export function computeGenerations(data: Genealogy): Map<string, number | null> {
  const gen = new Map<string, number | null>();
  const anchor = data.people.find((p) => p.role === "anchor");
  if (!anchor) return gen;
  gen.set(anchor.id, 0);
  const queue = [anchor.id];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const g = gen.get(id)!;
    for (const r of data.relationships) {
      if (r.advisorId === id && !gen.has(r.studentId)) {
        gen.set(r.studentId, g! + 1);
        queue.push(r.studentId);
      }
      if (r.studentId === id && !gen.has(r.advisorId)) {
        gen.set(r.advisorId, g! - 1);
        queue.push(r.advisorId);
      }
    }
  }
  return gen;
}

/** Selected person + their direct advisors and students. */
function neighborhood(data: Genealogy, selectedId: string): Set<string> {
  const near = new Set<string>([selectedId]);
  for (const r of data.relationships) {
    if (r.advisorId === selectedId) near.add(r.studentId);
    if (r.studentId === selectedId) near.add(r.advisorId);
  }
  return near;
}

export function buildFlowGraph(
  data: Genealogy,
  selectedId: string | null,
): { nodes: PersonFlowNode[]; edges: Edge[]; generations: Map<string, number | null> } {
  const generations = computeGenerations(data);
  const near = selectedId ? neighborhood(data, selectedId) : null;

  const nodes: PersonFlowNode[] = data.people.map((person) => {
    const generation = generations.get(person.id) ?? null;
    return {
      id: person.id,
      type: "personNode",
      position: { x: 0, y: 0 },
      className: near && !near.has(person.id) ? "dimmed" : undefined,
      data: {
        person,
        generation,
        variant: generation != null && generation > 0 ? "compact" : "full",
        isSelected: person.id === selectedId,
      },
    };
  });

  const edges: Edge[] = data.relationships.map((r) => {
    const unverified = r.confidence === "unverified";
    const coAdvisor = r.type === "co-advisor";
    const touchesSelected =
      selectedId != null && (r.advisorId === selectedId || r.studentId === selectedId);
    return {
      id: `${r.advisorId}->${r.studentId}`,
      source: r.advisorId,
      target: r.studentId,
      style: {
        stroke: touchesSelected
          ? "var(--accent)"
          : unverified
            ? "var(--edge-unverified)"
            : "var(--edge)",
        strokeWidth: touchesSelected ? 2 : 1.2,
        opacity: touchesSelected ? 1 : selectedId ? 0.12 : 0.5,
        strokeDasharray: unverified ? "2 5" : coAdvisor ? "9 5" : undefined,
      },
    };
  });

  return { nodes, edges, generations };
}
