# Speech-to-Text React Native App with Google Cloud API

## 🎤 Features

- Real-time speech recognition using Google Cloud Speech-to-Text API
- Support for 15 Indian languages + English
- Beautiful UI with typewriter animation
- Physical device deployment via USB

## 🚀 Setup Instructions

### 1. Google Cloud Speech-to-Text API Setup

1. **Create Google Cloud Project:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Note your Project ID

2. **Enable Speech-to-Text API:**

   - In the Google Cloud Console, go to "APIs & Services" > "Library"
   - Search for "Cloud Speech-to-Text API"
   - Click on it and press "Enable"

3. **Create API Key:**

   - Go to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS" > "API key"
   - Copy the generated API key
   - (Recommended) Restrict the key to Speech-to-Text API only

4. **Configure Billing:**
   - Go to "Billing" in Google Cloud Console
   - Set up billing for your project (required for API usage)
   - Speech-to-Text API offers free tier: 60 minutes/month

### 2. App Configuration

1. **Update API Key:**

   ```bash
   # Edit the config file
   code src/config/config.ts
   ```

   Replace `'YOUR_API_KEY_HERE'` with your actual Google Cloud API key:

   ```typescript
   export const GOOGLE_CLOUD_CONFIG = {
     API_KEY: 'your-actual-api-key-here',
     SPEECH_API_URL: 'https://speech.googleapis.com/v1/speech:recognize',
   };
   ```

### 3. Build and Run

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Build for Android:**
   ```bash
   npx react-native run-android
   ```

## 📱 How to Use

1. **Select Language:** Choose your preferred output language from 15 options
2. **Start Recording:** Tap the microphone button to start recording
3. **Speak Clearly:** Speak in any language (the app will recognize it)
4. **View Results:** Text appears in your selected language format
5. **Stop Recording:** Tap the button again to stop and process

## 🎯 Supported Languages

- **Hindi** (हिन्दी) - hi-IN
- **English** - en-US
- **Bengali** (বাংলা) - bn-IN
- **Telugu** (తెలుగు) - te-IN
- **Marathi** (मराठी) - mr-IN
- **Tamil** (தமிழ்) - ta-IN
- **Gujarati** (ગુજરાતી) - gu-IN
- **Urdu** (اردو) - ur-PK
- **Kannada** (ಕನ್ನಡ) - kn-IN
- **Malayalam** (മലയാളം) - ml-IN
- **Odia** (ଓଡ଼ିଆ) - or-IN
- **Punjabi** (ਪੰਜਾਬੀ) - pa-IN
- **Assamese** (অসমীয়া) - as-IN
- **Nepali** (नेपाली) - ne-NP
- **Sanskrit** (संस्कृत) - sa-IN

## 🔧 Technical Details

- **React Native CLI** (not Expo)
- **TypeScript** for type safety
- **Google Cloud Speech-to-Text API** for accurate recognition
- **Real-time audio recording** with react-native-audio-record
- **Cross-platform design** optimized for mobile

## 💰 Pricing

Google Cloud Speech-to-Text API pricing:

- **Free Tier:** 60 minutes per month
- **Paid:** $0.006 per 15-second increment after free tier

## 🔒 Security Notes

- Never commit your actual API key to version control
- Consider using environment variables for production
- Restrict your API key to Speech-to-Text API only
- Monitor usage in Google Cloud Console

## 🐛 Troubleshooting

1. **"API key not configured" error:**

   - Update `src/config/config.ts` with your API key

2. **"API Error" messages:**

   - Check your Google Cloud billing is set up
   - Verify Speech-to-Text API is enabled
   - Ensure API key has proper permissions

3. **No audio recording:**

   - Grant microphone permissions to the app
   - Test on physical device (not emulator)

4. **Build errors:**
   - Run `cd android && ./gradlew clean && cd ..`
   - Restart Metro bundler: `npx react-native start --reset-cache`

## 📄 Files Structure

```
src/
├── config/
│   └── config.ts          # Google API configuration
├── screens/
│   ├── LandingPage.tsx    # Welcome screen
│   ├── LanguageSelectionPage.tsx  # Language picker
│   └── SpeechToTextPage.tsx       # Main speech interface
├── components/
│   ├── LanguageSelector.tsx       # Language dropdown
│   └── Typewriter.tsx            # Animated text
└── App.tsx                # Main navigation
```

Ready to use! 🚀
