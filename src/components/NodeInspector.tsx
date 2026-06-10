import { Activity, Gauge, ServerCog, Cpu, HardDrive, CircleDollarSign } from 'lucide-react';
import { useUiStore } from '../store/ui-store';
import type { ServiceNode, ServiceNodeData } from '../types/graph';
import { Badge } from './ui/badge';
import { Input, Textarea } from './ui/input';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type NodeInspectorProps = {
  selectedNode: ServiceNode | null;
  onUpdateSelectedNode: (patch: Partial<ServiceNodeData>) => void;
};

export function NodeInspector({ selectedNode, onUpdateSelectedNode }: NodeInspectorProps) {
  const activeInspectorTab = useUiStore((state) => state.activeInspectorTab);
  const setActiveInspectorTab = useUiStore((state) => state.setActiveInspectorTab);

  if (!selectedNode) {
    return (
      <section className="panel-section inspector-empty">
        <ServerCog size={28} />
        <h2>Select a service node</h2>
        <p>Click a node on the canvas to edit its configuration and view runtime details.</p>
      </section>
    );
  }

  const capacity = selectedNode.data.capacity;
  const clampValue = (nextValue: number) => Math.min(100, Math.max(0, nextValue));

  return (
    <section className="panel-section inspector">
      <div className="section-heading">
        <div className="inspector-title-area">
          <p className="eyebrow">Inspector</p>
          <h2>{selectedNode.data.label}</h2>
          {selectedNode.data.pricing && (
            <div className="pricing-indicator">
              <CircleDollarSign size={13} />
              <span>{selectedNode.data.pricing}</span>
            </div>
          )}
        </div>
        <Badge status={selectedNode.data.status}>{selectedNode.data.status}</Badge>
      </div>

      <Tabs value={activeInspectorTab} onValueChange={(value) => setActiveInspectorTab(value as 'config' | 'runtime')}>
        <TabsList className="tabs-list" aria-label="Inspector tabs">
          <TabsTrigger className="tabs-trigger" value="config">
            Config
          </TabsTrigger>
          <TabsTrigger className="tabs-trigger" value="runtime">
            Runtime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="tabs-content">
          <label className="field-group">
            <span>Node name</span>
            <Input
              value={selectedNode.data.label}
              onChange={(event) => onUpdateSelectedNode({ label: event.target.value })}
            />
          </label>

          <label className="field-group">
            <span>Description</span>
            <Textarea
              value={selectedNode.data.description}
              onChange={(event) => onUpdateSelectedNode({ description: event.target.value })}
            />
          </label>

          <div className="field-group">
            <div className="capacity-heading">
              <span>Overall Capacity</span>
              <Gauge size={16} />
            </div>
            <div className="capacity-row">
              <Slider value={capacity} onValueChange={(value) => onUpdateSelectedNode({ capacity: value })} />
              <Input
                type="number"
                min={0}
                max={100}
                className="number-input"
                value={capacity}
                onChange={(event) =>
                  onUpdateSelectedNode({ capacity: clampValue(Number(event.target.value) || 0) })
                }
              />
            </div>
          </div>

          <div className="field-group">
            <div className="capacity-heading">
              <span>CPU Allocation</span>
              <Cpu size={16} />
            </div>
            <div className="capacity-row">
              <Slider 
                value={selectedNode.data.cpu ?? 50} 
                onValueChange={(value) => onUpdateSelectedNode({ cpu: value })} 
              />
              <Input
                type="number"
                min={0}
                max={100}
                className="number-input"
                value={selectedNode.data.cpu ?? 50}
                onChange={(event) =>
                  onUpdateSelectedNode({ cpu: clampValue(Number(event.target.value) || 0) })
                }
              />
            </div>
          </div>

          <div className="field-group">
            <div className="capacity-heading">
              <span>Memory Allocation</span>
              <Activity size={16} />
            </div>
            <div className="capacity-row">
              <Slider 
                value={selectedNode.data.memory ?? 50} 
                onValueChange={(value) => onUpdateSelectedNode({ memory: value })} 
              />
              <Input
                type="number"
                min={0}
                max={100}
                className="number-input"
                value={selectedNode.data.memory ?? 50}
                onChange={(event) =>
                  onUpdateSelectedNode({ memory: clampValue(Number(event.target.value) || 0) })
                }
              />
            </div>
          </div>

          <div className="field-group">
            <div className="capacity-heading">
              <span>Disk Allocation</span>
              <HardDrive size={16} />
            </div>
            <div className="capacity-row">
              <Slider 
                value={selectedNode.data.disk ?? 50} 
                onValueChange={(value) => onUpdateSelectedNode({ disk: value })} 
              />
              <Input
                type="number"
                min={0}
                max={100}
                className="number-input"
                value={selectedNode.data.disk ?? 50}
                onChange={(event) =>
                  onUpdateSelectedNode({ disk: clampValue(Number(event.target.value) || 0) })
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="tabs-content runtime-list">
          <div className="runtime-item">
            <Activity size={17} />
            <div>
              <span>Status</span>
              <strong>{selectedNode.data.status}</strong>
            </div>
          </div>
          <div className="runtime-item">
            <ServerCog size={17} />
            <div>
              <span>Runtime</span>
              <strong>{selectedNode.data.runtime}</strong>
            </div>
          </div>
          <div className="runtime-item">
            <Gauge size={17} />
            <div>
              <span>Region</span>
              <strong>{selectedNode.data.region}</strong>
            </div>
          </div>
          <div className="runtime-item">
            <CircleDollarSign size={17} />
            <div>
              <span>Resource Cost</span>
              <strong>{selectedNode.data.pricing || '$0.00/HR'}</strong>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
