# Speech Segmentation Backend

FastAPI backend for processing audio/video files and detecting speech segments.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `POST /api/process` - Upload and process audio/video file
- `POST /api/extract-segment` - Extract specific segment
- `DELETE /api/cleanup/{file_id}` - Clean up temporary files

## Production Implementation

For production use, implement real speech detection using:
- **librosa**: Audio processing and feature extraction
- **webrtcvad** or **silero-vad**: Voice activity detection
- **pydub**: Audio manipulation and segment extraction
- **ffmpeg**: Video to audio conversion

## Notes

The current implementation returns mock data for demonstration purposes.
Integrate actual speech detection algorithms for production use.