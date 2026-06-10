import type { AppGraph, AppSummary } from '../types/graph';

const apps: AppSummary[] = [
  { id: 'commerce', name: 'Commerce Cloud', environment: 'Production', owner: 'Growth' },
  { id: 'analytics', name: 'Analytics Hub', environment: 'Staging', owner: 'Data' },
  { id: 'support', name: 'Support Desk', environment: 'Production', owner: 'Ops' },
];

const graphs: Record<string, AppGraph> = {
  commerce: {
    nodes: [
      {
        id: 'gateway',
        type: 'default',
        position: { x: 40, y: 90 },
        data: {
          label: 'API Gateway',
          description: 'Routes traffic into commerce services.',
          status: 'Healthy',
          capacity: 82,
          runtime: 'Node.js 20',
          region: 'us-east-1',
          cpu: 38,
          memory: 54,
          disk: 12,
          pricing: '$0.04/HR',
        },
      },
      {
        id: 'checkout',
        type: 'default',
        position: { x: 360, y: 40 },
        data: {
          label: 'Checkout Service',
          description: 'Handles cart checkout and payment orchestration.',
          status: 'Degraded',
          capacity: 64,
          runtime: 'Go 1.22',
          region: 'us-east-1',
          cpu: 72,
          memory: 85,
          disk: 44,
          pricing: '$0.12/HR',
        },
      },
      {
        id: 'inventory',
        type: 'default',
        position: { x: 360, y: 210 },
        data: {
          label: 'Inventory Sync',
          description: 'Keeps product availability aligned across channels.',
          status: 'Healthy',
          capacity: 72,
          runtime: 'Python 3.12',
          region: 'us-west-2',
          cpu: 15,
          memory: 48,
          disk: 68,
          pricing: '$0.08/HR',
        },
      },
    ],
    edges: [
      { id: 'gateway-checkout', source: 'gateway', target: 'checkout', animated: true },
      { id: 'checkout-inventory', source: 'checkout', target: 'inventory' },
    ],
  },
  analytics: {
    nodes: [
      {
        id: 'collector',
        position: { x: 40, y: 120 },
        data: {
          label: 'Event Collector',
          description: 'Receives client events from web and mobile apps.',
          status: 'Healthy',
          capacity: 90,
          runtime: 'Rust',
          region: 'eu-central-1',
          cpu: 88,
          memory: 64,
          disk: 32,
          pricing: '$0.18/HR',
        },
      },
      {
        id: 'pipeline',
        position: { x: 350, y: 80 },
        data: {
          label: 'Stream Pipeline',
          description: 'Normalizes events before warehouse loading.',
          status: 'Healthy',
          capacity: 76,
          runtime: 'Kafka Streams',
          region: 'eu-central-1',
          cpu: 54,
          memory: 90,
          disk: 58,
          pricing: '$0.44/HR',
        },
      },
      {
        id: 'warehouse',
        position: { x: 650, y: 120 },
        data: {
          label: 'Warehouse Loader',
          description: 'Batches transformed events into analytics storage.',
          status: 'Down',
          capacity: 18,
          runtime: 'Python 3.12',
          region: 'eu-west-1',
          cpu: 92,
          memory: 95,
          disk: 89,
          pricing: '$0.96/HR',
        },
      },
    ],
    edges: [
      { id: 'collector-pipeline', source: 'collector', target: 'pipeline', animated: true },
      { id: 'pipeline-warehouse', source: 'pipeline', target: 'warehouse' },
    ],
  },
  support: {
    nodes: [
      {
        id: 'inbox',
        position: { x: 70, y: 60 },
        data: {
          label: 'Inbox Router',
          description: 'Assigns new tickets to the correct queue.',
          status: 'Healthy',
          capacity: 68,
          runtime: 'Node.js 20',
          region: 'ap-south-1',
          cpu: 24,
          memory: 42,
          disk: 18,
          pricing: '$0.02/HR',
        },
      },
      {
        id: 'sla',
        position: { x: 360, y: 80 },
        data: {
          label: 'SLA Watcher',
          description: 'Tracks response windows and escalation thresholds.',
          status: 'Degraded',
          capacity: 55,
          runtime: 'Java 21',
          region: 'ap-south-1',
          cpu: 45,
          memory: 68,
          disk: 35,
          pricing: '$0.06/HR',
        },
      },
      {
        id: 'notifications',
        position: { x: 360, y: 250 },
        data: {
          label: 'Notification Worker',
          description: 'Sends email and chat alerts for escalations.',
          status: 'Healthy',
          capacity: 73,
          runtime: 'Ruby 3.3',
          region: 'ap-south-1',
          cpu: 12,
          memory: 34,
          disk: 8,
          pricing: '$0.01/HR',
        },
      },
    ],
    edges: [
      { id: 'inbox-sla', source: 'inbox', target: 'sla', animated: true },
      { id: 'sla-notifications', source: 'sla', target: 'notifications' },
    ],
  },
};

const cloneGraph = (graph: AppGraph): AppGraph => ({
  nodes: graph.nodes.map((node) => ({ ...node, data: { ...node.data }, position: { ...node.position } })),
  edges: graph.edges.map((edge) => ({ ...edge })),
});

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function getApps() {
  await wait(500);
  return apps;
}

export async function getAppGraph(appId: string, shouldFail: boolean) {
  await wait(650);

  if (shouldFail) {
    throw new Error('Mock graph request failed. Turn off the error toggle and retry.');
  }

  const graph = graphs[appId];
  if (!graph) {
    throw new Error(`No graph found for app "${appId}".`);
  }

  return cloneGraph(graph);
}
