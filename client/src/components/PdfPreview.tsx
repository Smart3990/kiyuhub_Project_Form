import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Download, ExternalLink, ZoomIn, ZoomOut, RotateCcw, FileText, ChevronLeft, ChevronRight, Loader2, Maximize2, Layers } from 'lucide-react';

// Configure pdfjs worker to reliable CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewProps {
  pdfBlob: Blob | null;
  fileName?: string;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfBlob, fileName = 'project_brief.pdf' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<'fit' | 'scroll'>('fit');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCanvases, setPageCanvases] = useState<string[]>([]);

  // Load PDF document and render pages to canvas image data URLs
  useEffect(() => {
    let isCancelled = false;

    if (!pdfBlob) {
      return;
    }

    const renderPdf = async () => {
      try {
        const arrayBuffer = await pdfBlob.arrayBuffer();
        if (isCancelled) return;

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        if (isCancelled) return;

        setNumPages(pdf.numPages);

        const renderedPages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          if (isCancelled) return;

          // Render at 2.5x resolution for ultra sharp preview text
          const viewport = page.getViewport({ scale: 2.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
          };

          await page.render(renderContext).promise;
          if (isCancelled) return;

          renderedPages.push(canvas.toDataURL('image/png'));
        }

        if (!isCancelled) {
          setPageCanvases(renderedPages);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        console.error('Failed to render PDF using PDF.js:', err);
        if (!isCancelled) {
          setError('Failed to render PDF preview.');
          setIsLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfBlob]);

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
  };

  if (!pdfBlob) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center space-y-3">
        <FileText className="w-12 h-12 text-slate-300" />
        <p className="text-xs font-bold text-slate-600">No PDF document loaded</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Control Header Toolbar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white text-xs z-10 shrink-0">
        <div className="flex items-center gap-2 font-bold">
          <FileText className="w-4 h-4 text-red-500" />
          <span className="text-slate-200 truncate max-w-[140px] sm:max-w-[220px]">{fileName}</span>
          {numPages > 0 && (
            <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
              {numPages} {numPages === 1 ? 'Page' : 'Pages'}
            </span>
          )}
        </div>

        {/* Page Nav, View Mode & Zoom controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {numPages > 1 && (
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 font-semibold text-slate-200">
                Page {currentPage} of {numPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                disabled={currentPage >= numPages}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* View Mode Switcher */}
          <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => {
                setViewMode('fit');
                setScale(1.0);
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'fit' && scale === 1.0
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Fit Full Page in Frame"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden md:inline">Fit Page</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('scroll')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'scroll'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Continuous Scroll All Pages"
            >
              <Layers className="w-3 h-3" />
              <span className="hidden md:inline">Scroll All</span>
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => {
                setViewMode('scroll');
                setScale((s) => Math.max(0.5, s - 0.15));
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono w-9 text-center font-bold text-slate-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => {
                setViewMode('scroll');
                setScale((s) => Math.min(2.5, s + 0.15));
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('fit');
                setScale(1.0);
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset View to Fit Page"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 ml-1">
            <button
              type="button"
              onClick={handleOpenNewTab}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px] font-semibold">New Tab</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview Container Area */}
      <div 
        ref={containerRef}
        className="flex-1 w-full bg-slate-950/90 relative overflow-hidden min-h-0"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3 py-16">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <span className="text-xs font-bold tracking-wide">Rendering Live PDF Preview...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
            <p className="text-xs text-red-400 font-bold">{error}</p>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF Directly
            </button>
          </div>
        ) : pageCanvases.length > 0 ? (
          viewMode === 'fit' && scale === 1.0 ? (
            /* Single Page Fit-to-Height View Mode (Zero Scroll required for complete page preview) */
            <div className="w-full h-full p-3 sm:p-5 flex flex-col items-center justify-center relative select-none">
              <div className="relative h-full w-full flex items-center justify-center max-h-full max-w-full">
                <img
                  src={pageCanvases[currentPage - 1] || pageCanvases[0]}
                  alt={`PDF Page ${currentPage}`}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                  className="rounded-lg shadow-2xl border border-slate-700/80 block bg-white"
                />

                {/* Page Indicator Badge */}
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-md border border-slate-700/80 z-10 pointer-events-none shadow-md">
                  Page {currentPage} of {numPages} (Full View)
                </div>
              </div>
            </div>
          ) : (
            /* Scroll All Pages or Zoomed View Mode */
            <div className="w-full h-full overflow-auto p-4 sm:p-6 flex flex-col items-center gap-6">
              {pageCanvases.map((imgSrc, idx) => {
                const pageNum = idx + 1;
                return (
                  <div
                    key={pageNum}
                    className="relative bg-white rounded-lg shadow-2xl transition-all duration-200 border border-slate-700/50 shrink-0"
                    style={{
                      width: `${600 * scale}px`,
                      maxWidth: '100%',
                    }}
                  >
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700 z-10 pointer-events-none">
                      Page {pageNum} of {numPages}
                    </div>
                    <img
                      src={imgSrc}
                      alt={`PDF Page ${pageNum}`}
                      className="w-full h-auto rounded-lg block"
                    />
                  </div>
                );
              })}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};
