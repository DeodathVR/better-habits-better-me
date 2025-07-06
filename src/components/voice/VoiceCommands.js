// components/voice/VoiceCommands.js
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { findHabitInSpeech, extractVoiceAction } from './voiceHelpers';
import VoiceHelpModal from './VoiceHelpModal';

const VoiceCommands = ({ habits, habitsRef, setHabits, showMessage, isMobile }) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setVoiceSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setVoiceTranscript('');
      };
        } else {
    setVoiceSupported(false);
  }
}, [showMessage]);

// ADD THIS NEW useEffect RIGHT HERE:
useEffect(() => {
  // Force habitsRef to update when habits prop changes
  if (habitsRef && habitsRef.current !== undefined) {
    habitsRef.current = habits;
  }
}, [habits, habitsRef]);

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        setVoiceTranscript(currentTranscript);
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          showMessage('Microphone access denied. Please allow microphone permissions.');
        } else {
          showMessage(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setVoiceSupported(false);
    }
  }, [showMessage]);

  const processVoiceCommand = (transcript) => {
    const text = transcript.toLowerCase().trim();
    // Use habitsRef.current to always get the latest habits
    const matchedHabit = findHabitInSpeech(text, habitsRef.current);
    
    const { percentage, action } = extractVoiceAction(text);
    
    if (matchedHabit) {
      executeHabitUpdate(matchedHabit, percentage, 'voice', action);
    } else {
      showMessage(`Couldn't identify a habit in: "${transcript}"`);
    }
  };

  const executeHabitUpdate = (habit, percentage, source, action = 'update') => {
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id === habit.id) {
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
          } else if (wasCompleted && willBeCompleted) {
            newStreak = h.streak;
            newProgress = h.progress;
          }
          
          return {
            ...h,
            completedToday: willBeCompleted,
            voiceCompletion: source === 'voice' ? percentage : undefined,
            aiCompletion: source === 'ai' ? percentage : undefined,
            streak: newStreak,
            progress: newProgress
          };
        }
        return h;
      });
      
      const updatedHabit = updated.find(h => h.id === habit.id);
      if (updatedHabit) {
        const actionMessages = {
          'remove': `${source.toUpperCase()} removed: ${updatedHabit.name}`,
          'complete': `${source.toUpperCase()} completed: ${updatedHabit.name}!`,
          'partial': `${source.toUpperCase()} logged: ${updatedHabit.name} at ${percentage}%`,
          'update': `${source.toUpperCase()} updated: ${updatedHabit.name} to ${percentage}%`
        };
        
        const successMessage = actionMessages[action] || `${source.toUpperCase()} logged: ${updatedHabit.name} at ${percentage}%`;
        showMessage(successMessage);
        
        if (source === 'voice' && 'speechSynthesis' in window) {
          const speechMessages = {
            'remove': `${updatedHabit.name} removed`,
            'complete': `${updatedHabit.name} completed`,
            'partial': `${updatedHabit.name} ${percentage} percent done`,
            'update': `${updatedHabit.name} updated to ${percentage} percent`
          };
          
          const speechText = speechMessages[action] || `${updatedHabit.name} logged at ${percentage} percent`;
          const utterance = new SpeechSynthesisUtterance(speechText);
          speechSynthesis.speak(utterance);
        }
      }
      
      return updated;
    });
  };

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        showMessage('Error starting voice recognition');
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (isMobile) {
    if (!voiceSupported) return null;
    
    return (
      <>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {isListening && (
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-blue-800 text-sm">Listening...</span>
            </div>
            <p className="text-xs text-gray-600">
              {voiceTranscript || 'Say: "Exercise complete" or "Reading 50 percent"'}
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-500" />
          Voice Command Center
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">LIVE</span>
        </h3>
        
        {voiceSupported ? (
          <div className="space-y-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? 'Stop Listening' : 'Start Voice Command'}
            </button>
            
            {isListening && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-blue-800">Listening...</span>
                </div>
                <p className="text-sm text-gray-600">
                  {voiceTranscript || 'Say: "Exercise complete" or "Meditation 75 percent"'}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowVoiceHelp(true)}
              className="w-full text-sm bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200"
            >
              📋 Voice Commands Help
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              ⚠️ Voice recognition not supported in this browser. Try Chrome, Edge, or Safari.
            </p>
          </div>
        )}
      </div>

      {showVoiceHelp && (
        <VoiceHelpModal 
          showModal={showVoiceHelp}
          setShowModal={setShowVoiceHelp}
        />
      )}
    </>
  );
};

export default VoiceCommands;
