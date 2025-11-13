import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import mermaid from 'mermaid';
import { useStore } from '../../store/useStore';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import toast from 'react-hot-toast';

export interface PreviewRef {
  getContainerElement: () => HTMLElement | null;
}

export const Preview = forwardRef<PreviewRef>((_, ref) => {
  const { currentDiagram, settings, setError } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      theme: settings.preview.mermaidTheme === 'dark' ? 'dark' : 'base',
      securityLevel: 'loose',
      fontFamily: '"Barlow Condensed", -apple-system, system-ui, sans-serif',
      themeVariables: {
        // Primary colors - Neon Cyberpunk palette
        primaryColor: '#00ffff',           // Electric cyan
        primaryTextColor: '#0a0e27',       // Deep navy for text on cyan
        primaryBorderColor: '#00ffff',     // Cyan border

        // Secondary colors
        secondaryColor: '#ff00ff',         // Magenta
        secondaryTextColor: '#ffffff',
        secondaryBorderColor: '#ff00ff',

        // Tertiary colors
        tertiaryColor: '#ccff00',          // Lime
        tertiaryTextColor: '#0a0e27',
        tertiaryBorderColor: '#ccff00',

        // Background and general
        background: '#0a0e27',             // Deep navy
        mainBkg: '#00ffff',                // Cyan for nodes
        secondBkg: '#ff00ff',              // Magenta for secondary nodes
        tertiaryBkg: '#ccff00',            // Lime for tertiary nodes

        // Text colors
        textColor: '#d4feff',              // Bright cyan-white
        lineColor: '#00ffff',              // Cyan lines

        // Node styling
        nodeBorder: '#00ffff',
        clusterBkg: 'rgba(0, 255, 255, 0.1)',
        clusterBorder: '#00ffff',

        // Edge/Arrow colors
        edgeLabelBackground: 'rgba(10, 14, 39, 0.9)',

        // State diagram colors
        labelColor: '#0a0e27',

        // Sequence diagram
        actorBorder: '#00ffff',
        actorBkg: '#0a0e27',
        actorTextColor: '#00ffff',
        actorLineColor: '#00ffff',
        signalColor: '#00ffff',
        signalTextColor: '#d4feff',

        // Gantt diagram
        gridColor: 'rgba(0, 255, 255, 0.2)',
        todayLineColor: '#ff00ff',

        // Git graph
        git0: '#00ffff',
        git1: '#ff00ff',
        git2: '#ccff00',
        git3: '#00d4ff',
        git4: '#ff00cc',
        git5: '#aaff00',
        git6: '#00ffaa',
        git7: '#ff0088',

        // Pie chart
        pie1: '#00ffff',
        pie2: '#ff00ff',
        pie3: '#ccff00',
        pie4: '#00d4ff',
        pie5: '#ff00cc',
        pie6: '#aaff00',
        pie7: '#00ffaa',
        pie8: '#ff0088',
        pie9: '#0088ff',
        pie10: '#ff8800',
        pie11: '#88ff00',
        pie12: '#ff0044',

        // Class diagram
        classText: '#0a0e27',

        // ER diagram
        attributeBackgroundColorOdd: 'rgba(0, 255, 255, 0.1)',
        attributeBackgroundColorEven: 'rgba(255, 0, 255, 0.1)',
      },
    });
  }, [settings.preview.mermaidTheme]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !currentDiagram.code.trim()) {
        return;
      }

      setIsLoading(true);
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
        setError(errorMessage);
        toast.error(`Syntax Error: ${errorMessage}`, {
          duration: 4000,
          position: 'bottom-right',
        });
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
      <Card className="absolute top-4 right-4 z-50 flex flex-col gap-2 p-2 shadow-lg">
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
        <div className="text-xs text-center text-muted-foreground px-1 font-medium">
          {Math.round(zoom * 100)}%
        </div>
      </Card>

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

        <div
          ref={containerRef}
          className="mermaid-container transition-transform"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            userSelect: isDragging ? 'none' : 'auto',
          }}
        />
      </div>
    </div>
  );
});
