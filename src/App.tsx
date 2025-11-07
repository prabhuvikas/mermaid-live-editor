import { useEffect, useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Editor } from './components/Editor/Editor';
import { Preview, PreviewRef } from './components/Preview/Preview';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Settings } from './components/Settings/Settings';
import { Examples } from './components/Examples/Examples';
import { Tabs } from './components/UI/Tabs';
import { PresentationMode } from './components/UI/PresentationMode';
import { useStore } from './store/useStore';
import { exportToPNG, exportToSVG, exportToPDF, copyDiagramToClipboard } from './utils/export';
import { openFile, saveFile, encodeDiagramToURL, decodeDiagramFromURL } from './utils/fileOperations';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { DEFAULT_DIAGRAM_CODE } from './constants/defaults';

function App() {
  const { settings, currentDiagram, setCurrentDiagram, updateSettings, toggleSettings } = useStore();
  const [editorWidth, setEditorWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const previewRef = useRef<PreviewRef>(null);

  // Load diagram from URL on mount
  useEffect(() => {
    const urlDiagram = decodeDiagramFromURL();
    if (urlDiagram) {
      setCurrentDiagram({
        id: crypto.randomUUID(),
        name: urlDiagram.name,
        code: urlDiagram.code,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // Clear URL parameter after loading
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [setCurrentDiagram]);

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', settings.editor.theme === 'dark');
  }, [settings.editor.theme]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setEditorWidth(newWidth);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleExportPNG = async () => {
    const container = previewRef.current?.getContainerElement();
    if (!container) {
      toast.error('No diagram to export');
      return;
    }

    try {
      await exportToPNG(container, 'mermaid-diagram.png');
      toast.success('Exported as PNG!');
    } catch (error) {
      toast.error('Failed to export as PNG');
      console.error(error);
    }
  };

  const handleExportSVG = async () => {
    const container = previewRef.current?.getContainerElement();
    if (!container) {
      toast.error('No diagram to export');
      return;
    }

    try {
      await exportToSVG(container, 'mermaid-diagram.svg');
      toast.success('Exported as SVG!');
    } catch (error) {
      toast.error('Failed to export as SVG');
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    const container = previewRef.current?.getContainerElement();
    if (!container) {
      toast.error('No diagram to export');
      return;
    }

    try {
      await exportToPDF(container, 'mermaid-diagram.pdf');
      toast.success('Exported as PDF!');
    } catch (error) {
      toast.error('Failed to export as PDF');
      console.error(error);
    }
  };

  const handleCopyDiagram = async () => {
    const container = previewRef.current?.getContainerElement();
    if (!container) {
      toast.error('No diagram to copy');
      return;
    }

    try {
      await copyDiagramToClipboard(container);
      toast.success('Diagram copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy diagram');
      console.error(error);
    }
  };

  const handleOpenFile = async () => {
    try {
      const content = await openFile();
      if (content) {
        setCurrentDiagram({
          id: crypto.randomUUID(),
          name: 'Opened Diagram',
          code: content,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success('File opened successfully!');
      }
    } catch (error) {
      toast.error('Failed to open file');
      console.error(error);
    }
  };

  const handleSaveFile = () => {
    try {
      saveFile(currentDiagram.code, `${currentDiagram.name}.mmd`);
      toast.success('File saved successfully!');
    } catch (error) {
      toast.error('Failed to save file');
      console.error(error);
    }
  };

  const handleNewDiagram = () => {
    setCurrentDiagram({
      id: crypto.randomUUID(),
      name: 'Untitled Diagram',
      code: DEFAULT_DIAGRAM_CODE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    toast.success('New diagram created!');
  };

  const handleShareLink = async () => {
    try {
      const shareUrl = encodeDiagramToURL(currentDiagram);
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to create share link');
      console.error(error);
    }
  };

  const handleToggleTheme = () => {
    const newTheme = settings.editor.theme === 'dark' ? 'light' : 'dark';
    updateSettings({
      editor: { ...settings.editor, theme: newTheme },
    });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Keyboard shortcuts
  const { togglePresentationMode } = useStore();
  useKeyboardShortcuts({
    onSave: handleSaveFile,
    onExport: handleExportPNG,
    onNew: handleNewDiagram,
    onOpen: handleOpenFile,
    onSettings: toggleSettings,
    onExamples: () => setShowExamples(true),
    onToggleTheme: handleToggleTheme,
    onPresentationMode: togglePresentationMode,
  });

  return (
    <>
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
        <Toolbar
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          onExportPDF={handleExportPDF}
          onCopyDiagram={handleCopyDiagram}
          onOpenExamples={() => setShowExamples(true)}
          onOpenFile={handleOpenFile}
          onSaveFile={handleSaveFile}
          onNewDiagram={handleNewDiagram}
          onShareLink={handleShareLink}
        />

        <Tabs />

        <div className="flex-1 flex overflow-hidden">
          {/* Editor Pane */}
          <div
            className="overflow-hidden border-r border-gray-200 dark:border-gray-700"
            style={{ width: `${editorWidth}%` }}
          >
            <Editor />
          </div>

          {/* Resizer */}
          <div
            className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
          />

          {/* Preview Pane */}
          <div
            className="overflow-hidden"
            style={{ width: `${100 - editorWidth}%` }}
          >
            <Preview ref={previewRef} />
          </div>
        </div>

        <Settings />
        <Examples isOpen={showExamples} onClose={() => setShowExamples(false)} />
        <Toaster position="bottom-right" />
      </div>

      <PresentationMode previewRef={previewRef} />
    </>
  );
}

export default App;
