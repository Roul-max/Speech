import type { Segment } from '../types/segment';
import JSZip from 'jszip';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sbc-k2ap.onrender.com';

export async function processAudioFile(file: File): Promise<{ segments: Segment[]; fileId: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/api/process`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to process audio: ${err}`);
  }

  const data = await res.json();
  // data contains segments array and file_id from backend
  return { segments: data.segments, fileId: data.file_id };
}

export async function downloadSegment(segment: Segment, fileId: string) {
  const res = await fetch(`${API_URL}/api/extract-segment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file_id: fileId,
      start_time: segment.startTime,
      end_time: segment.endTime,
      segment_name: segment.name,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to download segment ${segment.name}: ${err}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${segment.name || `segment_${segment.id}`}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAllSegmentsAsZip(segments: Segment[], fileId: string, fileName: string) {
  const zip = new JSZip();

  for (const segment of segments) {
    const res = await fetch(`${API_URL}/api/extract-segment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_id: fileId,
        start_time: segment.startTime,
        end_time: segment.endTime,
        segment_name: segment.name,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to extract segment ${segment.name}: ${err}`);
    }

    const blob = await res.blob();
    zip.file(`${segment.name || `segment_${segment.id}`}.mp3`, blob);
  }

  // Add JSON timestamps
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

export function downloadSegmentsAsJSON(segments: Segment[], fileName: string) {
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
