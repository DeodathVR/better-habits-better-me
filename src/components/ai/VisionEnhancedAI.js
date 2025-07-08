// Enhanced AI System - Building on Your Existing Foundation
class VisionEnhancedAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.visionDiscovery = new VisionDiscoveryEngine();
    this.contentPersonalizer = new ContentPersonalizer();
  }

  // ENHANCED VERSION of your existing processWithAI function
  async processWithAI(userMessage, context = {}) {
    // Step 1: Detect if this conversation contains vision clues
    const visionClues = await this.detectVisionClues(userMessage, context);
    
    // Step 2: Build enhanced context with vision awareness
    const enhancedContext = this.buildEnhancedContext(userMessage, context, visionClues);
    
    // Step 3: Generate vision-aware response
    const aiResponse = await this.generateVisionAwareResponse(userMessage, enhancedContext);
    
    // Step 4: Handle any actions (habit logging, vision updates, etc.)
    await this.handleActions(aiResponse, enhancedContext);
    
    return aiResponse;
  }

  // NEW: Detect vision clues in natural conversation
  async detectVisionClues(message, context) {
    const visionIndicators = {
      // Direct vision statements
      explicit: [
        /want to be/i, /hope to/i, /dream of/i, /goal is/i, /vision is/i,
        /want to become/i, /working toward/i, /building toward/i
      ],
      
      // Identity statements  
      identity: [
        /becoming/i, /turning into/i, /growing into/i, /developing into/i,
        /want to be someone who/i, /becoming the type of person/i
      ],
      
      // Emotional drivers
      motivation: [
        /frustrated with/i, /tired of/i, /excited about/i, /proud of/i,
        /inspired by/i, /motivated by/i, /driven by/i
      ],
      
      // Future self references
      future: [
        /in a year/i, /eventually/i, /someday/i, /when I/i,
        /future me/i, /down the road/i, /long term/i
      ]
    };

    const detectedClues = {};
    
    for (const [category, patterns] of Object.entries(visionIndicators)) {
      detectedClues[category] = patterns.some(pattern => pattern.test(message));
    }
    
    // Extract specific vision-related content
    const visionContent = this.extractVisionContent(message);
    
    return {
      hasVisionContent: Object.values(detectedClues).some(Boolean),
      categories: detectedClues,
      extractedContent: visionContent,
      confidenceLevel: this.calculateVisionConfidence(detectedClues, visionContent)
    };
  }

  extractVisionContent(message) {
    // Extract specific phrases that indicate vision/goals
    const visionExtracts = {
      goals: this.extractMatches(message, [
        /want to (be|become|build|create|achieve) ([^.!?]+)/gi,
        /goal is to ([^.!?]+)/gi,
        /working toward ([^.!?]+)/gi
      ]),
      
      identity: this.extractMatches(message, [
        /becoming (someone who|a person who|the type of person) ([^.!?]+)/gi,
        /(am|becoming) someone who ([^.!?]+)/gi
      ]),
      
      motivation: this.extractMatches(message, [
        /(frustrated|tired|excited|inspired) (with|by|about) ([^.!?]+)/gi,
        /because (I want|I need|I hope) ([^.!?]+)/gi
      ]),
      
      timeframe: this.extractMatches(message, [
        /in (a year|six months|the next year|2024|2025) ([^.!?]+)/gi,
        /(eventually|someday|long term) ([^.!?]+)/gi
      ])
    };
    
    return visionExtracts;
  }

  extractMatches(text, patterns) {
    const matches = [];
    patterns.forEach(pattern => {
      const found = [...text.matchAll(pattern)];
      matches.push(...found.map(match => match[0]));
    });
    return matches;
  }

  calculateVisionConfidence(detectedClues, extractedContent) {
    let confidence = 0;
    
    // Base confidence from detected patterns
    if (detectedClues.explicit) confidence += 0.4;
    if (detectedClues.identity) confidence += 0.3;
    if (detectedClues.motivation) confidence += 0.2;
    if (detectedClues.future) confidence += 0.1;
    
    // Boost confidence based on extracted content
    const totalExtracts = Object.values(extractedContent).flat().length;
    confidence += Math.min(totalExtracts * 0.1, 0.3);
    
    return Math.min(confidence, 1.0);
  }

  // NEW: Build enhanced context with vision awareness
  buildEnhancedContext(userMessage, originalContext, visionClues) {
    const { habits = [], currentUser = {}, chatHistory = [] } = originalContext;
    
    // Analyze user's current journey phase
    const journeyPhase = this.determineJourneyPhase(habits, currentUser);
    
    // Get or infer user's vision state
    const visionState = this.getVisionState(currentUser, visionClues, chatHistory);
    
    // Analyze recent patterns
    const patterns = this.analyzeUserPatterns(habits, chatHistory);
    
    return {
      ...originalContext,
      
      // Vision context
      visionState,
      visionClues,
      journeyPhase,
      
      // User patterns
      patterns,
      
      // Content strategy
      contentStrategy: this.determineContentStrategy(journeyPhase, visionState, patterns),
      
      // Response guidelines
      responseGuidelines: this.getResponseGuidelines(journeyPhase, visionState)
    };
  }

  determineJourneyPhase(habits, currentUser) {
    const daysActive = this.calculateDaysActive(currentUser);
    const longestStreak = Math.max(...habits.map(h => h.streak), 0);
    const completionRate = this.calculateCompletionRate(habits);
    const totalHabits = habits.length;
    
    // Phase determination logic
    if (daysActive <= 28 || longestStreak < 7) {
      return {
        phase: 'building_consistency',
        description: 'Focus on showing up daily',
        priority: 'consistency_over_vision',
        contentTone: 'encouraging_and_simple'
      };
    }
    
    if (daysActive <= 56 || completionRate < 0.7) {
      return {
        phase: 'developing_identity',
        description: 'Noticing who you\'re becoming',
        priority: 'identity_awareness',
        contentTone: 'reflective_and_proud'
      };
    }
    
    if (daysActive <= 112 || !currentUser.vision?.clarity) {
      return {
        phase: 'vision_emergence',
        description: 'Connecting habits to bigger purpose',
        priority: 'vision_exploration',
        contentTone: 'curious_and_expansive'
      };
    }
    
    return {
      phase: 'transformation_acceleration',
      description: 'Optimizing for vision achievement', 
      priority: 'vision_optimization',
      contentTone: 'challenging_and_strategic'
    };
  }

  getVisionState(currentUser, visionClues, chatHistory) {
    const existingVision = currentUser.vision;
    const hasStrongVisionClues = visionClues.confidenceLevel > 0.6;
    const recentVisionMentions = this.countRecentVisionMentions(chatHistory);
    
    return {
      hasExplicitVision: !!existingVision?.primaryVision,
      clarity: existingVision?.clarity || (hasStrongVisionClues ? 'emerging' : 'unclear'),
      recentMentions: recentVisionMentions,
      needsDiscovery: !existingVision && hasStrongVisionClues,
      readyForEvolution: existingVision && visionClues.confidenceLevel > 0.4
    };
  }

  analyzeUserPatterns(habits, chatHistory) {
    return {
      // Habit patterns
      strongestHabits: habits.filter(h => h.streak >= 7).map(h => h.name),
      strugglingHabits: habits.filter(h => h.streak < 3).map(h => h.name),
      recentMomentum: this.calculateRecentMomentum(habits),
      
      // Communication patterns
      communicationStyle: this.inferCommunicationStyle(chatHistory),
      motivationTriggers: this.identifyMotivationTriggers(chatHistory),
      responseToEncouragement: this.analyzeEngagementPatterns(chatHistory)
    };
  }

  determineContentStrategy(journeyPhase, visionState, patterns) {
    const strategies = {
      building_consistency: {
        primary: 'daily_identity_evidence',
        secondary: 'simple_wins_celebration',
        avoid: 'complex_future_planning'
      },
      
      developing_identity: {
        primary: 'identity_pattern_highlighting', 
        secondary: 'gentle_vision_exploration',
        avoid: 'pressure_for_clarity'
      },
      
      vision_emergence: {
        primary: 'vision_connection_building',
        secondary: 'purpose_exploration',
        avoid: 'forcing_specific_outcomes'
      },
      
      transformation_acceleration: {
        primary: 'vision_optimization',
        secondary: 'advanced_challenges',
        avoid: 'basic_motivation'
      }
    };
    
    return strategies[journeyPhase.phase] || strategies.building_consistency;
  }

  // ENHANCED: Generate vision-aware AI response
  async generateVisionAwareResponse(userMessage, enhancedContext) {
    const { visionState, journeyPhase, patterns, contentStrategy, habits } = enhancedContext;
    
    // Build the enhanced prompt
    const enhancedPrompt = this.buildEnhancedPrompt(userMessage, enhancedContext);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enhancedPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      
      // Parse the enhanced response
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        
        // Add metadata for tracking and improvement
        parsedResponse.metadata = {
          journeyPhase: journeyPhase.phase,
          visionClarity: visionState.clarity,
          contentStrategy: contentStrategy.primary,
          timestamp: new Date().toISOString()
        };
        
        return parsedResponse;
      }
      
      throw new Error('Invalid AI response format');
      
    } catch (error) {
      console.error('Enhanced AI processing error:', error);
      return this.getFallbackResponse(userMessage, enhancedContext);
    }
  }

  buildEnhancedPrompt(userMessage, context) {
    const { visionState, journeyPhase, patterns, habits, currentUser } = context;
    
    return `You are an advanced habit coaching assistant with deep vision-awareness capabilities.

CONTEXT ANALYSIS:
User Journey Phase: ${journeyPhase.phase} - ${journeyPhase.description}
Content Priority: ${journeyPhase.priority}
Tone: ${journeyPhase.contentTone}

VISION STATE:
- Has Explicit Vision: ${visionState.hasExplicitVision}
- Vision Clarity: ${visionState.clarity}
- Current Vision: "${currentUser.vision?.primaryVision || 'Not yet defined'}"
- Vision Discovery Needed: ${visionState.needsDiscovery}

USER PATTERNS:
- Strongest Habits: ${patterns.strongestHabits?.join(', ') || 'None yet'}
- Struggling Areas: ${patterns.strugglingHabits?.join(', ') || 'None identified'}
- Recent Momentum: ${patterns.recentMomentum || 'Building'}
- Communication Style: ${patterns.communicationStyle || 'Supportive'}

CURRENT HABITS:
${habits.map(h => `- ${h.name}: ${h.streak} day streak, ${h.completedToday ? 'completed today' : 'not completed today'}`).join('\n')}

USER MESSAGE: "${userMessage}"

RESPONSE REQUIREMENTS:
Based on the journey phase "${journeyPhase.phase}", your response should:

${this.getPhaseSpecificInstructions(journeyPhase.phase)}

RESPONSE FORMAT:
{
  "action": "log_habit|conversation|create_habit|vision_discovery|vision_update",
  "habit_name": "exact habit name if logging" | null,
  "percentage": number 0-100 if logging | null,
  "new_habit": {...} | null,
  "response": "your main response message",
  "speech_response": "version without emojis for speech",
  "vision_insight": "any vision-related insight discovered" | null,
  "identity_highlight": "identity evidence to emphasize" | null,
  "next_level_suggestion": "growth suggestion if appropriate" | null,
  "content_type": "encouragement|celebration|exploration|challenge|support",
  "confidence_boost": "specific confidence building message" | null
}

CRITICAL GUIDELINES:
- Match the tone to their journey phase
- Connect daily actions to identity/vision when possible
- Don't force vision discovery if they're in early phases
- Focus on transformation, not just completion
- Use their specific language and communication style
- Acknowledge patterns you've noticed
- Be authentic and avoid generic motivation speak

${this.getAdditionalPromptContext(context)}`;
  }

  getPhaseSpecificInstructions(phase) {
    const instructions = {
      building_consistency: `
- PRIORITY: Celebrate showing up, build confidence in their ability to change
- FOCUS: Daily identity evidence ("You're becoming someone who...")  
- AVOID: Complex future planning, pressure for vision clarity
- EMPHASIZE: Simple wins, consistency over perfection, who they're becoming today`,

      developing_identity: `
- PRIORITY: Help them notice identity shifts and patterns they're building
- FOCUS: Reflection on who they're becoming, gentle future exploration
- AVOID: Forcing major vision decisions or overwhelming future planning
- EMPHASIZE: Identity awareness, pattern recognition, organic growth`,

      vision_emergence: `
- PRIORITY: Connect habits to emerging purpose, explore bigger picture
- FOCUS: Vision exploration, purpose connection, meaningful goals
- AVOID: Rushing them into commitments, overwhelming with options
- EMPHASIZE: Collaborative vision building, connecting habits to values`,

      transformation_acceleration: `
- PRIORITY: Optimize habits for vision achievement, advanced challenges
- FOCUS: Vision-driven optimization, strategic growth, next-level thinking
- AVOID: Basic motivation, simple encouragement without substance
- EMPHASIZE: Strategic thinking, vision alignment, transformation acceleration`
    };

    return instructions[phase] || instructions.building_consistency;
  }

  getAdditionalPromptContext(context) {
    const { visionClues, patterns } = context;
    
    let additionalContext = '';
    
    if (visionClues.hasVisionContent) {
      additionalContext += `
VISION CLUES DETECTED:
The user mentioned vision-related content. Pay special attention to:
- Extracted goals: ${visionClues.extractedContent.goals?.join(', ') || 'None'}
- Identity mentions: ${visionClues.extractedContent.identity?.join(', ') || 'None'}
- Motivation drivers: ${visionClues.extractedContent.motivation?.join(', ') || 'None'}
This may be a perfect moment for gentle vision exploration.`;
    }
    
    if (patterns.recentMomentum === 'struggling') {
      additionalContext += `
SUPPORT NEEDED:
User appears to be struggling recently. Focus on:
- Compassionate support without judgment
- Reconnecting them to their "why"
- Simple, achievable next steps
- Identity reinforcement based on past successes`;
    }
    
    return additionalContext;
  }

  // Handle enhanced actions based on AI response
  async handleActions(aiResponse, context) {
    const { action, vision_insight, identity_highlight } = aiResponse;
    
    // Handle vision discovery
    if (action === 'vision_discovery' && vision_insight) {
      await this.updateVisionDiscovery(context.currentUser, vision_insight, context.visionClues);
    }
    
    // Handle identity highlighting
    if (identity_highlight) {
      await this.recordIdentityEvidence(context.currentUser, identity_highlight, context.habits);
    }
    
    // Handle vision updates
    if (action === 'vision_update') {
      await this.evolveUserVision(context.currentUser, context.visionClues, aiResponse);
    }
    
    // Standard habit actions (your existing logic)
    if (action === 'log_habit' && aiResponse.habit_name && aiResponse.percentage !== null) {
      // Your existing habit logging logic
    }
    
    if (action === 'create_habit' && aiResponse.new_habit) {
      // Your existing habit creation logic  
    }
  }

  // Helper methods for enhanced functionality
  async updateVisionDiscovery(user, insight, visionClues) {
    const visionDiscoveries = JSON.parse(localStorage.getItem('visionDiscoveries') || '[]');
    
    visionDiscoveries.push({
      insight,
      confidence: visionClues.confidenceLevel,
      extractedContent: visionClues.extractedContent,
      timestamp: new Date(),
      userId: user.id
    });
    
    localStorage.setItem('visionDiscoveries', JSON.stringify(visionDiscoveries));
  }

  async recordIdentityEvidence(user, evidence, habits) {
    const identityEvidence = JSON.parse(localStorage.getItem('identityEvidence') || '[]');
    
    identityEvidence.push({
      evidence,
      relatedHabits: habits.filter(h => h.completedToday).map(h => h.name),
      timestamp: new Date(),
      userId: user.id
    });
    
    localStorage.setItem('identityEvidence', JSON.stringify(identityEvidence));
  }

  getFallbackResponse(userMessage, context) {
    const { journeyPhase } = context;
    
    const fallbackResponses = {
      building_consistency: {
        response: "Every day you show up, you're proving to yourself that you can change. That's huge!",
        content_type: "encouragement",
        identity_highlight: "You're becoming someone who follows through on commitments."
      },
      developing_identity: {
        response: "I can see you're building something meaningful with these habits. Keep noticing who you're becoming!",
        content_type: "reflection", 
        identity_highlight: "You're developing the identity of someone who invests in growth."
      },
      vision_emergence: {
        response: "Your consistency shows real commitment. What bigger picture are these habits serving?",
        content_type: "exploration",
        identity_highlight: "You're becoming someone who builds toward meaningful goals."
      },
      transformation_acceleration: {
        response: "You've proven you can transform. Let's make sure every habit serves your bigger vision.",
        content_type: "challenge",
        identity_highlight: "You're someone who optimizes for long-term transformation."
      }
    };
    
    return fallbackResponses[journeyPhase.phase] || fallbackResponses.building_consistency;
  }

  // Utility methods
  calculateDaysActive(user) {
    const startDate = new Date(user.startDate || Date.now() - 30 * 24 * 60 * 60 * 1000);
    return Math.floor((Date.now() - startDate) / (24 * 60 * 60 * 1000));
  }

  calculateCompletionRate(habits) {
    if (habits.length === 0) return 0;
    const completedToday = habits.filter(h => h.completedToday).length;
    return completedToday / habits.length;
  }

  calculateRecentMomentum(habits) {
    // Analyze last 7 days completion patterns
    const recentCompletions = habits.map(h => {
      const recent7Days = h.completedDates?.slice(-7) || [];
      return recent7Days.length / 7;
    });
    
    const averageRate = recentCompletions.reduce((a, b) => a + b, 0) / recentCompletions.length;
    
    if (averageRate >= 0.8) return 'accelerating';
    if (averageRate >= 0.6) return 'building';
    if (averageRate >= 0.4) return 'maintaining';
    return 'struggling';
  }

  countRecentVisionMentions(chatHistory) {
    const recentChats = chatHistory.slice(-10);
    return recentChats.filter(chat => 
      /vision|goal|dream|future|becoming|want to be/i.test(chat.message)
    ).length;
  }

  inferCommunicationStyle(chatHistory) {
    // Analyze user's communication patterns
    const recentMessages = chatHistory.filter(chat => chat.type === 'user').slice(-5);
    
    if (recentMessages.some(msg => /amazing|awesome|love|excited/i.test(msg.message))) {
      return 'enthusiastic';
    }
    if (recentMessages.some(msg => /hard|difficult|struggle|tough/i.test(msg.message))) {
      return 'honest_about_challenges';  
    }
    if (recentMessages.some(msg => msg.message.length > 50)) {
      return 'detailed_communicator';
    }
    
    return 'concise_and_practical';
  }

  identifyMotivationTriggers(chatHistory) {
    // Identify what types of content get positive responses
    const positiveInteractions = chatHistory.filter(chat => 
      chat.engagement === 'positive' || /thanks|helpful|great/i.test(chat.message)
    );
    
    return {
      respondsToEncouragement: positiveInteractions.some(chat => /great job|well done|proud/i.test(chat.message)),
      respondsToChallenge: positiveInteractions.some(chat => /next level|challenge|push/i.test(chat.message)),
      respondsToIdentity: positiveInteractions.some(chat => /becoming|person who|identity/i.test(chat.message))
    };
  }

  analyzeEngagementPatterns(chatHistory) {
    // Track what content gets best engagement
    const engagementData = chatHistory.slice(-20).reduce((patterns, chat) => {
      if (chat.type === 'ai' && chat.engagement) {
        patterns[chat.contentType] = patterns[chat.contentType] || [];
        patterns[chat.contentType].push(chat.engagement);
      }
      return patterns;
    }, {});
    
    return engagementData;
  }
}

export default VisionEnhancedAI;
