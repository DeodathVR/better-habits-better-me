// App.js
import React, { useState, useEffect, useRef } from 'react';
import { Star, Menu } from 'lucide-react';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/localStorage';
import { calculateCurrentStreak } from './utils/habitCalculations';
import HabitsView from './components/views/HabitsView';
import DashboardView from './components/views/DashboardView';
import LearnView from './components/views/LearnView';
import ProfileView from './components/views/ProfileView';
import Notification from './components/common/Notification';
import Navigation from './components/common/Navigation';
//import VoiceCommands from './components/voice/VoiceCommands';
import './App.css';

function App() {
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';

  const [currentUser, setCurrentUser] = useState(() => {
    return loadFromLocalStorage('currentUser', {
      name: "Alex",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
      isPremium: true,
      lastActiveDate: new Date().toISOString(),
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
      emailHistory: [],
      callHistory: []
    });
  });

  const [habits, setHabits] = useState(() => {
    const defaultHabits = [
      {
        id: 1,
        name: "Morning Meditation",
        description: "Start the day with mindfulness",
        streak: 0,
        completedToday: false,
        completedDates: [],
        createdDate: '2025-01-01',
        lastCheckedDate: new Date().toISOString().split('T')[0],
        category: "Mindfulness",
        progress: 0,
        target: 10
      },
      {
        id: 2,
        name: "Read 20 Minutes",
        description: "Expand knowledge through daily reading",
        streak: 0,
        completedToday: false,
        completedDates: [],
        createdDate: '2025-01-01',
        lastCheckedDate: new Date().toISOString().split('T')[0],
        category: "Learning",
        progress: 0,
        target: 10
      },
      {
        id: 3,
        name: "Exercise",
        description: "Move your body for at least 30 minutes",
        streak: 0,
        completedToday: false,
        completedDates: [],
        createdDate: '2025-01-01',
        lastCheckedDate: new Date().toISOString().split('T')[0],
        category: "Fitness",
        progress: 0,
        target: 10
      }
    ];

    const loadedHabits = loadFromLocalStorage('userHabits', defaultHabits);
    
    // Update streaks for all habits on load
    return loadedHabits.map(habit => ({
      ...habit,
      streak: calculateCurrentStreak(habit.completedDates || [])
    }));
  });

  // Voice Command Fix: Use ref to always have current habits
  const habitsRef = useRef(habits);
  useEffect(() => {
    habitsRef.current = habits;
  }, [habits]);

  // Update habits for new day
  useEffect(() => {
    const updateHabitsForNewDay = () => {
      const today = new Date().toISOString().split('T')[0];
      
      setHabits(prev => prev.map(habit => {
        const lastChecked = habit.lastCheckedDate || today;
        
        // If it's a new day, reset completedToday
        if (lastChecked !== today) {
          return {
            ...habit,
            completedToday: (habit.completedDates || []).includes(today),
            lastCheckedDate: today,
            voiceCompletion: undefined,
            aiCompletion: undefined,
            streak: calculateCurrentStreak(habit.completedDates || [])
          };
        }
        
        return habit;
      }));
    };
    
    updateHabitsForNewDay();
  }, []);

  const [currentView, setCurrentView] = useState('habits');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  const navItems = [
    { id: 'habits', label: 'Habits', icon: 'Home' },
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'learn', label: 'Learn', icon: 'BookOpen' },
    { id: 'profile', label: 'Profile', icon: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification 
        show={showNotification} 
        message={notificationMessage} 
      />
      
      <Navigation 
        currentView={currentView}
        setCurrentView={setCurrentView}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        navItems={navItems}
      />

      <main className="px-3 py-4 md:px-6 md:py-8 max-w-7xl mx-auto">
        {currentView === 'habits' && (
          <HabitsView 
            habits={habits}
            setHabits={setHabits}
            habitsRef={habitsRef}
            showMessage={showMessage}
            GEMINI_API_KEY={GEMINI_API_KEY}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView habits={habits} />
        )}

        {currentView === 'learn' && (
          <LearnView />
        )}

        {currentView === 'profile' && (
          <ProfileView 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            habits={habits}
            showMessage={showMessage}
          />
        )}
      </main>

      <div className="md:hidden h-16"></div>

      <footer className="bg-white border-t mt-8 md:mt-12 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 text-center text-gray-600">
          <p className="text-xs md:text-sm">Transform your daily habits, transform your life ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
