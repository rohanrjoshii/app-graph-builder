# Interview Explanation Notes

## 1. Project Goal

This project is an App Graph Builder. The center of the UI is a ReactFlow canvas showing service nodes and dependencies. The right panel lets the user choose an app and inspect/edit the selected service node.

The assignment mainly tests whether the app separates layout, server state, local UI state, and canvas state cleanly.

## 2. Architecture

The code is split into focused areas:

- `src/api/mock-api.ts`: mock backend endpoints with simulated latency.
- `src/hooks/use-app-data.ts`: TanStack Query hooks for fetching apps and app graphs.
- `src/store/ui-store.ts`: Zustand store for UI-only state.
- `src/components/AppCanvas.tsx`: ReactFlow canvas and canvas interactions.
- `src/components/AppPanel.tsx`: right panel and mobile drawer shell.
- `src/components/AppSelector.tsx`: app list.
- `src/components/NodeInspector.tsx`: selected node editor.
- `src/components/ui/*`: small shadcn-style UI primitives.

This keeps the main `App.tsx` responsible for orchestration instead of putting every UI detail in one file.

## 3. TanStack Query Explanation

TanStack Query is used for data that behaves like server data:

- `useAppsQuery()` calls the mock `GET /apps`.
- `useAppGraphQuery(appId, shouldFail)` calls the mock `GET /apps/:appId/graph`.
- The query key includes the app id, so changing the selected app automatically fetches the correct graph.
- Loading and error states are rendered from query state.
- The mock error toggle is included in the graph query key so the error demo is predictable.
- Implemented background refetching UI with a spinning icon on the Refetch button and a non-intrusive canvas overlay indicator to communicate background network updates clearly without interrupting the user.

Important interview point: server data and UI state are intentionally separated. Query owns fetched/cached data, not drawer state or selected tabs.

## 4. Zustand Explanation

Zustand stores UI state that does not belong in the backend cache:

- `selectedAppId`
- `selectedNodeId`
- `isMobilePanelOpen`
- `activeInspectorTab`
- `shouldMockError`

The store is intentionally small. It does not store derived data like the whole selected node object. The selected node is derived from the local ReactFlow nodes array using `selectedNodeId`.

## 5. ReactFlow Explanation

ReactFlow renders the graph with nodes and edges from the selected app.

Implemented interactions:

- Nodes can be dragged.
- Clicking a node updates `selectedNodeId`.
- Delete/Backspace removes the selected node and connected edges.
- Zoom and pan use ReactFlow defaults.
- Fit view runs when graph data loads and is also available from the top bar.
- The dotted canvas uses ReactFlow's `Background` with `BackgroundVariant.Dots`.

Important implementation detail: fetched graph data is copied into local React state. That allows drag, delete, and inspector edits without mutating the TanStack Query cache directly.

## 6. Inspector Explanation

The inspector appears only when a node is selected.

It includes:

- A status badge for `Healthy`, `Degraded`, or `Down`.
- `Config` and `Runtime` tabs.
- Editable node name and description.
- A capacity slider and number input.

The slider and number input both read from `selectedNode.data.capacity`. Updating either control patches the selected node's `data`, so both controls stay synced and the value stays attached to the node.

## 7. Responsive Layout Explanation

The desktop layout has:

- left icon rail
- top bar
- center canvas
- right panel

At smaller widths, CSS media queries move the right panel into a fixed slide-over drawer. Zustand controls whether the drawer is open through `isMobilePanelOpen`.

## 8. Left Navigation Rail & Advanced Actions

The left navigation rail switches between primary views and tools using Zustand `activeRailTab` state:
- **Graph (Zap)**: The default full-screen interactive topology view.
- **Search (Magnifying Glass)**: A floating search card overlay to query nodes in real-time. Selecting a search match focuses and smooth-centers (`fitView`) on the node.
- **Settings (Gear)**: A panel allowing predefined graph operations:
  - **Reset to Default**: Re-fetches default application graph properties.
  - **Clear Canvas**: Clears all nodes and edges to begin from blank.
  - **Export JSON**: Downloads the active graph layout state as a local JSON file backup.
  - **Import JSON**: Uploads and parses any graph JSON structure onto the active canvas.
- **Add Service Node (Plus)**: Allows inserting new custom service nodes dynamically into the viewport.

## 9. How To Demo It

1. Start the app with `npm run dev`.
2. Show the three service nodes and two edges.
3. Drag a node to show ReactFlow interaction.
4. Click a node to open the inspector.
5. Edit the node name and show the node label updating on the canvas.
6. Move the capacity slider and type a number to show synced controls.
7. Switch apps and explain TanStack Query refetching by app id.
8. Turn on `Mock error`, click `Refetch`, and show the error state.
9. Resize to mobile width and show the Panel drawer.

## 10. Tradeoffs And Limitations

- The backend is mocked with delayed promises instead of MSW to keep the project small and easy to read.
- Node edits are local and not persisted to a backend.
- The shadcn-style components are local minimal primitives instead of generated components from the shadcn CLI.
- The mock error is controlled by a toggle rather than random failure, which makes the demo repeatable.
