<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Better Habits - AI-Powered Habit Tracker</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .app-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 2.5rem;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin: 10px 0;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .feature-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
        .feature-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
            color: white;
        }
        .feature-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
        }
        .feature-description {
            color: #666;
            line-height: 1.6;
        }
        .demo-section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .habit-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-bottom: 10px;
            border-left: 4px solid #667eea;
        }
        .habit-info h3 {
            margin: 0 0 5px 0;
            color: #333;
        }
        .habit-info p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        .habit-stats {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        .stat {
            text-align: center;
        }
        .stat-value {
            font-weight: bold;
            color: #667eea;
            font-size: 1.2rem;
        }
        .stat-label {
            font-size: 0.8rem;
            color: #666;
        }
        .voice-demo {
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
        }
        .ai-demo {
            background: linear-gradient(135deg, #48cae4, #0077b6);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: center;
        }
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 20px 0;
        }
        .tech-tag {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            border: 1px solid rgba(102, 126, 234, 0.2);
        }
        .code-preview {
            background: #2d3748;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            margin: 20px 0;
        }
        .highlight {
            color: #68d391;
        }
        .pulse {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect } = React;
        
        function App() {
            const [currentDemo, setCurrentDemo] = useState('overview');
            
            const features = [
                {
                    icon: '🎤',
                    title: 'Voice Recognition',
                    description: 'Log habits using natural speech commands like "Exercise complete" or "Meditation 75 percent". Built-in browser speech recognition with smart habit matching.'
                },
                {
                    icon: '🤖',
                    title: 'AI-Powered Assistant',
                    description: 'Integrated Gemini AI agent that understands context, provides personalized coaching, and responds to natural language queries about your habits.'
                },
                {
                    icon: '📊',
                    title: 'Smart Progress Tracking',
                    description: 'Track completion percentages, streaks, missed days, and progress toward goals. Visual feedback and motivational messages keep you engaged.'
                },
                {
                    icon: '👤',
                    title: 'Personalized Experience',
                    description: 'User profiles with personality types, behavior analysis, and customized coaching messages based on your preferences and patterns.'
                },
                {
                    icon: '🔥',
                    title: 'Streak Gamification',
                    description: 'Build momentum with streak tracking, milestone celebrations, and achievement unlocks that make habit building addictive in the best way.'
                },
                {
                    icon: '📱',
                    title: 'Modern UI/UX',
                    description: 'Beautiful, responsive interface with smooth animations, glassmorphism effects, and intuitive interactions that make tracking habits a joy.'
                }
            ];
            
            const sampleHabits = [
                {
                    name: 'Morning Meditation',
                    description: 'Start the day with mindfulness',
                    streak: 5,
                    progress: 7,
                    target: 10,
                    category: 'Mindfulness'
                },
                {
                    name: 'Read 20 Minutes',
                    description: 'Expand knowledge through daily reading',
                    streak: 3,
                    progress: 5,
                    target: 10,
                    category: 'Learning'
                },
                {
                    name: 'Exercise',
                    description: 'Move your body for at least 30 minutes',
                    streak: 8,
                    progress: 2,
                    target: 10,
                    category: 'Fitness'
                }
            ];
            
            return (
                <div className="app-container">
                    <div className="header">
                        <h1>🎯 Better Habits</h1>
                        <p>AI-Powered Habit Tracker with Voice Recognition</p>
                        <p style={{fontSize: '1rem', opacity: 0.8}}>
                            A sophisticated React application that combines modern web technologies with AI to revolutionize habit tracking
                        </p>
                    </div>
                    
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    <span style={{fontSize: '1.5rem'}}>{feature.icon}</span>
                                </div>
                                <div className="feature-title">{feature.title}</div>
                                <div className="feature-description">{feature.description}</div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="demo-section">
                        <h2 style={{textAlign: 'center', color: '#333', marginBottom: '20px'}}>📱 App Interface Preview</h2>
                        
                        <div style={{marginBottom: '20px'}}>
                            <h3 style={{color: '#333'}}>Sample Habits Dashboard</h3>
                            {sampleHabits.map((habit, index) => (
                                <div key={index} className="habit-item">
                                    <div className="habit-info">
                                        <h3>{habit.name}</h3>
                                        <p>{habit.description}</p>
                                    </div>
                                    <div className="habit-stats">
                                        <div className="stat">
                                            <div className="stat-value">{habit.streak}</div>
                                            <div className="stat-label">Streak</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-value">{habit.progress}/{habit.target}</div>
                                            <div className="stat-label">Progress</div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-value">{habit.category}</div>
                                            <div className="stat-label">Category</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="voice-demo">
                            <h3 style={{margin: '0 0 10px 0'}}>🎤 Voice Command Examples</h3>
                            <p style={{margin: '5px 0'}}><strong>"Exercise complete"</strong> → Logs 100% completion</p>
                            <p style={{margin: '5px 0'}}><strong>"Meditation 75 percent"</strong> → Logs 75% completion</p>
                            <p style={{margin: '5px 0'}}><strong>"Reading done"</strong> → Logs 100% completion</p>
                            <p className="pulse" style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>
                                🎙️ Click microphone button and speak naturally!
                            </p>
                        </div>
                        
                        <div className="ai-demo">
                            <h3 style={{margin: '0 0 10px 0'}}>🤖 AI Assistant Capabilities</h3>
                            <p style={{margin: '5px 0'}}><strong>Smart Habit Logging:</strong> "I did some meditation this morning"</p>
                            <p style={{margin: '5px 0'}}><strong>Progress Queries:</strong> "How am I doing with my reading habit?"</p>
                            <p style={{margin: '5px 0'}}><strong>Motivational Coaching:</strong> Personalized encouragement based on your profile</p>
                            <p className="pulse" style={{margin: '10px 0 0 0', fontSize: '0.9rem'}}>
                                🧠 Powered by Google Gemini AI for natural conversations
                            </p>
                        </div>
                    </div>
                    
                    <div className="demo-section">
                        <h2 style={{textAlign: 'center', color: '#333', marginBottom: '20px'}}>🛠️ Technical Implementation</h2>
                        
                        <div className="tech-stack">
                            <span className="tech-tag">React 18</span>
                            <span className="tech-tag">React Hooks</span>
                            <span className="tech-tag">Web Speech API</span>
                            <span className="tech-tag">Google Gemini AI</span>
                            <span className="tech-tag">Lucide Icons</span>
                            <span className="tech-tag">Modern CSS</span>
                            <span className="tech-tag">Local State Management</span>
                            <span className="tech-tag">Responsive Design</span>
                        </div>
                        
                        <div className="code-preview">
<span className="highlight">// Voice Recognition Setup</span>
const processVoiceCommand = (transcript) => {
  const matchedHabit = <span className="highlight">findHabitInSpeech</span>(transcript);
  const percentage = <span className="highlight">extractPercentageFromSpeech</span>(transcript);
  
  if (matchedHabit) {
    <span className="highlight">executeHabitUpdate</span>(matchedHabit, percentage, 'voice');
  }
};

<span className="highlight">// AI Integration</span>
const processWithAI = async (userMessage) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`,
    { /* Gemini API configuration */ }
  );
  
  // Parse AI response and execute actions
  const aiResult = JSON.parse(response);
  if (aiResult.action === 'log_habit') {
    <span className="highlight">executeHabitUpdate</span>(habit, aiResult.percentage, 'ai');
  }
};
                        </div>
                        
                        <h3 style={{color: '#333', marginTop: '30px'}}>🏗️ Key Architecture Features</h3>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px'}}>
                            <div style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #28a745'}}>
                                <strong>Unified Command Processing</strong>
                                <p style={{margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666'}}>
                                    Single executeHabitUpdate function handles voice, AI, and manual inputs
                                </p>
                            </div>
                            <div style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #007bff'}}>
                                <strong>Smart Habit Matching</strong>
                                <p style={{margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666'}}>
                                    Intelligent keyword matching with category-based synonyms
                                </p>
                            </div>
                            <div style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #ffc107'}}>
                                <strong>Contextual AI Responses</strong>
                                <p style={{margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666'}}>
                                    Personalized coaching based on user profile and behavior data
                                </p>
                            </div>
                            <div style={{padding: '15px', background: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #dc3545'}}>
                                <strong>Error Handling</strong>
                                <p style={{margin: '5px 0 0 0', fontSize: '0.9rem', color: '#666'}}>
                                    Graceful fallbacks for voice recognition and API failures
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="demo-section" style={{textAlign: 'center'}}>
                        <h2 style={{color: '#333', marginBottom: '15px'}}>🚀 Ready to Transform Your Habits?</h2>
                        <p style={{color: '#666', fontSize: '1.1rem', marginBottom: '20px'}}>
                            This is more than just a habit tracker - it's your personal AI-powered life coach that understands you, 
                            responds to your voice, and helps you build lasting positive changes.
                        </p>
                        
                        <div style={{display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap'}}>
                            <div style={{padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', borderRadius: '25px', fontWeight: '600'}}>
                                🎤 Voice-Enabled
                            </div>
                            <div style={{padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', borderRadius: '25px', fontWeight: '600'}}>
                                🤖 AI-Powered
                            </div>
                            <div style={{padding: '12px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', borderRadius: '25px', fontWeight: '600'}}>
                                📱 Modern UI
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
