import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function VoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript('');
          handleSendMessage(finalTranscript.trim());
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Speech recognition error. Please try again.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    } else {
      setError('Speech recognition not supported in this browser.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    } else {
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response from Groq
      const chatResponse = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Failed to get AI response');
      }

      const { reply } = await chatResponse.json();
      const responseText = reply;

      // Call backend API for TTS
      const response = await fetch('http://localhost:3001/api/elevenlabs/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: responseText,
          voiceId: 'EXAVITQu4vr4xnSDxMaL', // Default voice ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      // Play audio response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setIsSpeaking(true);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();

      // Add assistant message
      const assistantMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to process message. Please check that the backend server is running on port 3001.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Voice Assistant</h1>
        <p className="text-muted-foreground">Speak naturally and get intelligent responses</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4 px-2">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Volume2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Start speaking to begin conversation</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex animate-fade-in",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-6 py-4 shadow-sm",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-card-foreground border border-border'
              )}
            >
              <p className="text-sm font-medium mb-1 opacity-70">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </p>
              <p className="leading-relaxed">{message.content}</p>
              <p className="text-xs opacity-50 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Live Transcript */}
        {transcript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-primary/20 text-foreground border-2 border-primary border-dashed">
              <p className="text-sm font-medium mb-1 opacity-70">Speaking...</p>
              <p className="leading-relaxed opacity-70">{transcript}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-card text-card-foreground border border-border">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Voice Control Button */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={toggleListening}
          disabled={isLoading}
          className={cn(
            "relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
            isListening
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-primary text-primary-foreground hover:scale-105'
          )}
        >
          {/* Pulse Ring Animation */}
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-destructive animate-pulse-ring" />
          )}
          
          {/* Speaking Indicator */}
          {isSpeaking && (
            <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
          )}

          {isListening ? (
            <MicOff className="w-8 h-8 relative z-10" />
          ) : (
            <Mic className="w-8 h-8 relative z-10" />
          )}
        </button>

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Click to speak'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isListening ? 'Click again to stop' : 'Hold and speak your message'}
          </p>
        </div>
      </div>
    </div>
  );
}

