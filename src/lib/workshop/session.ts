import {
  ARCHIVE,
  DEFAULT_CONFIG,
  formatCast,
  ideaImage,
  SCREENS,
  type ArchiveItem,
  type CharacterId,
  type SceneConfig,
  type ScreenId,
} from "./data";

export type SceneEntry = {
  id: string;
  kind: "opening" | "continuation";
  label: string;
  text: string;
  source: "configuration" | "director";
  generated?: boolean;
  instruction?: string;
  revision?: number;
};

export type SceneHistory = {
  current: () => SceneEntry[];
  generate: (entry: SceneEntry | string) => SceneHistory;
  reroll: (entry: SceneEntry | string) => SceneHistory;
  undo: () => SceneHistory;
};

export type SceneSession = {
  config: SceneConfig;
  history: SceneHistory;
  directorInstruction: string;
  notes: string;
};

export type AppState = {
  screen: ScreenId;
  stack: ScreenId[];
  selectedCharacterId: CharacterId;
  selectedSceneId: string;
  sceneConfig: SceneConfig;
};

export const INITIAL_STATE: AppState = {
  screen: "libraries",
  stack: [],
  selectedCharacterId: "ryo",
  selectedSceneId: "first-encounter",
  sceneConfig: { ...DEFAULT_CONFIG, cast: [...DEFAULT_CONFIG.cast] },
};

const STORAGE_KEY = "lunelle-workshop-v1";

export type PersistedWorkshop = {
  sceneConfig: SceneConfig;
  savedArchive: ArchiveItem[];
  notesByScene: Record<string, string>;
};

export function loadPersisted(): PersistedWorkshop | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedWorkshop;
    if (!parsed?.sceneConfig) return null;
    return {
      sceneConfig: {
        ...DEFAULT_CONFIG,
        ...parsed.sceneConfig,
        cast: parsed.sceneConfig.cast?.length
          ? parsed.sceneConfig.cast
          : [...DEFAULT_CONFIG.cast],
      },
      savedArchive: Array.isArray(parsed.savedArchive) ? parsed.savedArchive : [],
      notesByScene: parsed.notesByScene ?? {},
    };
  } catch {
    return null;
  }
}

export function savePersisted(data: PersistedWorkshop) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota */
  }
}

function slug(prefix: string, seed: string) {
  const rest =
    String(seed)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "scene";
  return `${prefix}-${rest}`;
}

function normalizeEntry(
  entry: SceneEntry | string,
  index: number,
  kind: SceneEntry["kind"] = "continuation",
): SceneEntry {
  if (typeof entry === "string") {
    return {
      id: slug(kind, `${index}-${entry}`),
      kind,
      label: kind === "opening" ? "Scene" : `Continuation ${index}`,
      text: entry,
      source: kind === "opening" ? "configuration" : "director",
      generated: kind === "continuation",
    };
  }
  return { ...entry };
}

export function openingEntries(config: SceneConfig): SceneEntry[] {
  const cast = formatCast(config.cast ?? []);
  const timeline = config.timeline?.trim() || "Unspecified timeline";
  const setting = config.setting?.trim() || "An undefined setting";
  const premise = config.premise?.trim() || "An open-ended moment";
  const mood = config.mood?.trim() || "an unhurried mood";
  return [
    {
      id: slug("opening-setting", setting),
      kind: "opening",
      label: "Setting",
      text: `${setting} frames the opening of “${premise}” during ${timeline}, held in a mood of ${mood}.`,
      source: "configuration",
    },
    {
      id: slug("opening-cast", cast),
      kind: "opening",
      label: "Cast",
      text: `${cast} are the people present as this scene begins, carrying the possibilities of ${premise}.`,
      source: "configuration",
    },
    {
      id: slug("opening-premise", premise),
      kind: "opening",
      label: "Premise",
      text: `The first dramatic question is simple: how will ${cast} respond as “${premise}” unfolds?`,
      source: "configuration",
    },
  ];
}

export function makeContinuation(
  instruction: string,
  text: string,
  n = 1,
): SceneEntry {
  const prompt = instruction?.trim() || "Continue naturally from the current moment.";
  return {
    id: slug(`continuation-${n}`, `${prompt}-${text}`),
    kind: "continuation",
    label: `Continuation ${n}`,
    text: text.trim(),
    source: "director",
    generated: true,
    instruction: prompt,
    revision: n,
  };
}

export function inspirePrompt(config: SceneConfig, entries: SceneEntry[] = []) {
  const cast = formatCast(config.cast ?? []);
  const timeline = config.timeline?.trim() || "the current timeline";
  const setting = config.setting?.trim() || "the current setting";
  const premise = config.premise?.trim() || "the current premise";
  const last = entries.at(-1);
  return `${last ? `Build from the latest ${last.label.toLowerCase()}` : "Begin with the opening context"} and let ${cast} explore “${premise}” at ${setting}, keeping the tone grounded in ${timeline}.`;
}

export function memoryBeats(config: SceneConfig, entries: SceneEntry[] = []) {
  const beats = [
    `${formatCast(config.cast ?? [])} are present for “${config.premise || "Untitled Scene"}”.`,
    `The scene is set at ${config.setting || "an unspecified setting"}.`,
    `This moment belongs to ${config.timeline || "an unspecified timeline"}.`,
  ];
  const last = entries.at(-1);
  if (last) beats.push(`Latest development: ${last.text}`);
  return beats;
}

export function currentBeat(config: SceneConfig, entries: SceneEntry[] = []) {
  const last = entries.at(-1);
  const count = entries.length;
  if (last) {
    return {
      title: last.label,
      description: last.text,
      stepLabel: `${count} scene ${count === 1 ? "entry" : "entries"} · Open-ended draft`,
    };
  }
  return {
    title: config.premise || "Untitled Scene",
    description: `An open-ended scene ready for ${formatCast(config.cast ?? [])}.`,
    stepLabel: "No scene entries yet · Open-ended draft",
  };
}

export function createHistory(seed: SceneEntry[] = []): SceneHistory {
  let stack: SceneEntry[][] = [
    [],
    seed.map((e, i) => normalizeEntry(e, i, "opening")),
  ];
  const wrap = (): SceneHistory => {
    const api: SceneHistory = {
      current: () => (stack.at(-1) ?? []).map((e) => ({ ...e })),
      generate(entry) {
        const last = stack.at(-1) ?? [];
        stack = [...stack, [...last, normalizeEntry(entry, last.length)]];
        return wrap();
      },
      reroll(entry) {
        const last = stack.at(-1) ?? [];
        if (last.at(-1)?.kind === "continuation") {
          stack = [
            ...stack.slice(0, -1),
            [...last.slice(0, -1), normalizeEntry(entry, last.length - 1)],
          ];
        }
        return wrap();
      },
      undo() {
        if (stack.length > 1) stack = stack.slice(0, -1);
        return wrap();
      },
    };
    return api;
  };
  return wrap();
}

export function createSession(
  config: SceneConfig,
  notes = "",
): SceneSession {
  const next = { ...config, cast: [...(config.cast ?? [])] };
  return {
    config: next,
    history: createHistory(openingEntries(next)),
    directorInstruction: "",
    notes,
  };
}

export function pushScreen(state: AppState, screen: ScreenId): AppState {
  if (!SCREENS.includes(screen) || state.screen === screen) return state;
  return { ...state, screen, stack: [...state.stack, state.screen] };
}

export function jumpScreen(state: AppState, screen: ScreenId): AppState {
  if (!SCREENS.includes(screen) || state.screen === screen) return state;
  return { ...state, screen, stack: screen === "home" ? [] : ["home"] };
}

export function selectCharacter(state: AppState, id: string): AppState {
  if (!["ryo", "ren", "natsuki", "raina"].includes(id)) return state;
  return pushScreen(
    { ...state, selectedCharacterId: id as CharacterId },
    "profile",
  );
}

export function findArchiveItem(
  id: string,
  extra: ArchiveItem[] = [],
): ArchiveItem | undefined {
  return extra.find((s) => s.id === id) ?? ARCHIVE.find((s) => s.id === id);
}

export function openArchiveScene(
  state: AppState,
  id: string,
  extra: ArchiveItem[] = [],
): AppState {
  const scene = findArchiveItem(id, extra);
  if (!scene) return state;
  const config = scene.config ?? state.sceneConfig;
  return pushScreen(
    {
      ...state,
      selectedSceneId: scene.id,
      sceneConfig: { ...config, cast: [...config.cast] },
    },
    "workspace",
  );
}

export function goBack(state: AppState): AppState {
  if (!state.stack.length) return pushScreen(state, "home");
  const stack = state.stack.slice(0, -1);
  return { ...state, screen: state.stack.at(-1) as ScreenId, stack };
}

export function patchConfig(state: AppState, patch: Partial<SceneConfig>): AppState {
  return { ...state, sceneConfig: { ...state.sceneConfig, ...patch } };
}

export function filterArchive(filter: string, extra: ArchiveItem[] = []) {
  const seen = new Set<string>();
  const items = [...extra, ...ARCHIVE].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
  if (filter === "all") return items;
  return items.filter((item) => item.filter === filter);
}

export function makeSavedScene(
  config: SceneConfig,
  excerpt: string,
): ArchiveItem {
  const title = config.premise?.trim() || "Untitled Scene";
  return {
    id: `saved-${Date.now()}`,
    status: "Saved",
    filter: "saved",
    title,
    meta: `${config.timeline} · ${config.setting}`,
    image: ideaImage(title),
    available: true,
    config: { ...config, cast: [...config.cast] },
    excerpt: excerpt.slice(0, 280),
  };
}