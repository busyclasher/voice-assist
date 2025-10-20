# Voice Assistant with ElevenLabs

A modern, real-time voice assistant built with React, ElevenLabs TTS API, and Web Speech API. Features a beautiful Google Material Design-inspired interface with conversational chat history.

![Voice Assistant](https://img.shields.io/badge/React-19.1-blue) ![ElevenLabs](https://img.shields.io/badge/ElevenLabs-TTS-orange) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

## 🎯 Features

- **🎤 Speech-to-Text**: Real-time voice recognition using Web Speech API
- **🤖 AI-Powered Responses**: Intelligent conversations powered by Groq (Llama 3.1)
- **🔊 Natural Voice**: High-quality voice synthesis with ElevenLabs TTS
- **💬 Chat History**: Beautiful conversational interface with message history
- **🎨 Modern UI**: Google Material Design-inspired interface with Tailwind CSS
- **🔒 Secure**: API keys protected on backend server
- **⚡ Lightning Fast**: Groq provides incredibly fast AI responses
- **📱 Responsive**: Works seamlessly on desktop and mobile devices

## 🏗️ Project Structure

```
voice-assist/
├── eleven-tts/                 # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   └── VoiceChat.jsx   # Main voice chat component
│   │   ├── lib/
│   │   │   └── utils.js        # Utility functions
│   │   ├── App.jsx             # Root component
│   │   ├── App.css             # App styles
│   │   ├── index.css           # Global styles with Tailwind
│   │   └── main.jsx            # Entry point
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
├── server.js                   # Express backend server
├── package.json                # Backend dependencies & scripts
├── .env                        # Environment variables (create this)
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ installed
- ElevenLabs API key ([Get one here](https://elevenlabs.io/))
- ElevenLabs Conversational AI Agent ID ([Create one here](https://elevenlabs.io/app/conversational-ai))
- Modern browser with Web Speech API support (Chrome, Edge recommended)

### Installation

1. **Clone or download this repository**

2. **Install backend dependencies** (in root directory):
   ```bash
   npm install
   ```

3. **Install frontend dependencies** (in eleven-tts directory):
   ```bash
   cd eleven-tts
   npm install
   cd ..
   ```

### Configuration

1. **Create `.env` file** in the root directory:
   ```env
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   PORT=3001
   ```

2. **Get your credentials:**
   - **ElevenLabs API Key**: Get from https://elevenlabs.io/app/settings/api-keys
   - **Groq API Key**: Get from https://console.groq.com/keys
     - Sign up for free at https://console.groq.com/
     - Navigate to API Keys section
     - Create a new API key
     - Copy the key (starts with `gsk_`)

3. **Replace the placeholders** in `.env` with your actual credentials

### Running the Application

**Development Mode** (recommended):
```bash
npm run dev
```

This starts both:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:5173`

**Or run separately:**

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

### Production Build

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## 🎮 How to Use

1. **Open the application** in your browser (usually `http://localhost:5173`)

2. **Click the microphone button** to start listening

3. **Speak your message** - you'll see live transcription as you speak

4. **The assistant responds** with voice and text in the chat history

5. **Click again to stop** listening or continue the conversation

## 🛠️ Technology Stack

### Frontend
- **React 19.1** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Web Speech API** - Browser speech recognition

### Backend
- **Express 5** - Node.js web framework
- **Groq API** - Ultra-fast AI inference (Llama 3.1)
- **ElevenLabs API** - Text-to-speech synthesis
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📡 API Endpoints

### `POST /api/chat`
Sends user message to Groq AI and returns intelligent response

**Request body:**
```json
{
  "message": "User's spoken message"
}
```

**Response:**
```json
{
  "reply": "AI assistant's response"
}
```

### `POST /api/elevenlabs/text-to-speech`
Converts text to speech using ElevenLabs API

**Request body:**
```json
{
  "text": "Text to convert to speech",
  "voiceId": "EXAVITQu4vr4xnSDxMaL"
}
```

**Response:** Audio file (audio/mpeg)

## 🎨 Customization

### Change AI Model
Edit `server.js` line 77 to use a different Groq model:
```javascript
model: 'llama-3.1-70b-versatile', // Current model
// Options:
// 'llama-3.1-8b-instant' - Fastest
// 'mixtral-8x7b-32768' - Long context
// 'gemma2-9b-it' - Google's model
```

### Change Voice
Edit `VoiceChat.jsx` line 124 to use a different ElevenLabs voice:
```javascript
voiceId: 'EXAVITQu4vr4xnSDxMaL', // Replace with your preferred voice ID
```
Browse voices at: https://elevenlabs.io/voice-library

### Adjust AI Personality
Edit the system prompt in `server.js` line 81:
```javascript
content: 'You are a helpful voice assistant. Keep responses concise...'
```

### Modify Colors
Edit CSS variables in `eleven-tts/src/index.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* Main brand color */
  --background: 0 0% 100%;        /* Background color */
  /* ... more variables */
}
```

### Adjust UI Layout
Modify `eleven-tts/src/components/VoiceChat.jsx` to customize the interface

## 🐛 Troubleshooting

### Speech Recognition Not Working
- Ensure you're using Chrome or Edge browser
- Check microphone permissions in browser settings
- Try HTTPS or localhost (required for Web Speech API)

### No Audio Output
- Check browser audio permissions
- Verify ElevenLabs API key is correct in `.env`
- Check browser console for errors

### Backend Connection Failed
- Ensure backend server is running on port 3001
- Check `.env` file exists and has correct API key
- Verify CORS is not blocking requests

### Tailwind Styles Not Applied
- Ensure you ran `npm install` in `eleven-tts/` directory
- Check that `tailwind.config.js` and `postcss.config.js` exist
- Restart the dev server

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key | Yes |
| `GROQ_API_KEY` | Your Groq API key | Yes |
| `PORT` | Backend server port | No (default: 3001) |

## 🔐 Security Notes

- ✅ API keys are stored server-side only
- ✅ `.env` file is gitignored
- ✅ Backend acts as proxy to protect credentials
- ⚠️ For production, add rate limiting and authentication

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Resources

- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 💡 Future Enhancements

- [ ] Add conversation context/memory
- [ ] Support multiple languages
- [ ] Voice activity detection
- [ ] Custom wake word
- [ ] Export chat history
- [ ] Dark/light theme toggle
- [ ] WebSocket for real-time streaming
- [ ] Integration with LLM (GPT-4, Claude, etc.)

---

**Built with ❤️ using ElevenLabs, React, and Tailwind CSS**

#   o o p - p r o j  
 