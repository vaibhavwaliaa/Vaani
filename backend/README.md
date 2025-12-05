# Speech-to-Text Backend Server

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Google Cloud Setup

#### A. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "IAM & Admin" > "Service Accounts"
3. Click "Create Service Account"
4. Give it a name: `speech-to-text-service`
5. Grant role: `Cloud Speech Client`
6. Create and download the JSON key file

#### B. Enable Speech-to-Text API

1. Go to "APIs & Services" > "Library"
2. Search for "Cloud Speech-to-Text API"
3. Click "Enable"

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your values:
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
PORT=3000
```

### 4. Add Service Account Key

- Place your downloaded JSON key file in the `backend` folder
- Name it `service-account-key.json` (or update the path in `.env`)

### 5. Start Server

```bash
npm start
# or for development with auto-restart:
npm run dev
```

## 📡 API Endpoints

### Health Check

```
GET http://localhost:3000/health
```

### Speech Recognition

```
POST http://localhost:3000/speech-to-text
Content-Type: multipart/form-data

Body:
- audio: (audio file)
- languageCode: "hi-IN" (optional, defaults to "en-US")
```

### Test Connection

```
GET http://localhost:3000/test-connection
```

## 🎯 Supported Languages

- `en-US` - English (US)
- `hi-IN` - Hindi (India)
- `bn-IN` - Bengali (India)
- `te-IN` - Telugu (India)
- `mr-IN` - Marathi (India)
- `ta-IN` - Tamil (India)
- `gu-IN` - Gujarati (India)
- `ur-PK` - Urdu (Pakistan)
- `kn-IN` - Kannada (India)
- `ml-IN` - Malayalam (India)
- `or-IN` - Odia (India)
- `pa-IN` - Punjabi (India)
- `as-IN` - Assamese (India)
- `ne-NP` - Nepali (Nepal)
- `sa-IN` - Sanskrit (India)

## 🧪 Testing

Test with curl:

```bash
curl -X POST http://localhost:3000/speech-to-text \
  -F "audio=@test-audio.wav" \
  -F "languageCode=hi-IN"
```

## 📁 File Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .env                   # Your environment (create this)
├── service-account-key.json # Google Cloud key (add this)
└── README.md              # This file
```

## 🔒 Security Notes

- Never commit `.env` or `service-account-key.json` to version control
- Use environment variables in production
- Consider rate limiting for production use
- Validate audio file types and sizes

## 💰 Pricing

Google Cloud Speech-to-Text:

- Free tier: 60 minutes/month
- Standard pricing: $0.006 per 15-second increment

## 🐛 Troubleshooting

**"Permission denied" errors:**

- Check your service account has `Cloud Speech Client` role
- Verify the JSON key file path is correct

**"Project not found" errors:**

- Ensure `GOOGLE_CLOUD_PROJECT_ID` matches your actual project ID
- Verify the project has Speech-to-Text API enabled

**"Quota exceeded" errors:**

- Check your Google Cloud billing is set up
- Monitor usage in the Cloud Console
