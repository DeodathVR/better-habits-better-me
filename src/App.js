import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X, Mic, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

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

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'Mindfulness'
  });

  const [currentView, setCurrentView] = useState('habits');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [selectedHabitForBacklog, setSelectedHabitForBacklog] = useState(null);
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [selectedHabitForSlider, setSelectedHabitForSlider] = useState(null);
  const [sliderValue, setSliderValue] = useState(100);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('habitTracker_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('habitTracker_habits', JSON.stringify(habits));
  }, [habits]);

  // SIMPLE VOICE COMMANDS - New and Improved!
  useEffect(() => {
    const handleSimpleVoiceCommand = () => {
      console.log('🎤 SIMPLE VOICE COMMAND DETECTOR ACTIVATED!');
      console.log('📍 Current URL:', window.location.href);
      
      const urlParams = new URLSearchParams(window.location.search);
      console.log('📋 URL Parameters found:');
      
      // Look for simple habit commands
      const habitCommands = [];
      for (let [key, value] of urlParams) {
        console.log(`  - ${key}: "${value}"`);
        habitCommands.push({ habit: key, action: value });
      }
      
      console.log('🏃 Available habits for matching:');
      habits.forEach((habit, index) => {
        console.log(`  ${index + 1}. "${habit.name}" (id: ${habit.id})`);
      });

      // Process each habit command
      habitCommands.forEach(command => {
        console.log(`🎯 Processing command: ${command.habit}=${command.action}`);
        
        const matchedHabit = findHabitByKeyword(command.habit);
        if (matchedHabit) {
          const percentage = parseActionToPercentage(command.action);
          console.log(`✅ MATCH FOUND: ${matchedHabit.name} → ${percentage}%`);
          
          executeVoiceCommand(matchedHabit, percentage);
        } else {
          console.log(`❌ No habit found for keyword: "${command.habit}"`);
          showMessage(`🎤 Voice command failed: No habit found for "${command.habit}"`);
        }
      });

      // Clear URL after processing to avoid repeat executions
      if (habitCommands.length > 0) {
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        console.log('🧹 URL cleaned:', newUrl);
      }
    };

    // Smart habit matching by keyword
    const findHabitByKeyword = (keyword) => {
      const searchTerm = keyword.toLowerCase();
      console.log(`🔍 Searching for habit with keyword: "${searchTerm}"`);
      
      // Direct keyword mapping for reliability
      const keywordMap = {
        'meditation': ['meditation', 'meditate', 'mindful', 'zen'],
        'exercise': ['exercise', 'workout', 'fitness', 'gym', 'run'],
        'reading': ['reading', 'read', 'book', 'study'],
        'morning': ['morning'], // for "Morning Meditation"
      };
      
      // First, try exact habit name matching
      let match = habits.find(h => h.name.toLowerCase().includes(searchTerm));
      if (match) {
        console.log(`✅ Direct name match: "${match.name}"`);
        return match;
      }
      
      // Then try keyword mapping
      for (const [habitType, keywords] of Object.entries(keywordMap)) {
        if (keywords.includes(searchTerm)) {
          match = habits.find(h => h.name.toLowerCase().includes(habitType));
          if (match) {
            console.log(`✅ Keyword match: "${match.name}" via "${habitType}"`);
            return match;
          }
        }
      }
      
      console.log(`❌ No match found for: "${searchTerm}"`);
      return null;
    };

    // Convert action words to percentages
    const parseActionToPercentage = (action) => {
      const actionLower = action.toLowerCase();
      console.log(`📊 Parsing action: "${actionLower}"`);
      
      // Check if it's already a number
      const numericMatch = actionLower.match(/(\d+)/);
      if (numericMatch) {
        const percent = parseInt(numericMatch[1]);
        console.log(`📊 Numeric percentage found: ${percent}%`);
        return Math.min(percent, 100); // Cap at 100%
      }
      
      // Word-based actions
      const actionMap = {
        'complete': 100,
        'completed': 100,
        'done': 100,
        'finished': 100,
        'full': 100,
        'half': 50,
        'partial': 50,
        'some': 50,
        'little': 25,
        'bit': 25,
        'started': 25
      };
      
      const percentage = actionMap[actionLower] || 100; // Default to 100%
      console.log(`📊 Action "${actionLower}" → ${percentage}%`);
      return percentage;
    };

    // Execute the voice command
    const executeVoiceCommand = (habit, percentage) => {
      console.log(`🚀 Executing: ${habit.name} at ${percentage}%`);
      
      setHabits(prev => prev.map(h => {
        if (h.id === habit.id) {
          const newStreak = percentage >= 50 ? h.streak + 1 : h.streak;
          const newProgress = Math.min(h.progress + Math.ceil(percentage/100), h.target);
          
          console.log(`📈 Updated: streak=${newStreak}, progress=${newProgress}`);
          
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
      
      // Success message and confirmation
      const successMessage = percentage === 100 
        ? `🎤✅ VOICE SUCCESS: ${habit.name} completed!`
        : `🎤📊 VOICE SUCCESS: ${habit.name} logged at ${percentage}%!`;
      
      console.log('📢 Success:', successMessage);
      showMessage(successMessage);
      
      // Speak confirmation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          percentage === 100 
            ? `Great job! ${habit.name} completed successfully!`
            : `Nice work! ${habit.name} logged at ${percentage} percent!`
        );
        console.log('🔊 Speaking confirmation');
        speechSynthesis.speak(utterance);
      }
    };

    // Check for voice commands on page load
    console.log('🚀 Setting up simple voice command listener...');
    const timer = setTimeout(() => {
      console.log('⏰ Checking for simple voice commands...');
      handleSimpleVoiceCommand();
    }, 500);

    // Listen for URL changes
    window.addEventListener('popstate', handleSimpleVoiceCommand);
    window.addEventListener('hashchange', handleSimpleVoiceCommand);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handleSimpleVoiceCommand);
      window.removeEventListener('hashchange', handleSimpleVoiceCommand);
    };
  }, [habits]);

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
            voiceCompletion: undefined // Clear voice completion when manually toggling
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

  const generateVoiceExamples = () => {
    return `🎤 WORKING VOICE COMMANDS:

Try saying these to Google Assistant:

✅ "Hey Google, open myawesomelifehabits.com?exercise=complete"
✅ "Hey Google, open myawesomelifehabits.com?meditation=done" 
✅ "Hey Google, open myawesomelifehabits.com?reading=75"
✅ "Hey Google, open myawesomelifehabits.com?meditation=half"
✅ "Hey Google, open myawesomelifehabits.com?exercise=50"

📊 Percentage words that work:
• complete/done/finished = 100%
• half/partial/some = 50% 
• little/bit/started = 25%
• Any number (25, 75, 90, etc.)

🎯 Habit keywords that work:
• meditation, meditate, mindful → Morning Meditation
• exercise, workout, fitness, gym → Exercise  
• reading, read, book, study → Read 20 Minutes`;
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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎤 Voice Commands Active!</h1>
            <p className="text-lg text-gray-600 mb-4">Simple, natural voice logging - no more Google acting!</p>
          </div>

          {/* Voice Command Examples */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-green-800 mb-3">🎯 Try These Commands Now!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold mb-2">✅ Complete a Habit:</h3>
                <p className="text-sm text-gray-600">"Hey Google, open myawesomelifehabits.com?exercise=complete"</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="font-semibold mb-2">📊 Partial Progress:</h3>
                <p className="text-sm text-gray-600">"Hey Google, open myawesomelifehabits.com?meditation=75"</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                <h3 className="font-semibold mb-2">🌓 Half Done:</h3>
                <p className="text-sm text-gray-600">"Hey Google, open myawesomelifehabits.com?reading=half"</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                <h3 className="font-semibold mb-2">🌱 Quick Start:</h3>
                <p className="text-sm text-gray-600">"Hey Google, open myawesomelifehabits.com?meditation=started"</p>
              </div>
            </div>
            <button 
              onClick={() => showMessage(generateVoiceExamples())}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              📋 Show All Voice Commands
            </button>
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">🧪 Test Your Exercise!</h3>
            <p className="text-sm text-yellow-700 mb-4">
              Since you just finished your workout, try logging it with voice! Open your phone and say:
            </p>
            <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="font-medium mb-2">🎤 "Hey Google, open myawesomelifehabits.com?exercise=complete"</p>
              <p className="text-xs text-gray-600">This should finally work without any Oscar-worthy acting from Google! 🎭</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">🎤 Voice commands: Simple, Natural, Working! No more lies! ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
