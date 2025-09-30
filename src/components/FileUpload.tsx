import { useState, useCallback } from 'react';
import { Upload, FileAudio, FileVideo, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUpload({ onFileSelect, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(file =>
      file.type.startsWith('audio/') || file.type.startsWith('video/')
    );

    if (validFile) {
      setSelectedFile(validFile);
      onFileSelect(validFile);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-12 h-12 text-blue-500" />;
    if (selectedFile.type.startsWith('audio/')) return <FileAudio className="w-12 h-12 text-blue-500" />;
    if (selectedFile.type.startsWith('video/')) return <FileVideo className="w-12 h-12 text-blue-500" />;
    return <Upload className="w-12 h-12 text-blue-500" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-blue-400'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="audio/*,video/*"
          onChange={handleFileInput}
          disabled={isProcessing}
        />

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          {isProcessing ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            getFileIcon()
          )}

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {isProcessing ? 'Processing your file...' : selectedFile ? selectedFile.name : 'Upload Audio or Video File'}
          </h3>

          <p className="mt-2 text-sm text-gray-600 text-center">
            {isProcessing
              ? 'Please wait while we detect speech segments'
              : 'Drag and drop your file here, or click to browse'
            }
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Supports MP3, WAV, M4A, MP4, AVI, MOV and more
          </p>

          {!isProcessing && (
            <button
              type="button"
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Select File
            </button>
          )}
        </label>
      </div>

      {selectedFile && !isProcessing && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            {selectedFile.type.startsWith('audio/') ? (
              <FileAudio className="w-5 h-5 text-blue-600" />
            ) : (
              <FileVideo className="w-5 h-5 text-blue-600" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-600">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}