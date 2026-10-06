import { APP_CONFIG } from "@/lib/config";
import type { TextItem } from "@/types/learning";

export type StrofaState = {
  items: TextItem[];
  activeTextId?: string;
  theme: "light" | "dark";
};

const initial: StrofaState = {
  items: [],
  theme: "light",
};

export function loadState(): StrofaState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(APP_CONFIG.storageKey);
    if (!raw) return initial;
    return { ...initial, ...JSON.parse(raw) } as StrofaState;
  } catch {
    return initial;
  }
}

export function saveState(state: StrofaState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(state));
}
