import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X, Mic, MicOff, Volume2, Bot, Send, Sparkles, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

function App() {
  const GEMINI_API_KEY = 'AIzaSyDFZ6mr63MOYGy--TDsw2RBQ6kpNeL-p6o';

  const [currentUser, setCurrentUser] = useState({
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
    emailHistory: [
      {
        id: 1,
        subject: "Your meditation streak is waiting for you, Alex",
        sent: new Date().toISOString(),
        daysMissed: 2,
        content: "Hi Alex,\n\nI noticed you haven't checked in for 2 days. Your 21-day streak shows real dedication!\n\nYour AI Coach"
      }
    ],
    callHistory: []
  });

  const [habits, setHabits] = useState([
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
  ]);

  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [aiProcessing, setAiProcessing] = useState(false);
  const chatEndRef = useRef(null);
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
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [selectedHabitForBacklog, setSelectedHabitForBacklog] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory, aiProcessing]);

  const showMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

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
          showMessage('Microphone access denied. Please allow microphone permissions.');
        } else {
          showMessage(`Speech recognition error: ${event.error}`);
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

  const processWithAI = async (userMessage) => {
    setAiProcessing(true);
    
    try {
      const prompt = `You are a habit tracking assistant. The user says: "${userMessage}"

Current habits:
${habits.map(h => `- ${h.name}: ${h.description} (${h.streak} day streak)`).join('\n')}

Respond in JSON format:
{
  "action": "log_habit" | "conversation",
  "habit_name": "habit name if logging" | null,
  "percentage": number 0-100 if logging | null,
  "response": "your response",
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
      
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiResult = JSON.parse(jsonMatch[0]);
        
        setAiChatHistory(prev => [...prev, 
          { type: 'user', message: userMessage, timestamp: new Date() },
          { type: 'ai', message: aiResult.response, timestamp: new Date() }
        ]);
        
        if ('speechSynthesis' in window && aiResult.speech_response) {
          const utterance = new SpeechSynthesisUtterance(aiResult.speech_response);
          speechSynthesis.speak(utterance);
        }
        
        if (aiResult.action === 'log_habit' && aiResult.habit_name && aiResult.percentage !== null) {
          const habit = habits.find(h => h.name.toLowerCase().includes(aiResult.habit_name.toLowerCase()));
          if (habit) {
            executeHabitUpdate(habit, aiResult.percentage, 'ai');
          }
        }
        
        return aiResult;
      }
      
    } catch (error) {
      const errorMessage = `AI Error: ${error.message}`;
      setAiChatHistory(prev => [...prev, 
        { type: 'user', message: userMessage, timestamp: new Date() },
        { type: 'error', message: errorMessage, timestamp: new Date() }
      ]);
      showMessage(errorMessage);
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

  const processVoiceCommand = (transcript) => {
    const text = transcript.toLowerCase().trim();
    const matchedHabit = findHabitInSpeech(text);
    const percentage = extractPercentageFromSpeech(text);
    
    if (matchedHabit) {
      executeHabitUpdate(matchedHabit, percentage, 'voice');
    } else {
      showMessage(`Couldn't identify a habit in: "${transcript}"`);
    }
  };

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
          streak: newStreak,
          progress: newProgress
        };
      }
      return h;
    }));
    
    const successMessage = `${source.toUpperCase()} logged: ${habit.name} at ${percentage}%!`;
    showMessage(successMessage);
    
    if (source === 'voice' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${habit.name} logged at ${percentage} percent`);
      speechSynthesis.speak(utterance);
    }
  };

  const findHabitInSpeech = (text) => {
    const habitKeywords = {};
    habits.forEach(habit => {
      const habitName = habit.name;
      const nameWords = habitName.toLowerCase().split(' ');
      
      habitKeywords[habitName] = [...nameWords, habitName.toLowerCase()];
      
      if (habit.category === 'Mindfulness') {
        habitKeywords[habitName].push('meditation', 'meditate', 'mindful');
      } else if (habit.category === 'Fitness') {
        habitKeywords[habitName].push('exercise', 'workout', 'fitness');
      } else if (habit.category === 'Learning') {
        habitKeywords[habitName].push('reading', 'read', 'book');
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

  const extractPercentageFromSpeech = (text) => {
    const percentMatches = [/(\d+)\s*percent/, /(\d+)\s*%/];
    
    for (const pattern of percentMatches) {
      const match = text.match(pattern);
      if (match) {
        return Math.min(parseInt(match[1]), 100);
      }
    }
    
    const completionWords = {
      'complete': 100, 'completed': 100, 'done': 100, 'finished': 100,
      'mostly': 75, 'almost': 75, 'half': 50, 'little': 25
    };
    
    for (const [word, percent] of Object.entries(completionWords)) {
      if (text.includes(word)) {
        return percent;
      }
    }
    
    return 100;
  };

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        showMessage('Error starting voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const toggleHabit = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completedToday;
        let newStreak = habit.streak;
        
        if (newCompleted) {
          newStreak = habit.streak + 1;
          const newProgress = Math.min(habit.progress + 1, habit.target);
          
          showMessage(`${habit.name} completed! Day ${newStreak} streak!`);
          
          return {
            ...habit,
            completedToday: newCompleted,
            streak: newStreak,
            progress: newProgress
          };
        }
        
        return { ...habit, completedToday: newCompleted };
      }
      return habit;
    }));
  };

  const addNewHabit = () => {
    if (newHabit.name.trim() === '') return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      description: newHabit.description || `Build a consistent ${newHabit.name.toLowerCase()} routine`,
      streak: 0,
      missedDays: 0,
      completedToday: false,
      completedDates: [],
      category: newHabit.category,
      progress: 0,
      target: 10
    };
    
    setHabits(prev => [...prev, habit]);
    setNewHabit({ name: '', description: '', category: 'Mindfulness' });
    setShowAddHabit(false);
    showMessage(`New habit "${habit.name}" added!`);
  };

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

  const openDeleteConfirm = (habit) => {
    setHabitToDelete(habit);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setHabitToDelete(null);
    setShowDeleteConfirm(false);
  };

  const confirmDeleteHabit = () => {
    if (!habitToDelete) return;
    setHabits(prev => prev.filter(habit => habit.id !== habitToDelete.id));
    showMessage(`"${habitToDelete.name}" habit deleted`);
    closeDeleteConfirm();
  };

  const openBacklogModal = (habit) => {
    setSelectedHabitForBacklog(habit);
    setShowBacklogModal(true);
  };

  const closeBacklogModal = () => {
    setShowBacklogModal(false);
    setSelectedHabitForBacklog(null);
  };

  const getPastDates = (days = 3) => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    
    return dates.reverse();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateCompleted = (habit, date) => {
    const dateString = formatDate(date);
    return habit.completedDates.includes(dateString);
  };

  const toggleBacklogDate = (habitId, date) => {
    const dateString = formatDate(date);
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCurrentlyCompleted = habit.completedDates.includes(dateString);
        let newCompletedDates;
        let newProgress = habit.progress;
        
        if (isCurrentlyCompleted) {
          newCompletedDates = habit.completedDates.filter(d => d !== dateString);
          newProgress = Math.max(newProgress - 1, 0);
          showMessage(`Removed ${habit.name} completion for ${new Date(dateString).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}`);
        } else {
          newCompletedDates = [...habit.completedDates, dateString].sort();
          newProgress = Math.min(newProgress + 1, habit.target);
          showMessage(`Marked ${habit.name} complete for ${new Date(dateString).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}!`);
        }
        
        return {
          ...habit,
          completedDates: newCompletedDates,
          progress: newProgress
        };
      }
      return habit;
    }));
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
        {currentView === 'habits' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Awesome Life Habits Tracker</h1>
              <p className="text-lg text-gray-600">Transform your daily habits, transform your life.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Voice Commands and AI Chat - Top Section */}
              <div className="lg:col-span-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Voice Commands Panel */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Mic className="w-5 h-5 text-purple-500" />
                      Voice Commands
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">LIVE</span>
                    </h3>
                    
                    {voiceSupported ? (
                      <div className="space-y-4">
                        <button
                          onClick={isListening ? stopListening : startListening}
                          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                            isListening 
                              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                          {isListening ? 'Stop Listening' : 'Start Voice Command'}
                        </button>
                        
                        {isListening && (
                          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center gap-2 mb-2">
                              <Volume2 className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-blue-800">Listening...</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {voiceTranscript || 'Say: "Exercise complete" or "Meditation 75 percent"'}
                            </p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => setShowVoiceHelp(true)}
                          className="w-full text-sm bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200"
                        >
                          📋 Voice Commands Help
                        </button>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                          ⚠️ Voice recognition not supported in this browser. Try Chrome, Edge, or Safari.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* AI Coach Panel */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Bot className="w-5 h-5 text-green-500" />
                      AI Coach
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">GEMINI</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowAIChat(true)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Chat with AI Coach
                      </button>
                      
                      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-sm mb-1">🧠 Smart & Natural</h4>
                        <p className="text-xs text-gray-600">Understands context and gives helpful advice!</p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-sm mb-1">💬 Try saying:</h4>
                        <p className="text-xs text-gray-600">"I just finished a great workout!" or "How do I stay motivated?"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content - Today's Habits */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Today's Habits
                    </h2>
                    <button
                      onClick={() => setShowAddHabit(true)}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Habit
                    </button>
                  </div>

                  <div className="space-y-4">
                    {habits.map(habit => (
                      <div key={habit.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-800">{habit.name}</h3>
                              <button
                                onClick={() => openDeleteConfirm(habit)}
                                className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleHabit(habit.id)}
                            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                              habit.completedToday
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-gray-100 hover:bg-green-500 hover:text-white text-gray-700'
                            }`}
                          >
                            {habit.completedToday ? (
                              <span className="flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                {habit.voiceCompletion ? `Voice: ${habit.voiceCompletion}%` : 
                                 habit.aiCompletion ? `AI: ${habit.aiCompletion}%` : 'Completed!'}
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Circle className="w-5 h-5" />
                                Complete
                              </span>
                            )}
                          </button>
                          
                          <button
                            onClick={() => openSliderModal(habit)}
                            className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                            title="Set partial completion"
                          >
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                            </div>
                            <span className="text-sm font-bold">%</span>
                          </button>
                          
                          {habit.missedDays > 0 && habit.missedDays <= 3 && (
                            <button
                              onClick={() => openBacklogModal(habit)}
                              className="px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                              title="Update past 3 days"
                            >
                              <Calendar className="w-4 h-4" />
                              <span className="hidden sm:inline text-sm">Past</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-bold text-2xl text-gray-800">{getWeeklyProgress().completionRate}%</h3>
                    <p className="text-gray-600">Today's Progress</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-bold text-2xl text-gray-800">{getWeeklyProgress().totalStreak}</h3>
                    <p className="text-gray-600">Total Streak Days</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-bold text-2xl text-gray-800">{habits.length}</h3>
                    <p className="text-gray-600">Active Habits</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      App Benefits
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">Smart Completion</h4>
                          <p className="text-xs text-gray-600">Track partial progress with percentage sliders</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mic className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">Voice Control</h4>
                          <p className="text-xs text-gray-600">Hands-free habit logging with speech recognition</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">AI Coaching</h4>
                          <p className="text-xs text-gray-600">Intelligent conversations and habit insights</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Flame className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">Streak Tracking</h4>
                          <p className="text-xs text-gray-600">Build momentum with visual streak counters</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">Backlog Updates</h4>
                          <p className="text-xs text-gray-600">Update up to 3 past days to maintain streaks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
              <p className="text-gray-600">Your progress overview</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="text-green-800">Great job completing your habits today!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Backlog Modal */}
      {showBacklogModal && selectedHabitForBacklog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Update Past Days</h3>
              <button onClick={closeBacklogModal}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">{selectedHabitForBacklog.name}</h4>
              <p className="text-sm text-gray-600 mb-4">Mark completion for up to 3 past days</p>
            </div>

            <div className="space-y-3">
              {getPastDates(3).map(date => {
                const currentHabit = habits.find(h => h.id === selectedHabitForBacklog.id) || selectedHabitForBacklog;
                const isCompleted = isDateCompleted(currentHabit, date);
                const dayName = date.toLocaleDateString('en', { weekday: 'long' });
                const dateString = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                
                return (
                  <div key={formatDate(date)} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                    isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                  }`}>
                    <div>
                      <p className="font-medium text-gray-800">{dayName}</p>
                      <p className="text-sm text-gray-600">{dateString}</p>
                    </div>
                    <button
                      onClick={() => toggleBacklogDate(currentHabit.id, date)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-500 text-white hover:bg-green-600 scale-110'
                          : 'bg-gray-100 text-gray-400 hover:bg-green-500 hover:text-white hover:scale-105'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4 mt-6 border-t">
              <button
                onClick={closeBacklogModal}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add New Habit</h3>
              <button onClick={() => setShowAddHabit(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Morning Yoga"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Start the day with mindful movement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Learning">Learning</option>
                  <option value="Health">Health</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Social">Social</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addNewHabit}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Add Habit
                </button>
                <button
                  onClick={() => setShowAddHabit(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slider Modal */}
      {showSliderModal && selectedHabitForSlider && (
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
              <p className="text-sm text-gray-600 mb-4">How much did you accomplish today?</p>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-blue-500 mb-2">
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
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Complete!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && habitToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-red-600">Delete Habit</h3>
              <button onClick={closeDeleteConfirm}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">Are you sure you want to delete "{habitToDelete.name}"?</p>
              <p className="text-sm text-gray-500 mt-2">This will remove all progress and cannot be undone.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteConfirm}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteHabit}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Help Modal */}
      {showVoiceHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Voice Commands Help</h3>
              <button onClick={() => setShowVoiceHelp(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Complete Commands:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Exercise complete"</li>
                  <li>• "Meditation done"</li>
                  <li>• "Reading finished"</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Percentage Commands:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Exercise 75 percent"</li>
                  <li>• "Meditation half done"</li>
                  <li>• "Reading mostly complete"</li>
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
      )}

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-500" />
                AI Habit Coach
              </h3>
              <button onClick={() => setShowAIChat(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {aiChatHistory.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <Bot className="w-12 h-12 text-green-300 mx-auto mb-4" />
                  <p className="font-medium">Chat with your AI habit coach!</p>
                  <p className="text-sm mt-2">Try saying things like:</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="bg-green-50 rounded-lg p-2">"I just finished an amazing workout!"</div>
                    <div className="bg-green-50 rounded-lg p-2">"Had a good meditation session"</div>
                    <div className="bg-green-50 rounded-lg p-2">"How can I stay motivated?"</div>
                  </div>
                </div>
              )}
              
              {aiChatHistory.map((chat, index) => (
                <div key={index} className={`flex gap-3 ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {chat.type !== 'user' && (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      chat.type === 'error' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <Bot className={`w-4 h-4 ${chat.type === 'error' ? 'text-red-500' : 'text-green-500'}`} />
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
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-500 animate-spin" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-6 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                  placeholder="Message your AI coach..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={aiProcessing}
                />
                <button
                  onClick={sendAIMessage}
                  disabled={aiProcessing || !aiChatInput.trim()}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">Transform your daily habits, transform your life ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
