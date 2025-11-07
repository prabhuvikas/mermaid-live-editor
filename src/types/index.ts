export interface Diagram {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  theme: 'light' | 'dark';
}

export interface PreviewSettings {
  backgroundColor: string;
  padding: number;
  mermaidTheme: 'default' | 'forest' | 'dark' | 'neutral' | 'base';
}

export interface AppSettings {
  editor: EditorSettings;
  preview: PreviewSettings;
  autoSave: boolean;
  debounceDelay: number;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf';
  scale: number;
  backgroundColor: string;
}

export type DiagramType =
  | 'flowchart'
  | 'sequence'
  | 'class'
  | 'state'
  | 'er'
  | 'gantt'
  | 'pie'
  | 'journey'
  | 'git'
  | 'quadrant'
  | 'requirement'
  | 'timeline';

export interface Template {
  id: string;
  name: string;
  type: DiagramType;
  code: string;
  description: string;
  category: string;
}
