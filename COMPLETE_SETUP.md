# 🎤 Complete Speech-to-Text Setup Guide

Your React Native app now uses a secure backend server to handle Google Cloud Speech API calls.

## 📋 What's Built

✅ **React Native App** - Speech recording and UI  
✅ **Node.js Backend** - Secure Google Cloud API integration  
✅ **15 Languages Support** - Hindi, English, Bengali, Tamil, etc.  
✅ **Professional Architecture** - API key safely stored on server

## 🚀 Setup Steps

### Step 1: Google Cloud Setup

1. **Create Google Cloud Project:**

   - Go to [console.cloud.google.com](https://console.cloud.google.com/)
   - Create new project (e.g., "speech-to-text-app")
   - Note your Project ID

2. **Enable Speech-to-Text API:**

   - Go to "APIs & Services" > "Library"
   - Search "Cloud Speech-to-Text API"
   - Click Enable

3. **Create Service Account:**

   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Name: `speech-service`
   - Role: `Cloud Speech Client`
   - Create & Download JSON key

4. **Setup Billing:**
   - Go to "Billing" section
   - Add payment method (required even for free tier)

### Step 2: Backend Configuration

1. **Place Service Account Key:**

   ```bash
   # Copy your downloaded JSON key to:
   backend/service-account-key.json
   ```

2. **Create Environment File:**

   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Edit .env file:**
   ```bash
   GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
   GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
   PORT=3000
   NODE_ENV=development
   ```

### Step 3: Find Your Computer's IP Address

For **physical device testing**, you need your computer's IP:

**Windows:**

```cmd
ipconfig
# Look for "IPv4 Address" under your network adapter
# Example: 192.168.1.100
```

**Update config for physical device:**

```typescript
// src/config/config.ts
export const BACKEND_CONFIG = {
  BASE_URL: 'http://192.168.1.100:3000', // Use your actual IP
  // ...
};
```

### Step 4: Start Backend Server

```bash
cd backend
npm start
```

You should see:

```
🎤 Speech-to-Text Backend Server running on port 3000
📍 Health check: http://localhost:3000/health
```

### Step 5: Test Backend

Open browser and visit:

```
http://localhost:3000/health
```

Should show:

```json
{
  "status": "OK",
  "message": "Speech-to-Text Backend Server is running"
}
```

### Step 6: Build & Test App

```bash
# In main project directory
npx react-native run-android
```

## 🧪 Testing Speech Recognition

1. **Open app on device**
2. **Select language** (e.g., Hindi)
3. **Tap microphone** → Should show "🎤 Listening..."
4. **Speak clearly** for 5-10 seconds
5. **Wait for processing** → Should show recognized text

## 🎯 Supported Languages

| Language  | Code  | Native Name |
| --------- | ----- | ----------- |
| English   | en-US | English     |
| Hindi     | hi-IN | हिन्दी      |
| Bengali   | bn-IN | বাংলা       |
| Telugu    | te-IN | తెలుగు      |
| Marathi   | mr-IN | मराठी       |
| Tamil     | ta-IN | தமிழ்       |
| Gujarati  | gu-IN | ગુજરાતી     |
| Urdu      | ur-PK | اردو        |
| Kannada   | kn-IN | ಕನ್ನಡ       |
| Malayalam | ml-IN | മലയാളം      |
| Odia      | or-IN | ଓଡ଼ିଆ       |
| Punjabi   | pa-IN | ਪੰਜਾਬੀ      |
| Assamese  | as-IN | অসমীয়া     |
| Nepali    | ne-NP | नेपाली      |
| Sanskrit  | sa-IN | संस्कृत     |

## 🔧 Troubleshooting

### "Backend Connection Failed"

- ✅ Backend server is running on port 3000
- ✅ Device can reach your computer (same Wi-Fi)
- ✅ IP address is correct in config.ts
- ✅ Windows Firewall allows port 3000

### "Permission denied" (Backend logs)

- ✅ Service account has "Cloud Speech Client" role
- ✅ JSON key file path is correct
- ✅ Project ID matches your actual project

### "No speech detected"

- ✅ Speak closer to microphone
- ✅ Speak clearly and loudly
- ✅ Check microphone permissions
- ✅ Try in quiet environment

### "API quota exceeded"

- ✅ Check Google Cloud Console > Speech API > Quotas
- ✅ Verify billing is set up correctly

## 💰 Pricing

**Google Cloud Speech-to-Text:**

- **Free Tier:** 60 minutes/month
- **Paid:** $0.006 per 15-second increment

For testing: ~200 requests = $1-2

## 🔒 Security Features

✅ **API Key Protected** - Never exposed in mobile app  
✅ **Server-side Processing** - Google Cloud accessed securely  
✅ **Environment Variables** - Sensitive data in .env files  
✅ **CORS Enabled** - Restricted to your mobile app

## 📱 Ready to Use!

Your speech-to-text app is now production-ready with:

- ✅ Secure Google Cloud integration
- ✅ Multi-language support
- ✅ Professional architecture
- ✅ Real-time speech recognition

Speak in any language → Get text in your selected output language! 🎉
