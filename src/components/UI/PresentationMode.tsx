import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Preview, PreviewRef } from '../Preview/Preview';
import { forwardRef } from 'react';

interface PresentationModeProps {
  previewRef: React.RefObject<PreviewRef>;
}

export const PresentationMode = forwardRef<PreviewRef, PresentationModeProps>(
  ({ previewRef }, ref) => {
    const { isPresentationMode, togglePresentationMode, diagrams, activeTabId, switchTab } =
      useStore();

    if (!isPresentationMode) return null;

    const currentIndex = diagrams.findIndex((d) => d.id === activeTabId);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < diagrams.length - 1;

    const handlePrev = () => {
      if (hasPrev) {
        switchTab(diagrams[currentIndex - 1].id);
      }
    };

    const handleNext = () => {
      if (hasNext) {
        switchTab(diagrams[currentIndex + 1].id);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        togglePresentationMode();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    return (
      <div
        className="fixed inset-0 bg-background z-50 flex flex-col animate-fade-in"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Header */}
        <div className="h-14 border-b border-glow bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Maximize2 className="w-5 h-5 text-primary animate-pulse" />
            <h1 className="text-lg font-semibold text-primary text-glow-cyan">
              Presentation Mode
            </h1>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {diagrams.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {diagrams.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="p-2 hover:bg-muted/30 hover:text-primary rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                  title="Previous diagram (←)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="p-2 hover:bg-muted/30 hover:text-primary rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                  title="Next diagram (→)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-primary/30 mx-2" />
              </>
            )}

            <button
              onClick={togglePresentationMode}
              className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-all duration-200"
              title="Exit presentation mode (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto">
          <Preview ref={ref || previewRef} />
        </div>

        {/* Footer hint */}
        <div className="h-8 bg-muted/20 border-t border-glow flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            Press Esc to exit • Use ← → to navigate diagrams
          </span>
        </div>
      </div>
    );
  }
);
