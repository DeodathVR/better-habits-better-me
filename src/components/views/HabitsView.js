// components/views/HabitsView.js
import React, { useState } from 'react';
import { Calendar, Plus, Bot, Mic } from 'lucide-react';
import HabitCard from '../habits/HabitCard';
import VoiceCommands from '../voice/VoiceCommands';
import AIChat from '../ai/AIChat';
import AddHabitModal from '../habits/AddHabitModal';
import BacklogModal from '../habits/BacklogModal';
import SliderModal from '../habits/SliderModal';
import DeleteConfirmModal from '../habits/DeleteConfirmModal';
import StatsCards from '../common/StatsCards';
import { getWeeklyProgress } from '../../utils/habitCalculations';

const HabitsView = ({ habits, setHabits, habitsRef, showMessage, GEMINI_API_KEY }) => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [selectedHabitForSlider, setSelectedHabitForSlider] = useState(null);
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [selectedHabitForBacklog, setSelectedHabitForBacklog] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  const openSliderModal = (habit) => {
    setSelectedHabitForSlider(habit);
    setShowSliderModal(true);
  };

  const openBacklogModal = (habit) => {
    setSelectedHabitForBacklog(habit);
    setShowBacklogModal(true);
  };

  const openDeleteConfirm = (habit) => {
    setHabitToDelete(habit);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center py-3 md:py-6">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">Life Habits Tracker</h1>
        <p className="text-sm md:text-lg text-gray-600">Transform your daily habits, transform your life.</p>
      </div>

      {/* Mobile Quick Actions */}
      <div className="flex gap-2 md:hidden">
        <button
          onClick={() => setShowAIChat(true)}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          <Bot className="w-4 h-4" />
          <span className="text-sm">AI Coach</span>
        </button>
        
        <VoiceCommands 
          habits={habits}
          habitsRef={habitsRef}
          setHabits={setHabits}
          showMessage={showMessage}
          isMobile={true}
        />
      </div>

      {/* Desktop Voice & AI Command Centers */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <VoiceCommands 
            habits={habits}
            habitsRef={habitsRef}
            setHabits={setHabits}
            showMessage={showMessage}
            isMobile={false}
          />
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-green-500" />
              AI Coach
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">GEMINI</span>
            </h3>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowAIChat(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                <Bot className="w-5 h-5" />
                Chat with AI Coach
              </button>
              
              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-sm mb-1">🧠 Smart & Natural</h4>
                <p className="text-xs text-gray-600">Understands context and gives helpful advice!</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-sm mb-1">💬 Try saying:</h4>
                <p className="text-xs text-gray-600">"I just finished a great workout!" or "How do I stay motivated?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Today's Habits
          </h2>
          <button
            onClick={() => setShowAddHabit(true)}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-colors"
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Add New</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              habits={habits}
              setHabits={setHabits}
              openSliderModal={openSliderModal}
              openBacklogModal={openBacklogModal}
              openDeleteConfirm={openDeleteConfirm}
              showMessage={showMessage}
            />
          ))}
        </div>

        <StatsCards progress={getWeeklyProgress(habits)} />
      </div>

      {/* Modals */}
      {showAIChat && (
        <AIChat 
          showAIChat={showAIChat}
          setShowAIChat={setShowAIChat}
          habits={habits}
          habitsRef={habitsRef}
          setHabits={setHabits}
          showMessage={showMessage}
          GEMINI_API_KEY={GEMINI_API_KEY}
        />
      )}

      {showAddHabit && (
        <AddHabitModal
          showAddHabit={showAddHabit}
          setShowAddHabit={setShowAddHabit}
          habits={habits}
          setHabits={setHabits}
          showMessage={showMessage}
        />
      )}

      {showSliderModal && selectedHabitForSlider && (
        <SliderModal
          habit={selectedHabitForSlider}
          showModal={showSliderModal}
          setShowModal={setShowSliderModal}
          habits={habits}
          setHabits={setHabits}
          showMessage={showMessage}
        />
      )}

      {showBacklogModal && selectedHabitForBacklog && (
        <BacklogModal
          habit={selectedHabitForBacklog}
          habits={habits}
          setHabits={setHabits}
          showModal={showBacklogModal}
          setShowModal={setShowBacklogModal}
          showMessage={showMessage}
        />
      )}

      {showDeleteConfirm && habitToDelete && (
        <DeleteConfirmModal
          habit={habitToDelete}
          showModal={showDeleteConfirm}
          setShowModal={setShowDeleteConfirm}
          habits={habits}
          setHabits={setHabits}
          showMessage={showMessage}
        />
      )}
    </div>
  );
};

export default HabitsView;
