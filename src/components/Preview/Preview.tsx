import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mermaid from 'mermaid';
import { useStore } from '../../store/useStore';
import { AlertCircle } from 'lucide-react';

export interface PreviewRef {
  getContainerElement: () => HTMLElement | null;
}

export const Preview = forwardRef<PreviewRef>((_, ref) => {
  const { currentDiagram, settings, setError } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    getContainerElement: () => containerRef.current,
  }));

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: settings.preview.mermaidTheme,
      securityLevel: 'loose',
      fontFamily: 'monospace',
    });
  }, [settings.preview.mermaidTheme]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !currentDiagram.code.trim()) {
        return;
      }

      setIsLoading(true);
      setRenderError(null);
      setError(null);

      try {
        // Clear previous diagram
        containerRef.current.innerHTML = '';

        // Generate unique ID for this render
        const id = `mermaid-${Date.now()}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, currentDiagram.code);

        // Insert the SVG
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setRenderError(errorMessage);
        setError(errorMessage);
        console.error('Mermaid rendering error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the rendering
    const timeoutId = setTimeout(renderDiagram, settings.debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [currentDiagram.code, settings.debounceDelay, settings.preview.mermaidTheme, setError]);

  return (
    <div className="w-full h-full overflow-auto relative">
      <div
        className="flex items-center justify-center p-4 min-h-full"
        style={{
          backgroundColor: settings.preview.backgroundColor,
          padding: `${settings.preview.padding}px`,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {renderError && (
          <div className="max-w-2xl mx-auto p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                  Rendering Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                  {renderError}
                </p>
              </div>
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className="mermaid-container"
          style={{ display: renderError ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
});
