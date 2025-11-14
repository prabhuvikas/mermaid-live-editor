import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export const exportToPNG = async (element: HTMLElement, filename: string = 'diagram.png') => {
  try {
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    throw new Error('Failed to export diagram as PNG');
  }
};

export const exportToSVG = async (element: HTMLElement, filename: string = 'diagram.svg') => {
  try {
    const dataUrl = await toSvg(element, {
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting to SVG:', error);
    throw new Error('Failed to export diagram as SVG');
  }
};

export const exportToPDF = async (element: HTMLElement, filename: string = 'diagram.pdf') => {
  try {
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });

    const img = new Image();
    img.src = dataUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const pdf = new jsPDF({
      orientation: img.width > img.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [img.width, img.height],
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export diagram as PDF');
  }
};

export const copyDiagramToClipboard = async (element: HTMLElement) => {
  try {
    const blob = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    }).then((dataUrl) => {
      return fetch(dataUrl).then((res) => res.blob());
    });

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw new Error('Failed to copy diagram to clipboard');
  }
};
