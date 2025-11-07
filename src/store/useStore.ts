import { create } from 'zustand';
import { Diagram, AppSettings } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_DIAGRAM_CODE, STORAGE_KEYS } from '../constants/defaults';

interface AppState {
  // Current diagram
  currentDiagram: Diagram;
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

// Load current diagram from localStorage
const loadCurrentDiagram = (): Diagram => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_DIAGRAM);
    if (saved) {
      const diagram = JSON.parse(saved);
      return {
        ...diagram,
        createdAt: new Date(diagram.createdAt),
        updatedAt: new Date(diagram.updatedAt),
      };
    }
  } catch {
    // Fall through to default
  }

  return {
    id: crypto.randomUUID(),
    name: 'Untitled Diagram',
    code: DEFAULT_DIAGRAM_CODE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const useStore = create<AppState>((set) => ({
  // Initial state
  currentDiagram: loadCurrentDiagram(),
  settings: loadSettings(),
  isSidebarOpen: false,
  isSettingsOpen: false,
  error: null,

  // Actions
  setCurrentDiagram: (diagram) => {
    set({ currentDiagram: diagram });
    localStorage.setItem(STORAGE_KEYS.CURRENT_DIAGRAM, JSON.stringify(diagram));
  },

  updateDiagramCode: (code) => {
    set((state) => {
      const updatedDiagram = {
        ...state.currentDiagram,
        code,
        updatedAt: new Date(),
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_DIAGRAM, JSON.stringify(updatedDiagram));
      return { currentDiagram: updatedDiagram };
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
  setError: (error) => set({ error }),
}));
