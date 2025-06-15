// App.js - Complete Better Habits App with AI Follow-Up System
import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone } from 'lucide-react';

const BetterHabitsApp = () => {
  const [currentUser, setCurrentUser] = useState({
    name: "Alex",
    email: "alex@example.com",
    joinDate: new Date('2024-01-15'),
    isPremium: true,
    lastActiveDate: new Date('2025-06-13'), // 2 days ago for demo
    preferences: {
      morningReminder: '8:00 AM',
      eveningReminder: '8:00 PM',
      notifications: true,
      emailCoaching: true,
      phoneCoaching: false
    },
    aiProfile: {
      personalityType: "achiever", // achiever, explorer, socializer, perfectionist
      motivationStyle: "encouraging", // encouraging, challenging, analytical, celebratory
      riskLevel: "medium",
      preferredTiming: "morning",
      communicationFreq: "moderate", // minimal, moderate, frequent
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

  // AI-Powered Follow-Up Flow System
  const getMotivationalMessage = (type, data = {}) => {
    const { personalityType, motivationStyle } = currentUser.aiProfile;
    const { completionRate, bestTimeForHabits, weeklyAvg } = currentUser.behaviorData;

    // Premium AI-powered personalized messages
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

      // Select appropriate message based on personality and motivation style
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
      eveningReflection: [
        "How did today go? Every check-in counts! 🌟",
        "Time to reflect on today's wins! Even small progress matters 💫",
        "Quick check-in time! Your consistency journey is important 📱"
      ],
      streakCelebration: {
        1: "First step taken! 🎯 Every journey begins with day one!",
        3: "3 days strong! 💪 You're already building a pattern!",
        7: "ONE WEEK! 🔥 You officially have a habit in progress!",
        14: "TWO WEEKS! 🌟 This is where real change happens!",
        21: "21 DAYS! 🎊 Scientists say this is when habits start to stick!",
        30: "ONE MONTH! 👑 You're now officially a habit-building champion!"
      },
      missedDay: [
        "🌱 Just checking in! Noticed you missed yesterday - totally normal! Life happens, and that's perfectly okay. Ready for a fresh start today? ✨",
        "💙 No worries! Sometimes life gets busy - we've all been there! Remember: You're not starting over, you're just continuing your journey.",
        "🤗 Back in action! Consistency isn't perfection - it's showing up again! 💫"
      ]
    };

    if (type === 'streakCelebration' && basicMessages[type][data.streak]) {
      return basicMessages[type][data.streak];
    }

    const messageArray = basicMessages[type] || basicMessages.habitCompleted;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
  };

  // AI Email Generation System
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

Your AI Coach 🤖💪`,

        challenging: `${userProfile.name},

${daysMissed} days without progress. Let's be honest about what's happening here.

You've proven you can build a ${longestStreak}-day streak. You've shown ${Math.round(completionRate * 100)}% consistency in the past. But champions aren't made by past victories - they're made by how they respond to setbacks.

The question isn't whether you'll restart. It's whether you'll restart today or let another day slip by.

Your ${lastCompletedHabit} habit is waiting. Your goals aren't going to achieve themselves.

What's it going to be?

Your AI Coach 🤖🔥`
      },
      explorer: {
        encouraging: `Dear ${userProfile.name},

I've been thinking about your unique journey, and I miss seeing your daily discoveries.

Remember when you built that beautiful ${longestStreak}-day streak with ${lastCompletedHabit}? Each day was like adding a new color to your personal masterpiece.

Life has seasons, and maybe these ${daysMissed} days were your winter. But spring is here whenever you're ready to bloom again.

Your habit journey isn't about perfection - it's about exploration, growth, and becoming who you're meant to be.

What calls to your heart today? Maybe just 2 minutes of ${lastCompletedHabit.toLowerCase()}?

The adventure continues when you're ready.

Your AI Coach 🤖✨`
      },
      perfectionist: {
        analytical: `Hello ${userProfile.name},

Data analysis shows you've been inactive for ${daysMissed} days. Let me share what the numbers tell us:

• Previous success rate: ${Math.round(completionRate * 100)}%
• Longest streak achieved: ${longestStreak} days
• Last successful habit: ${lastCompletedHabit}
• Optimal restart strategy: Begin with highest-probability habit

Research indicates that users who restart within 48 hours of receiving this email maintain 89% of their previous success rate.

The most efficient path forward: Complete ${lastCompletedHabit.toLowerCase()} for 2 minutes today. This creates a new baseline for habit reconstruction.

Your system is optimized for success. Let's execute the restart protocol.

Your AI Coach 🤖📊`
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
          
          // Show completion message with AI personalization
          const message = getMotivationalMessage('habitCompleted', {
            habitName: habit.name,
            streak: newStreak
          });
          showMessage(message);
          
          // Check for streak milestones
          if ([1, 3, 7, 14, 21, 30].includes(newStreak)) {
            setTimeout(() => {
              const streakMessage = getMotivationalMessage('streakCelebration', { streak: newStreak });
              showMessage(streakMessage);
            }, 2000);
          }

          // Check if it's a struggling day and show AI support
          const currentDay = new Date().toLocaleDateString('en', {weekday: 'long'}).toLowerCase();
          if (currentUser.isPremium && currentUser.behaviorData.strugglingDays.includes(currentDay)) {
            setTimeout(() => {
              const strugglingMessage = getMotivationalMessage('strugglingDay', {});
              showMessage(strugglingMessage);
            }, 3000);
          }

          // Update last active date
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

  // Email Preview Component
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
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm animate-pulse">
          <p className="text-sm font-medium">{notificationMessage}</p>
        </div>
      )}
      
      {/* Navigation */}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Better Habits</h1>
              <p className="text-gray-600">Building the engagement that keeps you consistent</p>
            </div>

            {/* AI Insights Panel - Premium Feature */}
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

            {/* Weekly Reflection */}
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

            {/* Today's Habits */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Habits
              </h2>
              <div className="space-y-4">
