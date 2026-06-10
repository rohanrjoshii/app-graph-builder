import { Server, X } from 'lucide-react';
import { useUiStore } from '../store/ui-store';
import type { AppSummary, ServiceNode, ServiceNodeData } from '../types/graph';
import { AppSelector } from './AppSelector';
import { NodeInspector } from './NodeInspector';
import { Button } from './ui/button';

type AppPanelProps = {
  apps: AppSummary[];
  appsLoading: boolean;
  selectedNode: ServiceNode | null;
  onUpdateSelectedNode: (patch: Partial<ServiceNodeData>) => void;
};

export function AppPanel({ apps, appsLoading, selectedNode, onUpdateSelectedNode }: AppPanelProps) {
  const isMobilePanelOpen = useUiStore((state) => state.isMobilePanelOpen);
  const setMobilePanelOpen = useUiStore((state) => state.setMobilePanelOpen);

  return (
    <>
      <div
        className={isMobilePanelOpen ? 'panel-backdrop is-open' : 'panel-backdrop'}
        onClick={() => setMobilePanelOpen(false)}
      />
      <aside className={isMobilePanelOpen ? 'right-panel is-open' : 'right-panel'} aria-label="App details panel">
        <div className="panel-mobile-header">
          <div className="panel-title">
            <Server size={18} />
            App details
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => setMobilePanelOpen(false)}>
            <X size={18} />
          </Button>
        </div>

        <AppSelector apps={apps} isLoading={appsLoading} />
        <NodeInspector selectedNode={selectedNode} onUpdateSelectedNode={onUpdateSelectedNode} />
      </aside>
    </>
  );
}
