// utils/habitCalculations.js
export const calculateCurrentStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split('T')[0];
  
  let streak = 0;
  let checkDate = new Date(today);
  
  // Check if today is completed or if yesterday was completed
  if (sortedDates[0] === todayString) {
    streak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Check if yesterday was completed
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayString = checkDate.toISOString().split('T')[0];
    
    if (sortedDates[0] !== yesterdayString) {
      return 0; // Streak is broken
    }
    streak = 1;
  }
  
  // Count backwards from the last completed date
  for (let i = 1; i < sortedDates.length; i++) {
    const expectedDate = checkDate.toISOString().split('T')[0];
    
    if (sortedDates[i] === expectedDate) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break; // Streak is broken
    }
  }
  
  return streak;
};

export const calculateMissedDays = (habit) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const createdDate = new Date(habit.createdDate || '2025-01-01');
  createdDate.setHours(0, 0, 0, 0);
  
  // Don't count days before the habit was created
  const startDate = createdDate > today ? today : createdDate;
  
  let missedCount = 0;
  const checkDate = new Date(startDate);
  
  // Check each day from creation to today
  while (checkDate < today) {
    const dateString = checkDate.toISOString().split('T')[0];
    
    // If this date is not in completedDates and it's not today, it's missed
    if (!(habit.completedDates || []).includes(dateString) && 
        dateString !== today.toISOString().split('T')[0]) {
      missedCount++;
    }
    
    checkDate.setDate(checkDate.getDate() + 1);
  }
  
  // Limit to last 3 days for the UI
  return Math.min(missedCount, 3);
};

export const getWeeklyProgress = (habits) => {
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  
  return {
    completionRate: totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0,
    totalStreak,
    activeHabits: totalHabits
  };
};
