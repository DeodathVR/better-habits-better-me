import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X, Mic, MicOff, Volume2, Bot, Send, Sparkles, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

function App() {
  // Your Gemini API Key (replace with your actual key)
  const GEMINI_API_KEY = 'AIzaSyDFZ6mr63MOYGy--TDsw2RBQ6kpNeL-p6o';

  // Initialize state from memory (not localStorage per Claude.ai restrictions)
  const [currentUser, setCurrentUser] = useState(() => ({
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
  }));

  const [habits, setHabits] = useState(() => ([
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
  ]));

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
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [selectedHabitForBacklog, setSelectedHabitForBacklog] = useState(null);
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [selectedHabitForSlider, setSelectedHabitForSlider] = useState(null);
  const [sliderValue, setSliderValue] = useState(100);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  // Auto-scroll chat to bottom
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

  // BUILT-IN VOICE RECOGNITION SETUP
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

  // GEMINI AI AGENT INTEGRATION
  const processWithAI = async (userMessage) => {
    console.log('🤖 Processing with Gemini AI:', userMessage);
    setAiProcessing(true);
    
    try {
      const prompt = `You are a SMART habit tracking assistant. The user says: "${userMessage}"

Current habits available:
${habits.map(h => `- ${h.name}: ${h.description} (${h.streak} day streak, ${h.completedToday ? 'completed today' : 'not completed today'})`).join('\n')}

User profile: ${currentUser.name}, ${currentUser.aiProfile.personalityType} personality

RESPONSE RULES:
- For HABIT LOGGING: Max 6 words, enthusiastic but brief, NO EMOJIS AT ALL in speech
- For QUESTIONS/ADVICE: 2-3 helpful sentences, can be more detailed, NO EMOJIS AT ALL in speech  
- Act like an encouraging but knowledgeable fitness buddy
- CRITICAL: The speech_response field must NEVER contain emojis, emoji names, or emoji descriptions
- speech_response should use ONLY regular words that sound natural when spoken
- Use emojis only in the regular response field for visual display

Your task:
1. Determine if the user is logging a habit completion or asking a question
2. If logging a habit, extract: habit name and completion percentage (0-100)
3. Respond appropriately based on the type of interaction

Respond in JSON format:
{
  "action": "log_habit" | "conversation" | "question",
  "habit_name": "exact habit name if logging" | null,
  "percentage": number 0-100 if logging | null,
  "response": "appropriate response (brief for logging, detailed for questions)",
  "speech_response": "version without emojis for speech synthesis",
  "reasoning": "brief explanation of what you understood"
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
        
        // Always speak the response using speech_response (no emojis)
        if ('speechSynthesis' in window && aiResult.speech_response) {
          const utterance = new SpeechSynthesisUtterance(aiResult.speech_response);
          speechSynthesis.speak(utterance);
        }
        
        // Execute action if it's a habit log
        if (aiResult.action === 'log_habit' && aiResult.habit_name && aiResult.percentage !== null) {
          const habit = habits.find(h => h.name.toLowerCase().includes(aiResult.habit_name.toLowerCase()) || 
                                         aiResult.habit_name.toLowerCase().includes(h.name.toLowerCase()));
          
          if (habit) {
            console.log(`🤖 AI logging habit: ${habit.name} at ${aiResult.percentage}%`);
            executeHabitUpdate(habit, aiResult.percentage, 'ai');
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

  // Process voice commands
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

  // Execute habit update (unified function for voice, AI, and manual commands)
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
    const icon = source === 'voice' ? '🎤' : source === 'ai' ? '🤖' : '🎤';
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

  // Find habit mentioned in speech
  const findHabitInSpeech = (text) => {
    console.log('🔍 Searching for habits in:', text);
    
    const habitKeywords = {};
    habits.forEach(habit => {
      const habitName = habit.name;
      const nameWords = habitName.toLowerCase().split(' ');
      
      habitKeywords[habitName] = [
        ...nameWords,
        habitName.toLowerCase()
      ];
      
      if (habit.category === 'Mindfulness') {
        habitKeywords[habitName].push('meditation', 'meditate', 'mindful', 'zen', 'calm', 'breathing');
      } else if (habit.category === 'Fitness') {
        habitKeywords[habitName].push('exercise', 'workout', 'fitness', 'gym', 'run', 'running', 'cardio', 'training');
      } else if (habit.category === 'Learning') {
        habitKeywords[habitName].push('reading', 'read', 'book', 'study', 'studying', 'learning');
      }
    });
    
    for (const habit of habits) {
      const keywords = habitKeywords[habit.name] || [];
      
      for (const keyword of keywords) {
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

  const logHabitViaVoice = (habitName, percentString) => {
    console.log('Voice command:', { habitName, percentString });
    
    const percent = parseInt(percentString) || 100;
    const habit = habits.find(h => {
      const habitLower = h.name.toLowerCase();
      const searchLower = habitName.toLowerCase();
      return habitLower.includes(searchLower) || searchLower.includes(habitLower);
    });
    
    if (habit) {
      setHabits(prev => prev.map(h => {
        if (h.id === habit.id) {
          const newStreak = percent >= 50 ? h.streak + 1 : h.streak;
          const newProgress = Math.min(h.progress + Math.ceil(percent/100), h.target);
          
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
      
      const voiceMessage = percent === 100 
        ? `🎤 Voice logged: ${habit.name} completed!`
        : `🎤 Voice logged: ${habit.name} at ${percent}% - Great progress!`;
      
      showMessage(voiceMessage);
    } else {
      const errorMessage = `🎤 Voice command: Couldn't find habit "${habitName}". Available habits: ${habits.map(h => h.name).join(', ')}`;
      showMessage(errorMessage);
    }
  };

  const exportData = () => {
    const data = {
      user: currentUser,
      habits: habits,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `better-habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage('📥 Data exported successfully!');
  };

  const getMotivationalMessage = (type, data = {}) => {
    if (currentUser.isPremium) {
      const personalizedMessages = {
        habitCompleted: [
          `Outstanding work, ${currentUser.name}! ✅ ${data.habitName} completed. You're building real momentum!`,
          `Boom! 🎯 ${data.habitName} done! Day ${data.streak} in your streak. Your consistency is what separates achievers from dreamers!`
        ],
        streakCelebration: {
          7: "ONE WEEK! 🔥 You officially have a habit in progress!",
          14: "TWO WEEKS! 🌟 This is where real change happens!",
          21: "21 DAYS! 🎊 Scientists say this is when habits start to stick!"
        },
        lifeCoachMessages: {
          achiever: [
            `Your ${data.habitName || 'meditation'} habit isn't just about calm—it's about becoming the focused leader you're meant to be. Every session builds the mental strength that will help you crush your career goals.`,
            `${currentUser.name}, I know ${new Date().toLocaleDateString('en', {weekday: 'long'})}s can be tough for you, but remember: you've conquered that ${currentUser.behaviorData.longestStreak}-day streak before. That took real mental toughness.`
          ]
        }
      };
      
      if (type === 'lifeCoach') {
        const userType = currentUser.aiProfile.personalityType;
        const messages = personalizedMessages.lifeCoachMessages[userType] || personalizedMessages.lifeCoachMessages.achiever;
        return messages[Math.floor(Math.random() * messages.length)];
      }
      
      if (type === 'streakCelebration' && personalizedMessages[type][data.streak]) {
        return personalizedMessages[type][data.streak];
      }
      
      return personalizedMessages[type]?.[0] || "Great job! 🎉";
    }
    
    return `Great job completing ${data.habitName}! Keep it up! 🎉`;
  };

  const sendLifeCoachMessage = () => {
    const message = getMotivationalMessage('lifeCoach', { habitName: currentUser.behaviorData.lastCompletedHabit });
    showMessage(message);
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
    showMessage(`🎉 New habit "${habit.name}" added! Let's build that streak!`);
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

  const openSliderModal = (habit) => {
    setSelectedHabitForSlider(habit);
    setSliderValue(habit.completionPercentage || 100);
    setShowSliderModal(true);
  };

  const closeSliderModal = () => {
    setShowSliderModal(false);
    setSelectedHabitForSlider(null);
    setSliderValue(100);
  };

  const confirmSliderCompletion = () => {
    if (!selectedHabitForSlider) return;

    setHabits(prev => prev.map(habit => {
      if (habit.id === selectedHabitForSlider.id) {
        const newStreak = sliderValue >= 50 ? habit.streak + 1 : habit.streak;
        const newProgress = Math.min(habit.progress + Math.ceil(sliderValue/100), habit.target);
        
        const message = sliderValue === 100 
          ? getMotivationalMessage('habitCompleted', {
              habitName: habit.name,
              streak: newStreak
            })
          : `Great progress on ${habit.name}! ${sliderValue}% completion shows real dedication! 💪`;
        
        showMessage(message);
        
        return {
          ...habit,
          completedToday: sliderValue >= 50,
          completionPercentage: sliderValue,
          streak: newStreak,
          progress: newProgress,
          voiceCompletion: undefined
        };
      }
      return habit;
    }));

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
    showMessage(`🗑️ "${habitToDelete.name}" habit deleted. You can always add it back later!`);
    closeDeleteConfirm();
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

    const getSliderColor = (value) => {
      if (value >= 80) return 'from-green-400 to-green-600';
      if (value >= 60) return 'from-yellow-400 to-yellow-600';
      if (value >= 40) return 'from-orange-400 to-orange-600';
      return 'from-red-400 to-red-600';
    };

    const getEncouragementText = (value) => {
      if (value === 100) return "Perfect! 🎉 Full completion!";
      if (value >= 80) return "Excellent! 💪 Almost there!";
      if (value >= 60) return "Great progress! 👍 Keep it up!";
      if (value >= 40) return "Good effort! 💪 Every step counts!";
      if (value >= 20) return "Nice start! 🌱 Progress is progress!";
      return "Every little bit helps! 🌟";
    };

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
            <p className="text-sm text-gray-600 mb-4">How much did you accomplish today?</p>
            
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold bg-gradient-to-r ${getSliderColor(sliderValue)} bg-clip-text text-transparent mb-2`}>
                {sliderValue}%
              </div>
              <p className="text-sm text-gray-600">{getEncouragementText(sliderValue)}</p>
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

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Will count as:</span>
                <span className={`font-medium ${sliderValue >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                  {sliderValue >= 50 ? '✅ Completed day' : '⚠️ Partial progress'}
                </span>
              </div>
              {sliderValue >= 50 && (
                <p className="text-xs text-green-600 mt-1">This will continue your streak!</p>
              )}
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
              className={`flex-1 py-3 rounded-lg font-medium transition-colors text-white ${
                sliderValue >= 50 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {sliderValue >= 50 ? 'Complete!' : 'Log Progress'}
            </button>
          </div>
        </div>
      </div>
    );
}

export default App;
  };

  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm || !habitToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-red-600">Delete Habit</h3>
            <button onClick={closeDeleteConfirm}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{habitToDelete.name}</h4>
                <p className="text-sm text-gray-600">Are you sure you want to delete this habit?</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-medium text-red-800 mb-2">This will permanently remove:</h5>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• {habitToDelete.streak} day streak</li>
                <li>• All completion history</li>
                <li>• Progress data ({habitToDelete.progress}/{habitToDelete.target})</li>
              </ul>
              <p className="text-xs text-red-600 mt-3">This action cannot be undone, but you can always create the habit again.</p>
            </div>
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
              Delete Habit
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
              <button
                onClick={() => setCurrentView('learn')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'learn' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Learn
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Profile
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
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-600 mb-4">Transform your daily habits, transform your life.</p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">🌟 Why Track Your Habits?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🎯</div>
                      <p className="font-medium text-gray-700">Build Consistency</p>
                      <p className="text-gray-600">Turn daily actions into automatic behaviors</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">🚀</div>
                      <p className="font-medium text-gray-700">Achieve Goals</p>
                      <p className="text-gray-600">Small daily steps lead to massive results</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">📈</div>
                      <p className="font-medium text-gray-700">Track Progress</p>
                      <p className="text-gray-600">See your growth and celebrate wins</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">💪</div>
                      <p className="font-medium text-gray-700">Stay Motivated</p>
                      <p className="text-gray-600">AI coaching keeps you on track</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

                  <div className="space-y-4">
                    {habits.map(habit => (
                      <div
                        key={habit.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-gray-800">{habit.name}</h3>
                              <button
                                onClick={() => openDeleteConfirm(habit)}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Delete habit"
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
                              {habit.missedDays > 0 && (
                                <span className="text-orange-600 text-sm">
                                  {habit.missedDays} missed days
                                </span>
                              )}
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
                                 habit.completionPercentage && habit.completionPercentage !== 100 ? `${habit.completionPercentage}% Done` : 
                                 'Completed!'}
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
                            <div className="w-4 h-4 bg-blue-500 rounded-full relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                            <span className="hidden sm:inline">%</span>
                          </button>
                          
                          <button
                            onClick={() => logHabitViaVoice(habit.name, "100")}
                            className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                            title="Voice command demo"
                          >
                            <Mic className="w-4 h-4" />
                            <span className="hidden sm:inline">Voice</span>
                          </button>
                          
                          <button
                            onClick={() => logHabitViaVoice(habit.name, "100")}
                            className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                            title="Voice command demo"
                          >
                            <Mic className="w-4 h-4" />
                            <span className="hidden sm:inline">Voice</span>
                          </button>
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
                          {/* Voice Commands Panel */}
                          <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <Mic className="w-5 h-5 text-purple-500" />
                              Voice Commands
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">LIVE</span>
                            </h3>
                            
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
                                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Volume2 className="w-4 h-4 text-blue-500" />
                                      <span className="font-medium text-blue-800">Listening for commands...</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {voiceTranscript || 'Say: "Exercise complete" or "Meditation 75 percent"'}
                                    </p>
                                  </div>
                                )}
                                
                                <button
                                  onClick={() => setShowVoiceHelp(true)}
                                  className="w-full text-sm bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                                >
                                  📋 Voice Commands Help
                                </button>
                              </div>
                            ) : (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 text-sm">
                                  ⚠️ Voice recognition not supported in this browser. Try using Chrome, Edge, or Safari.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* AI Agent Panel */}
                          <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <Bot className="w-5 h-5 text-green-500" />
                              AI Coach
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">GEMINI</span>
                            </h3>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-center gap-4">
                                <button
                                  onClick={() => setShowAIChat(true)}
                                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  Chat with AI Coach
                                </button>
                              </div>
                              
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>-purple-200 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-800 mb-2">🎤 Voice Logging</h4>
                        <p className="text-sm text-purple-700 mb-3">Try the voice button on any habit!</p>
                        <div className="space-y-2 text-xs">
                          <div className="bg-white p-2 rounded border-l-2 border-purple-500">
                            <p className="font-medium mb-1">Demo commands:</p>
                            <p className="text-gray-600">Click the purple voice button to simulate voice logging</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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
                          <Heart className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">AI Coaching</h4>
                          <p className="text-xs text-gray-600">Personalized motivation based on your personality</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your AI-Powered Dashboard</h2>
              <p className="text-gray-600">Personalized insights and motivation</p>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-6">
              <h3 className="text-xl font-bold mb-4">🧠 AI Personal Coach</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Your Profile</h4>
                  <div className="text-sm space-y-1">
                    <p>Type: <span className="font-medium capitalize">{currentUser.aiProfile.personalityType}</span></p>
                    <p>Style: <span className="font-medium capitalize">{currentUser.aiProfile.motivationStyle}</span></p>
                    <p>Success Rate: <span className="font-medium">{Math.round(currentUser.behaviorData.completionRate * 100)}%</span></p>
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Smart Insight</h4>
                  <p className="text-sm">🎯 Focus on your Morning Meditation first - it sets the winning tone for your entire day!</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Life Coach Messages
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">AI POWERED</span>
              </h3>
              <div className="mb-4">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">💝 Deep Personal Connection</h4>
                  <p className="text-sm text-red-700 mb-3">AI creates meaningful messages connecting your habits to your bigger life goals.</p>
                  <button 
                    onClick={sendLifeCoachMessage}
                    className="bg-red-600 text-white text-xs px-3 py-1 rounded-full hover:bg-red-700"
                  >
                    💬 Get Life Coach Message
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Recent Messages
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="text-green-800">🎉 Amazing job completing Reading yesterday! That's 4 days in a row - you're building real momentum!</p>
                  <p className="text-xs text-green-600 mt-2">Yesterday, 8:15 PM</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-blue-800">🌅 Good morning, {currentUser.name}! Ready to build some amazing habits today?</p>
                  <p className="text-xs text-blue-600 mt-2">Today, 8:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'learn' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Learn & Grow</h2>
              <p className="text-gray-600">Insights, guides, and inspiration for your habit journey</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Why Small Habits Create Big Results</h3>
                <p className="text-purple-100 text-sm">Discover the science behind habit formation and transformation</p>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>Dreams without systems are just wishes.</strong> Every extraordinary achievement starts with small, consistent actions.
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 mb-2">🔧 The Compound Effect</h4>
                  <ul className="text-gray-700 space-y-1 mb-4">
                    <li><strong>1% Better Daily:</strong> Leads to 37x improvement in a year</li>
                    <li><strong>Identity Shift:</strong> You become the person who does the thing</li>
                    <li><strong>Momentum Building:</strong> Success breeds more success</li>
                  </ul>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                    <p className="text-blue-800 font-medium">💭 You don't rise to the level of your goals. You fall to the level of your systems.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile & Settings</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">✨ Premium AI Features Active</h3>
              <p className="text-sm opacity-90 mb-4">You're experiencing the full power of AI-driven habit building!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">🧠 AI Features Active:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>✅ Personality-based messaging</li>
                    <li>✅ Voice command simulation</li>
                    <li>✅ Percentage completion tracking</li>
                    <li>✅ Smart habit suggestions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📊 Your Stats:</h4>
                  <div className="space-y-1 text-sm">
                    <p>• {Math.round(currentUser.behaviorData.completionRate * 100)}% success rate</p>
                    <p>• {currentUser.aiProfile.personalityType} personality optimized</p>
                    <p>• {habits.length} active habits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SliderModal />
      <DeleteConfirmModal />

      {/* Voice Help Modal */}
      {showVoiceHelp && (
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
                  <li>• Works with ANY habit you add!</li>
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
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">GEMINI POWERED</span>
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
                    <div className="bg-green-50 rounded-lg p-2">"How's my streak going?"</div>
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
              
              {/* Auto-scroll anchor */}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-6 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiChatInput}
                  onChange={(e) => setAiChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                  placeholder="Message your AI coach... (e.g., 'I just finished a great workout!')"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={aiProcessing}
                  autoFocus
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
