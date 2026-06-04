# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive US + Canada map app built with React, Vite, and React-Leaflet. Users can explore regions on an overview map, drill into region-level maps, mark waypoints as visited, and undo actions.

## Build / Run Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server (Vite, localhost:5173)
npm run build      # production build
npm run preview    # preview production build
```

No test suite or lint tooling is configured.

## Architecture

- **Entry**: `src/main.jsx` → `src/App.jsx`
- **Views**: Two map levels — `OverviewMap` (full US + Canada) and `RegionMap` (drill-down per region)
- **Navigation**: `BackButton` returns from region view to overview; `MapZoomer` handles zoom behavior
- **State**: `useVisited` hook (persists visited waypoints), `UndoButton` for undo
- **Data**: `src/data/waypoints.js` (waypoint definitions), `src/data/regionMeta.js` (region metadata)
- **Utils**: `geoUtils.js` (geographic helpers), `markerIcons.js` (Leaflet icon config)
- **Components**: `RegionLayer`, `WaypointMarker`, `WaypointPopup` handle map rendering and interaction
- **Styling**: Per-component CSS files alongside each component
