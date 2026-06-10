import { Database } from 'lucide-react';
import { useUiStore } from '../store/ui-store';
import type { AppSummary } from '../types/graph';
import { Skeleton } from './ui/skeleton';

type AppSelectorProps = {
  apps: AppSummary[];
  isLoading: boolean;
};

export function AppSelector({ apps, isLoading }: AppSelectorProps) {
  const selectedAppId = useUiStore((state) => state.selectedAppId);
  const setSelectedAppId = useUiStore((state) => state.setSelectedAppId);

  return (
    <section className="panel-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Apps</p>
          <h2>Application list</h2>
        </div>
        <Database size={18} />
      </div>

      <div className="app-list">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="app-skeleton" />)
          : apps.map((app) => (
              <button
                type="button"
                key={app.id}
                className={app.id === selectedAppId ? 'app-card is-selected' : 'app-card'}
                onClick={() => setSelectedAppId(app.id)}
              >
                <span className="app-card-title">{app.name}</span>
                <span className="app-card-meta">
                  {app.environment} · {app.owner}
                </span>
              </button>
            ))}
      </div>
    </section>
  );
}
