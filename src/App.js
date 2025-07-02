import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X, Mic, MicOff, Volume2, VolumeX, Bot, Send, Sparkles, ChevronLeft, ChevronRight, Trash2, Menu, Home, BarChart3, BookOpen, Settings } from 'lucide-react';

function App() {
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

  const getMotivationalMessage = (type, context = {}) => {
    const messages = {
      habitCompleted: [
        `🎉 Amazing! You completed ${context.habitName}! Streak: ${context.streak} days!`,
        `✨ Well done on ${context.habitName}! Building habits one day at a time!`,
        `🔥 ${context.habitName} complete! You're on fire with a ${context.streak}-day streak!`,
        `💪 Fantastic work on ${context.habitName}! Consistency is key!`,
        `🌟 ${context.habitName} done! You're building an amazing routine!`
      ],
      streakCelebration: [
        `🎊 INCREDIBLE! ${context.streak} days straight! You're unstoppable!`,
        `🏆 ${context.streak}-day streak achieved! You're a habit champion!`,
        `🚀 ${context.streak} days in a row! Your consistency is inspiring!`,
        `💎 ${context.streak}-day diamond streak! Keep shining!`,
        `⭐ ${context.streak} consecutive days! You're a true habit master!`
      ],
      encouragement: [
        `🌱 Every small step counts! Keep growing!`,
        `💪 You've got this! One habit at a time!`,
        `🎯 Focus on progress, not perfection!`,
        `🔥 Your future self will thank you!`,
        `✨ Consistency beats intensity every time!`
      ]
    };

    const messageArray = messages[type] || messages.encouragement;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
  };

  const validateAIHabitInput = (habitData) => {
    if (!habitData || typeof habitData !== 'object') return false;
    if (!habitData.name || typeof habitData.name !== 'string' || habitData.name.trim().length === 0) return false;
    if (habitData.name.length > 30) return false;
    if (!habitData.description || typeof habitData.description !== 'string') return false;
    if (habitData.description.length > 100) return false;
    
    const validCategories = ['Mindfulness', 'Fitness', 'Learning', 'Health', 'Productivity', 'Social'];
    if (habitData.category && !validCategories.includes(habitData.category)) {
      habitData.category = 'Health';
    }
    
    return true;
  };

  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      showMessage('⚠️ Could not save data locally');
    }
  };

  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };
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

  const [habits, setHabits] = useState(() => {
    return loadFromLocalStorage('userHabits', [
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
  });
    
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);

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
    saveToLocalStorage('userHabits', habits);
  }, [habits]);

  useEffect(() => {
    saveToLocalStorage('currentUser', currentUser);
  }, [currentUser]);
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

RULES:
- Only suggest creating NEW habits if user explicitly asks to add/create a habit
- For logging existing habits, use "log_habit" action  
- For new habit creation, use "create_habit" action
- Be specific about what you're actually doing
- Don't claim you've done something you haven't

Respond in JSON format:
{
  "action": "log_habit" | "conversation" | "create_habit",
  "habit_name": "exact habit name if logging existing" | null,
  "percentage": number 0-100 if logging | null,
  "new_habit": {
    "name": "habit name (max 30 chars)",
    "description": "habit description (max 100 chars)",
    "category": "Mindfulness|Fitness|Learning|Health|Productivity|Social"
  } | null,
  "response": "your honest response explaining what you actually did",
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
        
        if ('speechSynthesis' in window && aiResult.speech_response && aiVoiceEnabled) {
          const utterance = new SpeechSynthesisUtterance(aiResult.speech_response);
          speechSynthesis.speak(utterance);
        }
        
        if (aiResult.action === 'log_habit' && aiResult.habit_name && aiResult.percentage !== null) {
          const habit = habits.find(h => h.name.toLowerCase().includes(aiResult.habit_name.toLowerCase()));
          if (habit) {
            executeHabitUpdate(habit, aiResult.percentage, 'ai');
          }
        }
        
        if (aiResult.action === 'create_habit' && aiResult.new_habit) {
          const newHabitData = aiResult.new_habit;
          
          if (newHabitData && newHabitData.name && newHabitData.description) {
            const newHabit = {
              id: Date.now(),
              name: newHabitData.name.substring(0, 30),
              description: newHabitData.description.substring(0, 100),
              streak: 0,
              missedDays: 0,
              completedToday: false,
              completedDates: [],
              category: newHabitData.category || 'Health',
              progress: 0,
              target: 10
            };
            
            setHabits(prev => [...prev, newHabit]);
            showMessage(`🤖 AI created: "${newHabit.name}"! Now it's real! ✨`);
            
            setTimeout(() => {
              setAiChatHistory(prev => [...prev, {
                type: 'ai',
                message: `✅ Perfect! I've successfully added "${newHabit.name}" to your habits list. You can see it above and start tracking it right away!`,
                timestamp: new Date()
              }]);
            }, 1000);
            
          } else {
            showMessage(`❌ AI tried to create invalid habit. Please try again with different details.`);
            setAiChatHistory(prev => [...prev, {
              type: 'ai',
              message: `Sorry, I couldn't create that habit due to invalid data. Please try describing the habit differently.`,
              timestamp: new Date()
            }]);
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
  console.log('🎬 Processing voice command:', text);
  const matchedHabit = findHabitInSpeech(text, habits); // ← ADD habits parameter
  
  // Enhanced command detection
  const { percentage, action } = extractVoiceAction(text);
  
  if (matchedHabit) {
    executeHabitUpdate(matchedHabit, percentage, 'voice', action);
  } else {
    showMessage(`Couldn't identify a habit in: "${transcript}"`);
  }
};

  const executeHabitUpdate = (habit, percentage, source, action = 'update') => {
  setHabits(prev => prev.map(h => {
    if (h.id === habit.id) {
      const wasCompleted = h.completedToday;
      const willBeCompleted = percentage >= 50;
      
      let newStreak = h.streak;
      let newProgress = h.progress;
      
      if (!wasCompleted && willBeCompleted) {
        newStreak = h.streak + 1;
        newProgress = Math.min(h.progress + Math.ceil(percentage/100), h.target);
      } else if (wasCompleted && !willBeCompleted) {
        newStreak = Math.max(h.streak - 1, 0);
        newProgress = Math.max(h.progress - 1, 0);
      } else if (wasCompleted && willBeCompleted) {
        newStreak = h.streak;
        newProgress = h.progress;
      }
      
      return {
        ...h,
        completedToday: willBeCompleted,
        voiceCompletion: source === 'voice' ? percentage : undefined,
        aiCompletion: source === 'ai' ? percentage : undefined,
        streak: newStreak,
        progress: newProgress
      };
    }
    return h;
  }));
  
  // Better feedback messages based on action
  const actionMessages = {
    'remove': `${source.toUpperCase()} removed: ${habit.name}`,
    'complete': `${source.toUpperCase()} completed: ${habit.name}!`,
    'partial': `${source.toUpperCase()} logged: ${habit.name} at ${percentage}%`,
    'update': `${source.toUpperCase()} updated: ${habit.name} to ${percentage}%`
  };
  
  const successMessage = actionMessages[action] || `${source.toUpperCase()} logged: ${habit.name} at ${percentage}%`;
  showMessage(successMessage);
  
  if (source === 'voice' && 'speechSynthesis' in window) {
    const speechMessages = {
      'remove': `${habit.name} removed`,
      'complete': `${habit.name} completed`,
      'partial': `${habit.name} ${percentage} percent done`,
      'update': `${habit.name} updated to ${percentage} percent`
    };
    
    const speechText = speechMessages[action] || `${habit.name} logged at ${percentage} percent`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    speechSynthesis.speak(utterance);
  }
};

 const findHabitInSpeech = (text, currentHabits) => {
  const habitsToUse = currentHabits || habits;
   const findHabitInSpeech = (text, currentHabits) => {
  const habitsToUse = currentHabits || habits;
  
  // ADD THESE DEBUG LINES:
  console.log('🔍 currentHabits parameter:', currentHabits?.map(h => h.name));
  console.log('🔍 habitsToUse:', habitsToUse?.map(h => h.name));
  console.log('🔍 Global habits:', habits?.map(h => h.name));
  
  // 🔍 DEBUG: Let's see what we're working with
  console.log('🎤 Voice Input:', text);
  console.log('🎯 Available Habits:', habitsToUse.map(h => h.name));
  const habitsToUse = currentHabits || habits; // Use passed habits or fallback
  // 🔍 DEBUG: Let's see what we're working with
  console.log('🎤 Voice Input:', text);
 console.log('🎯 Available Habits:', habitsToUse.map(h => h.name));
  
  const habitKeywords = {};
  habitsToUse.forEach(habit => {
    const habitName = habit.name.toLowerCase();
    const nameWords = habitName.split(' ').filter(word => 
      word.length > 2 && !['mins', 'minutes', 'min', 'the', 'and', 'for', 'with'].includes(word)
    );
    
    // Start with all individual words and full name
    habitKeywords[habit.name] = [...nameWords, habitName];
    
    // Add category-based keywords
    const categoryKeywords = {
      'Mindfulness': ['meditation', 'meditate', 'mindful', 'zen', 'breathe', 'calm'],
      'Fitness': ['exercise', 'workout', 'fitness', 'gym', 'run', 'walk', 'train'],
      'Learning': ['reading', 'read', 'book', 'study', 'learn', 'education'],
      'Health': ['health', 'medicine', 'vitamins', 'water', 'sleep', 'rest'],
      'Productivity': ['work', 'productive', 'focus', 'organize', 'plan'],
      'Social': ['social', 'friends', 'family', 'call', 'connect', 'relationship']
    };
    
    // Add category keywords
    if (categoryKeywords[habit.category]) {
      habitKeywords[habit.name].push(...categoryKeywords[habit.category]);
    }
    
    // Add smart variations for custom habits
    nameWords.forEach(word => {
      if (word.length > 3) {
        // Add partial matches for longer words
        if (word.length > 5) {
          habitKeywords[habit.name].push(word.substring(0, 4));
        }
        
        // Add common variations including gardening terms
        const variations = {
          'yoga': ['stretching', 'pose', 'asana'],
          'water': ['drink', 'hydrate', 'fluid'],
          'journal': ['write', 'diary', 'log'],
          'walking': ['walk', 'stroll', 'steps'],
          'cooking': ['cook', 'meal', 'food'],
          'cleaning': ['clean', 'tidy', 'organize'],
          'coding': ['code', 'programming', 'develop'],
          'guitar': ['music', 'practice', 'instrument'],
          'running': ['run', 'jog', 'cardio'],
          'garden': ['gardening', 'plant', 'flowers', 'yard', 'outdoor'],
          'flowers': ['garden', 'gardening', 'plant', 'bloom', 'nature'],
          'reading': ['read', 'book', 'study']
        };
        
        if (variations[word]) {
          habitKeywords[habit.name].push(...variations[word]);
        }
      }
    });
    
    // 🔍 DEBUG: Show keywords for each habit
    console.log(`🔑 Keywords for "${habit.name}":`, habitKeywords[habit.name]);
  });
  
  // Enhanced matching with scoring
  let bestMatch = null;
  let bestScore = 0;
  
  for (const habit of habitsToUse) {
    const keywords = habitKeywords[habit.name] || [];
    let score = 0;
    
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        // Exact habit name match gets highest score
        if (keyword === habit.name.toLowerCase()) {
          score += 10;
        }
        // Individual words from habit name get high score
        else if (habit.name.toLowerCase().split(' ').includes(keyword)) {
          score += 5;
        }
        // Category keywords get medium score
        else {
          score += 1;
        }
        
        // 🔍 DEBUG: Show matches
        console.log(`✅ Match found: "${keyword}" in "${habit.name}" (score +${score})`);
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = habit;
    }
  }
  
  // 🔍 DEBUG: Show final result
  console.log(`🎯 Best Match:`, bestMatch?.name || 'None', `(score: ${bestScore})`);
  
  return bestScore > 0 ? bestMatch : null;
};

 const extractVoiceAction = (text) => {
  // Removal/deletion commands
  const removalWords = [
    'remove', 'delete', 'take off', 'undo', 'cancel', 'clear', 'reset', 
    'uncheck', 'unmark', 'reverse', 'take away', 'get rid of'
  ];
  
  // Completion commands  
  const completionWords = {
    'complete': 100, 'completed': 100, 'done': 100, 'finished': 100,
    'accomplish': 100, 'achieved': 100, 'succeed': 100, 'nailed': 100,
    'crushed': 100, 'smashed': 100, 'knocked out': 100, 'wrapped up': 100,
    'check off': 100, 'mark done': 100, 'mark complete': 100
  };
  
  // Partial completion commands
  const partialWords = {
    'mostly': 75, 'almost': 75, 'nearly': 75, 'pretty much': 75,
    'half': 50, 'halfway': 50, 'partially': 50, 'some': 50,
    'little': 25, 'bit': 25, 'started': 25, 'barely': 25,
    'quarter': 25, 'touch': 10
  };
  
  // Update/modify commands
  const updateWords = [
    'update', 'change', 'modify', 'adjust', 'set', 'make it', 'put at'
  ];
  
  // Check for removal commands first
  for (const word of removalWords) {
    if (text.includes(word)) {
      return { percentage: 0, action: 'remove' };
    }
  }
  
  // Check for explicit percentages
  const percentMatches = [
    /(\d+)\s*percent/,
    /(\d+)\s*%/,
    /(\d+)\s*per\s*cent/
  ];
  
  for (const pattern of percentMatches) {
    const match = text.match(pattern);
    if (match) {
      const percentage = Math.min(parseInt(match[1]), 100);
      const action = percentage === 0 ? 'remove' : 'update';
      return { percentage, action };
    }
  }
  
  // Check for completion words
  for (const [word, percent] of Object.entries(completionWords)) {
    if (text.includes(word)) {
      return { percentage: percent, action: 'complete' };
    }
  }
  
  // Check for partial completion words
  for (const [word, percent] of Object.entries(partialWords)) {
    if (text.includes(word)) {
      return { percentage: percent, action: 'partial' };
    }
  }
  
  // Check for update words with context
  for (const word of updateWords) {
    if (text.includes(word)) {
      // Try to extract number after update word
      const updateMatch = text.match(new RegExp(word + '.*?(\\d+)'));
      if (updateMatch) {
        const percentage = Math.min(parseInt(updateMatch[1]), 100);
        return { percentage, action: 'update' };
      }
    }
  }
  
  // Natural language patterns
  if (text.includes('for today')) {
    if (text.includes('100') || text.includes('complete')) {
      return { percentage: 100, action: 'complete' };
    }
    if (text.includes('0') || text.includes('nothing')) {
      return { percentage: 0, action: 'remove' };
    }
  }
  
  // Default to completion if no specific action found
  return { percentage: 100, action: 'complete' };
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
          
          const message = getMotivationalMessage('habitCompleted', {
            habitName: habit.name,
            streak: newStreak
          });
          showMessage(message);
          
          if ([7, 14, 21].includes(newStreak)) {
            setTimeout(() => {
              const streakMessage = getMotivationalMessage('streakCelebration', { streak: newStreak });
              showMessage(streakMessage);
            }, 2000);
          }
          
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
    
    setHabits(prev => {
      const newHabits = [...prev, habit];
      saveToLocalStorage('userHabits', newHabits);
      return newHabits;
    });
    
    setNewHabit({ name: '', description: '', category: 'Mindfulness' });
    setShowAddHabit(false);
    showMessage(`New habit "${habit.name}" added! 💾 Saved`);
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

  const navItems = [
    { id: 'habits', label: 'Habits', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {showNotification && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">
          <p className="text-sm font-medium text-center md:text-left">{notificationMessage}</p>
        </div>
      )}
      
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-lg text-gray-800 md:text-xl">My Habits</span>
            </div>
            
            <div className="hidden md:flex gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === item.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentView === item.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="px-3 py-4 md:px-6 md:py-8 max-w-7xl mx-auto">
        {currentView === 'habits' && (
          <div className="space-y-4 md:space-y-6">
            <div className="text-center py-3 md:py-6">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">Life Habits Tracker</h1>
              <p className="text-sm md:text-lg text-gray-600">Transform your daily habits, transform your life.</p>
            </div>

            <div className="flex gap-2 md:hidden">
              <button
                onClick={() => setShowAIChat(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span className="text-sm">AI Coach</span>
              </button>
              
              {voiceSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-purple-500 hover:bg-purple-600 text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
            </div>

            {isListening && (
              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 md:hidden">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-blue-800 text-sm">Listening...</span>
                </div>
                <p className="text-xs text-gray-600">
                  {voiceTranscript || 'Say: "Exercise complete" or "Reading 50 percent"'}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="hidden md:block">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Mic className="w-5 h-5 text-purple-500" />
                      Voice Command Center
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

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Today's Habits
                  </h2>
                  <button
                    onClick={() => setShowAddHabit(true)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Add New</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {habits.map(habit => (
                    <div key={habit.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base md:text-lg font-bold text-gray-800 truncate">{habit.name}</h3>
                            <button
                              onClick={() => openDeleteConfirm(habit)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                          <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">{habit.description}</p>
                          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm flex-wrap">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium text-xs">
                              {habit.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                              <span className="font-semibold text-orange-600">{habit.streak} day streak</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 md:mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs md:text-sm text-gray-600">Progress: {habit.progress}/{habit.target}</span>
                          <span className="text-xs md:text-sm font-medium text-gray-700">
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
                          className={`flex-1 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                            habit.completedToday
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-100 hover:bg-green-500 hover:text-white text-gray-700'
                          }`}
                        >
                          {habit.completedToday ? (
                            <span className="flex items-center justify-center gap-1 md:gap-2">
                              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                              <span className="hidden sm:inline">
                                {habit.voiceCompletion ? `Voice: ${habit.voiceCompletion}%` : 
                                 habit.aiCompletion ? `AI: ${habit.aiCompletion}%` : 'Completed!'}
                              </span>
                              <span className="sm:hidden">✓</span>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1 md:gap-2">
                              <Circle className="w-4 h-4 md:w-5 md:h-5" />
                              <span>Complete</span>
                            </span>
                          )}
                        </button>
                        
                        <button
                          onClick={() => openSliderModal(habit)}
                          className="px-3 md:px-4 py-2 md:py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-1 md:gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-300 rounded-full"></div>
                          </div>
                          <span className="text-xs md:text-sm font-bold">%</span>
                        </button>
                        
                        {habit.missedDays > 0 && habit.missedDays <= 3 && (
                          <button
                            onClick={() => openBacklogModal(habit)}
                            className="px-3 md:px-4 py-2 md:py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg font-medium transition-colors flex items-center gap-1 md:gap-2"
                          >
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="hidden md:inline text-sm">Past</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
                  <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 text-center">
                    <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-green-500 mx-auto mb-1 md:mb-2" />
                    <h3 className="font-bold text-lg md:text-2xl text-gray-800">{getWeeklyProgress().completionRate}%</h3>
                    <p className="text-xs md:text-sm text-gray-600">Today's Progress</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 text-center">
                    <Flame className="w-5 h-5 md:w-8 md:h-8 text-orange-500 mx-auto mb-1 md:mb-2" />
                    <h3 className="font-bold text-lg md:text-2xl text-gray-800">{getWeeklyProgress().totalStreak}</h3>
                    <p className="text-xs md:text-sm text-gray-600">Total Streaks</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 text-center">
                    <Award className="w-5 h-5 md:w-8 md:h-8 text-purple-500 mx-auto mb-1 md:mb-2" />
                    <h3 className="font-bold text-lg md:text-2xl text-gray-800">{habits.length}</h3>
                    <p className="text-xs md:text-sm text-gray-600">Active Habits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
{currentView === 'dashboard' && (
          <div className="space-y-4 md:space-y-6">
            <div className="text-center py-3 md:py-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
              <p className="text-sm md:text-base text-gray-600">Your habit journey at a glance</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 md:p-6 text-white">
                <div className="text-center md:flex md:items-center md:justify-between">
                  <div>
                    <p className="text-blue-100 text-xs md:text-sm">Today's Progress</p>
                    <p className="text-2xl md:text-3xl font-bold">{getWeeklyProgress().completionRate}%</p>
                  </div>
                  <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-blue-200 mx-auto mt-2 md:mt-0 md:mx-0" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 md:p-6 text-white">
                <div className="text-center md:flex md:items-center md:justify-between">
                  <div>
                    <p className="text-orange-100 text-xs md:text-sm">Total Streaks</p>
                    <p className="text-2xl md:text-3xl font-bold">{getWeeklyProgress().totalStreak}</p>
                  </div>
                  <Flame className="w-6 h-6 md:w-8 md:h-8 text-orange-200 mx-auto mt-2 md:mt-0 md:mx-0" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 md:p-6 text-white">
                <div className="text-center md:flex md:items-center md:justify-between">
                  <div>
                    <p className="text-green-100 text-xs md:text-sm">Active Habits</p>
                    <p className="text-2xl md:text-3xl font-bold">{habits.length}</p>
                  </div>
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-green-200 mx-auto mt-2 md:mt-0 md:mx-0" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 md:p-6 text-white">
                <div className="text-center md:flex md:items-center md:justify-between">
                  <div>
                    <p className="text-purple-100 text-xs md:text-sm">Best Streak</p>
                    <p className="text-2xl md:text-3xl font-bold">{Math.max(...habits.map(h => h.streak), 0)}</p>
                  </div>
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-purple-200 mx-auto mt-2 md:mt-0 md:mx-0" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-4">Habit Progress Overview</h3>
              <div className="space-y-3 md:space-y-4">
                {habits.map(habit => (
                  <div key={habit.id} className="border border-gray-200 rounded-lg p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate flex-1">{habit.name}</h4>
                      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
                        <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                        <span className="text-xs md:text-sm font-medium text-orange-600">{habit.streak} days</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{habit.progress}/{habit.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 md:h-3 rounded-full transition-all duration-300"
                            style={{width: `${Math.min((habit.progress / habit.target) * 100, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        habit.completedToday ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {habit.completedToday ? 'Done' : 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  <span className="font-medium text-sm md:text-base">Add New Habit</span>
                </button>
                <button
                  onClick={() => setShowAIChat(true)}
                  className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Bot className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  <span className="font-medium text-sm md:text-base">Chat with AI Coach</span>
                </button>
                <button
                  onClick={() => setCurrentView('profile')}
                  className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                  <span className="font-medium text-sm md:text-base">View Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'learn' && (
          <div className="space-y-4 md:space-y-6">
            <div className="text-center py-3 md:py-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Learn & Grow</h2>
              <p className="text-sm md:text-base text-gray-600">Insights, guides, and inspiration for your habit journey</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 md:p-6 text-white">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Target className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">FEATURED</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Why a BIG Vision Needs Good Habits</h3>
                  <p className="text-purple-100 text-xs md:text-sm">Discover how small daily actions build extraordinary achievements</p>
                </div>
                <div className="p-4 md:p-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                      <strong>Dreams without systems are just wishes.</strong> Every extraordinary achievement starts with an extraordinary vision, but it's the boring, daily habits that actually make it happen.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">🎯 The Vision-Habit Connection</h4>
                    <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                      Your big vision is the <em>destination</em>. Your habits are the <em>vehicle</em>. Without reliable daily systems, even the most inspiring goals remain out of reach.
                    </p>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 my-3 md:my-4">
                      <p className="text-blue-800 font-medium text-sm md:text-base">💭 Remember: You don't rise to the level of your goals. You fall to the level of your systems.</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 flex-wrap">
                      <span>📖 5 min read</span>
                      <span>🎯 Goal Setting</span>
                      <span>💪 Motivation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 md:p-6 text-white">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Star className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">HOW-TO</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">How to Use This App</h3>
                  <p className="text-green-100 text-xs md:text-sm">Master every feature and become a habit-building pro</p>
                </div>
                <div className="p-4 md:p-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                      Welcome to the most advanced habit tracker you'll ever use! Here's how to unlock every feature and build life-changing habits.
                    </p>
                    
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">🏁 Getting Started</h4>
                    <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                      <p className="text-gray-700 mb-2 text-sm md:text-base"><strong>Four Ways to Log Completion:</strong></p>
                      <ul className="text-gray-700 space-y-1 text-sm md:text-base">
                        <li><strong>Complete Button:</strong> One-click for 100% completion</li>
                        <li><strong>% Slider:</strong> Set partial completion</li>
                        <li><strong>Voice Commands:</strong> "Exercise complete"</li>
                        <li><strong>AI Chat:</strong> "I just finished a workout!"</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-3 md:p-4 my-3 md:my-4">
                      <p className="text-green-800 font-medium text-sm md:text-base">🎉 Success Tip: Consistency beats perfection. A 50% day is infinitely better than a 0% day!</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 flex-wrap">
                      <span>📖 7 min read</span>
                      <span>🎓 Tutorial</span>
                      <span>⚡ Quick Start</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 md:p-6 text-white text-center">
              <h3 className="text-lg md:text-xl font-bold mb-2">📚 More Content Coming Soon!</h3>
              <p className="text-orange-100 text-sm md:text-base">We're constantly adding new articles, guides, and videos to help you on your habit journey.</p>
              <div className="mt-3 md:mt-4 flex flex-wrap justify-center gap-2">
                <span className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">🧠 Habit Science</span>
                <span className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">💪 Success Stories</span>
                <span className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">🎯 Advanced Strategies</span>
              </div>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="space-y-4 md:space-y-6">
            <div className="text-center py-3 md:py-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Profile & Settings</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={currentUser.phone}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
              </div>
            </div>
<div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                AI Coaching Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Optimal Call Time</label>
                  <input
                    type="time"
                    defaultValue="10:00"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentUser.preferences.emailCoaching}
                      onChange={(e) => setCurrentUser(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, emailCoaching: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <label className="text-xs md:text-sm text-gray-700">
                      📧 Enable AI email coaching (after 2 days inactive)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentUser.preferences.phoneCoaching}
                      onChange={(e) => setCurrentUser(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, phoneCoaching: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <label className="text-xs md:text-sm text-gray-700">
                      📞 Enable AI phone coaching (after 4 days inactive)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                🧪 Test Coaching System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <button
                  onClick={async () => {
                    try {
                      showMessage('📧 Sending test email...');
                      const response = await fetch('/api/send-coaching-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userEmail: currentUser.email,
                          userName: currentUser.name,
                          inactiveDays: 0,
                          habits: habits,
                          longestStreak: Math.max(...habits.map(h => h.streak))
                        })
                      });
                      if (response.ok) {
                        showMessage('✅ Real test email sent!');
                      } else {
                        showMessage('❌ Email failed to send');
                      }
                    } catch (error) {
                      showMessage('❌ Email error: ' + error.message);
                    }
                  }}
                  className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  <span className="font-medium text-sm md:text-base">Test Email Coaching</span>
                </button>
                <button
                  onClick={async () => {
                    try {
                      showMessage('📱 Sending test SMS...');
                      const response = await fetch('/api/send-coaching-sms', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userPhone: currentUser.phone,
                          userName: currentUser.name,
                          inactiveDays: 0,
                          habits: habits,
                          longestStreak: Math.max(...habits.map(h => h.streak))
                        })
                      });
                      if (response.ok) {
                        showMessage('✅ Real test SMS sent!');
                      } else {
                        showMessage('❌ SMS failed to send');
                      }
                    } catch (error) {
                      showMessage('❌ SMS error: ' + error.message);
                    }
                  }}
                  className="flex items-center gap-3 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  <span className="font-medium text-sm md:text-base">Test SMS Coaching</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                📧 Email coaching triggers after 2 days inactive • 📱 SMS coaching triggers after 4 days inactive (Premium users)
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                💾 Data Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <button
                  onClick={() => {
                    const dataToExport = {
                      habits: habits,
                      user: currentUser,
                      exportDate: new Date().toISOString(),
                      version: "1.0"
                    };
                    const dataStr = JSON.stringify(dataToExport, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `habits-backup-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    showMessage('📁 Data exported successfully!');
                  }}
                  className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  <span className="font-medium text-sm md:text-base">Export Data</span>
                </button>
                <label className="flex items-center gap-3 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  <span className="font-medium text-sm md:text-base">Import Data</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const importedData = JSON.parse(event.target.result);
                            if (importedData.habits && Array.isArray(importedData.habits)) {
                              setHabits(importedData.habits);
                              saveToLocalStorage('userHabits', importedData.habits);
                            }
                            if (importedData.user) {
                              setCurrentUser(importedData.user);
                              saveToLocalStorage('currentUser', importedData.user);
                            }
                            showMessage('📂 Data imported successfully!');
                          } catch (error) {
                            showMessage('❌ Import failed: Invalid file format');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💾 Export your data as backup • 📂 Import from previous backup files
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 md:p-6 text-white">
              <h3 className="text-base md:text-lg font-bold mb-2">✨ Premium AI Features Active</h3>
              <p className="text-xs md:text-sm opacity-90 mb-4">You're experiencing the full power of AI-driven habit building!</p>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm md:text-base">🧠 AI Features Active:</h4>
                  <ul className="space-y-1 text-xs md:text-sm">
                    <li>✅ Voice command recognition</li>
                    <li>✅ AI conversation logging</li>
                    <li>✅ Smart habit suggestions</li>
                    <li>✅ Percentage completion tracking</li>
                    <li>✅ Backlog update system</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-1 transition-colors ${
                currentView === item.id ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="md:hidden h-16"></div>
{showBacklogModal && selectedHabitForBacklog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4 p-4 pb-0">
              <h3 className="text-lg font-bold">Update Past Days</h3>
              <button onClick={closeBacklogModal}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="px-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">{selectedHabitForBacklog.name}</h4>
              <p className="text-sm text-gray-600 mb-4">Mark completion for up to 3 past days</p>
            </div>

            <div className="px-4 space-y-3">
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

            <div className="p-4 pt-6 border-t mt-6">
              <button
                onClick={closeBacklogModal}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4 p-4 pb-0">
              <h3 className="text-lg font-bold">Add New Habit</h3>
              <button onClick={() => setShowAddHabit(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="px-4 space-y-4">
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
            </div>
            <div className="flex gap-3 p-4 pt-6">
              <button
                onClick={addNewHabit}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Add Habit
              </button>
              <button
                onClick={() => setShowAddHabit(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSliderModal && selectedHabitForSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4 p-4 pb-0">
              <h3 className="text-lg font-bold">Set Completion Level</h3>
              <button onClick={closeSliderModal}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="px-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">{selectedHabitForSlider.name}</h4>
              <p className="text-sm text-gray-600 mb-4">How much did you accomplish today?</p>
              
              <div className="text-center mb-6">
                <div className="text-5xl md:text-6xl font-bold text-blue-500 mb-2">
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
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
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

            <div className="flex gap-3 p-4 pt-0">
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

      {showDeleteConfirm && habitToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4 p-4 pb-0">
              <h3 className="text-lg font-bold text-red-600">Delete Habit</h3>
              <button onClick={closeDeleteConfirm}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="px-4 mb-6">
              <p className="text-gray-700">Are you sure you want to delete "{habitToDelete.name}"?</p>
              <p className="text-sm text-gray-500 mt-2">This will remove all progress and cannot be undone.</p>
            </div>

            <div className="flex gap-3 p-4 pt-0">
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

      {showVoiceHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4 p-4 pb-0">
              <h3 className="text-lg font-bold">Voice Commands Help</h3>
              <button onClick={() => setShowVoiceHelp(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            
            <div className="px-4 space-y-4">
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

            <div className="p-4 pt-6">
              <button
                onClick={() => setShowVoiceHelp(false)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {showAIChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl shadow-xl w-full h-full md:max-w-2xl md:h-[600px] flex flex-col">
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
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {aiChatHistory.length === 0 && (
                <div className="text-center text-gray-500 mt-10 md:mt-20">
                  <Bot className="w-10 h-10 md:w-12 md:h-12 text-green-300 mx-auto mb-4" />
                  <p className="font-medium text-sm md:text-base">Chat with your AI habit coach!</p>
                  <p className="text-xs md:text-sm mt-2">Try saying things like:</p>
                  <div className="mt-4 space-y-2 text-xs md:text-sm">
                    <div className="bg-green-50 rounded-lg p-2">"I just finished an amazing workout!"</div>
                    <div className="bg-green-50 rounded-lg p-2">"Add a savings habit"</div>
                    <div className="bg-green-50 rounded-lg p-2">"How can I stay motivated?"</div>
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
                    <p className="text-xs md:text-sm">{chat.message}</p>
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
            
            <div className="p-4 md:p-6 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
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
      )}

      <footer className="bg-white border-t mt-8 md:mt-12 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 text-center text-gray-600">
          <p className="text-xs md:text-sm">Transform your daily habits, transform your life ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
