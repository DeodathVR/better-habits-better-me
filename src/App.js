// Modal Components
  const VoiceHelpModal = () => {
    if (!showVoiceHelp) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">🎤 Voice Commands Help</h3>
            <button onClick={() => setShowVoiceHelp(false)}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="space-y-4">
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
                <li>• Works with ANY habit you add!</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowVoiceHelp(false)}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  };

  const AIChatModal = () => {
    if (!showAIChat) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-2xl mx-4 h-[600px] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              AI Habit Coach
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">GEMINI POWERED</span>
            </h3>
            <button onClick={() => setShowAIChat(false)}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {aiChatHistory.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <Bot className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                <p className="font-medium">Chat with your AI habit coach!</p>
                <p className="text-sm mt-2">Try saying things like:</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="bg-purple-50 rounded-lg p-2">"I just finished an amazing workout!"</div>
                  <div className="bg-purple-50 rounded-lg p-2">"Had a good meditation session"</div>
                  <div className="bg-purple-50 rounded-lg p-2">"How's my streak going?"</div>
                </div>
              </div>
            )}
            
            {aiChatHistory.map((chat, index) => (
              <div key={index} className={`flex gap-3 ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {chat.type !== 'user' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    chat.type === 'error' ? 'bg-red-100' : 'bg-purple-100'
                  }`}>
                    <Bot className={`w-4 h-4 ${chat.type === 'error' ? 'text-red-500' : 'text-purple-500'}`} />
                  </div>
                )}
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  chat.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : chat.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm">{chat.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {chat.action && (
                    <div className="mt-2 text-xs bg-black bg-opacity-10 rounded p-2">
                      <p>Action: {chat.action.action}</p>
                      {chat.action.habit_name && <p>Habit: {chat.action.habit_name}</p>}
                      {chat.action.percentage && <p>Progress: {chat.action.percentage}%</p>}
                    </div>
                  )}
                </div>
                {chat.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-500" />
                  </div>
                )}
              </div>
            ))}
            
            {aiProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-purple-500" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Auto-scroll anchor */}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-6 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAIMessage()}
                placeholder="Message your AI coach... (e.g., 'I just finished a great workout!')"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={aiProcessing}
                autoFocus
              />
              <button
                onClick={sendAIMessage}
                disabled={aiProcessing || !aiChatInput.trim()}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BacklogModal = () => {
    if (!showBacklogModal || !selectedHabitForBacklog) return null;

    const pastDates = getPastDates(3);
    const currentHabit = habits.find(h => h.id === selectedHabitForBacklog.id) || selectedHabitForBacklog;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Update Past Days</h3>
            <button onClick={closeBacklogModal}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">{currentHabit.name}</h4>
            <p className="text-sm text-gray-600 mb-4">Mark completion for up to 3 past days</p>
          </div>

          <div className="space-y-3">
            {pastDates.map(date => {
              const isCompleted = isDateCompleted(currentHabit, date);
              const dayName = date.toLocaleDateString('en', { weekday: 'long' });
              const dateString = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
              
              return (
                <div key={formatDate(date)} className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}>
                  <div>
                    <p className="font-medium text-gray-800">{dayName}</p>
                    <p className="text-sm text-gray-600">{dateString}</p>
                  </div>
                  <button
                    onClick={() => toggleBacklogDate(currentHabit.id, date)}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isCompleted
                        ? 'bg-green-500 text-white hover:bg-green-600 scale-110'
                        : 'bg-gray-100 text-gray-400 hover:bg-green-500 hover:text-white hover:scale-105'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4 mt-6 border-t">
            <button
              onClick={closeBacklogModal}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SliderModal = () => {
    if (!showSliderModal || !selectedHabitForSlider) return null;

    const getSliderColor = (value) => {
      if (value >= 80) return 'from-green-400 to-green-600';
      if (value >= 60) return 'from-yellow-400 to-yellow-600';
      if (value >= 40) return 'from-orange-400 to-orange-600';
      return 'from-red-400 to-red-600';
    };

    const getEncouragementText = (value) => {
      if (value === 100) return "Perfect! 🎉 Full completion!";
      if (value >= 80) return "Excellent! 💪 Almost there!";
      if (value >= 60) return "Great progress! 👍 Keep it up!";
      if (value >= 40) return "Good effort! 💪 Every step counts!";
      if (value >= 20) return "Nice start! 🌱 Progress is progress!";
      return "Every little bit helps! 🌟";
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Set Completion Level</h3>
            <button onClick={closeSliderModal}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">{selectedHabitForSlider.name}</h4>
            <p className="text-sm text-gray-600 mb-4">How much did you accomplish today?</p>
            
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold bg-gradient-to-r ${getSliderColor(sliderValue)} bg-clip-text text-transparent mb-2`}>
                {sliderValue}%
              </div>
              <p className="text-sm text-gray-600">{getEncouragementText(sliderValue)}</p>
            </div>

            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={sliderValue}
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`
                }}
              />
              
              <div className="flex justify-between mt-3 gap-2">
                {[25, 50, 75, 100].map(percentage => (
                  <button
                    key={percentage}
                    onClick={() => setSliderValue(percentage)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      sliderValue === percentage 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Will count as:</span>
                <span className={`font-medium ${sliderValue >= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                  {sliderValue >= 50 ? '✅ Completed day' : '⚠️ Partial progress'}
                </span>
              </div>
              {sliderValue >= 50 && (
                <p className="text-xs text-green-600 mt-1">This will continue your streak!</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeSliderModal}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmSliderCompletion}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors text-white ${
                sliderValue >= 50 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {sliderValue >= 50 ? 'Complete!' : 'Log Progress'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm || !habitToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-red-600">Delete Habit</h3>
            <button onClick={closeDeleteConfirm}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{habitToDelete.name}</h4>
                <p className="text-sm text-gray-600">Are you sure you want to delete this habit?</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-medium text-red-800 mb-2">This will permanently remove:</h5>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• {habitToDelete.streak} day streak</li>
                <li>• All completion history</li>
                <li>• Progress data ({habitToDelete.progress}/{habitToDelete.target})</li>
              </ul>
              <p className="text-xs text-red-600 mt-3">This action cannot be undone, but you can always create the habit again.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeDeleteConfirm}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteHabit}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Delete Habit
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm">
          <p className="text-sm font-medium">{notificationMessage}</p>
        </div>
      )}
      
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-xl text-gray-800">My Awesome Life Habits</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentView('habits')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'habits' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Awesome Life Habits Tracker
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('learn')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'learn' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Learn
              </button>
              <button
                onClick={() => setCurrentView('profile')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'habits' && (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">🎤🤖 The Ultimate Habit Tracker!</h1>
              <p className="text-lg text-gray-600 mb-4">Choose your superpower: Lightning-fast voice commands OR intelligent AI conversations!</p>
              
              {/* Epic Journey Badge */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <h2 className="text-lg font-semibold text-yellow-800 mb-2">🏆 Today's Epic Journey: From Google's Lies to AI Truth!</h2>
                  <div className="flex flex-wrap justify-center gap-2 text-sm">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">🎭 Google's Oscar Performance</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">🦗 Cricket Sounds Era</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">🎤 Accidental Voice Hero</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">🤖 Gemini's Redemption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Panel with Both Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Voice Control Panel (The Undefeated Champion!) */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                    <Mic className="w-5 h-5" />
                    🏆 Voice Commands (Undefeated Champion!)
                  </h2>
                  <button
                    onClick={() => setShowVoiceHelp(true)}
                    className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    📋 Help
                  </button>
                </div>
                
                {voiceSupported ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={isListening ? stopListening : startListening}
                        disabled={!voiceSupported}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          isListening 
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                        }`}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-5 h-5" />
                            Stop Listening
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5" />
                            Quick Voice Command
                          </>
                        )}
                      </button>
                    </div>
                    
                    {isListening && (
                      <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-blue-500" />
                          <span className="font-medium text-blue-800">Listening for commands...</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {voiceTranscript || 'Say: "Exercise complete" or "Meditation 75 percent"'}
                        </p>
                      </div>
                    )}
                    
                    {!isListening && (
                      <div className="grid grid-cols-1 gap-2">
                        <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                          <h3 className="font-semibold text-sm mb-1">⚡ Lightning Fast & Reliable</h3>
                          <p className="text-xs text-gray-600">Works with ANY habit you add automatically!</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ Voice recognition not supported in this browser. Try using Chrome, Edge, or Safari.
                    </p>
                  </div>
                )}
              </div>

              {/* AI Chat Panel (Gemini's Redemption Story) */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-purple-800 flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    🎭➡️🤖 AI Coach (Redeemed!)
                  </h2>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">GEMINI POWERED</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setShowAIChat(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat with AI Coach
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-white p-3 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-sm mb-1">🧠 Smart & Natural</h3>
                      <p className="text-xs text-gray-600">Understands typos, context, and gives helpful advice!</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border-l-4 border-pink-500">
                      <h3 className="font-semibold text-sm mb-1">💬 Try saying:</h3>
                      <p className="text-xs text-gray-600">"I just crushed my workout!" or "How do I meditate better?"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Today's Habits
                </h2>
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add New Habit
                </button>
              </div>

              {/* Add New Habit Modal */}
              {showAddHabit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Add New Habit</h3>
                      <button onClick={() => setShowAddHabit(false)}>
                        <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Habit Name</label>
                        <input
                          type="text"
                          value={newHabit.name}
                          onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Morning Yoga"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={addNewHabit}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                        >
                          Add Habit
                        </button>
                        <button
                          onClick={() => setShowAddHabit(false)}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {habits.map(habit => (
                  <div
                    key={habit.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                  >
                    {/* Habit Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-800">{habit.name}</h3>
                          <button
                            onClick={() => openDeleteConfirm(habit)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete habit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            {habit.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold text-orange-600">{habit.streak} day streak</span>
                          </div>
                          {habit.missedDays > 0 && (
                            <span className="text-orange-600 text-sm">
                              {habit.missedDays} missed days
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress: {habit.progress}/{habit.target}</span>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round((habit.progress / habit.target) * 100)}% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{width: `${(habit.progress / habit.target) * 100}%`}}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                          habit.completedToday
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-100 hover:bg-green-500 hover:text-white text-gray-700'
                        }`}
                      >
                        {habit.completedToday ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            {habit.voiceCompletion && `🎤 Voice: ${habit.voiceCompletion}%`}
                            {habit.aiCompletion && `🤖 AI: ${habit.aiCompletion}%`}
                            {!habit.voiceCompletion && !habit.aiCompletion && 'Completed!'}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Circle className="w-5 h-5" />
                            Complete
                          </span>
                        )}
                      </button>
                      
                      {/* Partial Completion Slider Button */}
                      <button
                        onClick={() => openSliderModal(habit)}
                        className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                        title="Set partial completion"
                      >
                        <div className="w-4 h-4 bg-blue-500 rounded-full relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <span className="hidden sm:inline">%</span>
                      </button>
                      
                      {/* Update Past Days Button */}
                      <button
                        onClick={() => openBacklogModal(habit)}
                        className="px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                        title="Update past 3 days"
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">Past</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-bold text-2xl text-gray-800">{getWeeklyProgress().completionRate}%</h3>
                <p className="text-gray-600">Today's Progress</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-bold text-2xl text-gray-800">{getWeeklyProgress().totalStreak}</h3>
                <p className="text-gray-600">Total Streak Days</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-bold text-2xl text-gray-800">{habits.length}</h3>
                <p className="text-gray-600">Active Habits</p>
              </div>
            </div>

            {/* Success Story Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-800 mb-2">🎉 Today's Victory Story!</h3>
              <p className="text-sm text-green-700 mb-4">
                We went from Google's dramatic lies to a fully functional voice + AI habit tracking system!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold mb-2">🏆 Voice Commands Victory</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ Works with ANY habit automatically</li>
                    <li>✅ Lightning fast and reliable</li>
                    <li>✅ No Google Assistant drama!</li>
                    <li>✅ Perfect accuracy and feedback</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold mb-2">🤖 Gemini's Redemption</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ From gaslighting to helpful coach</li>
                    <li>✅ Smart conversation understanding</li>
                    <li>✅ No more "muscle emoji" speeches!</li>
                    <li>✅ Practically free to use</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Future Expansion Teaser */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-800 mb-2">🚀 Coming Soon: Voice Expansion Pack!</h3>
              <p className="text-sm text-purple-700 mb-4">
                Ready to explore even more voice-powered features?
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-sm mb-1">🗣️ Voice Journaling</h4>
                  <p className="text-xs text-gray-600">"Feeling really motivated today after that workout"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-sm mb-1">📊 Quick Data Entry</h4>
                  <p className="text-xs text-gray-600">"Slept 7 hours, energy level 8 out of 10"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-sm mb-1">🎯 Goal Setting</h4>
                  <p className="text-xs text-gray-600">"I want to meditate for 30 days straight"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-semibold text-sm mb-1">💭 Daily Reflection</h4>
                  <p className="text-xs text-gray-600">"Today's biggest win was completing my morning routine"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-sm mb-1">📱 Smart Reminders</h4>
                  <p className="text-xs text-gray-600">"Remind me to read at 8 PM"</p>
                </div>
                <div className="bg-white p-3 rounded-lg border-l-4 border-indigo-500">
                  <h4 className="font-semibold text-sm mb-1">🤖 Advanced AI</h4>
                  <p className="text-xs text-gray-600">Claude integration for even smarter conversations</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other views would go here - Dashboard, Learn, Profile */}
        {currentView === 'dashboard' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🚀 Dashboard Coming Soon!</h2>
            <p className="text-gray-600">Your AI-powered insights and analytics will live here.</p>
          </div>
        )}

        {currentView === 'learn' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 Learning Center Coming Soon!</h2>
            <p className="text-gray-600">Habit-building guides and AI coaching tips will be here.</p>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Profile Settings Coming Soon!</h2>
            <p className="text-gray-600">Customize your AI coach and preferences here.</p>
          </div>
        )}
      </main>

      {/* All Modals */}
      <VoiceHelpModal />
      <AIChatModal />
      <BacklogModal />
      <SliderModal />
      <DeleteConfirmModal />

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">🎤🤖 The perfect combo: Reliable voice commands + Intelligent AI conversations! ✨</p>
          <p className="text-xs mt-2 text-gray-500">
            From Google's dramatic lies to working AI magic - built in one epic session! 🎭➡️💪
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;import React, { useState, useEffect, useRef } from 'react';
import { Calendar, CheckCircle2, Circle, Flame, Star, Target, TrendingUp, MessageCircle, Award, Clock, User, Mail, Phone, Heart, Plus, X, Mic, MicOff, Volume2, Bot, Send, Sparkles, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

function App() {
  // Your Gemini API Key (replace with your actual key)
  const GEMINI_API_KEY = 'AIzaSyDFZ6mr63MOYGy--TDsw2RBQ6kpNeL-p6o';

  // Initialize state from localStorage or defaults
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('habitTracker_currentUser');
    return saved ? JSON.parse(saved) : {
      name: "Alex",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
      isPremium: true,
      lastActiveDate: new Date('2025-06-11'),
      preferences: {
        emailCoaching: true,
        phoneCoaching: true,
        optimalCallTime: "10:00 AM"
      },
      aiProfile: {
        personalityType: "achiever",
        motivationStyle: "encouraging"
      },
      behaviorData: {
        completionRate: 0.78,
        bestTimeForHabits: "morning",
        strugglingDays: ["monday", "friday"],
        lastCompletedHabit: "Morning Meditation",
        longestStreak: 21,
        biggerGoals: ["become a focused leader", "build mental strength for career"],
        proudestMoment: "completing 21-day meditation streak"
      },
      emailHistory: [{
        id: 1,
        subject: "Your meditation streak is waiting for you, Alex",
        sent: new Date().toISOString(),
        daysMissed: 2,
        content: "Hi Alex,\n\nI noticed you haven't checked in for 2 days. Your 21-day streak shows real dedication!\n\nYour AI Coach 🤖💪"
      }],
      callHistory: []
    };
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habitTracker_habits');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: "Morning Meditation",
        description: "Start the day with mindfulness",
        streak: 5,
        missedDays: 3,
        completedToday: false,
        completedDates: ['2025-06-09', '2025-06-10', '2025-06-11', '2025-06-12', '2025-06-13'],
        category: "Mindfulness",
        progress: 0,
        target: 10
      },
      {
        id: 2,
        name: "Read 20 Minutes",
        description: "Expand knowledge through daily reading",
        streak: 3,
        missedDays: 1,
        completedToday: true,
        completedDates: ['2025-06-11', '2025-06-12', '2025-06-13', '2025-06-14'],
        category: "Learning",
        progress: 5,
        target: 10
      },
      {
        id: 3,
        name: "Exercise",
        description: "Move your body for at least 30 minutes",
        streak: 8,
        missedDays: 0,
        completedToday: false,
        completedDates: ['2025-06-06', '2025-06-07', '2025-06-08', '2025-06-09', '2025-06-10', '2025-06-11', '2025-06-12', '2025-06-13'],
        category: "Fitness",
        progress: 2,
        target: 10
      }
    ];
  });

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // AI Agent states
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([]);
  const [aiProcessing, setAiProcessing] = useState(false);
  const chatEndRef = useRef(null);

  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'Mindfulness'
  });

  const [currentView, setCurrentView] = useState('habits');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [selectedHabitForBacklog, setSelectedHabitForBacklog] = useState(null);
  const [showSliderModal, setShowSliderModal] = useState(false);
  const [selectedHabitForSlider, setSelectedHabitForSlider] = useState(null);
  const [sliderValue, setSliderValue] = useState(100);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory, aiProcessing]);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('habitTracker_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('habitTracker_habits', JSON.stringify(habits));
  }, [habits]);

  // BUILT-IN VOICE RECOGNITION SETUP (The Undefeated Champion!)
  useEffect(() => {
    console.log('🎤 Checking for speech recognition support...');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      console.log('✅ Speech recognition supported!');
      setVoiceSupported(true);
      
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        console.log('🎤 Voice recognition started');
        setIsListening(true);
        setVoiceTranscript('');
      };
      
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
        console.log('🗣️ Speech detected:', currentTranscript);
        setVoiceTranscript(currentTranscript);
        
        if (finalTranscript) {
          console.log('✅ Final transcript:', finalTranscript);
          processVoiceCommand(finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          showMessage('🎤 Microphone access denied. Please allow microphone permissions and try again.');
        } else if (event.error === 'no-speech') {
          showMessage('🎤 No speech detected. Try speaking more clearly.');
        } else {
          showMessage(`🎤 Speech recognition error: ${event.error}`);
        }
      };
      
      recognitionInstance.onend = () => {
        console.log('🎤 Voice recognition ended');
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      console.log('❌ Speech recognition not supported');
      setVoiceSupported(false);
    }
  }, []);

  // GEMINI AI AGENT INTEGRATION - The Redemption Story!
  const processWithAI = async (userMessage) => {
    console.log('🤖 Processing with Gemini AI:', userMessage);
    setAiProcessing(true);
    
    try {
      const prompt = `You are a SMART habit tracking assistant. The user says: "${userMessage}"

Current habits available:
${habits.map(h => `- ${h.name}: ${h.description} (${h.streak} day streak, ${h.completedToday ? 'completed today' : 'not completed today'})`).join('\n')}

User profile: ${currentUser.name}, ${currentUser.aiProfile.personalityType} personality

RESPONSE RULES:
- For HABIT LOGGING: Max 6 words, enthusiastic but brief, NO EMOJIS AT ALL in speech
- For QUESTIONS/ADVICE: 2-3 helpful sentences, can be more detailed, NO EMOJIS AT ALL in speech  
- Act like an encouraging but knowledgeable fitness buddy
- CRITICAL: The speech_response field must NEVER contain emojis, emoji names, or emoji descriptions
- speech_response should use ONLY regular words that sound natural when spoken
- Use emojis only in the regular response field for visual display

EMOJI RULES FOR SPEECH:
- NEVER say "muscle emoji" - just don't include it
- NEVER say "thumbs up emoji" - just say "great job"  
- NEVER say "meditation emoji" - just say "nice meditation"
- Use ONLY words that sound natural when spoken aloud

Your task:
1. Determine if the user is logging a habit completion or asking a question
2. If logging a habit, extract: habit name and completion percentage (0-100)
3. Respond appropriately based on the type of interaction

Respond in JSON format:
{
  "action": "log_habit" | "conversation" | "question",
  "habit_name": "exact habit name if logging" | null,
  "percentage": number 0-100 if logging | null,
  "response": "appropriate response (brief for logging, detailed for questions)",
  "speech_response": "version without emojis for speech synthesis",
  "reasoning": "brief explanation of what you understood"
}

Examples:
- "I just finished an amazing workout!" → log_habit, Exercise, 100, "Awesome workout! 💪", "Awesome workout, great job", "..."
- "Had a good meditation session" → log_habit, Morning Meditation, 100, "Great meditation! 🧘‍♂️", "Great meditation session", "..."
- "How do I increase my meditation time?" → question, null, null, "Start by adding 2-3 minutes weekly. Consistency beats duration. Set a timer and focus on your breath.", "Start by adding 2 to 3 minutes weekly. Consistency beats duration. Set a timer and focus on your breath.", "..."

REMEMBER: 
- Habit logging = SHORT responses
- Questions = HELPFUL detailed responses  
- speech_response = PLAIN ENGLISH ONLY, no emoji words or descriptions!`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      
      console.log('🤖 Raw AI response:', aiText);
      
      // Extract JSON from AI response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const aiResult = JSON.parse(jsonMatch[0]);
        console.log('🤖 Parsed AI result:', aiResult);
        
        // Add to chat history
        setAiChatHistory(prev => [...prev, 
          { type: 'user', message: userMessage, timestamp: new Date() },
          { type: 'ai', message: aiResult.response, timestamp: new Date(), action: aiResult }
        ]);
        
        // Always speak the response using speech_response (no emojis)
        if ('speechSynthesis' in window && aiResult.speech_response) {
          const utterance = new SpeechSynthesisUtterance(aiResult.speech_response);
          speechSynthesis.speak(utterance);
        }
        
        // Execute action if it's a habit log
        if (aiResult.action === 'log_habit' && aiResult.habit_name && aiResult.percentage !== null) {
          const habit = habits.find(h => h.name.toLowerCase().includes(aiResult.habit_name.toLowerCase()) || 
                                         aiResult.habit_name.toLowerCase().includes(h.name.toLowerCase()));
          
          if (habit) {
            console.log(`🤖 AI logging habit: ${habit.name} at ${aiResult.percentage}%`);
            executeHabitUpdate(habit, aiResult.percentage, 'ai');
          } else {
            console.log('❌ AI identified habit not found:', aiResult.habit_name);
            showMessage(`🤖 AI understood "${aiResult.habit_name}" but couldn't match it to your habits.`);
          }
        }
        
        return aiResult;
      } else {
        throw new Error('Invalid AI response format');
      }
      
    } catch (error) {
      console.error('❌ AI processing error:', error);
      const errorMessage = `🤖 AI Error: ${error.message}. Don't worry, your voice commands still work perfectly!`;
      
      setAiChatHistory(prev => [...prev, 
        { type: 'user', message: userMessage, timestamp: new Date() },
        { type: 'error', message: errorMessage, timestamp: new Date() }
      ]);
      
      showMessage(errorMessage);
      return null;
    } finally {
      setAiProcessing(false);
    }
  };

  // Send AI chat message
  const sendAIMessage = async () => {
    if (!aiChatInput.trim()) return;
    
    const message = aiChatInput.trim();
    setAiChatInput('');
    
    await processWithAI(message);
  };

  // Process voice commands (our champion system!)
  const processVoiceCommand = (transcript) => {
    console.log('🧠 Processing voice command:', transcript);
    
    const text = transcript.toLowerCase().trim();
    
    // Smart habit matching
    const matchedHabit = findHabitInSpeech(text);
    const percentage = extractPercentageFromSpeech(text);
    
    console.log('🎯 Voice analysis:', { matchedHabit: matchedHabit?.name, percentage });
    
    if (matchedHabit) {
      executeHabitUpdate(matchedHabit, percentage, 'voice');
    } else {
      console.log('❌ No habit found in speech');
      showMessage(`🎤 Couldn't identify a habit in: "${transcript}". Try saying "Exercise complete" or "Meditation 75 percent"`);
      
      // Speak the error
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          "Sorry, I couldn't identify which habit you meant. Try saying something like exercise complete or meditation 75 percent."
        );
        speechSynthesis.speak(utterance);
      }
    }
  };

  // Execute habit update (unified function for both voice and AI)
  const executeHabitUpdate = (habit, percentage, source) => {
    console.log(`🚀 Executing ${source} command: ${habit.name} at ${percentage}%`);
    
    setHabits(prev => prev.map(h => {
      if (h.id === habit.id) {
        const newStreak = percentage >= 50 ? h.streak + 1 : h.streak;
        const newProgress = Math.min(h.progress + Math.ceil(percentage/100), h.target);
        
        return {
          ...h,
          completedToday: percentage >= 50,
          voiceCompletion: source === 'voice' ? percentage : undefined,
          aiCompletion: source === 'ai' ? percentage : undefined,
          streak: newStreak,
          progress: newProgress
        };
      }
      return h;
    }));
    
    // Success message
    const icon = source === 'voice' ? '🎤' : '🤖';
    const successMessage = percentage === 100 
      ? `${icon}✅ ${source.toUpperCase()} logged: ${habit.name} completed!`
      : `${icon}📊 ${source.toUpperCase()} logged: ${habit.name} at ${percentage}%!`;
    
    console.log('📢 Success:', successMessage);
    showMessage(successMessage);
    
    // Speak confirmation for voice commands
    if (source === 'voice' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        percentage === 100 
          ? `Perfect! ${habit.name} completed and logged!`
          : `Great! ${habit.name} logged at ${percentage} percent!`
      );
      speechSynthesis.speak(utterance);
    }
  };

  // Find habit mentioned in speech (enhanced for any habit!)
  const findHabitInSpeech = (text) => {
    console.log('🔍 Searching for habits in:', text);
    
    // Auto-generate keywords from all current habits
    const habitKeywords = {};
    habits.forEach(habit => {
      const habitName = habit.name;
      const nameWords = habitName.toLowerCase().split(' ');
      
      // Create keyword arrays for each habit
      habitKeywords[habitName] = [
        ...nameWords, // Split the habit name into words
        habitName.toLowerCase() // Full name
      ];
      
      // Add common synonyms based on category
      if (habit.category === 'Mindfulness') {
        habitKeywords[habitName].push('meditation', 'meditate', 'mindful', 'zen', 'calm', 'breathing');
      } else if (habit.category === 'Fitness') {
        habitKeywords[habitName].push('exercise', 'workout', 'fitness', 'gym', 'run', 'running', 'cardio', 'training');
      } else if (habit.category === 'Learning') {
        habitKeywords[habitName].push('reading', 'read', 'book', 'study', 'studying', 'learning');
      }
    });
    
    // Check each habit for keyword matches
    for (const habit of habits) {
      const keywords = habitKeywords[habit.name] || [];
      
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          console.log(`✅ Found habit "${habit.name}" via keyword "${keyword}"`);
          return habit;
        }
      }
    }
    
    console.log('❌ No habit keywords found');
    return null;
  };

  // Extract percentage from speech (keep our proven logic)
  const extractPercentageFromSpeech = (text) => {
    console.log('📊 Extracting percentage from:', text);
    
    const percentMatches = [
      /(\d+)\s*percent/,
      /(\d+)\s*%/,
      /(\d+)\s*per\s*cent/
    ];
    
    for (const pattern of percentMatches) {
      const match = text.match(pattern);
      if (match) {
        const percent = parseInt(match[1]);
        console.log(`📊 Found explicit percentage: ${percent}%`);
        return Math.min(percent, 100);
      }
    }
    
    const completionWords = {
      'complete': 100, 'completed': 100, 'done': 100, 'finished': 100, 
      'full': 100, 'fully': 100, 'totally': 100, 'entirely': 100,
      'mostly': 75, 'almost': 75, 'nearly': 75, 'three quarters': 75,
      'half': 50, 'halfway': 50, 'partially': 50, 'some': 50,
      'little': 25, 'bit': 25, 'started': 25, 'began': 25, 'quarter': 25
    };
    
    for (const [word, percent] of Object.entries(completionWords)) {
      if (text.includes(word)) {
        console.log(`📊 Found completion word "${word}" = ${percent}%`);
        return percent;
      }
    }
    
    console.log('📊 No percentage found, defaulting to 100%');
    return 100;
  };

  // Start voice recognition
  const startListening = () => {
    if (recognition && !isListening) {
      console.log('🎤 Starting voice recognition...');
      try {
        recognition.start();
      } catch (error) {
        console.error('❌ Error starting recognition:', error);
        showMessage('🎤 Error starting voice recognition. Try again.');
      }
    }
  };

  // Stop voice recognition
  const stopListening = () => {
    if (recognition && isListening) {
      console.log('🎤 Stopping voice recognition...');
      recognition.stop();
    }
  };

  const showMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const toggleHabit = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completedToday;
        let newStreak = habit.streak;
        
        if (newCompleted) {
          newStreak = habit.streak + 1;
          const newProgress = Math.min(habit.progress + 1, habit.target);
          
          return {
            ...habit,
            completedToday: newCompleted,
            streak: newStreak,
            progress: newProgress,
            voiceCompletion: undefined,
            aiCompletion: undefined
          };
        }
        
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newStreak,
          voiceCompletion: undefined,
          aiCompletion: undefined
        };
      }
      return habit;
    }));
  };

  // Backlog functionality
  const openBacklogModal = (habit) => {
    setSelectedHabitForBacklog(habit);
    setShowBacklogModal(true);
  };

  const closeBacklogModal = () => {
    setShowBacklogModal(false);
    setSelectedHabitForBacklog(null);
  };

  // Slider functionality
  const openSliderModal = (habit) => {
    setSelectedHabitForSlider(habit);
    setSliderValue(habit.completionPercentage || 100);
    setShowSliderModal(true);
  };

  const closeSliderModal = () => {
    setShowSliderModal(false);
    setSelectedHabitForSlider(null);
    setSliderValue(100);
  };

  const confirmSliderCompletion = () => {
    if (!selectedHabitForSlider) return;

    setHabits(prev => prev.map(habit => {
      if (habit.id === selectedHabitForSlider.id) {
        const newStreak = sliderValue >= 50 ? habit.streak + 1 : habit.streak;
        const newProgress = Math.min(habit.progress + Math.ceil(sliderValue/100), habit.target);
        
        const message = sliderValue === 100 
          ? getMotivationalMessage('habitCompleted', {
              habitName: habit.name,
              streak: newStreak
            })
          : `Great progress on ${habit.name}! ${sliderValue}% completion shows real dedication! 💪`;
        
        showMessage(message);
        
        return {
          ...habit,
          completedToday: sliderValue >= 50,
          completionPercentage: sliderValue,
          streak: newStreak,
          progress: newProgress,
          voiceCompletion: undefined,
          aiCompletion: undefined
        };
      }
      return habit;
    }));

    closeSliderModal();
  };

  // Delete habit functionality
  const openDeleteConfirm = (habit) => {
    setHabitToDelete(habit);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setHabitToDelete(null);
    setShowDeleteConfirm(false);
  };

  const confirmDeleteHabit = () => {
    if (!habitToDelete) return;
    
    setHabits(prev => prev.filter(habit => habit.id !== habitToDelete.id));
    showMessage(`🗑️ "${habitToDelete.name}" habit deleted. You can always add it back later!`);
    closeDeleteConfirm();
  };

  // Add new habit
  const addNewHabit = () => {
    if (newHabit.name.trim() === '') return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      description: newHabit.description || `Build a consistent ${newHabit.name.toLowerCase()} routine`,
      streak: 0,
      missedDays: 0,
      completedToday: false,
      completedDates: [],
      category: newHabit.category,
      progress: 0,
      target: 10
    };
    
    setHabits(prev => [...prev, habit]);
    setNewHabit({ name: '', description: '', category: 'Mindfulness' });
    setShowAddHabit(false);
    showMessage(`🎉 New habit "${habit.name}" added! Voice commands will work automatically!`);
  };

  // Get motivational messages
  const getMotivationalMessage = (type, data = {}) => {
    if (currentUser.isPremium) {
      const personalizedMessages = {
        habitCompleted: [
          `Outstanding work, ${currentUser.name}! ✅ ${data.habitName} completed. You're building real momentum!`,
          `Boom! 🎯 ${data.habitName} done! Day ${data.streak} in your streak. Your consistency is what separates achievers from dreamers!`
        ],
        streakCelebration: {
          7: "ONE WEEK! 🔥 You officially have a habit in progress!",
          14: "TWO WEEKS! 🌟 This is where real change happens!",
          21: "21 DAYS! 🎊 Scientists say this is when habits start to stick!"
        }
      };
      
      if (type === 'streakCelebration' && personalizedMessages[type][data.streak]) {
        return personalizedMessages[type][data.streak];
      }
      
      return personalizedMessages[type]?.[0] || "Great job! 🎉";
    }
    
    return `Great job completing ${data.habitName}! Keep it up! 🎉`;
  };

  const getWeeklyProgress = () => {
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.completedToday).length;
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    
    return {
      completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
      totalStreak,
      activeHabits: totalHabits
    };
  };

  // Helper functions for backlog
  const getPastDates = (days = 3) => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    
    return dates.reverse();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateCompleted = (habit, date) => {
    const dateString = formatDate(date);
    return habit.completedDates.includes(dateString);
  };

  const toggleBacklogDate = (habitId, date) => {
    const dateString = formatDate(date);
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCurrentlyCompleted = habit.completedDates.includes(dateString);
        let newCompletedDates;
        let newProgress = habit.progress;
        
        if (isCurrentlyCompleted) {
          newCompletedDates = habit.completedDates.filter(d => d !== dateString);
          newProgress = Math.max(newProgress - 1, 0);
          showMessage(`📅 Removed ${habit.name} completion for ${new Date(dateString).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}`);
        } else {
          newCompletedDates = [...habit.completedDates, dateString].sort();
          newProgress = Math.min(newProgress + 1, habit.target);
          showMessage(`✅ Marked ${habit.name} complete for ${new Date(dateString).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}!`);
        }
        
        return {
          ...habit,
          completedDates: newCompletedDates,
          progress: newProgress
        };
      }
      return habit;
    }));
  };

  // Modal Components
  const VoiceHelpModal = () => {
    if (!showVoiceHelp)
