import { useReducer, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'map-app-visited';
const SCHEMA_VERSION = 1;

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed.version !== SCHEMA_VERSION) return {};
    return parsed.visited ?? {};
  } catch {
    return {};
  }
}

function saveToStorage(visited) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, visited }));
}

function initState() {
  return { visited: loadFromStorage(), undoStack: [] };
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const next = { ...state.visited };
      if (next[action.id]) {
        delete next[action.id];
      } else {
        next[action.id] = true;
      }
      return { visited: next, undoStack: [...state.undoStack, state.visited] };
    }
    case 'UNDO': {
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      return { visited: prev, undoStack: state.undoStack.slice(0, -1) };
    }
    case 'RESET':
      return { visited: {}, undoStack: [] };
    default:
      return state;
  }
}

export function useVisited() {
  const [state, dispatch] = useReducer(reducer, null, initState);

  useEffect(() => {
    saveToStorage(state.visited);
  }, [state.visited]);

  const toggle = useCallback((id) => dispatch({ type: 'TOGGLE', id }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    visited: state.visited,
    toggle,
    undo,
    canUndo: state.undoStack.length > 0,
    reset,
  };
}
