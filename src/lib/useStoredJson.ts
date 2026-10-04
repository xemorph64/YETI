"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const EVENT = "yeti-storage";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange); // other tabs
  window.addEventListener(EVENT, onChange); // this tab
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/**
 * A JSON value in localStorage, read as an external store: the server and the
 * hydration pass render `fallback`, then React switches to the stored value
 * without a setState-in-effect. `fallback` must be a stable (module-level) value.
 */
export function useStoredJson<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
  const value = useMemo<T>(() => {
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }, [raw, fallback]);
  const write = useCallback(
    (next: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // ponytail: storage blocked → progress is not kept; add an in-memory store if that matters
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [value, write] as const;
}
