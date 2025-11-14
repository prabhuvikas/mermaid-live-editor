import { Diagram } from '../types';

export const openFile = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mmd,.txt';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      const text = await file.text();
      resolve(text);
    };

    input.oncancel = () => resolve(null);
    input.click();
  });
};

export const saveFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const encodeDiagramToURL = (diagram: Diagram): string => {
  const data = {
    code: diagram.code,
    name: diagram.name,
  };
  const jsonString = JSON.stringify(data);
  const base64 = btoa(encodeURIComponent(jsonString));
  return `${window.location.origin}${window.location.pathname}?diagram=${base64}`;
};

export const decodeDiagramFromURL = (): { code: string; name: string } | null => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('diagram');

  if (!encoded) return null;

  try {
    const jsonString = decodeURIComponent(atob(encoded));
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error('Failed to decode diagram from URL:', error);
    return null;
  }
};
