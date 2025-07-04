// components/common/StatsCards.js
import React from 'react';
import { TrendingUp, Flame, Award } from 'lucide-react';

const StatsCards = ({ progress }) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 text-center">
        <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-green-500 mx-auto mb-1 md:mb-2" />
        <h3 className="font-bold text-lg md:text-2xl text-gray-800">{progress.completionRate}%</h3>
        <p className="text-xs md:text-sm text-gray-600">Today's Progress</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 text-center">
        <Flame className="w-5 h-5 md:w-8 md:h-8 text-orange-500 mx-auto mb-1 md:mb-2" />
        <h3 className="font-bold text-lg md:text-2xl text-gray-800">{progress.totalStreak}</h3>
        <p className="text-xs md:text-sm text-gray-600">Total Streaks</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 text-center">
        <Award className="w-5 h-5 md:w-8 md:h-8 text-purple-500 mx-auto mb-1 md:mb-2" />
        <h3 className="font-bold text-lg md:text-2xl text-gray-800">{progress.activeHabits}</h3>
        <p className="text-xs md:text-sm text-gray-600">Active Habits</p>
      </div>
    </div>
  );
};

export default StatsCards;
