import { Editor as MonacoEditor } from '@monaco-editor/react';
import { useStore } from '../../store/useStore';

export const Editor = () => {
  const { currentDiagram, updateDiagramCode, settings } = useStore();

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateDiagramCode(value);
    }
  };

  return (
    <div className="w-full h-full">
      <MonacoEditor
        height="100%"
        defaultLanguage="mermaid"
        value={currentDiagram.code}
        onChange={handleEditorChange}
        theme={settings.editor.theme === 'dark' ? 'vs-dark' : 'vs-light'}
        options={{
          fontSize: settings.editor.fontSize,
          tabSize: settings.editor.tabSize,
          wordWrap: settings.editor.wordWrap ? 'on' : 'off',
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
};
