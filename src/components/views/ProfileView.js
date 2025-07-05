// components/views/ProfileView.js
import React from 'react';
import { User, Clock, MessageCircle, Mail, Phone, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import { saveToLocalStorage } from '../../utils/localStorage';

const ProfileView = ({ currentUser, setCurrentUser, habits, showMessage }) => {
  
  const handleExportData = () => {
    const dataToExport = {
      habits: habits,
      user: currentUser,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habits-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage('📁 Data exported successfully!');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.habits && Array.isArray(importedData.habits)) {
            // Note: In real app, you'd update habits through parent component
            saveToLocalStorage('userHabits', importedData.habits);
          }
          if (importedData.user) {
            setCurrentUser(importedData.user);
            saveToLocalStorage('currentUser', importedData.user);
          }
          showMessage('📂 Data imported successfully!');
        } catch (error) {
          showMessage('❌ Import failed: Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center py-3 md:py-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Profile & Settings</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
          <User className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          Account Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={currentUser.name}
              onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={currentUser.email}
              onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={currentUser.phone}
              onChange={(e) => setCurrentUser(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
          AI Coaching Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Optimal Call Time</label>
            <input
              type="time"
              defaultValue="10:00"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentUser.preferences.emailCoaching}
                onChange={(e) => setCurrentUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, emailCoaching: e.target.checked }
                }))}
                className="rounded"
              />
              <label className="text-xs md:text-sm text-gray-700">
                📧 Enable AI email coaching (after 2 days inactive)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentUser.preferences.phoneCoaching}
                onChange={(e) => setCurrentUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, phoneCoaching: e.target.checked }
                }))}
                className="rounded"
              />
              <label className="text-xs md:text-sm text-gray-700">
                📞 Enable AI phone coaching (after 4 days inactive)
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
          🧪 Test Coaching System
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <button
            onClick={() => showMessage('📧 Email coaching test would be sent here')}
            className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            <span className="font-medium text-sm md:text-base">Test Email Coaching</span>
          </button>
          <button
            onClick={() => showMessage('📱 SMS coaching test would be sent here')}
            className="flex items-center gap-3 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
            <span className="font-medium text-sm md:text-base">Test SMS Coaching</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          📧 Email coaching triggers after 2 days inactive • 📱 SMS coaching triggers after 4 days inactive (Premium users)
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
          💾 Data Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <button
            onClick={handleExportData}
            className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            <span className="font-medium text-sm md:text-base">Export Data</span>
          </button>
          <label className="flex items-center gap-3 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
            <span className="font-medium text-sm md:text-base">Import Data</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportData}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          💾 Export your data as backup • 📂 Import from previous backup files
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 md:p-6 text-white">
        <h3 className="text-base md:text-lg font-bold mb-2">✨ Premium AI Features Active</h3>
        <p className="text-xs md:text-sm opacity-90 mb-4">You're experiencing the full power of AI-driven habit building!</p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h4 className="font-semibold mb-2 text-sm md:text-base">🧠 AI Features Active:</h4>
            <ul className="space-y-1 text-xs md:text-sm">
              <li>✅ Voice command recognition</li>
              <li>✅ AI conversation logging</li>
              <li>✅ Smart habit suggestions</li>
              <li>✅ Percentage completion tracking</li>
              <li>✅ Backlog update system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
