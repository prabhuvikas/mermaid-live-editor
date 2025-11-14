import { AppSettings } from '../types';

export const DEFAULT_DIAGRAM_CODE = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

export const DEFAULT_SETTINGS: AppSettings = {
  editor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    theme: 'light',
  },
  preview: {
    backgroundColor: '#ffffff',
    padding: 20,
    mermaidTheme: 'default',
  },
  autoSave: true,
  debounceDelay: 500,
};

export const STORAGE_KEYS = {
  CURRENT_DIAGRAM: 'mermaid-live-editor:current-diagram',
  SAVED_DIAGRAMS: 'mermaid-live-editor:saved-diagrams',
  SETTINGS: 'mermaid-live-editor:settings',
  RECENT_DIAGRAMS: 'mermaid-live-editor:recent-diagrams',
};
