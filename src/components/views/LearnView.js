// components/views/LearnView.js
import React from 'react';
import { Target, Star } from 'lucide-react';

const LearnView = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center py-3 md:py-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Learn & Grow</h2>
        <p className="text-sm md:text-base text-gray-600">Insights, guides, and inspiration for your habit journey</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 md:p-6 text-white">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <Target className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">FEATURED</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Why a BIG Vision Needs Good Habits</h3>
            <p className="text-purple-100 text-xs md:text-sm">Discover how small daily actions build extraordinary achievements</p>
          </div>
          <div className="p-4 md:p-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                <strong>Dreams without systems are just wishes.</strong> Every extraordinary achievement starts with an extraordinary vision, but it's the boring, daily habits that actually make it happen.
              </p>
              
              <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">🎯 The Vision-Habit Connection</h4>
              <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base">
                Your big vision is the <em>destination</em>. Your habits are the <em>vehicle</em>. Without reliable daily systems, even the most inspiring goals remain out of reach.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 my-3 md:my-4">
                <p className="text-blue-800 font-medium text-sm md:text-base">💭 Remember: You don't rise to the level of your goals. You fall to the level of your systems.</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 flex-wrap">
                <span>📖 5 min read</span>
                <span>🎯 Goal Setting</span>
                <span>💪 Motivation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 md:p-6 text-white">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <Star className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-xs font-medium bg-white bg-opacity-20 px-2 py-1 rounded-full">HOW-TO</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">How to Use This App</h3>
            <p className="text-green-100 text-xs md:text-sm">Master every feature and become a habit-building pro</p>
          </div>
          <div className="p-4 md:p-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                Welcome to the most advanced habit tracker you'll ever use! Here's how to unlock every feature and build life-changing habits.
              </p>
              
              <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">🏁 Getting Started</h4>
              <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                <p className="text-gray-700 mb-2 text-sm md:text-base"><strong>Four Ways to Log Completion:</strong></p>
                <ul className="text-gray-700 space-y-1 text-sm md:text-base">
                  <li><strong>Complete Button:</strong> One-click for 100% completion</li>
                  <li><strong>% Slider:</strong> Set partial completion</li>
                  <li><strong>Voice Commands:</strong> "Exercise complete"</li>
                  <li><strong>AI Chat:</strong> "I just finished a workout!"</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-3 md:p-4 my-3 md:my-4">
                <p className="text-green-800 font-medium text-sm md:text-base">🎉 Success Tip: Consistency beats perfection. A 50% day is infinitely better than a 0% day!</p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 flex-wrap">
                <span>📖 7 min read</span>
                <span>🎓 Tutorial</span>
                <span>⚡ Quick Start</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 md:p-6 text-white text-center">
        <h3 className="text-lg md:text-xl font-bold mb-2">📚 More Content Coming Soon!</h3>
        <p className="text-orange-100 text-sm md:text-base">We're constantly adding new articles, guides, and videos to help you on your habit journey.</p>
        <div className="mt-3 md:mt-4 flex flex-wrap justify-center gap-2">
          <span className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">🧠 Habit Science</span>
          <span className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">💪 Success Stories</span>
          <span className="bg-white bg-opacity-20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">🎯 Advanced Strategies</span>
        </div>
      </div>
    </div>
  );
};

export default LearnView;
