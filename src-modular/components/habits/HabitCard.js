// components/habits/HabitCard.js
import React from 'react';
import { CheckCircle2, Circle, Flame, Trash2, Calendar } from 'lucide-react';
import { calculateMissedDays, calculateCurrentStreak } from '../../utils/habitCalculations';
import { getMotivationalMessage } from '../../utils/motivationalMessages';

const HabitCard = ({ 
  habit, 
  habits,
  setHabits,
  openSliderModal, 
  openBacklogModal, 
  openDeleteConfirm,
  showMessage 
}) => {
  const toggleHabit = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newCompleted = !h.completedToday;
        let newCompletedDates = [...(h.completedDates || [])];
        let newStreak = h.streak;
        let newProgress = h.progress;
        
        if (newCompleted) {
          // Add today to completed dates if not already there
          if (!newCompletedDates.includes(today)) {
            newCompletedDates.push(today);
            newCompletedDates.sort();
          }
          
          // Calculate streak
          newStreak = calculateCurrentStreak(newCompletedDates);
          newProgress = Math.min(h.progress + 1, h.target);
          
          const message = getMotivationalMessage('habitCompleted', {
            habitName: h.name,
            streak: newStreak
          });
          showMessage(message);
          
          if ([7, 14, 21].includes(newStreak)) {
            setTimeout(() => {
              const streakMessage = getMotivationalMessage('streakCelebration', { 
                streak: newStreak 
              });
              showMessage(streakMessage);
            }, 2000);
          }
        } else {
          // Remove today from completed dates
          newCompletedDates = newCompletedDates.filter(date => date !== today);
          newStreak = calculateCurrentStreak(newCompletedDates);
          newProgress = Math.max(h.progress - 1, 0);
        }
        
        return {
          ...h,
          completedToday: newCompleted,
          completedDates: newCompletedDates,
          streak: newStreak,
          progress: newProgress,
          lastCheckedDate: today
        };
      }
      return h;
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
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
        
        {calculateMissedDays(habit) > 0 && (
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
  );
};

export default HabitCard;
