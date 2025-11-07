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
        className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Header */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Maximize2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Presentation Mode
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} of {diagrams.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {diagrams.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous diagram (←)"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>

                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next diagram (→)"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
              </>
            )}

            <button
              onClick={togglePresentationMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Exit presentation mode (Esc)"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto">
          <Preview ref={ref || previewRef} />
        </div>

        {/* Footer hint */}
        <div className="h-8 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Press Esc to exit • Use ← → to navigate diagrams
          </span>
        </div>
      </div>
    );
  }
);
