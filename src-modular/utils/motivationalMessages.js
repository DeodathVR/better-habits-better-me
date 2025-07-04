// utils/motivationalMessages.js
export const getMotivationalMessage = (type, context = {}) => {
  const messages = {
    habitCompleted: [
      `🎉 Amazing! You completed ${context.habitName}! Streak: ${context.streak} days!`,
      `✨ Well done on ${context.habitName}! Building habits one day at a time!`,
      `🔥 ${context.habitName} complete! You're on fire with a ${context.streak}-day streak!`,
      `💪 Fantastic work on ${context.habitName}! Consistency is key!`,
      `🌟 ${context.habitName} done! You're building an amazing routine!`
    ],
    streakCelebration: [
      `🎊 INCREDIBLE! ${context.streak} days straight! You're unstoppable!`,
      `🏆 ${context.streak}-day streak achieved! You're a habit champion!`,
      `🚀 ${context.streak} days in a row! Your consistency is inspiring!`,
      `💎 ${context.streak}-day diamond streak! Keep shining!`,
      `⭐ ${context.streak} consecutive days! You're a true habit master!`
    ],
    encouragement: [
      `🌱 Every small step counts! Keep growing!`,
      `💪 You've got this! One habit at a time!`,
      `🎯 Focus on progress, not perfection!`,
      `🔥 Your future self will thank you!`,
      `✨ Consistency beats intensity every time!`
    ]
  };

  const messageArray = messages[type] || messages.encouragement;
  return messageArray[Math.floor(Math.random() * messageArray.length)];
};
