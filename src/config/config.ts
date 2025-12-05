// Backend Server Configuration for Speech-to-Text
// The backend server handles Google Cloud API calls securely

export const BACKEND_CONFIG = {
  // Physical device configuration (using your computer's actual IP)
  BASE_URL: 'http://10.251.123.57:3000', // Your computer's IP address
  WS_URL: 'ws://10.251.123.57:3000', // WebSocket for real-time
  // For Android emulator, use:
  // BASE_URL: 'http://10.0.2.2:3000',
  // WS_URL: 'ws://10.0.2.2:3000',
  
  ENDPOINTS: {
    HEALTH: '/health',
    SPEECH_TO_TEXT: '/speech-to-text',
    TEST_CONNECTION: '/test-connection',
  },
};

// Note: Make sure your backend server is running on port 3000
// For physical devices, use your computer's actual IP address instead of localhost