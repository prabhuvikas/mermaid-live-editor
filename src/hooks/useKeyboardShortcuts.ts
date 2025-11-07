import { useEffect } from 'react';

interface ShortcutHandlers {
  onSave?: () => void;
  onExport?: () => void;
  onNew?: () => void;
  onOpen?: () => void;
  onSettings?: () => void;
  onExamples?: () => void;
  onToggleTheme?: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + S - Save
      if (modKey && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
      }

      // Ctrl/Cmd + E - Export
      if (modKey && e.key === 'e') {
        e.preventDefault();
        handlers.onExport?.();
      }

      // Ctrl/Cmd + N - New
      if (modKey && e.key === 'n') {
        e.preventDefault();
        handlers.onNew?.();
      }

      // Ctrl/Cmd + O - Open
      if (modKey && e.key === 'o') {
        e.preventDefault();
        handlers.onOpen?.();
      }

      // Ctrl/Cmd + , - Settings
      if (modKey && e.key === ',') {
        e.preventDefault();
        handlers.onSettings?.();
      }

      // Ctrl/Cmd + K - Examples
      if (modKey && e.key === 'k') {
        e.preventDefault();
        handlers.onExamples?.();
      }

      // Ctrl/Cmd + Shift + T - Toggle Theme
      if (modKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        handlers.onToggleTheme?.();
      }

      // ? - Show shortcuts help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Can implement help modal later
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
