import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X, Mic, MicOff, Volume2, Bot, Send, Sparkles, Trash2 } from 'lucide-react';

function App() {
  // Your Gemini API Key (replace with your actual key)
  const GEMINI_API_KEY = 'AIzaSyDFZ6mr63MOYGy--TDsw2RBQ6kpNeL-p6o';

  // Initialize state in memory (not localStorage per Claude.ai restrictions)
  const [currentUser, setCurrentUser] = useState({
    name: "Alex",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    isPremium: true,
    preferences: {
      emailCoaching: true,
      phoneCoaching: true,
      optimalCallTime: "10:00 AM"
    },
    aiProfile: {
      personalityType: "achiever",
      motivationStyle: "encouraging"
    },
    behaviorData: {
      completionRate: 0.78,
      lastCompletedHabit: "Morning Meditation",
      longestStreak: 21,
      biggerGoals: ["become a focused leader", "build mental strength for career"]
    }
  });

  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Morning Meditation",
      description: "Start the day with mindfulness",
      streak: 5,
      completedToday: false,
      category: "Mindfulness",
      progress: 3,
      target: 10
    },
    {
      id: 2,
      name: "Read 20 Minutes",
      description: "Expand knowledge through daily reading",
      streak: 3,
      completedToday: true,
      category: "Learning",
      progress: 5,
      target: 10
    },
    {
      id: 3,
      name: "Exercise",
      description: "Move your body for at least 30 minutes",
      streak: 8,
      completedToday: false,
      category: "Fitness",
      progress: 2,
      target: 10
    }
  ]);

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // AI Agent states
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [aiProcessing, setAiProcessing] = useState(false);
  const chatEndRef = useRef(null);

  // UI states
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'Mindfulness'
  });
  const [currentView, setCurrentView] = useState('habits');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [selectedHabitForSlider, setSelectedHabitForSlider] = useState(null);
  const [sliderValue, setSliderValue] = useState(100);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory, aiProcessing]);

  // BUILT-IN VOICE RECOGNITION SETUP
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setVoiceSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setVoiceTranscript('');
      };
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setVoiceTranscript(currentTranscript);
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          showMessage('🎤 Microphone access denied. Please allow microphone permissions.');
        } else if (event.error === 'no-speech') {
          showMessage('🎤 No speech detected. Try speaking more clearly.');
        } else {
          showMessage(`🎤 Speech recognition error: ${event.error}`);
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      setVoiceSupported(false);
    }
  }, []);

  // Voice command handling via URL parameters
  useEffect(() => {
    const handleVoiceCommand = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const action = urlParams.get('action');
      const habitName = urlParams.get('name');
      const percent = urlParams.get('percent');
      
      if (action === 'log-habit' && habitName) {
        logHabitViaVoice(habitName, percent);
        
        // Clear URL parameters after processing
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    };

    const timer = setTimeout(handleVoiceCommand, 1000);
    return () => clearTimeout(timer);
  }, [habits]);

  // GEMINI AI AGENT INTEGRATION
  const processWithAI = async (userMessage) => {
    setAiProcessing(true);
    
    try {
      const prompt = `You are a habit tracking assistant. The user says: "${userMessage}"

Current habits: ${habits.map(h => `- ${h.name}: ${h.description}`).join('\n')}

Respond in JSON format:
{
  "action": "log_habit" | "conversation",
  "habit_name": "exact habit name if logging" | null,
  "percentage": number 0-100 if logging | null,
  "response": "appropriate response",
  "speech_response": "version without emojis for speech"
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from AI response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiResult = JSON.parse(jsonMatch[0]);
        
        // Add to chat history
        setAiChatHistory(prev => [...prev, 
          { type: 'user', message: userMessage, timestamp: new Date() },
          { type: 'ai', message: aiResult.response, timestamp: new Date() }
        ]);
        
        // Speak the response
        if ('speechSynthesis' in window && aiResult.speech_response) {
          const utterance = new SpeechSynthesisUtterance(aiResult.speech_response);
          speechSynthesis.speak(utterance);
        }
        
        // Execute action if it's a habit log
        if (aiResult.action === 'log_habit' && aiResult.habit_name && aiResult.percentage !== null) {
          const habit = habits.find(h => h.name.toLowerCase().includes(aiResult.habit_name.toLowerCase()));
          if (habit) {
            executeHabitUpdate(habit, aiResult.percentage, 'ai');
          }
        }
        
        return aiResult;
      } else {
        throw new Error('Invalid AI response format');
      }
      
    } catch (error) {
      const errorMessage = `🤖 AI Error: ${error.message}`;
      setAiChatHistory(prev => [...prev, 
        { type: 'user', message: userMessage, timestamp: new Date() },
        { type: 'error', message: errorMessage, timestamp: new Date() }
      ]);
      showMessage(errorMessage);
      return null;
    } finally {
      setAiProcessing(false);
    }
  };

  const sendAIMessage = async () => {
    if (!aiChatInput.trim()) return;
    
    const message = aiChatInput.trim();
    setAiChatInput('');
    
    await processWithAI(message);
  };

  const logHabitViaVoice = (habitName, percentString) => {
    const percent = parseInt(percentString) || 100;
    
    const habit = habits.find(h => {
      const habitLower = h.name.toLowerCase();
      const searchLower = habitName.toLowerCase();
      return habitLower.includes(searchLower) || searchLower.includes(habitLower);
    });
    
    if (habit) {
      executeHabitUpdate(habit, percent, 'voice');
    } else {
      showMessage(`🎤 Couldn't find habit "${habitName}"`);
    }
  };

  // Process voice commands (built-in system)
  const processVoiceCommand = (transcript) => {
    const text = transcript.toLowerCase().trim();
    
    // Smart habit matching
    const matchedHabit = findHabitInSpeech(text);
    const percentage = extractPercentageFromSpeech(text);
    
    if (matchedHabit) {
      executeHabitUpdate(matchedHabit, percentage, 'voice');
    } else {
      showMessage(`🎤 Couldn't identify a habit in: "${transcript}"`);
      
      // Speak the error
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          "Sorry, I couldn't identify which habit you meant."
        );
        speechSynthesis.speak(utterance);
      }
    }
  };

  // Execute habit update (unified function)
  const executeHabitUpdate = (habit, percentage, source) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habit.id) {
        const newStreak = percentage >= 50 ? h.streak + 1 : h.streak;
        const newProgress = Math.min(h.progress + Math.ceil(percentage/100), h.target);
        
        return {
          ...h,
          completedToday: percentage >= 50,
          voiceCompletion: source === 'voice' ? percentage : undefined,
          aiCompletion: source === 'ai' ? percentage : undefined,
          completionPercentage: source === 'manual' ? percentage : undefined,
          streak: newStreak,
          progress: newProgress
        };
      }
      return h;
    }));
    
    // Success message
    const icon = source === 'voice' ? '🎤' : source === 'ai' ? '🤖' : '📱';
    const successMessage = `${icon} ${habit.name} logged at ${percentage}%!`;
    showMessage(successMessage);
    
    // Speak confirmation for voice commands
    if (source === 'voice' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `${habit.name} logged at ${percentage} percent`
      );
      speechSynthesis.speak(utterance);
    }
  };

  // Find habit mentioned in speech
  const findHabitInSpeech = (text) => {
    const habitKeywords = {};
    habits.forEach(habit => {
      const habitName = habit.name;
      const nameWords = habitName.toLowerCase().split(' ');
      
      habitKeywords[habitName] = [...nameWords, habitName.toLowerCase()];
      
      if (habit.category === 'Mindfulness') {
        habitKeywords[habitName].push('meditation', 'meditate', 'mindful');
      } else if (habit.category === 'Fitness') {
        habitKeywords[habitName].push('exercise', 'workout', 'fitness', 'gym');
      } else if (habit.category === 'Learning') {
        habitKeywords[habitName].push('reading', 'read', 'book', 'study');
      }
    });
    
    for (const habit of habits) {
      const keywords = habitKeywords[habit.name] || [];
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return habit;
        }
      }
    }
    
    return null;
  };

  // Extract percentage from speech
  const extractPercentageFromSpeech = (text) => {
    const percentMatches = [
      /(\d+)\s*percent/,
      /(\d+)\s*%/
    ];
    
    for (const pattern of percentMatches) {
      const match = text.match(pattern);
      if (match) {
        return Math.min(parseInt(match[1]), 100);
      }
    }
    
    const completionWords = {
      'complete': 100, 'completed': 100, 'done': 100, 'finished': 100,
      'mostly': 75, 'almost': 75, 'nearly': 75,
      'half': 50, 'halfway': 50, 'partially': 50,
      'little': 25, 'bit': 25, 'started': 25
    };
    
    for (const [word, percent] of Object.entries(completionWords)) {
      if (text.includes(word)) {
        return percent;
      }
    }
    
    return 100;
  };

  // Start voice recognition
  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        showMessage('🎤 Error starting voice recognition. Try again.');
      }
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const showMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const toggleHabit = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completedToday;
        const newStreak = newCompleted ? habit.streak + 1 : habit.streak;
        const newProgress = newCompleted ? Math.min(habit.progress + 1, habit.target) : habit.progress;
        
        if (newCompleted) {
          showMessage(`✅ ${habit.name} completed!`);
        }
        
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newStreak,
          progress: newProgress,
          voiceCompletion: undefined,
          aiCompletion: undefined,
          completionPercentage: undefined
        };
      }
      return habit;
    }));
  };

  // Add new habit
  const addNewHabit = () => {
    if (newHabit.name.trim() === '') return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      description: newHabit.description || `Build a consistent ${newHabit.name.toLowerCase()} routine`,
      streak: 0,
      completedToday: false,
      category: newHabit.category,
      progress: 0,
      target: 10
    };
    
    setHabits(prev => [...prev, habit]);
    setNewHabit({ name: '', description: '', category: 'Mindfulness' });
    setShowAddHabit(false);
    showMessage(`🎉 New habit "${habit.name}" added!`);
  };

  // Slider functionality
  const openSliderModal = (habit) => {
    setSelectedHabitForSlider(habit);
    setSliderValue(100);
    setShowSliderModal(true);
  };

  const closeSliderModal = () => {
    setShowSliderModal(false);
    setSelectedHabitForSlider(null);
  };

  const confirmSliderCompletion = () => {
    if (!selectedHabitForSlider) return;
    executeHabitUpdate(selectedHabitForSlider, sliderValue, 'manual');
    closeSliderModal();
  };

  const generateVoiceInstructions = () => {
    return `Voice Commands Setup:
1. Google Assistant: "Hey Google, open ${window.location.origin}?action=log-habit&name=meditation&percent=80"
2. Available parameters: action=log-habit, name=[habit], percent=[0-100]`;
  };

  const getWeeklyProgress = () => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completedToday).length;
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    
    return {
      completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
      totalStreak,
      activeHabits: totalHabits
    };
  };

  const SliderModal = () => {
    if (!showSliderModal || !selectedHabitForSlider) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Set Completion Level</h3>
            <button onClick={closeSliderModal}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">{selectedHabitForSlider.name}</h4>
            <p className="text-sm text-gray-600 mb-4">How much did you accomplish?</p>
            
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {sliderValue}%
              </div>
            </div>

            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={sliderValue}
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="flex justify-between mt-3 gap-2">
                {[25, 50, 75, 100].map(percentage => (
                  <button
                    key={percentage}
                    onClick={() => setSliderValue(percentage)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      sliderValue === percentage 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeSliderModal}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmSliderCompletion}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Log Progress
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm">
          <p className="text-sm font-medium">{notificationMessage}</p>
        </div>
      )}
      
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-xl text-gray-800">Ultimate Habit Tracker</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentView('habits')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'habits' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Habits
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center py-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎤🤖 The Ultimate Habit Tracker!</h1>
            <p className="text-lg text-gray-600 mb-4">Voice commands, AI chat, and smart tracking all in one!</p>
          </div>

          {/* Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Control Panel */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Commands
                </h2>
                <button
                  onClick={() => setShowVoiceHelp(!showVoiceHelp)}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Help
                </button>
              </div>
              
              {voiceSupported ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-5 h-5" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          Start Voice Command
                        </>
                      )}
                    </button>
                  </div>
                  
                  {isListening && (
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-800">Listening...</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {voiceTranscript || 'Say: "Exercise complete" or "Meditation 75 percent"'}
                      </p>
                    </div>
                  )}
                  
                  {showVoiceHelp && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold mb-2">Voice Command Examples:</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        <li>• "Exercise complete"</li>
                        <li>• "Meditation 75 percent"</li>
                        <li>• "Reading finished"</li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    Voice recognition not supported. Try Chrome, Edge, or Safari.
                  </p>
                </div>
              )}
            </div>

            {/* AI Chat Panel */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Assistant
                </h2>
                <button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className={`text-sm px-3 py-1 rounded-full transition-colors ${
                    showAIChat 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {showAIChat ? 'Close' : 'Open Chat'}
                </button>
              </div>
              
              <div className="space-y-4">
                {!showAIChat ? (
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-white p-3 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-sm mb-1">Smart & Conversational</h3>
                      <p className="text-xs text-gray-600">Chat naturally about your habits!</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 h-80 flex flex-col">
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {aiChatHistory.length === 0 ? (
                        <div className="text-center text-gray-500 text-sm py-8">
                          <Bot className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                          <p>Hi! I'm your AI habit assistant.</p>
                          <p>Try: "I just finished my workout!"</p>
                        </div>
                      ) : (
                        aiChatHistory.map((chat, index) => (
                          <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              chat.type === 'user' 
                                ? 'bg-blue-500 text-white' 
                                : chat.type === 'error'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              <p>{chat.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                      {aiProcessing && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 animate-spin" />
                              <span>AI is thinking...</span>
