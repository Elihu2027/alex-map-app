import { useState, useCallback } from 'react';

const STORAGE_KEY = 'map-app-custom-waypoints';
const SCHEMA_VERSION = 1;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed.version !== SCHEMA_VERSION) return [];
    return parsed.waypoints ?? [];
  } catch {
    return [];
  }
}

function persist(waypoints) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, waypoints }));
}

export function useCustomWaypoints() {
  const [waypoints, setWaypoints] = useState(load);

  const addWaypoint = useCallback((waypoint) => {
    setWaypoints(prev => {
      const next = [...prev, waypoint];
      persist(next);
      return next;
    });
  }, []);

  return { customWaypoints: waypoints, addWaypoint };
}
