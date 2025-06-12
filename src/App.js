import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Calendar, Target, Flame, Trash2, Edit3, AlertCircle } from 'lucide-react';

function App() {
  const [habits, setHabits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMissedDaysModal, setShowMissedDaysModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'Health',
    targetCount: 1,
    color: '#3B82F6'
  });

  const categories = ['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Other'];
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDateDaysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const getMissedDays = (habit) => {
    const missedDays = [];
    for (let i = 1; i <= 3; i++) {
      const dateStr = getDateDaysAgo(i);
      const completed = habit.completions[dateStr] || 0;
      if (completed < habit.targetCount) {
        const date = new Date(dateStr);
        missedDays.push({
          date: dateStr,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
    }
    return missedDays;
  };

  const markMissedDay = (habitId, dateStr, completed = false) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        if (completed) {
          newCompletions[dateStr] = habit.targetCount;
        } else {
          newCompletions[dateStr] = 0; // Mark as "didn't do it"
        }
        
        return {
          ...habit,
          completions: newCompletions
        };
      }
      return habit;
    }));

    // Show success toast
    const message = completed ? 
      "✅ Day marked as completed!" : 
      "📝 Day marked as missed";
    
    setToast({ message, type: completed ? 'success' : 'info' });
    
    // Auto-hide toast after 2 seconds
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const saveUsername = (name) => {
    setUsername(name);
    setShowUsernameModal(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Initialize with sample habits and check for username
  useEffect(() => {
    // Check for stored username
    const storedUsername = localStorage.getItem('betterhabits-username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setShowUsernameModal(true);
    }

    if (habits.length === 0) {
      setHabits([
        {
          id: 1,
          name: 'Morning Meditation',
          description: 'Start the day with mindfulness',
          category: 'Mindfulness',
          targetCount: 1,
          color: '#8B5CF6',
          completions: {},
          streak: 3
        },
        {
          id: 2,
          name: 'Drink Water',
          description: 'Stay hydrated throughout the day',
          category: 'Health',
          targetCount: 8,
          color: '#06B6D4',
          completions: {},
          streak: 1
        },
        {
          id: 3,
          name: 'Daily Exercise',
          description: 'Move your body for at least 30 minutes',
          category: 'Fitness',
          targetCount: 1,
          color: '#10B981',
          completions: {},
          streak: 5
        }
      ]);
    }
  }, [habits.length]);

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit = {
        ...newHabit,
        id: Date.now(),
        completions: {},
        streak: 0
      };
      setHabits([...habits, habit]);
      setNewHabit({
        name: '',
        description: '',
        category: 'Health',
        targetCount: 1,
        color: '#3B82F6'
      });
      setShowAddForm(false);
    }
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleCompletion = (habitId, increment = true) => {
    const today = getTodayString();
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const currentCount = habit.completions[today] || 0;
        const newCount = increment 
          ? Math.min(currentCount + 1, habit.targetCount)
          : Math.max(currentCount - 1, 0);
        
        return {
          ...habit,
          completions: {
            ...habit.completions,
            [today]: newCount
          }
        };
      }
      return habit;
    }));
  };

  const getCompletionPercentage = (habit) => {
    const today = getTodayString();
    const completed = habit.completions[today] || 0;
    return Math.min((completed / habit.targetCount) * 100, 100);
  };

  const getTotalCompletedHabits = () => {
    const today = getTodayString();
    return habits.filter(habit => {
      const completed = habit.completions[today] || 0;
      return completed >= habit.targetCount;
    }).length;
  };

  // Missed Days Modal Component
  const MissedDaysModal = ({ habit, onClose }) => {
    const missedDays = getMissedDays(habit);
    
    if (missedDays.length === 0) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
              🎉 No Missed Days!
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Great job! You haven't missed any days for "{habit.name}" in the last 3 days.
            </p>
            <button
              onClick={onClose}
              style={{
                background: '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle style={{ height: '20px', width: '20px', color: '#f59e0b' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
              Missed Days for "{habit.name}"
            </h3>
          </div>
          
          <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>
            Mark what actually happened on these days:
          </p>

          <div style={{ marginBottom: '20px' }}>
            {missedDays.map(day => (
              <div key={day.date} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>{day.dayName}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{day.shortDate}</div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      markMissedDay(habit.id, day.date, true);
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = 'scale(0.95)';
                      e.target.style.background = '#059669';
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.background = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.background = '#10b981';
                    }}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    ✅ Did It
                  </button>
                  <button
                    onClick={() => {
                      markMissedDay(habit.id, day.date, false);
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = 'scale(0.95)';
                      e.target.style.background = '#dc2626';
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.background = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.background = '#ef4444';
                    }}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    ❌ Missed It
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                background: '#6b7280',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Username Setup Modal
  const UsernameModal = () => {
    const [tempName, setTempName] = useState('');
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', maxWidth: '400px', width: '90%' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937', textAlign: 'center' }}>
            Welcome! 👋
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '20px', textAlign: 'center' }}>
            What should we call you?
          </p>
          
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter your name..."
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '16px',
              textAlign: 'center'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && tempName.trim()) {
                saveUsername(tempName.trim());
              }
            }}
          />
          
          <button
            onClick={() => {
              if (tempName.trim()) {
                saveUsername(tempName.trim());
              }
            }}
            disabled={!tempName.trim()}
            style={{
              width: '100%',
              background: tempName.trim() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: tempName.trim() ? 'pointer' : 'not-allowed',
              fontSize: '16px'
            }}
          >
            Let's Start Building Better Habits! 🚀
          </button>
        </div>
      </div>
    );
  };

  // Toast Notification Component
  const Toast = ({ message, type, onClose }) => {
    if (!message) return null;

    const bgColor = type === 'success' ? '#10b981' : '#3b82f6';
    
    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: bgColor,
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '500',
          animation: 'slideIn 0.3s ease-out'
        }}
      >
        {message}
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            borderRadius: '4px',
            padding: '2px 6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)', padding: '24px' }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {username && (
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontSize: '18px', color: '#6b7280', margin: '0' }}>
                {getGreeting()}, <span style={{ color: '#3b82f6', fontWeight: '600' }}>{username}</span>! 
              </p>
            </div>
          )}
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            Better Habits Better Me
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '16px' }}>
            Transform your daily habits, transform your life
          </p>
          
          {/* Privacy Note */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: '#f0f9ff', 
            color: '#0369a1', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            fontSize: '14px',
            border: '1px solid #bae6fd'
          }}>
            <span style={{ fontSize: '16px' }}>🔒</span>
            Your habit data is stored securely on your device and never leaves your computer
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Calendar style={{ height: '32px', width: '32px', color: '#3b82f6', marginRight: '12px' }} />
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Today</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                  {getTotalCompletedHabits()}/{habits.length}
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Target style={{ height: '32px', width: '32px', color: '#10b981', marginRight: '12px' }} />
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Active Habits</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>{habits.length}</p>
              </div>
            </div>
          </div>
          
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Flame style={{ height: '32px', width: '32px', color: '#f97316', marginRight: '12px' }} />
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Best Streak</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                  {Math.max(...habits.map(h => h.streak), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Habit Button */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              background: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px'
            }}
          >
            <Plus style={{ height: '20px', width: '20px' }} />
            Add New Habit
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
              Create New Habit
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Habit Name
              </label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                placeholder="e.g., Read for 30 minutes"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Description
              </label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                placeholder="Describe your habit..."
                rows="2"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Category
                </label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Daily Target
                </label>
                <input
                  type="number"
                  min="1"
                  value={newHabit.targetCount}
                  onChange={(e) => setNewHabit({...newHabit, targetCount: parseInt(e.target.value) || 1})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                Color Theme
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewHabit({...newHabit, color})}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: newHabit.color === color ? '3px solid #374151' : '1px solid #d1d5db',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={addHabit}
                style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Create Habit
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Username Setup Modal */}
        {showUsernameModal && <UsernameModal />}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Missed Days Modal */}
        {showMissedDaysModal && (
          <MissedDaysModal
            habit={showMissedDaysModal}
            onClose={() => setShowMissedDaysModal(null)}
          />
        )}

        {/* Habits List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {habits.map(habit => {
            const today = getTodayString();
            const completed = habit.completions[today] || 0;
            const percentage = getCompletionPercentage(habit);
            const isFullyCompleted = completed >= habit.targetCount;
            const missedDays = getMissedDays(habit);

            return (
              <div
                key={habit.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>
                        {habit.name}
                      </h3>
                      <span 
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          borderRadius: '12px',
                          color: 'white',
                          backgroundColor: habit.color
                        }}
                      >
                        {habit.category}
                      </span>
                      {habit.streak > 0 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#fed7aa',
                          color: '#ea580c',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          <Flame style={{ height: '12px', width: '12px' }} />
                          {habit.streak} day streak
                        </div>
                      )}
                      {missedDays.length > 0 && (
                        <button
                          onClick={() => setShowMissedDaysModal(habit)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <AlertCircle style={{ height: '12px', width: '12px' }} />
                          {missedDays.length} missed day{missedDays.length > 1 ? 's' : ''}
                        </button>
                      )}
                    </div>
                    
                    {habit.description && (
                      <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 12px 0' }}>
                        {habit.description}
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    style={{
                      padding: '8px',
                      color: '#6b7280',
                      background: 'none',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 style={{ height: '16px', width: '16px' }} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    width: '100%',
                    height: '20px',
                    background: '#f3f4f6',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: habit.color,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Progress Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      Progress: {completed}/{habit.targetCount}
                    </span>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {Math.round(percentage)}% complete
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {completed > 0 && (
                      <button
                        onClick={() => toggleCompletion(habit.id, false)}
                        style={{
                          padding: '8px',
                          color: '#ef4444',
                          background: '#fef2f2',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        title="Remove completion"
                      >
                        <X style={{ height: '16px', width: '16px' }} />
                      </button>
                    )}
                    
                    {!isFullyCompleted && (
                      <button
                        onClick={() => toggleCompletion(habit.id, true)}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Check style={{ height: '16px', width: '16px' }} />
                        Mark Complete
                      </button>
                    )}
                    
                    {isFullyCompleted && (
                      <div style={{
                        background: '#d1fae5',
                        color: '#065f46',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <Check style={{ height: '16px', width: '16px' }} />
                        Completed Today!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {habits.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Target style={{ height: '64px', width: '64px', color: '#d1d5db', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b7280', marginBottom: '8px' }}>
              No habits yet
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
              Start building amazing habits that will transform your life!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
