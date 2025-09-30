import { useState } from 'react';
import { Download, CreditCard as Edit2, Check, X } from 'lucide-react';
import type { Segment } from '../types/segment';

interface SegmentTableProps {
  segments: Segment[];
  onDownloadSegment: (segment: Segment) => void;
  onDownloadAll: () => void;
  onRenameSegment: (id: string, newName: string) => void;
}

export default function SegmentTable({
  segments,
  onDownloadSegment,
  onDownloadAll,
  onRenameSegment,
}: SegmentTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  const handleStartEdit = (segment: Segment) => {
    setEditingId(segment.id);
    setEditName(segment.name || `Segment ${segment.id}`);
  };

  const handleSaveEdit = (id: string) => {
    onRenameSegment(id, editName);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detected Speech Segments</h2>
            <p className="text-sm text-gray-600 mt-1">
              Found {segments.length} speech segment{segments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onDownloadAll}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download All as ZIP
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Segment Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {segments.map((segment, index) => (
                <tr
                  key={segment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {editingId === segment.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(segment.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {segment.name || `Segment ${index + 1}`}
                        </span>
                        <button
                          onClick={() => handleStartEdit(segment)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                    {formatTime(segment.startTime)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                    {formatTime(segment.endTime)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                    {formatTime(segment.duration)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDownloadSegment(segment)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}