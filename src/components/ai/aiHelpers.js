// components/ai/aiHelpers.js
import VisionEnhancedAI from './VisionEnhancedAI';

// Initialize the enhanced AI system
let enhancedAI = null;

export const processWithAI = async (
  userMessage,
  habitsRef,
  setHabits,
  setAiChatHistory,
  setAiProcessing,
  showMessage,
  aiVoiceEnabled,
  GEMINI_API_KEY,
  currentUser = {}
) => {
  console.log('🚀 MAIN APP processWithAI START:', userMessage); // ADD THIS LINE
  console.log('📋 MAIN APP Parameters:', { userMessage, currentUser }); // ADD THIS LINE
  console.log('🚀 processWithAI START:', userMessage); // ADD THIS LINE
  setAiProcessing(true);
  
  try {
    // Initialize enhanced AI if not already done
    if (!enhancedAI) {
      enhancedAI = new VisionEnhancedAI(GEMINI_API_KEY);
    }

    console.log('🧠 VisionEnhancedAI initialized'); // ADD THIS LINE
    
    // Build context for enhanced AI
    const context = {
      habits: habitsRef.current || [],
      currentUser: currentUser,
      chatHistory: [] // You can pass existing chat history here if needed
    };

    console.log('📊 Context built, calling VisionEnhancedAI...'); // ADD THIS LINE
    
    // Use enhanced AI processing
    const aiResult = await enhancedAI.processWithAI(userMessage, context);

    console.log('✅ VisionEnhancedAI responded:', aiResult); // ADD THIS LINE
    
    // Add user message to chat history
    setAiChatHistory(prev => [...prev, 
      { type: 'user', message: userMessage, timestamp: new Date() }
    ]);
    
    // Add main AI response to chat history
    setAiChatHistory(prev => [...prev, {
      type: 'ai',
      message: aiResult.response,
      timestamp: new Date(),
      contentType: aiResult.content_type || 'conversation',
      metadata: aiResult.metadata
    }]);
    
    // Speak response if enabled
    if ('speechSynthesis' in window && aiResult.speech_response && aiVoiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(aiResult.speech_response);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
    
    // Handle enhanced actions
    await handleEnhancedActions(
      aiResult, 
      habitsRef, 
      setHabits, 
      setAiChatHistory, 
      showMessage
    );
    
    return aiResult;
    
  } catch (error) {
    console.error('Enhanced AI processing error:', error);
    
    // Fallback to basic response
    const fallbackResponse = getFallbackResponse(userMessage, habitsRef.current);
    
    setAiChatHistory(prev => [...prev, 
      { type: 'user', message: userMessage, timestamp: new Date() },
      { type: 'ai', message: fallbackResponse.response, timestamp: new Date() }
    ]);
    
    if (fallbackResponse.identity_highlight) {
      setTimeout(() => {
        setAiChatHistory(prev => [...prev, {
          type: 'identity',
          message: `✨ ${fallbackResponse.identity_highlight}`,
          timestamp: new Date()
        }]);
      }, 1000);
    }
    
  } finally {
    setAiProcessing(false);
  }
};

// Handle all the enhanced AI actions
const handleEnhancedActions = async (
  aiResult, 
  habitsRef, 
  setHabits, 
  setAiChatHistory, 
  showMessage
) => {
  // ADD THIS DEBUG LINE:
  console.log('🔍 handleEnhancedActions called with:', aiResult);
  
  const { action, habit_name, percentage, new_habit, identity_highlight, next_level_suggestion, vision_insight } = aiResult;
  
  // ADD THIS DEBUG LINE TOO:
  console.log('🔍 Extracted action:', action, 'habit_name:', habit_name);
  
  // Handle habit logging (existing functionality)
  if (action === 'log_habit' && habit_name && percentage !== null) {
    const habit = habitsRef.current.find(h => 
      h.name.toLowerCase().includes(habit_name.toLowerCase())
    );
    if (habit) {
      executeHabitUpdate(habit, percentage, 'ai', setHabits, showMessage);
    }
  }
  
  // Handle new habit creation (existing functionality)
  if (action === 'create_habit' && new_habit) {
    if (validateAIHabitInput(new_habit)) {
      const newHabit = {
        id: Date.now(),
        name: new_habit.name.substring(0, 30),
        description: new_habit.description.substring(0, 100),
        streak: 0,
        completedToday: false,
        completedDates: [],
        createdDate: new Date().toISOString().split('T')[0],
        lastCheckedDate: new Date().toISOString().split('T')[0],
        category: new_habit.category || 'Health',
        progress: 0,
        target: 10
      };
      
      setHabits(prev => [...prev, newHabit]);
      showMessage(`🤖 AI created: "${newHabit.name}"! ✨`);
      
      setTimeout(() => {
        setAiChatHistory(prev => [...prev, {
          type: 'ai',
          message: `✅ Perfect! I've added "${newHabit.name}" to your habits list. Start tracking it right away!`,
          timestamp: new Date()
        }]);
      }, 1000);
    }
  }
  
  // NEW: Handle habit deletion
if (action === 'delete_habit' && habit_name) {
  console.log('🗑️ Delete handler triggered for:', habit_name);
  const habitToDelete = habitsRef.current.find(h => 
    h.name.toLowerCase().includes(habit_name.toLowerCase())
  );
    
    if (habitToDelete) {
      setHabits(prev => prev.filter(h => h.id !== habitToDelete.id));
      showMessage(`🗑️ AI deleted: "${habitToDelete.name}"`);
      
      setTimeout(() => {
        setAiChatHistory(prev => [...prev, {
          type: 'ai',
          message: `✅ I've successfully deleted "${habitToDelete.name}" from your habits list.`,
          timestamp: new Date()
        }]);
      }, 1000);
    } else {
      setAiChatHistory(prev => [...prev, {
        type: 'error',
        message: `I couldn't find a habit called "${habit_name}" to delete. Could you check the name?`,
        timestamp: new Date()
      }]);
    }
  }
  
  // NEW: Handle vision discovery
  if (action === 'vision_discovery' && vision_insight) {
    showMessage(`💡 Vision insight: ${vision_insight}`);
    
    setTimeout(() => {
      setAiChatHistory(prev => [...prev, {
        type: 'vision',
        message: `🔮 Vision Discovery: ${vision_insight}`,
        timestamp: new Date()
      }]);
    }, 1500);
  }
  
  // NEW: Handle identity highlighting
  if (identity_highlight) {
    setTimeout(() => {
      setAiChatHistory(prev => [...prev, {
        type: 'identity',
        message: `✨ Identity Evidence: ${identity_highlight}`,
        timestamp: new Date()
      }]);
    }, 1000);
  }
  
  // NEW: Handle next level suggestions
  if (next_level_suggestion) {
    setTimeout(() => {
      setAiChatHistory(prev => [...prev, {
        type: 'challenge',
        message: `🚀 Next Level Challenge: ${next_level_suggestion}`,
        timestamp: new Date()
      }]);
    }, 2000);
  }
  
  // NEW: Handle confidence boosts
  if (aiResult.confidence_boost) {
    setTimeout(() => {
      setAiChatHistory(prev => [...prev, {
        type: 'confidence',
        message: `💪 Confidence Boost: ${aiResult.confidence_boost}`,
        timestamp: new Date()
      }]);
    }, 2500);
  }
};

// Fallback response for when enhanced AI fails
const getFallbackResponse = (userMessage, habits) => {
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  
  if (completedToday === totalHabits && totalHabits > 0) {
    return {
      response: "Wow! You've completed all your habits today. That's the mark of someone who follows through on commitments!",
      identity_highlight: "You're becoming someone who consistently shows up for themselves."
    };
  }
  
  if (completedToday > 0) {
    return {
      response: `Great work on completing ${completedToday} habits today! Every action is proof you're changing.`,
      identity_highlight: "You're developing the identity of someone who takes action."
    };
  }
  
  return {
    response: "Every day is a new opportunity to show up for yourself. What small step can you take right now?",
    identity_highlight: "You have the power to choose who you become, one habit at a time."
  };
};

// Existing validation function (unchanged)
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

// Existing habit update function (unchanged)
const executeHabitUpdate = (habit, percentage, source, setHabits, showMessage) => {
  setHabits(prev => {
    const updated = prev.map(h => {
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
        }
        
        return {
          ...h,
          completedToday: willBeCompleted,
          aiCompletion: percentage,
          streak: newStreak,
          progress: newProgress
        };
      }
      return h;
    });
    
    const updatedHabit = updated.find(h => h.id === habit.id);
    if (updatedHabit) {
      showMessage(`🤖 AI logged: ${updatedHabit.name} at ${percentage}%`);
    }
    
    return updated;
  });
};
