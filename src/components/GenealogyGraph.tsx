import { useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import { buildFlowGraph, type PersonFlowNode } from "../lib/graph";
import { layoutNodes, SIZES } from "../lib/layout";
import type { Genealogy } from "../types";
import { PersonNode } from "./PersonNode";

const nodeTypes = { personNode: PersonNode };

interface Props {
  data: Genealogy;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function minimapColor(node: PersonFlowNode): string {
  if (node.data.person.role === "anchor") return "#9a7b2d";
  return "#ddd8cc";
}

export function GenealogyGraph({ data, selectedId, onSelect }: Props) {
  const { nodes, edges } = useMemo(() => {
    const graph = buildFlowGraph(data, selectedId);
    return {
      nodes: layoutNodes(graph.nodes, graph.generations),
      edges: graph.edges,
    };
  }, [data, selectedId]);

  const { setCenter, getZoom } = useReactFlow();
  useEffect(() => {
    if (!selectedId) return;
    const node = nodes.find((n) => n.id === selectedId);
    if (node) {
      const size = SIZES[node.data.variant];
      // Keep the user's zoom (clamped) so selecting doesn't lurch the viewport in.
      const zoom = Math.min(Math.max(getZoom(), 0.45), 1.1);
      void setCenter(node.position.x + size.width / 2, node.position.y + size.height / 2, {
        duration: 400,
        zoom,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recenter only when selection changes
  }, [selectedId, setCenter, getZoom]);

  const onNodeClick: NodeMouseHandler<PersonFlowNode> = (_event, node) => onSelect(node.id);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      onPaneClick={() => onSelect(null)}
      fitView
      minZoom={0.2}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
    >
      <Background gap={24} size={1.5} />
      <Controls showInteractive={false} />
      <MiniMap nodeColor={minimapColor} pannable zoomable={false} />
    </ReactFlow>
  );
}
