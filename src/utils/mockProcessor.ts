import type { Segment } from '../types/segment';

export async function processAudioFile(file: File): Promise<{ segments: Segment[]; audioUrl: string }> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const audioUrl = URL.createObjectURL(file);

  const segments: Segment[] = [
    {
      id: '1',
      startTime: 0.5,
      endTime: 5.2,
      duration: 4.7,
      name: 'Introduction',
    },
    {
      id: '2',
      startTime: 6.8,
      endTime: 15.3,
      duration: 8.5,
      name: 'Main Speech',
    },
    {
      id: '3',
      startTime: 16.1,
      endTime: 22.7,
      duration: 6.6,
      name: 'Discussion',
    },
    {
      id: '4',
      startTime: 24.2,
      endTime: 30.5,
      duration: 6.3,
      name: 'Conclusion',
    },
  ];

  return { segments, audioUrl };
}

export function downloadSegmentAsJSON(segments: Segment[], fileName: string) {
  const json = JSON.stringify(segments, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_timestamps.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadSegment(segment: Segment, audioUrl: string) {
  const response = await fetch(audioUrl);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${segment.name || `segment_${segment.id}`}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllSegmentsAsZip(segments: Segment[], audioUrl: string, fileName: string) {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  const response = await fetch(audioUrl);
  const audioBlob = await response.blob();

  segments.forEach((segment, index) => {
    zip.file(`${segment.name || `segment_${index + 1}`}.mp3`, audioBlob);
  });

  const jsonContent = JSON.stringify(segments, null, 2);
  zip.file(`${fileName}_timestamps.json`, jsonContent);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_segments.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}