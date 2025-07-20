// components/ai/AIChat.js
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, Volume2, VolumeX, X, User } from 'lucide-react';
import { processWithAI } from './aiHelpers';

const AIChat = ({ 
  showAIChat, 
  setShowAIChat, 
  habits, 
  habitsRef,
  setHabits, 
  showMessage,
  GEMINI_API_KEY, 
  currentUser  // ADD THIS LINE
}) => {
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory, aiProcessing]);

  const sendAIMessage = async () => {
    console.log('🎯 AIChat sendAIMessage called!'); // ADD THIS LINE
    if (!aiChatInput.trim()) return;
    const message = aiChatInput.trim();
    setAiChatInput('');
    
    await processWithAI(
      message,
      habitsRef,
      setHabits,
      setAiChatHistory,
      setAiProcessing,
      showMessage,
      aiVoiceEnabled,
      GEMINI_API_KEY,
      currentUser  // ADD THIS LINE
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAIMessage();
    }
  };

  if (!showAIChat) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full h-full md:max-w-2xl md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Bot className="w-5 h-5 text-green-500" />
            AI Habit Coach
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (aiVoiceEnabled) {
                  speechSynthesis.cancel();
                }
                setAiVoiceEnabled(!aiVoiceEnabled);
              }}
              className={`p-2 rounded-lg transition-colors ${
                aiVoiceEnabled 
                  ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                  : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
              }`}
              title={aiVoiceEnabled ? 'Turn off AI voice' : 'Turn on AI voice'}
            >
              {aiVoiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button onClick={() => setShowAIChat(false)}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {aiChatHistory.length === 0 && (
            <div className="text-center text-gray-500 mt-10 md:mt-20">
              <Bot className="w-10 h-10 md:w-12 md:h-12 text-green-300 mx-auto mb-4" />
              <p className="font-medium text-sm md:text-base">Chat with your AI habit coach!</p>
              <p className="text-xs md:text-sm mt-2">Try saying things like:</p>
              <div className="mt-4 space-y-2 text-xs md:text-sm max-w-sm mx-auto">
                <div className="bg-green-50 rounded-lg p-2">"I just finished an amazing workout!"</div>
                <div className="bg-green-50 rounded-lg p-2">"Add a savings habit"</div>
                <div className="bg-green-50 rounded-lg p-2">"How do I stay motivated?"</div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                {aiVoiceEnabled ? (
                  <>
                    <Volume2 className="w-3 h-3" />
                    <span>AI voice responses enabled</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3" />
                    <span>AI voice responses disabled</span>
                  </>
                )}
              </div>
            </div>
          )}
          
          {aiChatHistory.map((chat, index) => (
            <div key={index} className={`flex gap-2 md:gap-3 ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {chat.type !== 'user' && (
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  chat.type === 'error' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <Bot className={`w-3 h-3 md:w-4 md:h-4 ${chat.type === 'error' ? 'text-red-500' : 'text-green-500'}`} />
                </div>
              )}
              <div className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                chat.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : chat.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-xs md:text-sm whitespace-pre-wrap">{chat.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {chat.type === 'user' && (
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                </div>
              )}
            </div>
          ))}
          
          {aiProcessing && (
            <div className="flex gap-2 md:gap-3 justify-start">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
              </div>
              <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-green-500 animate-spin" />
                  <span className="text-xs md:text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 md:p-6 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={aiChatInput}
              onChange={(e) => setAiChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message your AI coach..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              disabled={aiProcessing}
            />
            <button
              onClick={sendAIMessage}
              disabled={aiProcessing || !aiChatInput.trim()}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 md:px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
