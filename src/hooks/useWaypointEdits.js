import { useState, useCallback } from 'react';

const STORAGE_KEY = 'map-app-waypoint-edits';
const SCHEMA_VERSION = 1;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed.version !== SCHEMA_VERSION) return {};
    return parsed.edits ?? {};
  } catch {
    return {};
  }
}

function persist(edits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, edits }));
}

export function useWaypointEdits() {
  const [edits, setEdits] = useState(load);

  const editWaypoint = useCallback((id, changes) => {
    setEdits(prev => {
      const next = { ...prev, [id]: { ...(prev[id] ?? {}), ...changes } };
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setEdits({});
  }, []);

  return { waypointEdits: edits, editWaypoint, resetWaypointEdits: reset };
}
