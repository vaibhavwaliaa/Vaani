const express = require('express');
const cors = require('cors');
const multer = require('multer');
const speech = require('@google-cloud/speech');
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;

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

// Initialize Google Cloud Speech client
const client = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Path to service account key file
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Speech-to-Text Backend Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Speech-to-text endpoint
app.post('/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No audio file provided',
        message: 'Please upload an audio file',
      });
    }

    const { languageCode = 'en-US' } = req.body;

    console.log(`Processing speech recognition for language: ${languageCode}`);
    console.log(`Audio file size: ${req.file.size} bytes`);

    // Configure speech recognition request
    const request = {
      audio: {
        content: req.file.buffer.toString('base64'),
      },
      config: {
        encoding: 'LINEAR16', // For WAV files from React Native
        sampleRateHertz: 16000, // Match React Native app configuration
        languageCode: languageCode,
        alternativeLanguageCodes: ['en-US', 'hi-IN'], // Fallback languages
        enableAutomaticPunctuation: true,
        model: 'latest_long', // Best model for accuracy
      },
    };

    // Perform speech recognition
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    if (!transcription || transcription.trim() === '') {
      return res.status(200).json({
        success: false,
        message: 'No speech detected in audio',
        transcript: '',
        confidence: 0,
      });
    }

    // Get confidence score
    const confidence = response.results[0]?.alternatives[0]?.confidence || 0;

    console.log(`Transcription successful: "${transcription}"`);
    console.log(`Confidence: ${confidence}`);

    res.json({
      success: true,
      transcript: transcription,
      confidence: confidence,
      languageCode: languageCode,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Speech recognition error:', error);

    let errorMessage = 'Speech recognition failed';
    let statusCode = 500;

    if (error.code === 3) {
      errorMessage = 'Invalid audio format. Please use a supported format.';
      statusCode = 400;
    } else if (error.code === 7) {
      errorMessage = 'Permission denied. Check your Google Cloud credentials.';
      statusCode = 403;
    } else if (error.message.includes('quota')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Test endpoint for checking Google Cloud connection
app.get('/test-connection', async (req, res) => {
  try {
    // Simple test to verify Google Cloud Speech API connection
    const [operation] = await client.longRunningRecognize({
      audio: { content: '' }, // Empty content for test
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
    });

    res.json({
      success: true,
      message: 'Google Cloud Speech API connection successful',
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to Google Cloud Speech API',
      message: error.message,
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'Something went wrong',
  });
});

// Real-time WebSocket speech recognition
wss.on('connection', ws => {
  console.log('📞 New WebSocket connection for real-time speech');

  let recognizeStream = null;
  let isStreamActive = false;

  ws.on('message', async message => {
    try {
      const data = JSON.parse(message);

      if (data.action === 'start') {
        console.log(
          `🎤 Starting real-time recognition for language: ${data.languageCode}`,
        );

        // Create a new recognition stream
        recognizeStream = client
          .streamingRecognize({
            config: {
              encoding: 'LINEAR16', // For WAV files from React Native
              sampleRateHertz: 16000, // Match React Native configuration
              languageCode: data.languageCode || 'en-US',
              enableAutomaticPunctuation: true,
              interimResults: true, // Enable real-time partial results
              singleUtterance: false,
            },
            interimResults: true,
          })
          .on('data', response => {
            const result = response.results[0];
            if (result) {
              const transcript = result.alternatives[0].transcript;
              const isFinal = result.isFinal;

              // Send real-time results back to app
              ws.send(
                JSON.stringify({
                  type: 'transcript',
                  text: transcript,
                  isFinal: isFinal,
                  confidence: result.alternatives[0].confidence || 0,
                }),
              );

              console.log(
                `${isFinal ? '📝 Final' : '⏱️  Interim'}: "${transcript}"`,
              );
            }
          })
          .on('error', error => {
            console.error('❌ Stream error:', error);
            ws.send(
              JSON.stringify({
                type: 'error',
                message: error.message,
              }),
            );
          });

        isStreamActive = true;
        ws.send(
          JSON.stringify({
            type: 'ready',
            message: 'Real-time speech recognition started',
          }),
        );
      } else if (data.action === 'audio' && recognizeStream && isStreamActive) {
        // Stream audio data to Google Cloud Speech
        const audioBuffer = global.Buffer.from(data.audio, 'base64');
        recognizeStream.write(audioBuffer);
      } else if (data.action === 'stop') {
        console.log('🛑 Stopping real-time recognition');
        if (recognizeStream) {
          recognizeStream.end();
          recognizeStream = null;
        }
        isStreamActive = false;

        ws.send(
          JSON.stringify({
            type: 'stopped',
            message: 'Speech recognition stopped',
          }),
        );
      }
    } catch (error) {
      console.error('❌ WebSocket message error:', error);
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
        }),
      );
    }
  });

  ws.on('close', () => {
    console.log('📞 WebSocket connection closed');
    if (recognizeStream) {
      recognizeStream.end();
    }
  });
});

// Start server (listen on all interfaces for mobile device access)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎤 Speech-to-Text Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔊 Speech endpoint: http://localhost:${PORT}/speech-to-text`);
  console.log(`🧪 Test connection: http://localhost:${PORT}/test-connection`);
  console.log(`⚡ WebSocket for real-time: ws://localhost:${PORT}`);
  console.log(`📱 Mobile device access: http://10.251.123.57:${PORT}`);
  console.log(`📱 Mobile WebSocket: ws://10.251.123.57:${PORT}`);

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('⚠️  Warning: GOOGLE_APPLICATION_CREDENTIALS not set');
  }
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
    console.warn('⚠️  Warning: GOOGLE_CLOUD_PROJECT_ID not set');
  }
});
