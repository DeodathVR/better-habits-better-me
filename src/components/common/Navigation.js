// components/common/Navigation.js
import React from 'react';
import { Star, Menu, Home, BarChart3, BookOpen, Settings } from 'lucide-react';

const Navigation = ({ 
  currentView, 
  setCurrentView, 
  showMobileMenu, 
  setShowMobileMenu,
  navItems 
}) => {
  
  const iconMap = {
    'Home': Home,
    'BarChart3': BarChart3,
    'BookOpen': BookOpen,
    'Settings': Settings
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-lg text-gray-800 md:text-xl">My Habits</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === item.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navItems.map(item => {
                const Icon = iconMap[item.icon] || Home;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                      currentView === item.id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map(item => {
            const Icon = iconMap[item.icon] || Home;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 py-2 px-1 transition-colors ${
                  currentView === item.id ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;
