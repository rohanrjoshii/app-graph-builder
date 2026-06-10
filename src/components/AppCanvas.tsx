import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import type {
  Connection,
  EdgeChange,
  NodeChange,
  OnSelectionChangeParams,
} from '@xyflow/react';
import { useCallback, useEffect } from 'react';
import type { ServiceEdge, ServiceNode } from '../types/graph';

type AppCanvasProps = {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
  onNodesChange: (changes: NodeChange<ServiceNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<ServiceEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeSelect: (nodeId: string | null) => void;
  onDeleteSelected: () => void;
};

export function AppCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onDeleteSelected,
}: AppCanvasProps) {
  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams<ServiceNode, ServiceEdge>) => {
      onNodeSelect(selectedNodes[0]?.id ?? null);
    },
    [onNodeSelect],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        onDeleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDeleteSelected]);

  return (
    <ReactFlow<ServiceNode, ServiceEdge>
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onSelectionChange={handleSelectionChange}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      deleteKeyCode={['Backspace', 'Delete']}
      nodesDraggable
      panOnDrag
      className="flow-canvas"
    >
      <Background variant={BackgroundVariant.Dots} gap={18} size={1.5} color="var(--grid-color)" />
      <MiniMap pannable zoomable nodeStrokeWidth={3} />
      <Controls position="bottom-left" />
    </ReactFlow>
  );
}
