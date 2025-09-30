export interface Segment {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  name?: string;
}

export interface ProcessingResult {
  segments: Segment[];
  audioUrl: string;
  fileName: string;
}