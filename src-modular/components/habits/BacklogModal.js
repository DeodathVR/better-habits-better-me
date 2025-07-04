// components/habits/BacklogModal.js
import React from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';
import { getPastDates, formatDate, isDateCompleted } from '../../utils/dateHelpers';
import { calculateCurrentStreak } from '../../utils/habitCalculations';

const BacklogModal = ({ habit, habits, setHabits, showModal, setShowModal, showMessage }) => {
  
  const toggleBacklogDate = (habitId, date) => {
    const dateString = formatDate(date);
    
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const completedDates = h.completedDates || [];
        const isCurrentlyCompleted = completedDates.includes(dateString);
        let newCompletedDates;
        let newProgress = h.progress;
        
        if (isCurrentlyCompleted) {
          newCompletedDates = completedDates.filter(d => d !== dateString);
          newProgress = Math.max(newProgress - 1, 0);
          showMessage(`Removed ${h.name} completion for ${new Date(dateString).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}`);
        } else {
          newCompletedDates = [...completedDates, dateString].sort();
          newProgress = Math.min(newProgress + 1, h.target);
          showMessage(`Marked ${h.name} complete for ${new Date(dateString).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}!`);
        }
        
        // Recalculate streak after updating dates
        const newStreak = calculateCurrentStreak(newCompletedDates);
        
        return {
          ...h,
          completedDates: newCompletedDates,
          progress: newProgress,
          streak: newStreak
        };
      }
      return h;
    }));
  };

  if (!showModal || !habit) return null;

  // Get the current habit data from habits array
  const currentHabit = habits.find(h => h.id === habit.id) || habit;
  const pastDates = getPastDates(currentHabit);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4 p-4 pb-0">
          <h3 className="text-lg font-bold">Update Past Days</h3>
          <button onClick={() => setShowModal(false)}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        
        <div className="px-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">{currentHabit.name}</h4>
          <p className="text-sm text-gray-600 mb-4">
            Mark completion for missed days (created {new Date(currentHabit.createdDate).toLocaleDateString()})
          </p>
        </div>

        <div className="px-4 space-y-3">
          {pastDates.map(date => {
            const isCompleted = isDateCompleted(currentHabit, date);
            const dayName = date.toLocaleDateString('en', { weekday: 'long' });
            const dateString = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
            
            return (
              <div key={formatDate(date)} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
              }`}>
                <div>
                  <p className="font-medium text-gray-800">{dayName}</p>
                  <p className="text-sm text-gray-600">{dateString}</p>
                </div>
                <button
                  onClick={() => toggleBacklogDate(currentHabit.id, date)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 text-white hover:bg-green-600 scale-110'
                      : 'bg-gray-100 text-gray-400 hover:bg-green-500 hover:text-white hover:scale-105'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 pt-6 border-t mt-6">
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BacklogModal;
