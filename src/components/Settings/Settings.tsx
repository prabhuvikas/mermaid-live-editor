import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Settings = () => {
  const { settings, updateSettings, isSettingsOpen, toggleSettings } = useStore();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={toggleSettings}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <section className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Editor Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size: {settings.editor.fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={settings.editor.fontSize}
                  onChange={(e) =>
                    updateSettings({
                      editor: { ...settings.editor, fontSize: parseInt(e.target.value) },
                    })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tab Size
                </label>
                <select
                  value={settings.editor.tabSize}
                  onChange={(e) =>
                    updateSettings({
                      editor: { ...settings.editor, tabSize: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                  <option value="8">8 spaces</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="wordWrap"
                  checked={settings.editor.wordWrap}
                  onChange={(e) =>
                    updateSettings({
                      editor: { ...settings.editor, wordWrap: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="wordWrap" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable word wrap
                </label>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Preview Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mermaid Theme
                </label>
                <select
                  value={settings.preview.mermaidTheme}
                  onChange={(e) =>
                    updateSettings({
                      preview: {
                        ...settings.preview,
                        mermaidTheme: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="default">Default</option>
                  <option value="forest">Forest</option>
                  <option value="dark">Dark</option>
                  <option value="neutral">Neutral</option>
                  <option value="base">Base</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Padding: {settings.preview.padding}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.preview.padding}
                  onChange={(e) =>
                    updateSettings({
                      preview: { ...settings.preview, padding: parseInt(e.target.value) },
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              General Settings
            </h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={settings.autoSave}
                  onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="autoSave" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Enable auto-save
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Debounce Delay: {settings.debounceDelay}ms
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={settings.debounceDelay}
                  onChange={(e) =>
                    updateSettings({ debounceDelay: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
