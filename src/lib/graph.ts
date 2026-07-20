import type { Edge, Node } from "@xyflow/react";
import type { Genealogy, Person } from "../types";

export interface PersonNodeData extends Record<string, unknown> {
  person: Person;
  generation: number | null;
  isSelected: boolean;
}

export type PersonFlowNode = Node<PersonNodeData, "personNode">;

/**
 * Generation depth relative to the anchor: negative = ancestors,
 * 0 = anchor, positive = descendants. BFS over advisor edges in both
 * directions; first assignment wins (fine for a DAG this size).
 */
export function computeGenerations(data: Genealogy): Map<string, number> {
  const gen = new Map<string, number>();
  const anchor = data.people.find((p) => p.role === "anchor");
  if (!anchor) return gen;
  gen.set(anchor.id, 0);
  const queue = [anchor.id];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const g = gen.get(id)!;
    for (const r of data.relationships) {
      if (r.advisorId === id && !gen.has(r.studentId)) {
        gen.set(r.studentId, g + 1);
        queue.push(r.studentId);
      }
      if (r.studentId === id && !gen.has(r.advisorId)) {
        gen.set(r.advisorId, g - 1);
        queue.push(r.advisorId);
      }
    }
  }
  return gen;
}

export function buildFlowGraph(
  data: Genealogy,
  selectedId: string | null,
): { nodes: PersonFlowNode[]; edges: Edge[] } {
  const generations = computeGenerations(data);

  const nodes: PersonFlowNode[] = data.people.map((person) => ({
    id: person.id,
    type: "personNode",
    position: { x: 0, y: 0 },
    data: {
      person,
      generation: generations.get(person.id) ?? null,
      isSelected: person.id === selectedId,
    },
  }));

  const edges: Edge[] = data.relationships.map((r) => {
    const unverified = r.confidence === "unverified";
    const coAdvisor = r.type === "co-advisor";
    return {
      id: `${r.advisorId}->${r.studentId}`,
      source: r.advisorId,
      target: r.studentId,
      style: {
        stroke: unverified ? "var(--edge-unverified)" : "var(--edge)",
        strokeWidth: 1.6,
        strokeDasharray: unverified ? "2 5" : coAdvisor ? "9 5" : undefined,
      },
    };
  });

  return { nodes, edges };
}
