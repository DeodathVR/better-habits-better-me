import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X, Mic, MicOff, Volume2, Bot, Send, Sparkles, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

function App() {
  // Your Gemini API Key
  const GEMINI_API_KEY = 'AIzaSyDFZ6mr63MOYGy--TDsw2RBQ6kpNeL-p6o';

  // Initialize state from localStorage or defaults
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('habitTracker_currentUser');
    return saved ? JSON.parse(saved) : {
      name: "Alex",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
      isPremium: true,
      lastActiveDate: new Date('2025-06-11'),
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
        bestTimeForHabits: "morning",
        strugglingDays: ["monday", "friday"],
        lastCompletedHabit: "Morning Meditation",
        longestStreak: 21,
        biggerGoals: ["become a focused leader", "build mental strength for career"],
        proudestMoment: "completing 21-day meditation streak"
      },
      emailHistory: [{
        id: 1,
        subject: "Your meditation streak is waiting for you, Alex",
        sent: new Date().toISOString(),
        daysMissed: 2,
        content: "Hi Alex,\n\nI noticed you haven't checked in for 2 days. Your 21-day streak shows real dedication!\n\nYour AI Coach 🤖💪"
      }],
      callHistory: []
    };
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habitTracker_habits');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: "Morning Meditation",
        description: "Start the day with mindfulness",
        streak: 5,
        missedDays: 3,
        completedToday: false,
        completedDates: ['2025-06-09', '2025-06-10', '2025-06-11', '2025-06-12', '2025-06-13'],
        category: "Mindfulness",
        progress: 0,
        target: 10
      },
      {
        id: 2,
        name: "Read 20 Minutes",
        description: "Expand knowledge through daily reading",
        streak: 3,
        missedDays: 1,
        completedToday: true,
        completedDates: ['2025-06-11', '2025-06-12', '2025-06-13', '2025-06-14'],
        category: "Learning",
        progress: 5,
        target: 10
      },
      {
        id: 3,
        name: "Exercise",
        description: "Move your body for at least 30 minutes",
        streak: 8,
        missedDays: 0,
        completedToday: false,
        completedDates: ['2025-06-06', '2025-06-07', '2025-06-08', '2025-06-09', '2025-06-10', '2025-06-11', '2025-06-12', '2025-06-13'],
        category: "Fitness",
        progress: 2,
        target: 10
      }
    ];
  });

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

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('habitTracker_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('habitTracker_habits', JSON.stringify(habits));
  }, [habits]);

  // BUILT-IN VOICE RECOGNITION SETUP (Keep our champion!)
  useEffect(() => {
    console.log('🎤 Checking for speech recognition support...');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      console.log('✅ Speech recognition supported!');
      setVoiceSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        console.log('🎤 Voice recognition started');
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
        console.log('🗣️ Speech detected:', currentTranscript);
        setVoiceTranscript(currentTranscript);
        
        if (finalTranscript) {
          console.log('✅ Final transcript:', finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          showMessage('🎤 Microphone access denied. Please allow microphone permissions and try again.');
        } else if (event.error === 'no-speech') {
          showMessage('🎤 No speech detected. Try speaking more clearly.');
        } else {
          showMessage(`🎤 Speech recognition error: ${event.error}`);
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('🎤 Voice recognition ended');
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.log('❌ Speech recognition not supported');
      setVoiceSupported(false);
    }
  }, []);

  // GEMINI AI AGENT INTEGRATION - The Redemption Arc!
  const processWithAI = async (userMessage) => {
    console.log('🤖 Processing with Gemini AI:', userMessage);
    setAiProcessing(true);
    
    try {
      const prompt = `You are a CONCISE habit tracking assistant. The user says: "${userMessage}"

Current habits available:
${habits.map(h => `- ${h.name}: ${h.description} (${h.streak} day streak, ${h.completedToday ? 'completed today' : 'not completed today'})`).join('\n')}

User profile: ${currentUser.name}, ${currentUser.aiProfile.personalityType} personality

CRITICAL RULES:
- For habit logging: respond with MAX 8 words, be enthusiastic but brief
- For questions: you can be more detailed but still concise
- NO follow-up questions unless specifically asked
- NO lectures about career goals or life philosophy
- Act like an encouraging gym buddy, not a life coach

Your task:
1. Determine if the user is logging a habit completion or asking a question
2. If logging a habit, extract: habit name and completion percentage (0-100)
3. Respond briefly and encouragingly

Respond in JSON format:
{
  "action": "log_habit" | "conversation" | "question",
  "habit_name": "exact habit name if logging" | null,
  "percentage": number 0-100 if logging | null,
  "response": "brief encouraging message (MAX 8 words for habit logging)",
  "reasoning": "brief explanation of what you understood"
}

Examples:
- "I just finished an amazing workout!" → log_habit, Exercise, 100, "Awesome workout! 💪 8-day streak going strong!"
- "Had a good meditation session" → log_habit, Morning Meditation, 100, "Great meditation! 🧘‍♂️ Streak building nicely!"  
- "Started reading but only got through a few pages" → log_habit, Read 20 Minutes, 25, "Nice start! 📚 Every page counts!"
- "How's my meditation streak going?" → question, null, null, "Your meditation streak is at 5 days! You're building great momentum. Keep it up!"

REMEMBER: For habit logging, keep it SHORT and SWEET!`;

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
      
      console.log('🤖 Raw AI response:', aiText);
      
      // Extract JSON from AI response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiResult = JSON.parse(jsonMatch[0]);
        console.log('🤖 Parsed AI result:', aiResult);
        
        // Add to chat history
        setAiChatHistory(prev => [...prev, 
          { type: 'user', message: userMessage, timestamp: new Date() },
          { type: 'ai', message: aiResult.response, timestamp: new Date(), action: aiResult }
        ]);
        
        // Execute action if it's a habit log
        if (aiResult.action === 'log_habit' && aiResult.habit_name && aiResult.percentage !== null) {
          const habit = habits.find(h => h.name.toLowerCase().includes(aiResult.habit_name.toLowerCase()) || 
                                         aiResult.habit_name.toLowerCase().includes(h.name.toLowerCase()));
          
          if (habit) {
            console.log(`🤖 AI logging habit: ${habit.name} at ${aiResult.percentage}%`);
            executeHabitUpdate(habit, aiResult.percentage, 'ai');
            
            // Speak the AI response
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(aiResult.response);
              speechSynthesis.speak(utterance);
            }
          } else {
            console.log('❌ AI identified habit not found:', aiResult.habit_name);
            showMessage(`🤖 AI understood "${aiResult.habit_name}" but couldn't match it to your habits.`);
          }
        }
        
        return aiResult;
      } else {
        throw new Error('Invalid AI response format');
      }
      
    } catch (error) {
      console.error('❌ AI processing error:', error);
      const errorMessage = `🤖 AI Error: ${error.message}. Don't worry, your voice commands still work perfectly!`;
      
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

  // Send AI chat message
  const sendAIMessage = async () => {
    if (!aiChatInput.trim()) return;
    
    const message = aiChatInput.trim();
    setAiChatInput('');
    
    await processWithAI(message);
  };

  // Process voice commands (our champion system!)
  const processVoiceCommand = (transcript) => {
    console.log('🧠 Processing voice command:', transcript);
    
    const text = transcript.toLowerCase().trim();
    
    // Smart habit matching
    const matchedHabit = findHabitInSpeech(text);
    const percentage = extractPercentageFromSpeech(text);
    
    console.log('🎯 Voice analysis:', { matchedHabit: matchedHabit?.name, percentage });
    
    if (matchedHabit) {
      executeHabitUpdate(matchedHabit, percentage, 'voice');
    } else {
      console.log('❌ No habit found in speech');
      showMessage(`🎤 Couldn't identify a habit in: "${transcript}". Try saying "Exercise complete" or "Meditation 75 percent"`);
      
      // Speak the error
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          "Sorry, I couldn't identify which habit you meant. Try saying something like exercise complete or meditation 75 percent."
        );
        speechSynthesis.speak(utterance);
      }
    }
  };

  // Execute habit update (unified function for both voice and AI)
  const executeHabitUpdate = (habit, percentage, source) => {
    console.log(`🚀 Executing ${source} command: ${habit.name} at ${percentage}%`);
    
    setHabits(prev => prev.map(h => {
      if (h.id === habit.id) {
        const newStreak = percentage >= 50 ? h.streak + 1 : h.streak;
        const newProgress = Math.min(h.progress + Math.ceil(percentage/100), h.target);
        
        return {
          ...h,
          completedToday: percentage >= 50,
          voiceCompletion: source === 'voice' ? percentage : undefined,
          aiCompletion: source === 'ai' ? percentage : undefined,
          streak: newStreak,
          progress: newProgress
        };
      }
      return h;
    }));
    
    // Success message
    const icon = source === 'voice' ? '🎤' : '🤖';
    const successMessage = percentage === 100 
      ? `${icon}✅ ${source.toUpperCase()} logged: ${habit.name} completed!`
      : `${icon}📊 ${source.toUpperCase()} logged: ${habit.name} at ${percentage}%!`;
    
    console.log('📢 Success:', successMessage);
    showMessage(successMessage);
    
    // Speak confirmation for voice commands
    if (source === 'voice' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        percentage === 100 
          ? `Perfect! ${habit.name} completed and logged!`
          : `Great! ${habit.name} logged at ${percentage} percent!`
      );
      speechSynthesis.speak(utterance);
    }
  };

  // Find habit mentioned in speech (keep our proven logic)
  const findHabitInSpeech = (text) => {
    console.log('🔍 Searching for habits in:', text);
    
    const habitKeywords = {
      'Morning Meditation': ['meditation', 'meditate', 'mindful', 'mindfulness', 'zen', 'calm', 'breathing'],
      'Exercise': ['exercise', 'workout', 'fitness', 'gym', 'run', 'running', 'cardio', 'training'],
      'Read 20 Minutes': ['reading', 'read', 'book', 'study', 'studying', 'learning']
    };
    
    for (const habit of habits) {
      const keywords = habitKeywords[habit.name] || [];
      const nameWords = habit.name.toLowerCase().split(' ');
      const allKeywords = [...keywords, ...nameWords];
      
      for (const keyword of allKeywords) {
        if (text.includes(keyword)) {
          console.log(`✅ Found habit "${habit.name}" via keyword "${keyword}"`);
          return habit;
        }
      }
    }
    
    console.log('❌ No habit keywords found');
    return null;
  };

  // Extract percentage from speech (keep our proven logic)
  const extractPercentageFromSpeech = (text) => {
    console.log('📊 Extracting percentage from:', text);
    
    const percentMatches = [
      /(\d+)\s*percent/,
      /(\d+)\s*%/,
      /(\d+)\s*per\s*cent/
    ];
    
    for (const pattern of percentMatches) {
      const match = text.match(pattern);
      if (match) {
        const percent = parseInt(match[1]);
        console.log(`📊 Found explicit percentage: ${percent}%`);
        return Math.min(percent, 100);
      }
    }
    
    const completionWords = {
      'complete': 100, 'completed': 100, 'done': 100, 'finished': 100, 
      'full': 100, 'fully': 100, 'totally': 100, 'entirely': 100,
      'mostly': 75, 'almost': 75, 'nearly': 75, 'three quarters': 75,
      'half': 50, 'halfway': 50, 'partially': 50, 'some': 50,
      'little': 25, 'bit': 25, 'started': 25, 'began': 25, 'quarter': 25
    };
    
    for (const [word, percent] of Object.entries(completionWords)) {
      if (text.includes(word)) {
        console.log(`📊 Found completion word "${word}" = ${percent}%`);
        return percent;
      }
    }
    
    console.log('📊 No percentage found, defaulting to 100%');
    return 100;
  };

  // Start voice recognition
  const startListening = () => {
    if (recognition && !isListening) {
      console.log('🎤 Starting voice recognition...');
      try {
        recognition.start();
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        showMessage('🎤 Error starting voice recognition. Try again.');
      }
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognition && isListening) {
      console.log('🎤 Stopping voice recognition...');
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
        let newStreak = habit.streak;
        
        if (newCompleted) {
          newStreak = habit.streak + 1;
          const newProgress = Math.min(habit.progress + 1, habit.target);
          
          return {
            ...habit,
            completedToday: newCompleted,
            streak: newStreak,
            progress: newProgress,
            voiceCompletion: undefined,
            aiCompletion: undefined
          };
        }
        
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newStreak,
          voiceCompletion: undefined,
          aiCompletion: undefined
        };
      }
      return habit;
    }));
  };

  const VoiceHelpModal = () => {
    if (!showVoiceHelp) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">🎤 Voice Commands Help</h3>
            <button onClick={() => setShowVoiceHelp(false)}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">✅ Complete Commands:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Exercise complete"</li>
                <li>• "Meditation done"</li>
                <li>• "Reading finished"</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📊 Percentage Commands:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Exercise 75 percent"</li>
                <li>• "Meditation half done"</li>
                <li>• "Reading mostly complete"</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Speak clearly and at normal speed</li>
                <li>• Use simple phrases</li>
                <li>• Wait for the microphone to activate</li>
                <li>• Try different ways if not recognized</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowVoiceHelp(false)}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  };

  const AIChatModal = () => {
    if (!showAIChat) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-2xl mx-4 h-[600px] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              AI Habit Coach
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">GEMINI POWERED</span>
            </h3>
            <button onClick={() => setShowAIChat(false)}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {aiChatHistory.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <Bot className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <p className="font-medium">Chat with your AI habit coach!</p>
                <p className="text-sm mt-2">Try saying things like:</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="bg-purple-50 rounded-lg p-2">"I just finished an amazing workout!"</div>
                  <div className="bg-purple-50 rounded-lg p-2">"Had a good meditation session"</div>
                  <div className="bg-purple-50 rounded-lg p-2">"How's my streak going?"</div>
                </div>
              </div>
            )}
            
            {aiChatHistory.map((chat, index) => (
              <div key={index} className={`flex gap-3 ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {chat.type !== 'user' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    chat.type === 'error' ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    <Bot className={`w-4 h-4 ${chat.type === 'error' ? 'text-red-500' : 'text-purple-500'}`} />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  chat.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : chat.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{chat.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {chat.action && (
                    <div className="mt-2 text-xs bg-black bg-opacity-10 rounded p-2">
                      <p>Action: {chat.action.action}</p>
                      {chat.action.habit_name && <p>Habit: {chat.action.habit_name}</p>}
                      {chat.action.percentage && <p>Progress: {chat.action.percentage}%</p>}
                    </div>
                  )}
                </div>
                {chat.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-500" />
                  </div>
                )}
              </div>
            ))}
            
            {aiProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-purple-500" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                placeholder="Message your AI coach... (e.g., 'I just finished a great workout!')"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={aiProcessing}
                autoFocus
              />
              <button
                onClick={sendAIMessage}
                disabled={aiProcessing || !aiChatInput.trim()}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
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
              <span className="font-bold text-xl text-gray-800">My Awesome Life Habits</span>
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
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center py-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎤🤖 Voice + AI Power Combo!</h1>
            <p className="text-lg text-gray-600 mb-4">Choose your method: Lightning-fast voice commands OR intelligent AI conversations!</p>
          </div>

          {/* Control Panel with Both Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Control Panel (Our Champion!) */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  🏆 Voice Commands (Champion!)
                </h2>
                <button
                  onClick={() => setShowVoiceHelp(true)}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  📋 Help
                </button>
              </div>
              
              {voiceSupported ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      disabled={!voiceSupported}
                      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        isListening 
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
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
                          Quick Voice Command
                        </>
                      )}
                    </button>
                  </div>
                  
                  {isListening && (
                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-800">Listening for quick commands...</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {voiceTranscript || 'Say: "Exercise complete" or "Meditation 75 percent"'}
                      </p>
                    </div>
                  )}
                  
                  {!isListening && (
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                        <h3 className="font-semibold text-sm mb-1">⚡ Lightning Fast</h3>
                        <p className="text-xs text-gray-600">Perfect for quick habit logging</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Voice recognition not supported in this browser. Try using Chrome, Edge, or Safari.
                  </p>
                </div>
              )}
            </div>

            {/* AI Chat Panel (Gemini's Redemption) */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  🎭 AI Coach (Gemini's Redemption!)
                </h2>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">GEMINI POWERED</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setShowAIChat(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat with AI Coach
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-white p-3 rounded-lg border-l-4 border-purple-500">
                    <h3 className="font-semibold text-sm mb-1">🧠 Smart Conversations</h3>
                    <p className="text-xs text-gray-600">Natural language understanding</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border-l-4 border-pink-500">
                    <h3 className="font-semibold text-sm mb-1">💬 Examples:</h3>
                    <p className="text-xs text-gray-600">"I just crushed my workout!" or "How's my streak?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-500" />
              Today's Habits
            </h2>

            <div className="space-y-4">
              {habits.map(habit => (
                <div
                  key={habit.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{habit.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          {habit.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="font-semibold text-orange-600">{habit.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress: {habit.progress}/{habit.target}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {Math.round((habit.progress / habit.target) * 100)}% complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{width: `${(habit.progress / habit.target) * 100}%`}}
                      ></div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      habit.completedToday
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-100 hover:bg-green-500 hover:text-white text-gray-700'
                    }`}
                  >
                    {habit.completedToday ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        {habit.voiceCompletion && `🎤 Voice: ${habit.voiceCompletion}%`}
                        {habit.aiCompletion && `🤖 AI: ${habit.aiCompletion}%`}
                        {!habit.voiceCompletion && !habit.aiCompletion && 'Completed!'}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Circle className="w-5 h-5" />
                        Complete
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">🥊 The Ultimate Showdown!</h3>
            <p className="text-sm text-yellow-700 mb-4">
              Test both methods and see which one you prefer! Will our champion voice commands stay undefeated, or can Gemini redeem itself?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold mb-2">🏆 Voice Commands (Proven Champion)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Lightning fast</li>
                  <li>✅ Works offline</li>
                  <li>✅ 100% reliable</li>
                  <li>✅ No Google drama</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold mb-2">🎭 AI Agent (Redemption Arc)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>🧠 Smart understanding</li>
                  <li>💬 Natural conversations</li>
                  <li>🎯 Context awareness</li>
                  <li>❓ Can it redeem Gemini?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VoiceHelpModal />
      <AIChatModal />

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">🎤🤖 The perfect combo: Reliable voice commands + Intelligent AI conversations! ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
