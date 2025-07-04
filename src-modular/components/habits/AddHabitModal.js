// components/habits/AddHabitModal.js
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { saveToLocalStorage } from '../../utils/localStorage';

const AddHabitModal = ({ showAddHabit, setShowAddHabit, habits, setHabits, showMessage }) => {
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'Mindfulness'
  });

  const addNewHabit = () => {
    if (newHabit.name.trim() === '') {
      showMessage('Please enter a habit name');
      return;
    }
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      description: newHabit.description || `Build a consistent ${newHabit.name.toLowerCase()} routine`,
      streak: 0,
      completedToday: false,
      completedDates: [],
      createdDate: new Date().toISOString().split('T')[0],
      lastCheckedDate: new Date().toISOString().split('T')[0],
      category: newHabit.category,
      progress: 0,
      target: 10
    };
    
    setHabits(prev => {
      const newHabits = [...prev, habit];
      saveToLocalStorage('userHabits', newHabits);
      return newHabits;
    });
    
    setNewHabit({ name: '', description: '', category: 'Mindfulness' });
    setShowAddHabit(false);
    showMessage(`New habit "${habit.name}" added! 💾 Saved`);
  };

  if (!showAddHabit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4 p-4 pb-0">
          <h3 className="text-lg font-bold">Add New Habit</h3>
          <button onClick={() => setShowAddHabit(false)}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="px-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Morning Yoga"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
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
        </div>
        <div className="flex gap-3 p-4 pt-6">
          <button
            onClick={addNewHabit}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Add Habit
          </button>
          <button
            onClick={() => setShowAddHabit(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;
