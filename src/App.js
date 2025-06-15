import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState({
    name: "Alex",
    email: "alex@example.com",
    isPremium: true,
    preferences: {
      emailCoaching: true,
      phoneCoaching: false
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
      longestStreak: 21
    },
    emailHistory: [{
      id: 1,
      subject: "Your meditation streak is waiting for you, Alex",
      sent: new Date(),
      daysMissed: 2,
      content: "Hi Alex,\n\nI noticed you haven't checked in for 2 days. Your 21-day streak shows real dedication!\n\nYour AI Coach 🤖💪"
    }]
  });

  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Morning Meditation",
      streak: 5,
      completedToday: false,
      category: "mindfulness"
    },
    {
      id: 2,
      name: "Read 20 Minutes",
      streak: 3,
      completedToday: true,
      category: "learning"
    },
    {
      id: 3,
      name: "Exercise",
      streak: 8,
      completedToday: false,
      category: "fitness"
    }
  ]);

  const [currentView, setCurrentView] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

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
        }
      };
      
      if (type === 'streakCelebration' && personalizedMessages[type][data.streak]) {
        return personalizedMessages[type][data.streak];
      }
      
      return personalizedMessages[type]?.[0] || "Great job! 🎉";
    }
    
    return `Great job completing ${data.habitName}! Keep it up! 🎉`;
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
              <span className="font-bold text-xl text-gray-800">Better Habits</span>
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Better Habits</h1>
              <p className="text-gray-600">Building the engagement that keeps you consistent</p>
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
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Habits
              </h2>
              <div className="space-y-4">
                {habits.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className="flex-shrink-0"
                      >
                        {habit.completedToday ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 hover:text-green-500" />
                        )}
                      </button>
                      <div>
                        <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{habit.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-orange-500">{habit.streak}</span>
                    </div>
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
                      className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700"
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
                                <p className="text-xs text-gray-500">coach@betterhabits.ai</p>
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
              <p className="text-gray-600">AI-powered personalization & settings</p>
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
                    <li>✅ AI email coaching (2-day trigger)</li>
                    <li>✅ Predictive insights & recommendations</li>
                    <li>✅ Smart habit suggestions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📊 Your AI Stats:</h4>
                  <div className="space-y-1 text-sm">
                    <p>• {Math.round(currentUser.behaviorData.completionRate * 100)}% success rate</p>
                    <p>• Email coaching system active</p>
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
          <p className="text-sm">Building the engagement mechanism that keeps users consistent ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
