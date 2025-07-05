// components/habits/SliderModal.js
import React, { useState } from 'react';
import { X } from 'lucide-react';

const SliderModal = ({ habit, showModal, setShowModal, habits, setHabits, showMessage }) => {
  const [sliderValue, setSliderValue] = useState(100);

  const confirmSliderCompletion = () => {
    if (!habit) return;
    
    executeHabitUpdate(habit, sliderValue);
    setShowModal(false);
  };

  const executeHabitUpdate = (habitToUpdate, percentage) => {
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id === habitToUpdate.id) {
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
            manualCompletion: percentage,
            streak: newStreak,
            progress: newProgress
          };
        }
        return h;
      });
      
      const updatedHabit = updated.find(h => h.id === habitToUpdate.id);
      if (updatedHabit) {
        showMessage(`${updatedHabit.name} updated to ${percentage}%`);
      }
      
      return updated;
    });
  };

  if (!showModal || !habit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4 p-4 pb-0">
          <h3 className="text-lg font-bold">Set Completion Level</h3>
          <button onClick={() => setShowModal(false)}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        
        <div className="px-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">{habit.name}</h4>
          <p className="text-sm text-gray-600 mb-4">How much did you accomplish today?</p>
          
          <div className="text-center mb-6">
            <div className="text-5xl md:text-6xl font-bold text-blue-500 mb-2">
              {sliderValue}%
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${sliderValue}%, #E5E7EB ${sliderValue}%, #E5E7EB 100%)`
              }}
            />
            
            <div className="flex justify-between mt-3 gap-2">
              {[0, 25, 50, 75, 100].map(percentage => (
                <button
                  key={percentage}
                  onClick={() => setSliderValue(percentage)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sliderValue === percentage 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {percentage}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmSliderCompletion}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default SliderModal;
