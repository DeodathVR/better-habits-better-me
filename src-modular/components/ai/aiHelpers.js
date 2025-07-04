// components/ai/aiHelpers.js
export const processWithAI = async (
  userMessage,
  habitsRef,
  setHabits,
  setAiChatHistory,
  setAiProcessing,
  showMessage,
  aiVoiceEnabled,
  GEMINI_API_KEY
) => {
  setAiProcessing(true);
  
  try {
    const prompt = `You are a habit tracking assistant. The user says: "${userMessage}"

Current habits:
${habitsRef.current.map(h => `- ${h.name}: ${h.description} (${h.streak} day streak)`).join('\n')}

RULES:
- Only suggest creating NEW habits if user explicitly asks to add/create a habit
- For logging existing habits, use "log_habit" action  
- For new habit creation, use "create_habit" action
- Be specific about what you're actually doing
- Don't claim you've done something you haven't
- Be encouraging and supportive

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
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiResult = JSON.parse(jsonMatch[0]);
      
      // Add to chat history
      setAiChatHistory(prev => [...prev, 
        { type: 'user', message: userMessage, timestamp: new Date() },
        { type: 'ai', message: aiResult.response, timestamp: new Date() }
      ]);
      
      // Speak response if enabled
      if ('speechSynthesis' in window && aiResult.speech_response && aiVoiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(aiResult.speech_response);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
      }
      
      // Handle habit logging
      if (aiResult.action === 'log_habit' && aiResult.habit_name && aiResult.percentage !== null) {
        const habit = habitsRef.current.find(h => 
          h.name.toLowerCase().includes(aiResult.habit_name.toLowerCase())
        );
        if (habit) {
          executeHabitUpdate(habit, aiResult.percentage, 'ai', setHabits, showMessage);
        }
      }
      
      // Handle new habit creation
      if (aiResult.action === 'create_habit' && aiResult.new_habit) {
        const newHabitData = aiResult.new_habit;
        
        if (validateAIHabitInput(newHabitData)) {
          const newHabit = {
            id: Date.now(),
            name: newHabitData.name.substring(0, 30),
            description: newHabitData.description.substring(0, 100),
            streak: 0,
            completedToday: false,
            completedDates: [],
            createdDate: new Date().toISOString().split('T')[0],
            lastCheckedDate: new Date().toISOString().split('T')[0],
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
