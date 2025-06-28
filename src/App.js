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

  // Voice command handling - DEBUG VERSION
  useEffect(() => {
    const handleVoiceCommand = () => {
      // DETECTIVE MODE: Log everything!
      console.log('🕵️ VOICE COMMAND DETECTIVE MODE ACTIVATED!');
      console.log('📍 Current URL:', window.location.href);
      console.log('🔍 Full URL breakdown:');
      console.log('  - Origin:', window.location.origin);
      console.log('  - Pathname:', window.location.pathname);
      console.log('  - Search:', window.location.search);
      console.log('  - Hash:', window.location.hash);
      
      // Check ALL possible parameter sources
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
      
      console.log('📋 URL Parameters found:');
      if (urlParams.toString()) {
        for (let [key, value] of urlParams) {
          console.log(`  - ${key}: "${value}"`);
        }
      } else {
        console.log('  - (no URL parameters found)');
      }
      
      console.log('📋 Hash Parameters found:');
      if (hashParams.toString()) {
        for (let [key, value] of hashParams) {
          console.log(`  - ${key}: "${value}"`);
        }
      } else {
        console.log('  - (no hash parameters found)');
      }
      
      // Show what we're looking for vs what we got
      const action = urlParams.get('action') || hashParams.get('action');
      const habitName = urlParams.get('name') || urlParams.get('habit') || hashParams.get('name') || hashParams.get('habit');
      const percent = urlParams.get('percent') || urlParams.get('percentage') || hashParams.get('percent') || hashParams.get('percentage');
      
      console.log('🎯 Extracted values:');
      console.log(`  - Action: "${action}"`);
      console.log(`  - Habit Name: "${habitName}"`);
      console.log(`  - Percentage: "${percent}"`);
      
      // Try to match habits more flexibly
      console.log('🏃 Available habits for matching:');
      habits.forEach((habit, index) => {
        console.log(`  ${index + 1}. "${habit.name}" (id: ${habit.id})`);
      });
      
      // Enhanced habit matching function
      const findHabitFlexibly = (searchName) => {
        if (!searchName) return null;
        
        const searchLower = searchName.toLowerCase();
        console.log(`🔍 Searching for habit with: "${searchLower}"`);
        
        // Try exact match first
        let match = habits.find(h => h.name.toLowerCase() === searchLower);
        if (match) {
          console.log(`✅ Exact match found: "${match.name}"`);
          return match;
        }
        
        // Try partial match
        match = habits.find(h => {
          const habitLower = h.name.toLowerCase();
          return habitLower.includes(searchLower) || searchLower.includes(habitLower);
        });
        if (match) {
          console.log(`✅ Partial match found: "${match.name}"`);
          return match;
        }
        
        // Try keyword matching
        const keywords = {
          'meditation': ['meditat', 'mindful', 'zen', 'calm'],
          'exercise': ['exercise', 'workout', 'gym', 'fitness', 'run'],
          'reading': ['read', 'book', 'study']
        };
        
        for (const [habitType, keywordList] of Object.entries(keywords)) {
          if (keywordList.some(keyword => searchLower.includes(keyword))) {
            match = habits.find(h => h.name.toLowerCase().includes(habitType));
            if (match) {
              console.log(`✅ Keyword match found: "${match.name}" (via keyword: ${habitType})`);
              return match;
            }
          }
        }
        
        console.log(`❌ No match found for: "${searchLower}"`);
        return null;
      };
      
      if (habitName) {
        const matchedHabit = findHabitFlexibly(habitName);
        console.log(`🎯 Habit matching result: ${matchedHabit ? `Found "${matchedHabit.name}"` : 'No match found'}`);
      }
      
      // Check if this looks like a valid voice command
      if (action === 'log-habit' && habitName) {
        console.log('✅ VALID VOICE COMMAND DETECTED!');
        console.log('🚀 Attempting to log habit...');
        
        // Add a visual indicator that we received the command
        showMessage(`🎤 Google said: Update ${habitName} to ${percent || 100}% - Processing...`);
        
        // Enhanced logHabitViaVoice with better debugging
        const enhancedLogHabitViaVoice = (habitName, percentString) => {
          console.log('🎯 enhancedLogHabitViaVoice called with:', { habitName, percentString });
          
          const percent = parseInt(percentString) || 100;
          console.log('📊 Parsed percentage:', percent);
          
          const habit = findHabitFlexibly(habitName);
          
          if (habit) {
            console.log('✅ SUCCESS: Updating habit:', habit.name);
            console.log('📈 Current state:', {
              streak: habit.streak,
              progress: habit.progress,
              completedToday: habit.completedToday
            });
            
            // Your existing habit update logic
            setHabits(prev => prev.map(h => {
              if (h.id === habit.id) {
                const newStreak = percent >= 50 ? h.streak + 1 : h.streak;
                const newProgress = Math.min(h.progress + Math.ceil(percent/100), h.target);
                
                console.log('📈 New state will be:', {
                  streak: newStreak,
                  progress: newProgress,
                  completedToday: percent >= 50,
                  voiceCompletion: percent
                });
                
                return {
                  ...h,
                  completedToday: percent >= 50,
                  voiceCompletion: percent,
                  streak: newStreak,
                  progress: newProgress
                };
              }
              return h;
            }));
            
            // Enhanced success message
            const successMessage = percent === 100 
              ? `🎤✅ GOOGLE COMMAND SUCCESS: ${habit.name} completed!`
              : `🎤📊 GOOGLE COMMAND SUCCESS: ${habit.name} logged at ${percent}%!`;
            
            console.log('📢 Success message:', successMessage);
            showMessage(successMessage);
            
            // Speak confirmation
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(
                `Actually updated! ${habit.name} at ${percent} percent. Google wasn't lying this time!`
              );
              console.log('🔊 Speaking confirmation');
              speechSynthesis.speak(utterance);
            }
          } else {
            const errorMessage = `❌ GOOGLE COMMAND FAILED: Couldn't find habit "${habitName}". Available: ${habits.map(h => h.name).join(', ')}`;
            console.log('📢 Error message:', errorMessage);
            showMessage(errorMessage);
          }
        };

        enhancedLogHabitViaVoice(habitName, percent || '100');
        
        // Clear URL parameters after processing
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        console.log('🧹 URL cleaned:', newUrl);
      } else {
        console.log('❌ Not a valid voice command');
        console.log('Expected: action=log-habit AND name=[habit name]');
        console.log(`Got: action="${action}", name="${habitName}"`);
        
        // Show what Google actually sent us
        if (window.location.search || window.location.hash) {
          showMessage(`🔍 Debug: Google sent "${window.location.search}${window.location.hash}" - Check console for details`);
        }
      }
      
      // Method 2: Parse URL hash for natural language (your existing code)
      const hash = window.location.hash;
      console.log('🔗 URL Hash analysis:', hash);
      
      if (hash && hash.includes('update')) {
        console.log('🗣️ Natural language voice command detected in hash!');
        parseNaturalVoiceCommand(hash);
      }
      
      // Log completion
      console.log('🏁 Voice command analysis complete!');
      console.log('📊 Summary: URL processed, check above for any matches');
    };

    // Check URL on app load with debugging
    console.log('🚀 Setting up voice command listener...');
    const timer = setTimeout(() => {
      console.log('⏰ Timer triggered: Checking for voice commands...');
      handleVoiceCommand();
    }, 1000);

    // Listen for URL changes
    window.addEventListener('popstate', (e) => {
      console.log('🔄 popstate event triggered');
      handleVoiceCommand();
    });
    
    window.addEventListener('hashchange', (e) => {
      console.log('🔄 hashchange event triggered');
      handleVoiceCommand();
    });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handleVoiceCommand);
      window.removeEventListener('hashchange', handleVoiceCommand);
    };
  }, [habits]);

  const parseNaturalVoiceCommand = (hash) => {
    console.log('Parsing natural command:', hash);
    
    // Parse patterns like: #update-meditation-75-percent
    const text = hash.toLowerCase().replace('#', '');
    
    // Look for habit names
    const habitMatch = habits.find(h => 
      text.includes(h.name.toLowerCase()) || 
      h.name.toLowerCase().includes(text.split('-')[1] || '')
    );
    
    // Look for percentage
    const percentMatch = text.match(/(\d+)\s*percent?/);
    const percent = percentMatch ? parseInt(percentMatch[1]) : 100;
    
    console.log('Parsed:', { habitMatch, percent });
    
    if (habitMatch) {
      logHabitViaVoice(habitMatch.name, percent.toString());
    } else {
      showMessage(`🎤 Couldn't parse voice command: "${hash}". Try: "update meditation 75 percent"`);
    }
  };

  const logHabitViaVoice = (habitName, percentString) => {
    console.log('logHabitViaVoice called with:', { habitName, percentString });
    
    const percent = parseInt(percentString) || 100; // Default to 100% if no percentage given
    console.log('Parsed percentage:', percent);
    
    // Find habit by name (case insensitive, flexible matching)
    const habit = habits.find(h => {
      const habitLower = h.name.toLowerCase();
      const searchLower = habitName.toLowerCase();
      return habitLower.includes(searchLower) || searchLower.includes(habitLower);
    });
    
    console.log('Found habit:', habit);
    console.log('All habits:', habits.map(h => h.name));
    
    if (habit) {
      console.log('Updating habit:', habit.name);
      
      // Update the habit with voice completion
      setHabits(prev => prev.map(h => {
        if (h.id === habit.id) {
          const newStreak = percent >= 50 ? h.streak + 1 : h.streak; // Count as streak if 50%+
          const newProgress = Math.min(h.progress + Math.ceil(percent/100), h.target);
          
          console.log('Habit updated:', { percent, newStreak, newProgress });
          
          return {
            ...h,
            completedToday: percent >= 50,
            voiceCompletion: percent,
            streak: newStreak,
            progress: newProgress
          };
        }
        return h;
      }));
      
      // Show voice confirmation
      const voiceMessage = percent === 100 
        ? `🎤 Voice logged: ${habit.name} completed!`
        : `🎤 Voice logged: ${habit.name} at ${percent}% - Great progress!`;
      
      console.log('Showing message:', voiceMessage);
      showMessage(voiceMessage);
      
      // Speak confirmation if browser supports it
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Great job! I've logged your ${habit.name} at ${percent} percent.`
        );
        console.log('Speaking confirmation');
        speechSynthesis.speak(utterance);
      }
    } else {
      const errorMessage = `🎤 Voice command: Couldn't find habit "${habitName}". Available habits: ${habits.map(h => h.name).join(', ')}`;
      console.log('Habit not found:', errorMessage);
      showMessage(errorMessage);
    }
  };

  const showMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
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
            voiceCompletion: undefined // Clear any voice completion when manually toggling
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
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🕵️ Debug Mode Active</h1>
            <p className="text-lg text-gray-600 mb-4">Check your browser console for voice command detective work!</p>
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
                        {habit.voiceCompletion ? `Voice: ${habit.voiceCompletion}%` : 'Completed!'}
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">🎤 Voice Command Testing</h3>
            <p className="text-sm text-yellow-700 mb-4">
              Try your Google Assistant command now, then check the browser console (F12 → Console) for detailed logs!
            </p>
            <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="font-medium mb-2">Example command to test:</p>
              <p className="text-gray-600 text-sm">"Hey Google, open myawesomelifehabits.com?action=log-habit&name=meditation&percent=75"</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">🕵️ Detective Mode: Catching Google Assistant red-handed! 🎭</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
