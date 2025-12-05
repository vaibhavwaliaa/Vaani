const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3001; // Different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for handling audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Mock speech-to-text endpoint (without Google Cloud)
app.post('/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided',
        message: 'Please upload an audio file',
      });
    }

    const { languageCode = 'en-US' } = req.body;

    console.log(
      `📝 Mock processing speech recognition for language: ${languageCode}`,
    );
    console.log(`📁 Audio file size: ${req.file.size} bytes`);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock responses to test real-time functionality
    const mockResponses = [
      'Hello there',
      'How are you doing',
      'This is working',
      'Real time speech',
      'Testing one two three',
      'Perfect functionality',
      'Speech recognition',
      'Working properly now',
    ];

    const randomResponse =
      mockResponses[Math.floor(Math.random() * mockResponses.length)];

    console.log(`✅ Mock transcription: "${randomResponse}"`);

    res.json({
      success: true,
      transcript: randomResponse,
      confidence: 0.95,
      languageCode: languageCode,
      timestamp: new Date().toISOString(),
      mock: true, // Indicate this is a mock response
    });
  } catch (error) {
    console.error('Mock speech recognition error:', error);

    res.status(500).json({
      success: false,
      error: 'Mock speech recognition failed',
      details: error.message,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mock Speech-to-Text Backend Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎤 Mock Speech-to-Text Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(
    `🔊 Mock Speech endpoint: http://localhost:${PORT}/speech-to-text`,
  );
  console.log(`📱 Mobile device access: http://10.251.123.57:${PORT}`);
  console.log(`🧪 This is a MOCK server for testing real-time functionality`);
});
