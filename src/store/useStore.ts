import { create } from 'zustand';
import { Diagram, AppSettings } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_DIAGRAM_CODE, STORAGE_KEYS } from '../constants/defaults';

interface AppState {
  // Multi-diagram support
  diagrams: Diagram[];
  activeTabId: string;
  currentDiagram: Diagram;

  // Tab management
  addTab: (diagram?: Diagram) => void;
  closeTab: (id: string) => void;
  switchTab: (id: string) => void;

  // Legacy single diagram support
  setCurrentDiagram: (diagram: Diagram) => void;
  updateDiagramCode: (code: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  isPresentationMode: boolean;
  togglePresentationMode: () => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;
}

// Load settings from localStorage
const loadSettings = (): AppSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

// Load diagrams from localStorage
const loadDiagrams = (): { diagrams: Diagram[]; activeTabId: string } => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_DIAGRAMS);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        diagrams: data.diagrams.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: new Date(d.updatedAt),
        })),
        activeTabId: data.activeTabId,
      };
    }
  } catch {
    // Fall through to default
  }

  const defaultDiagram: Diagram = {
    id: crypto.randomUUID(),
    name: 'Untitled Diagram',
    code: DEFAULT_DIAGRAM_CODE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return {
    diagrams: [defaultDiagram],
    activeTabId: defaultDiagram.id,
  };
};

const saveDiagrams = (diagrams: Diagram[], activeTabId: string) => {
  localStorage.setItem(
    STORAGE_KEYS.SAVED_DIAGRAMS,
    JSON.stringify({ diagrams, activeTabId })
  );
};

const initialData = loadDiagrams();
const initialDiagram = initialData.diagrams.find((d) => d.id === initialData.activeTabId) || initialData.diagrams[0];

export const useStore = create<AppState>((set) => ({
  // Initial state
  diagrams: initialData.diagrams,
  activeTabId: initialData.activeTabId,
  currentDiagram: initialDiagram,
  settings: loadSettings(),
  isSidebarOpen: false,
  isSettingsOpen: false,
  isPresentationMode: false,
  error: null,

  // Tab management
  addTab: (diagram) => {
    set((state) => {
      const newDiagram: Diagram = diagram || {
        id: crypto.randomUUID(),
        name: `Untitled ${state.diagrams.length + 1}`,
        code: DEFAULT_DIAGRAM_CODE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newDiagrams = [...state.diagrams, newDiagram];
      saveDiagrams(newDiagrams, newDiagram.id);
      return {
        diagrams: newDiagrams,
        activeTabId: newDiagram.id,
        currentDiagram: newDiagram,
      };
    });
  },

  closeTab: (id) => {
    set((state) => {
      if (state.diagrams.length === 1) return state; // Keep at least one tab

      const newDiagrams = state.diagrams.filter((d) => d.id !== id);
      let newActiveId = state.activeTabId;

      if (state.activeTabId === id) {
        const closedIndex = state.diagrams.findIndex((d) => d.id === id);
        const newIndex = Math.max(0, closedIndex - 1);
        newActiveId = newDiagrams[newIndex].id;
      }

      const newCurrent = newDiagrams.find((d) => d.id === newActiveId) || newDiagrams[0];
      saveDiagrams(newDiagrams, newActiveId);

      return {
        diagrams: newDiagrams,
        activeTabId: newActiveId,
        currentDiagram: newCurrent,
      };
    });
  },

  switchTab: (id) => {
    set((state) => {
      const diagram = state.diagrams.find((d) => d.id === id);
      if (!diagram) return state;

      saveDiagrams(state.diagrams, id);
      return {
        activeTabId: id,
        currentDiagram: diagram,
      };
    });
  },

  // Actions
  setCurrentDiagram: (diagram) => {
    set((state) => {
      const newDiagrams = state.diagrams.map((d) =>
        d.id === state.activeTabId ? diagram : d
      );
      saveDiagrams(newDiagrams, state.activeTabId);
      return { diagrams: newDiagrams, currentDiagram: diagram };
    });
  },

  updateDiagramCode: (code) => {
    set((state) => {
      const updatedDiagram = {
        ...state.currentDiagram,
        code,
        updatedAt: new Date(),
      };
      const newDiagrams = state.diagrams.map((d) =>
        d.id === state.activeTabId ? updatedDiagram : d
      );
      saveDiagrams(newDiagrams, state.activeTabId);
      return { diagrams: newDiagrams, currentDiagram: updatedDiagram };
    });
  },

  updateSettings: (newSettings) => {
    set((state) => {
      const updatedSettings = {
        ...state.settings,
        ...newSettings,
        editor: { ...state.settings.editor, ...newSettings.editor },
        preview: { ...state.settings.preview, ...newSettings.preview },
      };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  togglePresentationMode: () => set((state) => ({ isPresentationMode: !state.isPresentationMode })),
  setError: (error) => set({ error }),
}));
