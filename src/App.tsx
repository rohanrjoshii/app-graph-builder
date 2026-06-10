import { AlertTriangle, GitBranch, Menu, RefreshCw, Search, Settings, Zap, Plus, X, Sun, Moon, Maximize } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { EdgeChange, NodeChange } from '@xyflow/react';
import { addEdge, applyEdgeChanges, applyNodeChanges, useReactFlow } from '@xyflow/react';
import type { Connection } from '@xyflow/react';
import { AppCanvas } from './components/AppCanvas';
import { AppPanel } from './components/AppPanel';
import { Button } from './components/ui/button';
import { Skeleton } from './components/ui/skeleton';
import { useAppGraphQuery, useAppsQuery } from './hooks/use-app-data';
import { useUiStore } from './store/ui-store';
import type { ServiceEdge, ServiceNode, ServiceNodeData } from './types/graph';

export function App() {
  const selectedAppId = useUiStore((state) => state.selectedAppId);
  const setSelectedAppId = useUiStore((state) => state.setSelectedAppId);
  const selectedNodeId = useUiStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useUiStore((state) => state.setSelectedNodeId);
  const setMobilePanelOpen = useUiStore((state) => state.setMobilePanelOpen);
  const shouldMockError = useUiStore((state) => state.shouldMockError);
  const setShouldMockError = useUiStore((state) => state.setShouldMockError);
  const activeRailTab = useUiStore((state) => state.activeRailTab);
  const setActiveRailTab = useUiStore((state) => state.setActiveRailTab);

  const [nodes, setNodes] = useState<ServiceNode[]>([]);
  const [edges, setEdges] = useState<ServiceEdge[]>([]);
  const { fitView } = useReactFlow<ServiceNode, ServiceEdge>();

  const appsQuery = useAppsQuery();
  const graphQuery = useAppGraphQuery(selectedAppId, shouldMockError);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return nodes.filter(
      (node) =>
        node.data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.data.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [nodes, searchQuery]);

  useEffect(() => {
    if (!selectedAppId && appsQuery.data?.[0]) {
      setSelectedAppId(appsQuery.data[0].id);
    }
  }, [appsQuery.data, selectedAppId, setSelectedAppId]);

  useEffect(() => {
    if (graphQuery.data) {
      setNodes(graphQuery.data.nodes);
      setEdges(graphQuery.data.edges);
      setSelectedNodeId(null);
      window.setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
    }
  }, [fitView, graphQuery.data, setSelectedNodeId]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const handleNodesChange = (changes: NodeChange<ServiceNode>[]) => {
    setNodes((currentNodes) => applyNodeChanges(changes, currentNodes));
  };

  const handleEdgesChange = (changes: EdgeChange<ServiceEdge>[]) => {
    setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges));
  };

  const handleConnect = (connection: Connection) => {
    setEdges((currentEdges) => addEdge({ ...connection, animated: true }, currentEdges));
  };

  const updateSelectedNodeData = (patch: Partial<ServiceNodeData>) => {
    if (!selectedNodeId) {
      return;
    }

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === selectedNodeId ? { ...node, data: { ...node.data, ...patch } } : node,
      ),
    );
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) {
      return;
    }

    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedNodeId));
    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId),
    );
    setSelectedNodeId(null);
  };

  const addServiceNode = () => {
    const newId = `service-${Date.now()}`;
    const newNode: ServiceNode = {
      id: newId,
      type: 'default',
      position: { x: Math.random() * 100 + 200, y: Math.random() * 100 + 200 },
      data: {
        label: `New Service ${nodes.length + 1}`,
        description: 'Custom service node added to the canvas.',
        status: 'Healthy',
        capacity: 100,
        runtime: 'Node.js 20',
        region: 'us-east-1',
      },
    };
    setNodes((current) => [...current, newNode]);
    setSelectedNodeId(newId);
    setActiveRailTab('graph');
  };

  const exportGraph = () => {
    const graphData = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([graphData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedAppId || 'app'}-graph.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          window.setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
        } else {
          alert('Invalid file format. Nodes and edges array required.');
        }
      } catch {
        alert('Failed to parse graph JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const resetGraph = () => {
    graphQuery.refetch();
    setActiveRailTab('graph');
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setActiveRailTab('graph');
  };

  return (
    <div className="app-shell">
      <aside className="left-rail" aria-label="Primary navigation">
        <div className="rail-logo">
          <GitBranch size={20} />
        </div>
        <button
          className={activeRailTab === 'graph' ? 'rail-item is-active' : 'rail-item'}
          aria-label="Graph"
          onClick={() => setActiveRailTab('graph')}
        >
          <Zap size={19} />
        </button>
        <button
          className={activeRailTab === 'search' ? 'rail-item is-active' : 'rail-item'}
          aria-label="Search"
          onClick={() => setActiveRailTab('search')}
        >
          <Search size={19} />
        </button>
        <button
          className={activeRailTab === 'settings' ? 'rail-item is-active' : 'rail-item'}
          aria-label="Settings"
          onClick={() => setActiveRailTab('settings')}
        >
          <Settings size={19} />
        </button>
      </aside>

      <div className="workspace">
        <header className="top-bar">
          <div>
            <p className="eyebrow">ReactFlow Canvas</p>
            <h1>App Graph Builder</h1>
          </div>
          <div className="top-actions">
            <label
              className="error-toggle"
              title="Simulates API or gateway connection failures to test query error states"
            >
              <input
                type="checkbox"
                checked={shouldMockError}
                onChange={(event) => setShouldMockError(event.target.checked)}
              />
              Mock error
            </label>
            <Button
              type="button"
              variant="secondary"
              onClick={() => graphQuery.refetch()}
              disabled={graphQuery.isFetching}
            >
              <RefreshCw size={16} className={graphQuery.isFetching ? 'animate-spin' : ''} />
              Refetch
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => fitView({ padding: 0.2, duration: 300 })}
              title="Automatically center and fit all nodes within the canvas viewport"
            >
              <Maximize size={16} />
              Fit
            </Button>
            <Button type="button" variant="secondary" onClick={addServiceNode} title="Add a new service node to the canvas">
              <Plus size={16} />
              Add Node
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={toggleDarkMode}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <Button
              type="button"
              variant="primary"
              className="mobile-panel-button"
              onClick={() => setMobilePanelOpen(true)}
            >
              <Menu size={16} />
              Panel
            </Button>
          </div>
        </header>

        <main className="main-grid">
          <section className="canvas-region" aria-label="Application graph canvas">
            {graphQuery.isFetching && !graphQuery.isLoading && (
              <div className="canvas-fetching-indicator">
                <RefreshCw size={14} className="animate-spin" />
                Updating graph...
              </div>
            )}

            {/* Search Overlay */}
            {activeRailTab === 'search' && (
              <div className="canvas-search-overlay">
                <div className="search-header">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search service nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="search-input"
                  />
                  <button onClick={() => setActiveRailTab('graph')} className="search-close-btn" title="Close search">
                    <X size={16} />
                  </button>
                </div>
                {searchQuery.trim() && (
                  <div className="search-results">
                    {filteredNodes.length === 0 ? (
                      <div className="search-empty">No service nodes matched</div>
                    ) : (
                      filteredNodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => {
                            setSelectedNodeId(node.id);
                            fitView({ nodes: [node], duration: 400, padding: 0.8 });
                          }}
                          className={`search-result-item ${selectedNodeId === node.id ? 'is-selected' : ''}`}
                        >
                          <div className="result-name">{node.data.label}</div>
                          <div className="result-desc">{node.data.description || 'No description'}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings Overlay */}
            {activeRailTab === 'settings' && (
              <div className="canvas-settings-overlay">
                <div className="settings-header">
                  <h3>Canvas Settings</h3>
                  <button onClick={() => setActiveRailTab('graph')} className="settings-close-btn" title="Close settings">
                    <X size={16} />
                  </button>
                </div>
                <div className="settings-body">
                  <div className="settings-group">
                    <h4>Predefined Graph Actions</h4>
                    <div className="settings-buttons">
                      <Button type="button" variant="secondary" onClick={resetGraph}>
                        Reset to Default
                      </Button>
                      <Button type="button" variant="danger" onClick={clearGraph}>
                        Clear Canvas
                      </Button>
                    </div>
                  </div>
                  
                  <div className="settings-group">
                    <h4>Backup & Share</h4>
                    <div className="settings-buttons">
                      <Button type="button" variant="primary" onClick={exportGraph}>
                        Export JSON
                      </Button>
                      <label className="btn btn-secondary btn-sm file-upload-label">
                        Import JSON
                        <input type="file" accept=".json" onChange={importGraph} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {appsQuery.isLoading || (graphQuery.isLoading && nodes.length === 0) ? (
              <div className="canvas-loading">
                <Skeleton className="skeleton-node" />
                <Skeleton className="skeleton-node wide" />
                <Skeleton className="skeleton-node" />
              </div>
            ) : graphQuery.isError ? (
              <div className="error-state">
                <AlertTriangle size={28} />
                <h2>Graph failed to load</h2>
                <p>{graphQuery.error.message}</p>
                <Button type="button" variant="primary" onClick={() => graphQuery.refetch()}>
                  Try again
                </Button>
              </div>
            ) : (
              <AppCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={handleConnect}
                onNodeSelect={setSelectedNodeId}
                onDeleteSelected={deleteSelectedNode}
              />
            )}
          </section>

          <AppPanel
            apps={appsQuery.data ?? []}
            appsLoading={appsQuery.isLoading}
            selectedNode={selectedNode}
            onUpdateSelectedNode={updateSelectedNodeData}
          />
        </main>
      </div>
    </div>
  );
}
