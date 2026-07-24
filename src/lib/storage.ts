import type { ProcessOptions } from "@/lib/image/process";

const LAST_STATE_KEY = "sit:lastState:v1";
const PRESETS_KEY = "sit:presets:v1";

export type PersistedState = {
  selectedSpecIds: string[];
  options: ProcessOptions;
  removeBgEnabled: boolean;
};

export type Preset = {
  id: string;
  name: string;
  createdAt: string;
  state: PersistedState;
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadLastState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  return safeParse<PersistedState>(window.localStorage.getItem(LAST_STATE_KEY));
}

export function saveLastState(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_STATE_KEY, JSON.stringify(state));
  } catch {
    // 용량 초과 등 무시
  }
}

export function loadPresets(): Preset[] {
  if (typeof window === "undefined") return [];
  return safeParse<Preset[]>(window.localStorage.getItem(PRESETS_KEY)) ?? [];
}

export function savePresets(presets: Preset[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch {
    // ignore
  }
}

export function upsertPreset(name: string, state: PersistedState): Preset[] {
  const presets = loadPresets();
  const existingIdx = presets.findIndex((p) => p.name === name);
  const preset: Preset = {
    id: existingIdx >= 0 ? presets[existingIdx].id : cryptoRandomId(),
    name,
    createdAt: new Date().toISOString(),
    state,
  };
  const next =
    existingIdx >= 0
      ? presets.map((p, i) => (i === existingIdx ? preset : p))
      : [...presets, preset];
  savePresets(next);
  return next;
}

export function deletePreset(id: string): Preset[] {
  const next = loadPresets().filter((p) => p.id !== id);
  savePresets(next);
  return next;
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
