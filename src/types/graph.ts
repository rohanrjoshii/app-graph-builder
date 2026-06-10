import type { Edge, Node } from '@xyflow/react';

export type NodeStatus = 'Healthy' | 'Degraded' | 'Down';

export type ServiceNodeData = {
  label: string;
  description: string;
  status: NodeStatus;
  capacity: number;
  runtime: string;
  region: string;
  cpu?: number;
  memory?: number;
  disk?: number;
  pricing?: string;
};

export type ServiceNode = Node<ServiceNodeData>;
export type ServiceEdge = Edge;

export type AppSummary = {
  id: string;
  name: string;
  environment: string;
  owner: string;
};

export type AppGraph = {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
};
