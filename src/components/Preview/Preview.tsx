import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mermaid from 'mermaid';
import { useStore } from '../../store/useStore';
import { AlertCircle, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';

export interface PreviewRef {
  getContainerElement: () => HTMLElement | null;
}

export const Preview = forwardRef<PreviewRef>((_, ref) => {
  const { currentDiagram, settings, setError } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    getContainerElement: () => containerRef.current,
  }));

  // Zoom handlers
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 5));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.25), 5));
    }
  };

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
    <div className="w-full h-full overflow-hidden relative">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          title="Zoom In (Ctrl + Mouse Wheel)"
          className="h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          title="Zoom Out (Ctrl + Mouse Wheel)"
          className="h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleResetZoom}
          title="Reset Zoom & Pan"
          className="h-8 w-8"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <div className="text-xs text-center text-gray-600 dark:text-gray-400 px-1">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      <div
        ref={viewportRef}
        className="flex items-center justify-center p-4 min-h-full w-full h-full overflow-hidden"
        style={{
          backgroundColor: settings.preview.backgroundColor,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
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
          className="mermaid-container transition-transform"
          style={{
            display: renderError ? 'none' : 'block',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            userSelect: isDragging ? 'none' : 'auto',
          }}
        />
      </div>
    </div>
  );
});
