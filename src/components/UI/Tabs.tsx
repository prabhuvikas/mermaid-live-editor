import { X, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const Tabs = () => {
  const { diagrams, activeTabId, switchTab, closeTab, addTab } = useStore();

  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    closeTab(id);
  };

  return (
    <div className="h-10 bg-muted/20 border-b border-glow flex items-center overflow-x-auto">
      <div className="flex items-center gap-1 px-2 min-w-0 flex-1">
        {diagrams.map((diagram) => (
          <button
            key={diagram.id}
            onClick={() => switchTab(diagram.id)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t text-sm transition-all duration-200 min-w-0 max-w-xs ${
              activeTabId === diagram.id
                ? 'bg-background text-primary border-t border-x border-primary/50 shadow-[0_-2px_8px_hsl(180_100%_50%/0.3)]'
                : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:shadow-[0_0_5px_hsl(180_100%_50%/0.2)]'
            }`}
          >
            <span className="truncate flex-1 min-w-0">{diagram.name}</span>
            {diagrams.length > 1 && (
              <button
                onClick={(e) => handleCloseTab(e, diagram.id)}
                className="flex-shrink-0 p-0.5 rounded hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-200"
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
        className="flex-shrink-0 p-2 hover:bg-muted/30 hover:text-primary rounded transition-all duration-200 mx-2"
        title="New tab"
      >
        <Plus className="w-4 h-4 text-muted-foreground" />
      </button>
    </div>
  );
};
