import { useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  useReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import { buildFlowGraph, type PersonFlowNode } from "../lib/graph";
import { layoutNodes, NODE_HEIGHT, NODE_WIDTH } from "../lib/layout";
import type { Genealogy } from "../types";
import { PersonNode } from "./PersonNode";

const nodeTypes = { personNode: PersonNode };

interface Props {
  data: Genealogy;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function GenealogyGraph({ data, selectedId, onSelect }: Props) {
  const { nodes, edges } = useMemo(() => {
    const graph = buildFlowGraph(data, selectedId);
    return { nodes: layoutNodes(graph.nodes, graph.edges), edges: graph.edges };
  }, [data, selectedId]);

  const { setCenter } = useReactFlow();
  useEffect(() => {
    if (!selectedId) return;
    const node = nodes.find((n) => n.id === selectedId);
    if (node) {
      void setCenter(node.position.x + NODE_WIDTH / 2, node.position.y + NODE_HEIGHT / 2, {
        duration: 500,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recenter only when selection changes
  }, [selectedId, setCenter]);

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
    </ReactFlow>
  );
}
