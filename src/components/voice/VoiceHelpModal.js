// components/voice/VoiceHelpModal.js
import React from 'react';
import { X } from 'lucide-react';

const VoiceHelpModal = ({ showModal, setShowModal }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4 p-4 pb-0">
          <h3 className="text-lg font-bold">Voice Commands Help</h3>
          <button onClick={() => setShowModal(false)}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        
        <div className="px-4 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">✅ Complete Commands:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "Exercise complete"</li>
              <li>• "Meditation done"</li>
              <li>• "Reading finished"</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📊 Percentage Commands:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "Exercise 75 percent"</li>
              <li>• "Meditation half done"</li>
              <li>• "Reading mostly complete"</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">🎯 Tips:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Speak clearly and at normal speed</li>
              <li>• Use simple phrases</li>
              <li>• Wait for the microphone to activate</li>
              <li>• Try different ways if not recognized</li>
            </ul>
          </div>
        </div>

        <div className="p-4 pt-6">
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceHelpModal;
