// components/habits/DeleteConfirmModal.js
import React from 'react';
import { X } from 'lucide-react';

const DeleteConfirmModal = ({ habit, showModal, setShowModal, habits, setHabits, showMessage }) => {
  
  const confirmDeleteHabit = () => {
    if (!habit) return;
    setHabits(prev => prev.filter(h => h.id !== habit.id));
    showMessage(`"${habit.name}" habit deleted`);
    setShowModal(false);
  };

  if (!showModal || !habit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4 p-4 pb-0">
          <h3 className="text-lg font-bold text-red-600">Delete Habit</h3>
          <button onClick={() => setShowModal(false)}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        
        <div className="px-4 mb-6">
          <p className="text-gray-700">Are you sure you want to delete "{habit.name}"?</p>
          <p className="text-sm text-gray-500 mt-2">This will remove all progress and cannot be undone.</p>
        </div>

        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteHabit}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
