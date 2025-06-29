import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X, Mic, MicOff, Volume2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

function App() {
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

  // BUILT-IN VOICE RECOGNITION SETUP
  useEffect(() => {
    console.log('🎤 Checking for speech recognition support...');
    
    // Check if speech recognition is supported
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

  // Process voice commands
  const processVoiceCommand = (transcript) => {
    console.log('🧠 Processing voice command:', transcript);
    
    const text = transcript.toLowerCase().trim();
    
    // Smart habit matching
    const matchedHabit = findHabitInSpeech(text);
    const percentage = extractPercentageFromSpeech(text);
    
    console.log('🎯 Analysis:', { matchedHabit: matchedHabit?.name, percentage });
    
    if (matchedHabit) {
      executeVoiceCommand(matchedHabit, percentage);
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

  // Find habit mentioned in speech
  const findHabitInSpeech = (text) => {
    console.log('🔍 Searching for habits in:', text);
    
    // Keyword mapping for each habit
    const habitKeywords = {
      'Morning Meditation': ['meditation', 'meditate', 'mindful', 'mindfulness', 'zen', 'calm', 'breathing'],
      'Exercise': ['exercise', 'workout', 'fitness', 'gym', 'run', 'running', 'cardio', 'training'],
      'Read 20 Minutes': ['reading', 'read', 'book', 'study', 'studying', 'learning']
    };
    
    // Check each habit for keyword matches
    for (const habit of habits) {
      const keywords = habitKeywords[habit.name] || [];
      
      // Also check the habit name itself (split into words)
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

  // Extract percentage from speech
  const extractPercentageFromSpeech = (text) => {
    console.log('📊 Extracting percentage from:', text);
    
    // Look for explicit percentages
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
    
    // Look for completion words
    const completionWords = {
      // 100% words
      'complete': 100, 'completed': 100, 'done': 100, 'finished': 100, 
      'full': 100, 'fully': 100, 'totally': 100, 'entirely': 100,
      
      // 75% words  
      'mostly': 75, 'almost': 75, 'nearly': 75, 'three quarters': 75,
      
      // 50% words
      'half': 50, 'halfway': 50, 'partially': 50, 'some': 50,
      
      // 25% words
      'little': 25, 'bit': 25, 'started': 25, 'began': 25, 'quarter': 25
    };
    
    for (const [word, percent] of Object.entries(completionWords)) {
      if (text.includes(word)) {
        console.log(`📊 Found completion word "${word}" = ${percent}%`);
        return percent;
      }
    }
    
    // Default to 100% if no percentage specified
    console.log('📊 No percentage found, defaulting to 100%');
    return 100;
  };

  // Execute voice command
  const executeVoiceCommand = (habit, percentage) => {
    console.log(`🚀 Executing voice command: ${habit.name} at ${percentage}%`);
    
    setHabits(prev => prev.map(h => {
      if (h.id === habit.id) {
        const newStreak = percentage >= 50 ? h.streak + 1 : h.streak;
        const newProgress = Math.min(h.progress + Math.ceil(percentage/100), h.target);
        
        return {
          ...h,
          completedToday: percentage >= 50,
          voiceCompletion: percentage,
          streak: newStreak,
          progress: newProgress
        };
      }
      return h;
    }));
    
    // Success message
    const successMessage = percentage === 100 
      ? `🎤✅ Voice logged: ${habit.name} completed!`
      : `🎤📊 Voice logged: ${habit.name} at ${percentage}%!`;
    
    console.log('📢 Success:', successMessage);
    showMessage(successMessage);
    
    // Speak confirmation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        percentage === 100 
          ? `Perfect! ${habit.name} completed and logged!`
          : `Great! ${habit.name} logged at ${percentage} percent!`
      );
      speechSynthesis.speak(utterance);
    }
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
            voiceCompletion: undefined
          };
        }
        
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newStreak,
          voiceCompletion: undefined
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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎤 Built-in Voice Recognition!</h1>
            <p className="text-lg text-gray-600 mb-4">No Google Assistant drama - direct speech processing!</p>
          </div>

          {/* Voice Control Panel */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-800">🎙️ Voice Control Center</h2>
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
                      {voiceTranscript || 'Speak now! Try: "Exercise complete" or "Meditation 75 percent"'}
                    </p>
                  </div>
                )}
                
                {!isListening && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-semibold text-sm mb-1">✅ Complete</h3>
                      <p className="text-xs text-gray-600">"Exercise complete"</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-yellow-500">
                      <h3 className="font-semibold text-sm mb-1">📊 Percentage</h3>
                      <p className="text-xs text-gray-600">"Meditation 75 percent"</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-sm mb-1">🌓 Partial</h3>
                      <p className="text-xs text-gray-600">"Reading half done"</p>
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
                        {habit.voiceCompletion ? `🎤 Voice: ${habit.voiceCompletion}%` : 'Completed!'}
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

          {/* Test Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-800 mb-2">🧪 Test Your Voice Commands!</h3>
            <p className="text-sm text-green-700 mb-4">
              Perfect timing! You just finished your workout. Let's test the built-in voice recognition:
            </p>
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
              <p className="font-medium mb-2">🎤 Steps to test:</p>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Click the "Start Voice Command" button above</li>
                <li>2. When it says "Listening..." speak clearly: <strong>"Exercise complete"</strong></li>
                <li>3. Watch the magic happen - no Google drama!</li>
              </ol>
              <p className="text-xs text-gray-600 mt-2">✨ This works entirely in your browser - no external services!</p>
            </div>
          </div>
        </div>
      </main>

      <VoiceHelpModal />

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">🎤 Built-in voice recognition: No Google Assistant required! ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
