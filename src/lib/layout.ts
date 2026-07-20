import dagre from "@dagrejs/dagre";
import type { Node } from "@xyflow/react";

export const NODE_WIDTH = 230;
export const NODE_HEIGHT = 96;

/**
 * Layered top-to-bottom layout: because every edge points advisor -> student,
 * dagre naturally places ancestors above and descendants below the anchor.
 */
export function layoutNodes<T extends Node>(
  nodes: T[],
  edges: { source: string; target: string }[],
): T[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", ranksep: 90, nodesep: 40 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const n of nodes) g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  for (const e of edges) g.setEdge(e.source, e.target);
  dagre.layout(g);
  return nodes.map((n) => {
    const pos = g.node(n.id);
    return {
      ...n,
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
    };
  });
}
