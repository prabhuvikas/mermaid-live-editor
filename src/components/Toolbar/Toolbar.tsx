import { Settings, Moon, Sun, Download, Copy, FileText, Image, FileImage, BookOpen, FolderOpen, Save, Plus, Share2, Maximize2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
  const { settings, updateSettings, toggleSettings, currentDiagram, togglePresentationMode } = useStore();
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
    <div className="h-14 border-b border-glow bg-background flex items-center justify-between px-4 relative">
      <div className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-primary animate-pulse" />
        <h1 className="text-lg font-semibold text-glow-cyan">
          Mermaid Live Editor
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <Button
          onClick={onNewDiagram}
          variant="ghost"
          size="icon"
          title="New diagram (Ctrl+N)"
        >
          <Plus className="w-5 h-5" />
        </Button>

        <Button
          onClick={onOpenFile}
          variant="ghost"
          size="icon"
          title="Open file (Ctrl+O)"
        >
          <FolderOpen className="w-5 h-5" />
        </Button>

        <Button
          onClick={onSaveFile}
          variant="ghost"
          size="icon"
          title="Save file (Ctrl+S)"
        >
          <Save className="w-5 h-5" />
        </Button>

        <Button
          onClick={onOpenExamples}
          variant="ghost"
          size="sm"
          title="Examples & Templates (Ctrl+K)"
          className="gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Examples</span>
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          onClick={onShareLink}
          variant="ghost"
          size="icon"
          title="Share link"
        >
          <Share2 className="w-5 h-5" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          onClick={copyCode}
          variant="ghost"
          size="icon"
          title="Copy code"
        >
          <Copy className="w-5 h-5" />
        </Button>

        <Button
          onClick={downloadCode}
          variant="ghost"
          size="icon"
          title="Download code"
        >
          <Download className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={onExportPNG}>
              <FileImage className="w-4 h-4 mr-2" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onExportSVG}>
              <FileImage className="w-4 h-4 mr-2" />
              Export as SVG
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onExportPDF}>
              <FileImage className="w-4 h-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onCopyDiagram}>
              <Copy className="w-4 h-4 mr-2" />
              Copy as Image
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          onClick={togglePresentationMode}
          variant="ghost"
          size="icon"
          title="Presentation mode (F11)"
        >
          <Maximize2 className="w-5 h-5" />
        </Button>

        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          title="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <Button
          onClick={toggleSettings}
          variant="ghost"
          size="icon"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
