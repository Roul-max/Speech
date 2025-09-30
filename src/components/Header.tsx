import { Mic2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Mic2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Speech Segmentation Tool</h1>
            <p className="text-sm text-gray-600">Extract and segment speech from audio and video files</p>
          </div>
        </div>
      </div>
    </header>
  );
}