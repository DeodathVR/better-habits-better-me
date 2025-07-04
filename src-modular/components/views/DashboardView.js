// components/views/DashboardView.js
import React from 'react';
import { TrendingUp, Flame, Target, Award, Plus, Bot, User } from 'lucide-react';
import { getWeeklyProgress } from '../../utils/habitCalculations';

const DashboardView = ({ habits }) => {
  const progress = getWeeklyProgress(habits);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center py-3 md:py-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-sm md:text-base text-gray-600">Your habit journey at a glance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 md:p-6 text-white">
          <div className="text-center md:flex md:items-center md:justify-between">
            <div>
              <p className="text-blue-100 text-xs md:text-sm">Today's Progress</p>
              <p className="text-2xl md:text-3xl font-bold">{progress.completionRate}%</p>
            </div>
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-blue-200 mx-auto mt-2 md:mt-0 md:mx-0" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 md:p-6 text-white">
          <div className="text-center md:flex md:items-center md:justify-between">
            <div>
              <p className="text-orange-100 text-xs md:text-sm">Total Streaks</p>
              <p className="text-2xl md:text-3xl font-bold">{progress.totalStreak}</p>
            </div>
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-orange-200 mx-auto mt-2 md:mt-0 md:mx-0" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 md:p-6 text-white">
          <div className="text-center md:flex md:items-center md:justify-between">
            <div>
              <p className="text-green-100 text-xs md:text-sm">Active Habits</p>
              <p className="text-2xl md:text-3xl font-bold">{habits.length}</p>
            </div>
            <Target className="w-6 h-6 md:w-8 md:h-8 text-green-200 mx-auto mt-2 md:mt-0 md:mx-0" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 md:p-6 text-white">
          <div className="text-center md:flex md:items-center md:justify-between">
            <div>
              <p className="text-purple-100 text-xs md:text-sm">Best Streak</p>
              <p className="text-2xl md:text-3xl font-bold">{Math.max(...habits.map(h => h.streak), 0)}</p>
            </div>
            <Award className="w-6 h-6 md:w-8 md:h-8 text-purple-200 mx-auto mt-2 md:mt-0 md:mx-0" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-4">Habit Progress Overview</h3>
        <div className="space-y-3 md:space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="border border-gray-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate flex-1">{habit.name}</h4>
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 ml-2">
                  <Flame className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                  <span className="text-xs md:text-sm font-medium text-orange-600">{habit.streak} days</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{habit.progress}/{habit.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 md:h-3 rounded-full transition-all duration-300"
                      style={{width: `${Math.min((habit.progress / habit.target) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>
                <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  habit.completedToday ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {habit.completedToday ? 'Done' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => alert('Navigate to habits view to add new habit')}
            className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            <span className="font-medium text-sm md:text-base">Add New Habit</span>
          </button>
          <button
            onClick={() => alert('Navigate to habits view to chat with AI')}
            className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Bot className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
            <span className="font-medium text-sm md:text-base">Chat with AI Coach</span>
          </button>
          <button
            onClick={() => alert('Navigate to profile view')}
            className="flex items-center gap-3 p-3 md:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <User className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
            <span className="font-medium text-sm md:text-base">View Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
