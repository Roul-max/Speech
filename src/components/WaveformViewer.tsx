import { useEffect, useRef } from 'react';
import type { Segment } from '../types/segment';

interface WaveformViewerProps {
  audioUrl: string;
  segments: Segment[];
}

export default function WaveformViewer({ audioUrl, segments }: WaveformViewerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<any>(null);

  useEffect(() => {
    let wavesurfer: any = null;

    const loadWavesurfer = async () => {
      if (!waveformRef.current) return;

      const WaveSurfer = (await import('wavesurfer.js')).default;
      const RegionsPlugin = (await import('wavesurfer.js/dist/plugins/regions.js')).default;

      const regions = RegionsPlugin.create();

      wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#93c5fd',
        progressColor: '#2563eb',
        cursorColor: '#1e40af',
        barWidth: 2,
        barRadius: 3,
        height: 120,
        plugins: [regions],
      });

      wavesurferRef.current = wavesurfer;

      await wavesurfer.load(audioUrl);

      segments.forEach((segment, index) => {
        regions.addRegion({
          start: segment.startTime,
          end: segment.endTime,
          color: `rgba(37, 99, 235, ${0.1 + (index % 3) * 0.1})`,
          drag: false,
          resize: false,
        });
      });
    };

    loadWavesurfer();

    return () => {
      if (wavesurfer) {
        wavesurfer.destroy();
      }
    };
  }, [audioUrl, segments]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Audio Waveform</h3>
        <div ref={waveformRef} className="w-full"></div>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <span>Speech Segments</span>
          </div>
        </div>
      </div>
    </div>
  );
}