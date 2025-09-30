import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import SegmentTable from './components/SegmentTable';
import WaveformViewer from './components/WaveformViewer';
import type { Segment } from './types/segment';
import {
  processAudioFile,
  downloadSegmentsAsJSON,
  downloadSegment,
  downloadAllSegmentsAsZip,
} from './utils/mockProcessor';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>(''); // for waveform preview
  const [fileId, setFileId] = useState<string>(''); // backend fileId
  const [fileName, setFileName] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setShowResults(false);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));

    try {
      const result = await processAudioFile(file);
      setSegments(result.segments);
      setAudioUrl(result.audioUrl); // corrected to include backend audio URL
      setFileId(result.fileId);
      setShowResults(true);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process audio file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSegment = async (segment: Segment) => {
    try {
      await downloadSegment(segment, fileId);
    } catch (error) {
      console.error(`Error downloading segment ${segment.name}:`, error);
    }
  };

  const handleDownloadAll = async () => {
    try {
      await downloadAllSegmentsAsZip(segments, fileId, fileName);
    } catch (error) {
      console.error('Error downloading all segments:', error);
    }
  };

  const handleDownloadJSON = () => {
    downloadSegmentsAsJSON(segments, fileName);
  };

  const handleRenameSegment = (id: string, newName: string) => {
    setSegments(prev =>
      prev.map(seg => (seg.id === id ? { ...seg, name: newName } : seg))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />

          {showResults && segments.length > 0 && (
            <>
              <WaveformViewer audioUrl={audioUrl} segments={segments} />

              <SegmentTable
                segments={segments}
                onDownloadSegment={handleDownloadSegment}
                onDownloadAll={handleDownloadAll}
                onRenameSegment={handleRenameSegment}
              />

              <div className="flex justify-center mt-4">
                <button
                  onClick={handleDownloadJSON}
                  className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-sm"
                >
                  Download Timestamps as JSON
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
