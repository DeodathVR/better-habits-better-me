import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail } from 'lucide-react';

const BetterHabitsApp = () => {
  const [currentUser, setCurrentUser] = useState({
    name: "Alex",
    email: "alex@example.com",
    joinDate: new Date('2024-01-15'),
    isPremium: true,
    lastActiveDate: new Date('2025-06-13'),
    preferences: {
      morningReminder: '8:00 AM',
      eveningReminder: '8:00 PM',
      notifications: true,
      emailCoaching: true,
      phoneCoaching: false
    },
    aiProfile: {
      personalityType: "achiever",
      motivationStyle: "encouraging",
      riskLevel: "medium",
      preferredTiming: "morning",
      communicationFreq: "moderate",
      stressLevel: "low",
      energyPattern: [7, 8, 9, 8, 6, 5, 4],
      successFactors: ["consistency", "small-steps", "visual-progress"]
    },
    behaviorData: {
      completionRate: 0.78,
      bestTimeForHabits: "morning",
      strugglingDays: ["monday", "friday"],
      mostMotivatingMessages: ["progress-focused", "streak-celebration"],
      responseToSetbacks: "resilient",
      engagementTrends: {
        weeklyAvg: 0.82,
        monthlyTrend: "improving",
        lastActiveStreak: 14
      },
      lastCompletedHabit: "Morning Meditation",
      longestStreak: 21,
      totalHabitsCompleted: 156
    },
    emailHistory: [
      {
        id: 1,
        type: "re-engagement",
        subject: "Your meditation streak is waiting for you, Alex",
        sent: new Date('2025-06-14'),
        opened: false,
        daysMissed: 2,
        content: "Hi Alex,\n\nI noticed you haven't checked in for 2 days, and I wanted to personally reach out because your habit journey matters to me.\n\nHere's what I know about you:\n• You've built a 21-day streak before (that took real dedication!)\n• Your Morning Meditation habit was your last win\n• You have a 78% success rate - that's champion-level consistency\n\nTwo days off doesn't erase all your progress.\n\nYour future self is counting on today's decision. What if we started with just 2 minutes of morning meditation?\n\nI believe in your comeback story.\n\nYour AI Coach 🤖💪"
      }
    ]
  });

  const [habits, setHabits] = useState([
    {
      id: 1,
      name: "Morning Meditation",
      goal: "daily",
      streak: 5,
      completedToday: false,
      completedDates: ['2025-06-09', '2025-06-10', '2025-06-11', '2025-06-12', '2025-06-13'],
      category: "mindfulness"
    },
    {
      id: 2,
      name: "Read 20 Minutes",
      goal: "daily",
      streak: 3,
      completedToday: true,
      completedDates: ['2025-06-11', '2025-06-12', '2025-06-13', '2025-06-14'],
      category: "learning"
    },
    {
      id: 3,
      name: "Exercise",
      goal: "daily",
      streak: 8,
      completedToday: false,
      completedDates: ['2025-06-06', '2025-06-07', '2025-06-08', '2025-06-09', '2025-06-10', '2025-06-11', '2025-06-12', '2025-06-13'],
      category: "fitness"
    }
  ]);

  const [currentView, setCurrentView] = useState('dashboard');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const getMotivationalMessage = (type, data = {}) => {
    const { personalityType, motivationStyle } = currentUser.aiProfile;
    const { completionRate, bestTimeForHabits, weeklyAvg } = currentUser.behaviorData;

    if (currentUser.isPremium) {
      const personalizedMessages = {
        habitCompleted: {
          achiever: {
            encouraging: [
              `Outstanding work, ${currentUser.name}! ✅ ${data.habitName} completed. You're ${Math.round(completionRate * 100)}% consistent this month - that's champion-level dedication!`,
              `Boom! 🎯 ${data.habitName} done! Day ${data.streak} in your streak. Your consistency is what separates achievers from dreamers!`,
              `Perfect execution! 🏆 ${data.habitName} completed. You're outperforming 85% of users with this ${data.streak}-day streak!`
            ],
            challenging: [
              `Nice! But let's push further - what if you doubled down tomorrow? ${data.habitName} streak: ${data.streak} days`,
              `Good work on ${data.habitName}! Now let's see if you can beat your personal best of ${Math.max(...habits.map(h => h.streak))} days`,
              `${data.habitName} ✅ Keep climbing! Top 10% of users maintain 30+ day streaks. You're at ${data.streak} - ready to join the elite?`
            ]
          },
          explorer: {
            encouraging: [
              `Amazing discovery today! ✨ Completing ${data.habitName} is shaping who you're becoming. Day ${data.streak} of your transformation!`,
              `Love this journey you're on! 🌱 ${data.habitName} completed. Every day you're discovering more about your potential.`,
              `Beautiful work, ${currentUser.name}! 🎨 ${data.habitName} is like adding another brushstroke to your masterpiece. ${data.streak} days strong!`
            ]
          },
          perfectionist: {
            analytical: [
              `Excellent execution! 📊 ${data.habitName} completed with ${((data.streak / (data.streak + 1)) * 100).toFixed(1)}% consistency rate over ${data.streak + 1} attempts.`,
              `Data shows you're ${completionRate > 0.8 ? 'excelling' : 'improving'}! ${data.habitName} ✅ Current success rate: ${Math.round(completionRate * 100)}%`,
              `Perfect! ${data.habitName} completion maintains your ${data.streak}-day streak. Your precision is paying off!`
            ]
          }
        },
        morningMotivation: {
          achiever: [
            `Rise and conquer, ${currentUser.name}! 🌅 Your ${bestTimeForHabits} energy is peak performance time. Let's dominate today!`,
            `Champion mindset activated! 💪 You've got ${habits.filter(h => !h.completedToday).length} habits ready to boost your winning streak!`,
            `Good morning, high achiever! 🎯 Your consistency score this week: ${Math.round(weeklyAvg * 100)}%. Ready to raise that bar?`
          ],
          explorer: [
            `What beautiful discoveries await today, ${currentUser.name}? 🌸 Your habit journey is unfolding perfectly at its own pace.`,
            `Morning, curious soul! 🔍 Each habit you build reveals something new about who you're becoming. Ready to explore?`,
            `The adventure continues! 🗺️ Your ${Math.max(...habits.map(h => h.streak))}-day streak shows you're not just building habits - you're crafting your story.`
          ],
          perfectionist: [
            `Good morning, ${currentUser.name}! 📊 Your optimized routine awaits. Today's success probability: ${Math.round(completionRate * 100)}%`,
            `Morning precision mode activated! 🎯 Your systematic approach has built ${habits.reduce((sum, h) => sum + h.streak, 0)} total streak days.`
          ]
        },
        strugglingDay: {
          achiever: [
            `Hey champion, I see ${new Date().toLocaleDateString('en', {weekday: 'long'})}s are typically tougher for you. Let's tackle just ONE habit today - which feels most doable? 🎯`,
            `Your data shows ${currentUser.behaviorData.strugglingDays.join(' and ')} need extra support. That's normal! Even top performers have pattern days. Start small today. 💪`
          ],
          explorer: [
            `${new Date().toLocaleDateString('en', {weekday: 'long'})}s feel different, don't they? 🌊 Let's surf this energy rather than fight it. What feels right today?`,
            `I notice patterns in your journey - some days flow differently. That's beautiful! What's one tiny step that feels aligned today? ✨`
          ],
          perfectionist: [
            `Analysis shows you typically struggle on ${currentUser.behaviorData.strugglingDays.join(' and ')}s. Let's optimize: focus on just your highest-impact habit today. Quality over quantity. 📊`,
            `Your completion rate dips ${Math.round((1 - completionRate) * 100)}% on challenging days. Strategic adjustment: pick your #1 priority habit. Execute with precision. 🎯`
          ]
        },
        aiInsights: [
          `🧠 AI Insight: Your energy peaks on mid-week days. Consider scheduling your hardest habit then!`,
          `📈 Pattern Recognition: You're ${currentUser.behaviorData.monthlyTrend} with a ${Math.round(weeklyAvg * 100)}% weekly average. Your consistency is your superpower!`,
          `🎯 Personalized Tip: Based on your ${personalityType} profile, try breaking your next habit into ${personalityType === 'perfectionist' ? 'precise micro-steps' : personalityType === 'achiever' ? 'measurable milestones' : 'creative experiments'}!`,
          `💡 Smart Suggestion: Your best habit completion happens during ${bestTimeForHabits} hours. Want me to adjust your other reminders to match this window?`
        ]
      };

      if (type === 'aiInsight') {
        return personalizedMessages.aiInsights[Math.floor(Math.random() * personalizedMessages.aiInsights.length)];
      }

      if (type === 'strugglingDay') {
        const userType = personalityType === 'achiever' ? 'achiever' : personalityType === 'explorer' ? 'explorer' : 'perfectionist';
        const messages = personalizedMessages.strugglingDay[userType] || personalizedMessages.strugglingDay.achiever;
        return messages[Math.floor(Math.random() * messages.length)];
      }

      const categoryMessages = personalizedMessages[type]?.[personalityType]?.[motivationStyle] || 
                              personalizedMessages[type]?.[personalityType] ||
                              personalizedMessages[type]?.achiever?.[motivationStyle] ||
                              personalizedMessages[type]?.achiever ||
                              personalizedMessages.habitCompleted.achiever.encouraging;
      
      if (Array.isArray(categoryMessages)) {
        return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
      }
    }

    // Free tier basic messages
    const basicMessages = {
      habitCompleted: [
        `Crushing it! ✅ ${data.habitName} completed. You're building real momentum!`,
        `Way to go! 🎉 That's ${data.streak} days in a row for ${data.habitName}. Keep the streak alive!`,
        `Love seeing this consistency! Your future self is thanking you right now 🙌`
      ],
      morningMotivation: [
        "Good morning! Ready to build some amazing habits today? 💪",
        "🌅 New day, new opportunities to grow! Let's make it count!",
        "Morning champion! Your habits are waiting for you ✨"
      ],
      streakCelebration: {
        1: "First step taken! 🎯 Every journey begins with day one!",
        3: "3 days strong! 💪 You're already building a pattern!",
        7: "ONE WEEK! 🔥 You officially have a habit in progress!",
        14: "TWO WEEKS! 🌟 This is where real change happens!",
        21: "21 DAYS! 🎊 Scientists say this is when habits start to stick!",
        30: "ONE MONTH! 👑 You're now officially a habit-building champion!"
      }
    };

    if (type === 'streakCelebration' && basicMessages[type][data.streak]) {
      return basicMessages[type][data.streak];
    }

    const messageArray = basicMessages[type] || basicMessages.habitCompleted;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
  };

  const generateAIEmail = (daysMissed, userProfile) => {
    const { personalityType, motivationStyle } = userProfile.aiProfile;
    const { lastCompletedHabit, longestStreak, completionRate } = userProfile.behaviorData;
    
    const subjectLines = {
      achiever: {
        encouraging: [
          `Your ${lastCompletedHabit.toLowerCase()} streak is waiting for you, ${userProfile.name}`,
          `${userProfile.name}, your goals aren't giving up on you - let's get back to winning`,
          `Time to reclaim your momentum, champion`
        ],
        challenging: [
          `${userProfile.name}, champions don't stay down for ${daysMissed} days`,
          `Your competition is still building habits. Are you?`,
          `${daysMissed} days off track. Time to prove your commitment.`
        ]
      },
      explorer: {
        encouraging: [
          `Missing your daily discovery ritual, ${userProfile.name}?`,
          `Your journey is calling you back, curious soul`,
          `The best adventures start with coming back to yourself`
        ]
      },
      perfectionist: {
        analytical: [
          `Let's get back to your optimized routine, ${userProfile.name}`,
          `Your ${Math.round(completionRate * 100)}% success rate is worth protecting`,
          `Data shows: the best time to restart is right now`
        ]
      }
    };

    const emailContent = {
      achiever: {
        encouraging: `Hi ${userProfile.name},

I noticed you haven't checked in for ${daysMissed} days, and I wanted to personally reach out because your habit journey matters to me.

Here's what I know about you:
• You've built a ${longestStreak}-day streak before (that took real dedication!)
• Your ${lastCompletedHabit} habit was your last win
• You have a ${Math.round(completionRate * 100)}% success rate - that's champion-level consistency

${daysMissed === 2 ? "Two days off doesn't erase all your progress." : "A few days off is just a pause, not a stop."} 

Your future self is counting on today's decision. What if we started with just 2 minutes of ${lastCompletedHabit.toLowerCase()}?

I believe in your comeback story.

Your AI Coach 🤖💪`
      }
    };

    const subjectArray = subjectLines[personalityType]?.[motivationStyle] || subjectLines.achiever.encouraging;
    const subject = subjectArray[Math.floor(Math.random() * subjectArray.length)];
    
    const content = emailContent[personalityType]?.[motivationStyle] || emailContent.achiever.encouraging;

    return { subject, content };
  };

  const sendAIEmail = (daysMissed) => {
    if (!currentUser.preferences.emailCoaching || !currentUser.isPremium) return;

    const email = generateAIEmail(daysMissed, currentUser);
    const newEmail = {
      id: Date.now(),
      type: "re-engagement",
      subject: email.subject,
      content: email.content,
      sent: new Date(),
      opened: false,
      daysMissed: daysMissed
    };

    setCurrentUser(prev => ({
      ...prev,
      emailHistory: [newEmail, ...prev.emailHistory]
    }));

    showMessage(`📧 AI Coach email sent: "${email.subject}"`);
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
        const today = new Date().toISOString().split('T')[0];
        
        let newStreak = habit.streak;
        let newCompletedDates = [...habit.completedDates];
        
        if (newCompleted) {
          if (!newCompletedDates.includes(today)) {
            newCompletedDates.push(today);
            newStreak = habit.streak + 1;
          }
          
          const message = getMotivationalMessage('habitCompleted', {
            habitName: habit.name,
            streak: newStreak
          });
          showMessage(message);
          
          if ([1, 3, 7, 14, 21, 30].includes(newStreak)) {
            setTimeout(() => {
              const streakMessage = getMotivationalMessage('streakCelebration', { streak: newStreak });
              showMessage(streakMessage);
            }, 2000);
          }

          const currentDay = new Date().toLocaleDateString('en', {weekday: 'long'}).toLowerCase();
          if (currentUser.isPremium && currentUser.behaviorData.strugglingDays.includes(currentDay)) {
            setTimeout(() => {
              const strugglingMessage = getMotivationalMessage('strugglingDay', {});
              showMessage(strugglingMessage);
            }, 3000);
          }

          setCurrentUser(prev => ({
            ...prev,
            lastActiveDate: new Date()
          }));
        } else {
          newCompletedDates = newCompletedDates.filter(date => date !== today);
          if (habit.completedToday) {
            newStreak = Math.max(0, habit.streak - 1);
          }
        }
        
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newStreak,
          completedDates: newCompletedDates
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

  const EmailPreview = ({ email }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            AI
          </div>
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
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>Sent after {email.daysMissed} days inactive</span>
        <span className={email.opened ? "text-green-600" : "text-orange-600"}>
          {email.opened ? "✅ Opened" : "📬 Unopened"}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm animate-pulse">
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
                  currentView === 'dashboard' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('messages')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'messages' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Messages
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'profile' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
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
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    🧠
                  </div>
                  AI Personal Coach
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Your Profile</h4>
                    <div className="text-sm space-y-1">
                      <p>Type: <span className="font-medium capitalize">{currentUser.aiProfile.personalityType}</span></p>
                      <p>Style: <span className="font-medium capitalize">{currentUser.aiProfile.motivationStyle}</span></p>
                      <p>Success Rate: <span className="font-medium">{Math.round(currentUser.behaviorData.completionRate * 100)}%</span></p>
                      <p>Best Time: <span className="font-medium capitalize">{currentUser.behaviorData.bestTimeForHabits}</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Smart Insight</h4>
                    <p className="text-sm">{getMotivationalMessage('aiInsight', {})}</p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-3">
                  <h4 className="font-semibold mb-2">💡 Today's AI Recommendation</h4>
                  <p className="text-sm">
                    {currentUser.aiProfile.personalityType === 'achiever' 
                      ? "Focus on your Morning Meditation first - it sets the winning tone for your entire day!"
                      : currentUser.aiProfile.personalityType === 'explorer'
                      ? "Try a walking meditation today - combine your habits creatively!"
                      : "Track the quality of your habits, not just completion. Precision matters!"
                    }
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                🎯 WEEK WRAP-UP 🎯
              </h3>
              <div className="space-y-3">
                <p className="text-sm opacity-90">Time to celebrate your progress!</p>
                <div className="space-y-2">
                  <p>✅ Today's completion rate: {getWeeklyProgress().completionRate}%</p>
                  <p>✅ Total active streaks: {getWeeklyProgress().totalStreak} days</p>
                  <p>✅ Building {getWeeklyProgress().activeHabits} life-changing habits</p>
                </div>
                <p className="text-sm mt-4 font-medium">What made you proudest this week?</p>
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
              <p className="text-gray-600">
                {currentUser.isPremium ? "AI-powered personalized encouragement" : "Personalized encouragement and insights"}
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white mb-6">
              <h3 className="text-xl font-bold mb-4">⚡ MIDWEEK MOMENTUM ⚡</h3>
              <p className="mb-4">You're halfway through the week!</p>
              <div className="space-y-2">
                <p className="font-semibold">Current streak status:</p>
                {habits.map(habit => (
                  <p key={habit.id} className="flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    {habit.name}: {habit.streak} days
                  </p>
                ))}
              </div>
              <p className="mt-4 font-medium">You've got this! What's working best so far?</p>
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
                    <p className="text-sm text-blue-700 mb-3">AI will send personalized re-engagement emails based on your personality type and behavior patterns.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium">Email after:</span> 2 days inactive
                      </div>
                      <div>
                        <span className="font-medium">Personality:</span> {currentUser.aiProfile.personalityType}
                      </div>
                      <div>
                        <span className="font-medium">Style:</span> {currentUser.aiProfile.motivationStyle}
                      </div>
                      <div>
                        <span className="font-medium">Last active:</span> {Math.floor((new Date() - new Date(currentUser.lastActiveDate)) / (1000 * 60 * 60 * 24))} days ago
                      </div>
                    </div>
                    <button 
                      onClick={() => sendAIEmail(2)}
                      className="mt-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700"
                    >
                      📧 Preview AI Email (Demo)
                    </button>
                  </div>
                </div>
                
                {currentUser.emailHistory && currentUser.emailHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recent AI Coach Emails</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {currentUser.emailHistory.slice(0, 3).map(email => (
                        <EmailPreview key={email.id} email={email} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                {currentUser.isPremium ? "AI-Personalized Messages" : "Recent Messages"}
                {currentUser.isPremium && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">PREMIUM</span>}
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="text-green-800">
                    {currentUser.isPremium 
                      ? `🎯 Perfect execution! Reading completed with 80% consistency rate over 4 attempts. Your precision is paying off, ${currentUser.name}!`
                      : "🎉 Amazing job completing Reading yesterday! That's 4 days in a row - you're building real momentum!"
                    }
                  </p>
                  <p className="text-xs text-green-600 mt-2">Yesterday, 8:15 PM</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-blue-800">
                    {currentUser.isPremium
                      ? getMotivationalMessage('morningMotivation', {})
                      : `🌅 Good morning, ${currentUser.name}! Ready to build some amazing habits today? Your consistency journey matters!`
                    }
                  </p>
                  <p className="text-xs text-blue-600 mt-2">Today, 8:00 AM</p>
                </div>
                {currentUser.isPremium && (
                  <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                    <p className="text-purple-800">
                      🧠 AI Insight: Your energy peaks on mid-week days. Consider scheduling your hardest habit then! Current success pattern shows 89% completion on Wednesdays.
                    </p>
                    <p className="text-xs text-purple-600 mt-2">AI Analysis • Confidence: 92%</p>
                  </div>
                )}
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <p className="text-orange-800">🔥 ONE WEEK! You officially have a habit in progress with Exercise! Scientists say this is when real change happens!</p>
                  <p className="text-xs text-orange-600 mt-2">3 days ago</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">💙 Gentle Accountability</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-800">
                  {currentUser.isPremium && currentUser.aiProfile.personalityType === 'achiever'
                    ? getMotivationalMessage('strugglingDay', {})
                    : "🌱 Just checking in! Remember: Progress > Perfection, always! Every small action is building your future self ✨"
                  }
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  {currentUser.isPremium ? "AI-personalized support" : "Personalized insight"}
                </p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile & Settings</h2>
              <p className="text-gray-600">
                {currentUser.isPremium ? "AI-powered personalization & settings" : "Customize your habit-building experience"}
              </p>
            </div>

            {currentUser.isPremium && (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  🧠 AI Personality Profile
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">PREMIUM</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Core Profile</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Personality Type</label>
                        <select 
                          value={currentUser.aiProfile.personalityType}
                          onChange={(e) => setCurrentUser(prev => ({
                            ...prev,
                            aiProfile: { ...prev.aiProfile, personalityType: e.target.value }
                          }))}
                          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md text-white"
                        >
                          <option value="achiever" className="text-gray-800">🏆 Achiever - Goal-driven & competitive</option>
                          <option value="explorer" className="text-gray-800">🌟 Explorer - Curious & creative</option>
                          <option value="socializer" className="text-gray-800">🤝 Socializer - Community-focused</option>
                          <option value="perfectionist" className="text-gray-800">🎯 Perfectionist - Detail-oriented</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Motivation Style</label>
                        <select 
                          value={currentUser.aiProfile.motivationStyle}
                          onChange={(e) => setCurrentUser(prev => ({
                            ...prev,
                            aiProfile: { ...prev.aiProfile, motivationStyle: e.target.value }
                          }))}
                          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md text-white"
                        >
                          <option value="encouraging" className="text-gray-800">💫 Encouraging & supportive</option>
                          <option value="challenging" className="text-gray-800">💪 Challenging & pushing</option>
                          <option value="analytical" className="text-gray-800">📊 Analytical & data-driven</option>
                          <option value="celebratory" className="text-gray-800">🎉 Celebratory & fun</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Behavioral Insights</h4>
                    <div className="space-y-3 text-sm">
                      <div className="bg-white bg-opacity-10 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span>Success Rate</span>
                          <span className="font-bold">{Math.round(currentUser.behaviorData.completionRate * 100)}%</span>
                        </div>
                        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                          <div 
                            className="bg-white h-2 rounded-full transition-all duration-300" 
                            style={{width: `${currentUser.behaviorData.completionRate * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-10 rounded-lg p-3">
                        <div className="mb-2">
                          <span className="font-medium">Peak Energy Time:</span>
                          <span className="ml-2 capitalize">{currentUser.behaviorData.bestTimeForHabits}</span>
                        </div>
                        <div className="mb-2">
                          <span className="font-medium">Challenge Days:</span>
                          <span className="ml-2 capitalize">{currentUser.behaviorData.strugglingDays.join(", ")}</span>
                        </div>
                        <div>
                          <span className="font-medium">Trend:</span>
                          <span className="ml-2 capitalize text-green-200">{currentUser.behaviorData.monthlyTrend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p className="text-gray-600">{currentUser.joinDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                Follow-Up Preferences
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Morning Reminder</label>
                  <input
                    type="time"
                    value="08:00"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Evening Check-in</label>
                  <input
                    type="time"
                    value="20:00"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentUser.preferences.notifications}
                      onChange={(e) => setCurrentUser(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, notifications: e.target.checked }
                      }))}
                      className="rounded"
                    />
                    <label className="text-sm text-gray-700">
                      Enable {currentUser.isPremium ? "AI-personalized" : "motivational"} notifications
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={currentUser.preferences.emailCoaching}
                      onChange={(e) => setCurrentUser(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, emailCoaching: e.target.checked }
                      }))}
                      className="rounded"
                      disabled={!currentUser.isPremium}
                    />
                    <label className="text-sm text-gray-700">
                      📧 Enable AI email coaching (re-engagement after 2 days) {!currentUser.isPremium && "(Premium only)"}
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
                      disabled={!currentUser.isPremium}
                    />
                    <label className="text-sm text-gray-700">
                      📞 Enable AI phone coaching (call after 4 days) {!currentUser.isPremium && "(Premium only)"}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-6 text-white ${
              currentUser.isPremium 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`}>
              <h3 className="text-lg font-bold mb-2">
                {currentUser.isPremium ? '✨ Premium AI Features Active' : '✨ Upgrade to Premium AI'}
              </h3>
              
              {currentUser.isPremium ? (
                <div>
                  <p className="text-sm opacity-90 mb-4">You're experiencing the full power of AI-driven habit building!</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">🧠 AI Features Active:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✅ Personality-based messaging</li>
                        <li>✅ AI email coaching (2-day trigger)</li>
                        <li>✅ AI phone coaching (4-day trigger)</li>
                        <li>✅ Predictive insights & recommendations</li>
                        <li>✅ Adaptive notification timing</li>
                        <li>✅ Pattern recognition & optimization</li>
                        <li>✅ Smart habit suggestions</li>
                        <li>✅ Behavioral analytics dashboard</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">📊 Your AI Stats:</h4>
                      <div className="space-y-1 text-sm">
                        <p>• {Math.round(currentUser.behaviorData.completionRate * 100)}% accuracy in predictions</p>
                        <p>• 7 behavior patterns identified</p>
                        <p>• Email coaching system active</p>
                        <p>• {currentUser.aiProfile.personalityType} personality optimized</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Manage Subscription
                    </button>
                    <button 
                      onClick={() => setCurrentUser(prev => ({ ...prev, isPremium: false }))}
                      className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors"
                    >
                      Demo Free Version
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm opacity-90 mb-4">Unlock AI-powered personalization for 10x better results!</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">🆓 Free Tier:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✅ Track up to 5 habits</li>
                        <li>✅ Basic motivational messages</li>
                        <li>✅ Simple streak tracking</li>
                        <li>✅ Weekly progress summaries</li>
                        <li>✅ Gentle accountability system</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">🚀 Premium AI:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>✨ AI personality profiling</li>
                        <li>✨ AI email coaching system</li>
                        <li>✨ AI phone coaching calls</li>
                        <li>✨ Predictive success insights</li>
                        <li>✨ Smart habit recommendations</li>
                        <li>✨ Adaptive messaging & timing</li>
                        <li>✨ Pattern recognition & optimization</li>
                        <li>✨ Unlimited habits & analytics</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCurrentUser(prev => ({ ...prev, isPremium: true }))}
                      className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Upgrade to Premium AI 🚀
                    </button>
                    <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-30 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              )}
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
};

export default BetterHabitsApp;
