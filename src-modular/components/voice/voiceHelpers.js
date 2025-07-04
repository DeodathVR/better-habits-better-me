// components/voice/voiceHelpers.js
export const findHabitInSpeech = (text, currentHabits) => {
  const habitsToUse = currentHabits || [];
  
  console.log('🎤 Voice Input:', text);
  console.log('🎯 Available Habits:', habitsToUse.map(h => h.name));
  
  const habitKeywords = {};
  habitsToUse.forEach(habit => {
    const habitName = habit.name.toLowerCase();
    const nameWords = habitName.split(' ').filter(word => 
      word.length > 2 && !['mins', 'minutes', 'min', 'the', 'and', 'for', 'with'].includes(word)
    );
    
    habitKeywords[habit.name] = [...nameWords, habitName];
    
    const categoryKeywords = {
      'Mindfulness': ['meditation', 'meditate', 'mindful', 'zen', 'breathe', 'calm'],
      'Fitness': ['exercise', 'workout', 'fitness', 'gym', 'run', 'walk', 'train'],
      'Learning': ['reading', 'read', 'book', 'study', 'learn', 'education'],
      'Health': ['health', 'medicine', 'vitamins', 'water', 'sleep', 'rest'],
      'Productivity': ['work', 'productive', 'focus', 'organize', 'plan'],
      'Social': ['social', 'friends', 'family', 'call', 'connect', 'relationship']
    };
    
    if (categoryKeywords[habit.category]) {
      habitKeywords[habit.name].push(...categoryKeywords[habit.category]);
    }
    
    nameWords.forEach(word => {
      if (word.length > 3) {
        if (word.length > 5) {
          habitKeywords[habit.name].push(word.substring(0, 4));
        }
        
        const variations = {
          'yoga': ['stretching', 'pose', 'asana'],
          'water': ['drink', 'hydrate', 'fluid'],
          'journal': ['write', 'diary', 'log'],
          'walking': ['walk', 'stroll', 'steps'],
          'cooking': ['cook', 'meal', 'food'],
          'cleaning': ['clean', 'tidy', 'organize'],
          'coding': ['code', 'programming', 'develop'],
          'guitar': ['music', 'practice', 'instrument'],
          'running': ['run', 'jog', 'cardio'],
          'garden': ['gardening', 'plant', 'flowers', 'yard', 'outdoor'],
          'flowers': ['garden', 'gardening', 'plant', 'bloom', 'nature'],
          'reading': ['read', 'book', 'study']
        };
        
        if (variations[word]) {
          habitKeywords[habit.name].push(...variations[word]);
        }
      }
    });
    
    console.log(`🔑 Keywords for "${habit.name}":`, habitKeywords[habit.name]);
  });
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const habit of habitsToUse) {
    const keywords = habitKeywords[habit.name] || [];
    let score = 0;
    
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        if (keyword === habit.name.toLowerCase()) {
          score += 10;
        }
        else if (habit.name.toLowerCase().split(' ').includes(keyword)) {
          score += 5;
        }
        else {
          score += 1;
        }
        
        console.log(`✅ Match found: "${keyword}" in "${habit.name}" (score +${score})`);
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = habit;
    }
  }
  
  console.log(`🎯 Best Match:`, bestMatch?.name || 'None', `(score: ${bestScore})`);
  
  return bestScore > 0 ? bestMatch : null;
};

export const extractVoiceAction = (text) => {
  const removalWords = [
    'remove', 'delete', 'take off', 'undo', 'cancel', 'clear', 'reset', 
    'uncheck', 'unmark', 'reverse', 'take away', 'get rid of'
  ];
  
  const completionWords = {
    'complete': 100, 'completed': 100, 'done': 100, 'finished': 100,
    'accomplish': 100, 'achieved': 100, 'succeed': 100, 'nailed': 100,
    'crushed': 100, 'smashed': 100, 'knocked out': 100, 'wrapped up': 100,
    'check off': 100, 'mark done': 100, 'mark complete': 100
  };
  
  const partialWords = {
    'mostly': 75, 'almost': 75, 'nearly': 75, 'pretty much': 75,
    'half': 50, 'halfway': 50, 'partially': 50, 'some': 50,
    'little': 25, 'bit': 25, 'started': 25, 'barely': 25,
    'quarter': 25, 'touch': 10
  };
  
  const updateWords = [
    'update', 'change', 'modify', 'adjust', 'set', 'make it', 'put at'
  ];
  
  for (const word of removalWords) {
    if (text.includes(word)) {
      return { percentage: 0, action: 'remove' };
    }
  }
  
  const percentMatches = [
    /(\d+)\s*percent/,
    /(\d+)\s*%/,
    /(\d+)\s*per\s*cent/
  ];
  
  for (const pattern of percentMatches) {
    const match = text.match(pattern);
    if (match) {
      const percentage = Math.min(parseInt(match[1]), 100);
      const action = percentage === 0 ? 'remove' : 'update';
      return { percentage, action };
    }
  }
  
  for (const [word, percent] of Object.entries(completionWords)) {
    if (text.includes(word)) {
      return { percentage: percent, action: 'complete' };
    }
  }
  
  for (const [word, percent] of Object.entries(partialWords)) {
    if (text.includes(word)) {
      return { percentage: percent, action: 'partial' };
    }
  }
  
  for (const word of updateWords) {
    if (text.includes(word)) {
      const updateMatch = text.match(new RegExp(word + '.*?(\\d+)'));
      if (updateMatch) {
        const percentage = Math.min(parseInt(updateMatch[1]), 100);
        return { percentage, action: 'update' };
      }
    }
  }
  
  if (text.includes('for today')) {
    if (text.includes('100') || text.includes('complete')) {
      return { percentage: 100, action: 'complete' };
    }
    if (text.includes('0') || text.includes('nothing')) {
      return { percentage: 0, action: 'remove' };
    }
  }
  
  return { percentage: 100, action: 'complete' };
};
