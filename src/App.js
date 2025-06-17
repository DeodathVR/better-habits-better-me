import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X } from 'lucide-react';

function App() {
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
    emailHistory: [{
      id: 1,
      subject: "Your meditation streak is waiting for you, Alex",
      sent: new Date(),
      daysMissed: 2,
      content: "Hi Alex,\n\nI noticed you haven't checked in for 2 days. Your 21-day streak shows real dedication!\n\nYour AI Coach 🤖💪"
    }],
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

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'Mindfulness'
  });

  const [currentView, setCurrentView] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

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

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.user && data.habits) {
          setCurrentUser(data.user);
          setHabits(data.habits);
          showMessage('📤 Data restored successfully!');
        } else {
          showMessage('❌ Invalid backup file format');
        }
      } catch (error) {
        showMessage('❌ Error reading backup file');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
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
            `${currentUser.name}, I know ${new Date().toLocaleDateString('en', {weekday: 'long'})}s can be tough for you, but remember: you've conquered that ${currentUser.behaviorData.longestStreak}-day streak before. That took real mental toughness.`,
            `Imagine yourself 90 days from now, ${currentUser.name}. You've built unshakeable habits, your focus is laser-sharp, and you're the person everyone turns to for consistency. Today's choice builds that future.`,
            `Remember how proud you felt when you ${currentUser.behaviorData.proudestMoment}? That feeling is waiting for you again. This isn't about perfection—it's about becoming who you're meant to be.`
          ],
          explorer: [
            `Your reading habit is like collecting treasures for your soul, ${currentUser.name}. Each page you turn opens new worlds and ideas that will inspire your next creative breakthrough.`,
            `${currentUser.name}, your journey isn't linear, and that's beautiful. Some days flow differently than others. What calls to your curious heart today?`,
            `Picture yourself 90 days from now—a person rich with new perspectives, someone who's explored countless new ideas. Every habit you build adds another dimension to who you're becoming.`,
            `Remember that spark you felt when you discovered something amazing in your reading? That magic is still there, waiting to be rekindled with just one small step today.`
          ],
          perfectionist: [
            `Your systematic approach to ${data.habitName || 'habits'} isn't just about completion—it's about crafting excellence in every area of your life. Quality over quantity, always.`,
            `${currentUser.name}, I see you typically struggle on ${currentUser.behaviorData.strugglingDays.join(' and ')}s. Your precision shows in recognizing patterns. Let's optimize: what's your highest-impact habit today?`,
            `Envision yourself 90 days from now: your systems are flawless, your execution is precise, and you've become the person who others look to for structure and excellence.`,
            `Your attention to detail is a superpower, ${currentUser.name}. Remember how satisfying it felt to maintain that perfect ${currentUser.behaviorData.longestStreak}-day streak? That precision is still in you.`
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

  const generateAICall = (daysMissed, userProfile) => {
    const { personalityType } = userProfile.aiProfile;
    const { lastCompletedHabit, longestStreak, strugglingDays, biggerGoals } = userProfile.behaviorData;
    
    const voiceStyle = {
      achiever: "energetic and confident",
      explorer: "warm and curious", 
      perfectionist: "calm and precise",
      socializer: "friendly and supportive"
    };

    const getTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "morning";
      if (hour < 17) return "afternoon";
      return "evening";
    };

    const callScripts = {
      achiever: `Hi ${userProfile.name}, this is your Better Habits AI coach calling. I noticed you haven't checked in for ${daysMissed} days, and I wanted to personally reach out because your ${lastCompletedHabit} journey matters to your goal of ${biggerGoals[0]}. 

I know ${strugglingDays.join(' and ')} can be challenging for you, but you've conquered ${longestStreak}-day streaks before - that shows real champion mindset! 

What if we started with just 2 minutes of ${lastCompletedHabit.toLowerCase()} today? I believe in your comeback story. You've got this, champion!`,

      explorer: `Hello ${userProfile.name}, this is your Better Habits AI coach reaching out with care. I've been thinking about your unique ${lastCompletedHabit} journey, and I miss seeing your daily discoveries.

Life has seasons, and maybe these ${daysMissed} days were your winter. But spring is here whenever you're ready to bloom again. Remember that beautiful ${longestStreak}-day streak you built? Each day was like adding a new color to your personal masterpiece.

What calls to your heart today? Maybe just a gentle 2-minute return to ${lastCompletedHabit.toLowerCase()}? The adventure continues when you're ready.`,

      perfectionist: `Good ${getTimeOfDay()}, ${userProfile.name}. This is your Better Habits AI coach with a precision update. Data analysis shows you've been inactive for ${daysMissed} days.

Based on your ${personalityType} profile and ${Math.round(userProfile.behaviorData.completionRate * 100)}% historical success rate, the optimal restart strategy is to begin with your highest-probability habit: ${lastCompletedHabit}.

Research indicates that users who restart within 24 hours of this call maintain 89% of their previous performance metrics. Your system is optimized for success - let's execute the restart protocol today.`
    };

    return {
      script: callScripts[personalityType] || callScripts.achiever,
      voiceStyle: voiceStyle[personalityType] || voiceStyle.achiever,
      duration: "45-60 seconds",
      scheduledTime: userProfile.preferences.optimalCallTime || "10:00 AM"
    };
  };

  const scheduleAICall = (daysMissed) => {
    if (!currentUser.preferences.phoneCoaching || !currentUser.isPremium) return;

    const callData = generateAICall(daysMissed, currentUser);
    const newCall = {
      id: Date.now(),
      type: "ai-coaching-call",
      script: callData.script,
      voiceStyle: callData.voiceStyle,
      duration: callData.duration,
      scheduledTime: callData.scheduledTime,
      scheduled: new Date(),
      daysMissed: daysMissed,
      status: "scheduled"
    };

    setCurrentUser(prev => ({
      ...prev,
      callHistory: [newCall, ...prev.callHistory]
    }));

    showMessage(`📞 AI Coach call scheduled for ${callData.scheduledTime}!`);
  };

  const sendAIEmail = () => {
    const newEmail = {
      id: Date.now(),
      subject: `Your ${currentUser.behaviorData.lastCompletedHabit.toLowerCase()} streak is waiting for you, ${currentUser.name}`,
      content: `Hi ${currentUser.name},\n\nI noticed you haven't checked in for 2 days. You've built a ${currentUser.behaviorData.longestStreak}-day streak before!\n\nYour AI Coach 🤖💪`,
      sent: new Date(),
      daysMissed: 2
    };

    setCurrentUser(prev => ({
      ...prev,
      emailHistory: [newEmail, ...prev.emailHistory]
    }));

    showMessage("📧 AI Coach email sent!");
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
        
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newStreak
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
              <span className="font-bold text-xl text-gray-800">Zenithal Life - Your Life at its Zenith</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('messages')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'messages' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Messages
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Zenithal Life</h1>
              <p className="text-gray-600">Transform your daily habits, transform your life.</p>
            </div>

            {currentUser.isPremium && (
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
            )}

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                🎯 WEEK WRAP-UP
              </h3>
              <div className="space-y-3">
                <p className="text-sm opacity-90">Time to celebrate your progress!</p>
                <div className="space-y-2">
                  <p>✅ Today's completion rate: {getWeeklyProgress().completionRate}%</p>
                  <p>✅ Total active streaks: {getWeeklyProgress().totalStreak} days</p>
                  <p>✅ Building {getWeeklyProgress().activeHabits} life-changing habits</p>
                </div>
                <p className="text-sm">Ready to level up next week? 🚀</p>
              </div>
            </div>

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

              {/* Add New Habit Modal */}
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
                    {/* Habit Header */}
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
                          {habit.missedDays > 0 && (
                            <span className="text-orange-600 text-sm">
                              {habit.missedDays} missed days
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
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

                    {/* Action Button */}
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
                          Completed Today!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Circle className="w-5 h-5" />
                          Mark Complete
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        )}

        {currentView === 'messages' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Motivation Feed</h2>
              <p className="text-gray-600">AI-powered personalized encouragement</p>
            </div>

            {currentUser.isPremium && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  AI Email Coach
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">PREMIUM</span>
                </h3>
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">🤖 Smart Email System Active</h4>
                    <p className="text-sm text-blue-700 mb-3">AI will send personalized re-engagement emails based on your personality type.</p>
                    <button 
                      onClick={sendAIEmail}
                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 mr-2"
                    >
                      📧 Preview AI Email (Demo)
                    </button>
                  </div>
                </div>
                
                {currentUser.emailHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recent AI Coach Emails</h4>
                    <div className="space-y-3">
                      {currentUser.emailHistory.map(email => (
                        <div key={email.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">AI</div>
                              <div>
                                <p className="font-medium text-gray-800">Your AI Coach</p>
                                <p className="text-xs text-gray-500">coach@zenithallife.com</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{email.sent.toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-2">📧 {email.subject}</h4>
                          <div className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                            {email.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentUser.isPremium && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-500" />
                  AI Phone Coach
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">WORLD FIRST</span>
                </h3>
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">📞 AI Voice Calling System</h4>
                    <p className="text-sm text-green-700 mb-3">After 4 days inactive, AI will call you with personalized voice coaching matching your personality.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                      <div><span className="font-medium">Voice Style:</span> Energetic & confident (Achiever)</div>
                      <div><span className="font-medium">Call Time:</span> {currentUser.preferences.optimalCallTime}</div>
                      <div><span className="font-medium">Duration:</span> 45-60 seconds</div>
                      <div><span className="font-medium">Last Active:</span> {Math.floor((new Date() - new Date(currentUser.lastActiveDate)) / (1000 * 60 * 60 * 24))} days ago</div>
                    </div>
                    <button 
                      onClick={() => scheduleAICall(4)}
                      className="bg-green-600 text-white text-xs px-3 py-1 rounded-full hover:bg-green-700"
                    >
                      📞 Preview AI Call (Demo)
                    </button>
                  </div>
                </div>
                
                {currentUser.callHistory && currentUser.callHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Scheduled AI Calls</h4>
                    <div className="space-y-3">
                      {currentUser.callHistory.map(call => (
                        <div key={call.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">📞</div>
                              <div>
                                <p className="font-medium text-gray-800">AI Voice Coach</p>
                                <p className="text-xs text-gray-500">Scheduled for {call.scheduledTime}</p>
                              </div>
                            </div>
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">{call.status}</span>
                          </div>
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-green-500">
                            <p className="font-medium mb-2">📜 Call Script Preview ({call.voiceStyle}):</p>
                            <p className="whitespace-pre-line">{call.script}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Duration: {call.duration} • After {call.daysMissed} days inactive</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Life Coach Messages
                {currentUser.isPremium && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">AI POWERED</span>}
              </h3>
              <div className="mb-4">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">💝 Deep Personal Connection</h4>
                  <p className="text-sm text-red-700 mb-3">AI creates meaningful messages connecting your habits to your bigger life goals and personal journey.</p>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={currentUser.phone}
                    onChange={(e) => setCurrentUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                AI Coaching Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Optimal Call Time</label>
                  <input
                    type="time"
                    value="10:00"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="text-sm text-gray-700">
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
                    <label className="text-sm text-gray-700">
                      📞 Enable AI phone coaching (after 4 days inactive) - WORLD FIRST!
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Data & Privacy
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 mb-2">🔒 Privacy Protected</p>
                  <p className="text-xs text-green-700">Your habit data is stored securely on your device and never leaves your computer</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Backup & Restore</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={exportData}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      📥 Export Data
                    </button>
                    <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                      📤 Import Data
                      <input
                        type="file"
                        accept=".json"
                        onChange={importData}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Export your data as a backup file or restore from a previous backup</p>
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
                    <li>✅ AI email coaching (2-day trigger)</li>
                    <li>✅ AI phone coaching (4-day trigger)</li>
                    <li>✅ Life coach-style messaging</li>
                    <li>✅ Predictive insights & recommendations</li>
                    <li>✅ Smart habit suggestions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📊 Your AI Stats:</h4>
                  <div className="space-y-1 text-sm">
                    <p>• {Math.round(currentUser.behaviorData.completionRate * 100)}% success rate</p>
                    <p>• Email coaching system active</p>
                    <p>• Phone coaching system active</p>
                    <p>• Life coaching system active</p>
                    <p>• {currentUser.aiProfile.personalityType} personality optimized</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setCurrentUser(prev => ({ ...prev, isPremium: false }))}
                className="mt-4 bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
              >
                Demo Free Version
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">Transform your daily habits, transform your life ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
