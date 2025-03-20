"use client";

import { useState, useEffect, useRef } from "react";

export default function VoiceChatbot() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const chatBodyRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  useEffect(() => {
    // Initialize speech synthesis when component mounts
    speechSynthesisRef.current = window.speechSynthesis;
    
    // Show initial bot message when chat is first opened
    if (isChatOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        addMessage("How can I help you?", "bot");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, messages.length]);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender }]);
    if (sender === "bot") {
      speakText(text);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;
    
    addMessage(inputText, "user");
    setInputText("");
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText })
      });
      
      const data = await response.json();
      addMessage(data.response || "Sorry, I couldn't process that request.", "bot");
    } catch (error) {
      addMessage("Error connecting to server.", "bot");
      console.error("Error:", error);
    }
  };

  const speakText = (text) => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesisRef.current.speak(utterance);
    }
  };

  const togglePause = () => {
    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      if (isPaused) {
        speechSynthesisRef.current.resume();
      } else {
        speechSynthesisRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const startVoiceRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.onresult = (event) => {
          setInputText(event.results[0][0].transcript);
        };
        recognition.start();
      } else {
        addMessage("Speech recognition is not supported in your browser.", "bot");
      }
    }
  };

  const replayMessage = (text) => {
    speakText(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-widget-container">
      <div className={`chat-window ${isChatOpen ? 'active' : ''}`}>
        <div className="chat-header">
          <span>Voice Assistant</span>
          <span className="close-chat" onClick={toggleChat}>✕</span>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              {message.text}
              {message.sender === "bot" && (
                <button 
                  className="replay-button" 
                  onClick={() => replayMessage(message.text)}
                >
                  🔊
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
          />
          <button className="send-button" onClick={sendMessage}>▶</button>
          <button className="voice-button" onClick={startVoiceRecognition}>🎤</button>
          <button className="pause-button" onClick={togglePause}>
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>
      </div>
      <div className="chat-button" onClick={toggleChat}>💬</div>

      <style jsx global>{`
        :root {
            --primary-color: #3B82F6;
            --primary-light: #60A5FA;
            --primary-dark: #2563EB;
            --chat-bg: #EFF6FF;
            --user-bubble: #DBEAFE;
            --bot-bubble: #ffffff;
            --shadow: rgba(59, 130, 246, 0.2);
            --voice-color: #38BDF8;
            --pause-color: #FB7185;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #F1F5F9;
            margin: 0;
            padding: 0;
        }

        .chat-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary-color);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 12px var(--shadow);
            color: white;
            font-size: 24px;
            transition: background-color 0.3s ease;
        }

        .chat-button:hover {
            background-color: var(--primary-dark);
        }

        .chat-window {
            width: 600px;
            height: 500px;
            background-color: var(--chat-bg);
            border-radius: 16px;
            box-shadow: 0 8px 24px var(--shadow);
            display: none;
            flex-direction: column;
            margin-bottom: 16px;
            border: 1px solid #BFDBFE;
            transition: all 0.3s ease;
        }

        .chat-window.active {
            display: flex;
            animation: slideIn 0.3s forwards;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chat-header {
            background-color: var(--primary-color);
            color: white;
            padding: 16px;
            border-radius: 16px 16px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .close-chat {
            cursor: pointer;
            font-size: 18px;
            transition: opacity 0.2s;
        }

        .close-chat:hover {
            opacity: 0.8;
        }

        .chat-body {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            background-color: #F0F9FF;
        }

        .chat-message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 16px;
            margin-bottom: 12px;
            box-shadow: 0 2px 4px var(--shadow);
            display: flex;
            align-items: center;
            justify-content: space-between;
            animation: fadeIn 0.3s forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .chat-message.bot {
            align-self: flex-start;
            background-color: var(--bot-bubble);
            border-bottom-left-radius: 4px;
            border-left: 3px solid var(--primary-color);
        }

        .chat-message.user {
            align-self: flex-end;
            background-color: var(--user-bubble);
            border-bottom-right-radius: 4px;
            border-right: 3px solid var(--primary-light);
            color: #1E40AF;
        }

        .replay-button {
            background-color: var(--voice-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            margin-left: 8px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }

        .replay-button:hover {
            transform: scale(1.1);
        }

        .chat-footer {
            padding: 16px;
            display: flex;
            background-color: white;
            border-radius: 0 0 16px 16px;
            border-top: 1px solid #BFDBFE;
        }

        .chat-input {
            flex: 1;
            padding: 12px 16px;
            border-radius: 24px;
            border: 1px solid #BFDBFE;
            background-color: #F0F9FF;
            color: #1E40AF;
            font-size: 14px;
            transition: all 0.2s;
        }

        .chat-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .chat-input::placeholder {
            color: #93C5FD;
        }

        .send-button, .voice-button, .pause-button {
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            margin-left: 8px;
            cursor: pointer;
            font-size: 18px;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, background-color 0.2s;
        }

        .send-button {
            background-color: var(--primary-color);
        }

        .send-button:hover {
            background-color: var(--primary-dark);
            transform: scale(1.05);
        }

        .voice-button {
            background-color: var(--voice-color);
        }

        .voice-button:hover {
            background-color: #0284C7;
            transform: scale(1.05);
        }

        .pause-button {
            background-color: var(--pause-color);
        }

        .pause-button:hover {
            background-color: #E11D48;
            transform: scale(1.05);
        }

        @media (max-width: 768px) {
            .chat-window {
                width: 350px;
            }
        }

        @media (max-width: 480px) {
            .chat-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 100px);
            }
        }
      `}</style>
    </div>
  );
}
