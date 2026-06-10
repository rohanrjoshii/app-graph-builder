import { create } from 'zustand';

type InspectorTab = 'config' | 'runtime';

type RailTab = 'graph' | 'search' | 'settings';

type UiState = {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  shouldMockError: boolean;
  activeRailTab: RailTab;
  setSelectedAppId: (appId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setMobilePanelOpen: (isOpen: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
  setShouldMockError: (enabled: boolean) => void;
  setActiveRailTab: (tab: RailTab) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  shouldMockError: false,
  activeRailTab: 'graph',
  setSelectedAppId: (appId) =>
    set({
      selectedAppId: appId,
      selectedNodeId: null,
      isMobilePanelOpen: false,
      activeInspectorTab: 'config',
      activeRailTab: 'graph',
    }),
  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),
  setMobilePanelOpen: (isOpen) => set({ isMobilePanelOpen: isOpen }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  setShouldMockError: (enabled) => set({ shouldMockError: enabled }),
  setActiveRailTab: (tab) => set({ activeRailTab: tab }),
}));
