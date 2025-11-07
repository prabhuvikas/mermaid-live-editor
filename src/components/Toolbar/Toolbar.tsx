import { Settings, Moon, Sun, Download, Copy, FileText, Image, FileImage, BookOpen, ChevronDown, FolderOpen, Save, Plus, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface ToolbarProps {
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportPDF: () => void;
  onCopyDiagram: () => void;
  onOpenExamples: () => void;
  onOpenFile?: () => void;
  onSaveFile?: () => void;
  onNewDiagram?: () => void;
  onShareLink?: () => void;
}

export const Toolbar = ({
  onExportPNG,
  onExportSVG,
  onExportPDF,
  onCopyDiagram,
  onOpenExamples,
  onOpenFile,
  onSaveFile,
  onNewDiagram,
  onShareLink,
}: ToolbarProps) => {
  const { settings, updateSettings, toggleSettings, currentDiagram } = useStore();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const isDark = settings.editor.theme === 'dark';

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    updateSettings({
      editor: { ...settings.editor, theme: newTheme },
    });
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast.success(`Switched to ${newTheme} theme`);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentDiagram.code);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const downloadCode = () => {
    const blob = new Blob([currentDiagram.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDiagram.name}.mmd`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded!');
  };

  return (
    <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Mermaid Live Editor
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onNewDiagram}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="New diagram (Ctrl+N)"
        >
          <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={onOpenFile}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Open file (Ctrl+O)"
        >
          <FolderOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={onSaveFile}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Save file (Ctrl+S)"
        >
          <Save className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={onOpenExamples}
          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
          title="Examples & Templates (Ctrl+K)"
        >
          <BookOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Examples</span>
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button
          onClick={onShareLink}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Share link"
        >
          <Share2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button
          onClick={copyCode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Copy code"
        >
          <Copy className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={downloadCode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Download code"
        >
          <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            title="Export diagram"
          >
            <Image className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Export</span>
            <ChevronDown className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
              <button
                onClick={() => {
                  onExportPNG();
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <FileImage className="w-4 h-4" />
                <span className="text-sm">Export as PNG</span>
              </button>
              <button
                onClick={() => {
                  onExportSVG();
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <FileImage className="w-4 h-4" />
                <span className="text-sm">Export as SVG</span>
              </button>
              <button
                onClick={() => {
                  onExportPDF();
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <FileImage className="w-4 h-4" />
                <span className="text-sm">Export as PDF</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
              <button
                onClick={() => {
                  onCopyDiagram();
                  setShowExportMenu(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm">Copy as Image</span>
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        <button
          onClick={toggleSettings}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};
