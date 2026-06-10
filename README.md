# App Graph Builder

**Live Demo** → [Add your Vercel/Netlify link here after deploying]

A polished, responsive ReactFlow canvas for visualizing and interacting with microservice application graphs.

Built as a complete submission for the **Frontend Intern** role, showcasing modern React architecture, excellent UX, and thoughtful state management.

![Main Screenshot](public/screenshots/main.png)
![Node Inspector](public/screenshots/inspector.png)
![Mobile Drawer](public/screenshots/mobile.png)

## Design Reference & Approach

The reference design showcases a dark-themed monitoring dashboard with service cards containing resource metrics (CPU, Memory, Disk), pricing, and status indicators.

**My Implementation**:
- I interpreted the core requirement as building an **interactive service dependency graph** (using ReactFlow) — which goes beyond static cards while preserving the rich inspector experience.
- The node inspector closely mirrors the reference: synced sliders for CPU, Memory, and Disk allocations, status badges, instance cost specifications, runtime details, and tabs.
- Added a **Dark Mode Theme** switcher in the top bar to fully align the visual design with the premium monitoring style.
- This gives a more powerful, real-world architecture visualization tool while hitting all the key UI elements from the example.

## Features

| Feature                        | Description |
|-------------------------------|-----------|
| **Interactive Graph**         | Drag, zoom, pan, select, delete nodes & edges with smooth ReactFlow behavior |
| **Responsive Dashboard**      | Top bar, icon rail, right sidebar that becomes a slide-over drawer on mobile |
| **Rich Node Inspector**       | Status badges, Config/Runtime tabs, editable name & description, **synced slider + numeric input** |
| **Modern Data Fetching**      | TanStack Query with loading skeletons, error states, caching & automatic refetching |
| **Clean State Architecture**  | TanStack Query (server cache) + Zustand (UI state) + local React state (canvas) |
| **Polished UI**               | Custom shadcn-style components, micro-interactions, glassmorphism, smooth animations |

## Tech Stack
- **React 18 + Vite** + **Strict TypeScript**
- **@xyflow/react** (ReactFlow)
- **TanStack Query** + **Zustand**
- Custom UI components (Badge, Tabs, Slider, Button, etc.)

## Setup

```bash
npm install
npm run dev
```

**Quick Checks**
```bash
npm run lint
npm run typecheck
npm run build
```

## Architecture Highlights

- **Server vs UI State Separation**: TanStack Query handles API cache (`/apps` and `/apps/:id/graph`). Zustand manages transient UI state (selected app/node, mobile drawer, active tab, mock error).
- **Local Canvas State**: Graph data is copied into React `useState` so users can freely drag/edit/delete nodes without mutating the query cache.
- **Synced Controls**: Slider and number input stay perfectly in sync when editing node capacity.
- **Mock API**: Realistic delayed responses + configurable error simulation for demo purposes.

## Known Limitations (Honest)

- Mock data resets on refresh (no real backend persistence)
- Node edits stay in local session only
- Error toggle is manual (easier to demo in interviews)

## Interview Prep

Read `INTERVIEW_NOTES.md` — it contains a clear walkthrough of the architecture, data flow, key decisions, and a suggested demo script.

---

**Made with ❤️ for the Frontend Intern position at [Company Name]**
