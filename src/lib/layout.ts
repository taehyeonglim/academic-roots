import type { PersonFlowNode } from "./graph";

export const SIZES = {
  full: { width: 230, height: 96 },
  compact: { width: 170, height: 64 },
} as const;

export type Variant = keyof typeof SIZES;

const MAX_PER_ROW = 6;
const COL_GAP = 20;
const ROW_GAP = 24;
const GEN_GAP = 80;

/**
 * Generational grid layout. Generations stack top-to-bottom (ancestors above
 * the anchor, descendants below). A generation with more than MAX_PER_ROW
 * people wraps into centered rows, sorted by graduation year (unknown years
 * last, then by name) — this is what keeps 30+ graduates readable where a
 * generic layered DAG layout would put them all in one very wide rank.
 * Disconnected people (generation null) go in a final block at the bottom.
 */
export function layoutNodes(
  nodes: PersonFlowNode[],
  generations: Map<string, number | null>,
): PersonFlowNode[] {
  const known = [...generations.values()].filter((g): g is number => g != null);
  const orphanGen = (known.length > 0 ? Math.max(...known) : 0) + 1;

  const byGen = new Map<number, PersonFlowNode[]>();
  for (const node of nodes) {
    const gen = generations.get(node.id) ?? orphanGen;
    if (!byGen.has(gen)) byGen.set(gen, []);
    byGen.get(gen)!.push(node);
  }

  const positioned: PersonFlowNode[] = [];
  let y = 0;

  for (const gen of [...byGen.keys()].sort((a, b) => a - b)) {
    const members = byGen.get(gen)!.sort((a, b) => {
      const ya = a.data.person.year ?? Number.MAX_SAFE_INTEGER;
      const yb = b.data.person.year ?? Number.MAX_SAFE_INTEGER;
      if (ya !== yb) return ya - yb;
      return a.data.person.name.localeCompare(b.data.person.name);
    });

    for (let i = 0; i < members.length; i += MAX_PER_ROW) {
      const row = members.slice(i, i + MAX_PER_ROW);
      const widths = row.map((n) => SIZES[n.data.variant].width);
      const rowWidth =
        widths.reduce((sum, w) => sum + w, 0) + COL_GAP * (row.length - 1);
      const rowHeight = Math.max(...row.map((n) => SIZES[n.data.variant].height));

      let x = -rowWidth / 2;
      for (const node of row) {
        positioned.push({ ...node, position: { x, y } });
        x += SIZES[node.data.variant].width + COL_GAP;
      }
      y += rowHeight + ROW_GAP;
    }
    y += GEN_GAP - ROW_GAP;
  }

  return positioned;
}
