import { X, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Tabs = () => {
  const { diagrams, activeTabId, switchTab, closeTab, addTab } = useStore();

  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    closeTab(id);
  };

  return (
    <div className="h-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center overflow-x-auto">
      <div className="flex items-center gap-1 px-2 min-w-0 flex-1">
        {diagrams.map((diagram) => (
          <button
            key={diagram.id}
            onClick={() => switchTab(diagram.id)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t text-sm transition-colors min-w-0 max-w-xs ${
              activeTabId === diagram.id
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-x border-gray-200 dark:border-gray-700'
                : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="truncate flex-1 min-w-0">{diagram.name}</span>
            {diagrams.length > 1 && (
              <button
                onClick={(e) => handleCloseTab(e, diagram.id)}
                className="flex-shrink-0 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Close tab"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => addTab()}
        className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors mx-2"
        title="New tab"
      >
        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};
