// utils/dateHelpers.js
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const getPastDates = (habit) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const createdDate = new Date(habit.createdDate || '2025-01-01');
  createdDate.setHours(0, 0, 0, 0);
  
  // Go back up to 3 days, but not before habit was created
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Only include dates after habit creation
    if (date >= createdDate) {
      dates.push(date);
    }
  }
  
  return dates.reverse();
};

export const isDateCompleted = (habit, date) => {
  const dateString = formatDate(date);
  return (habit.completedDates || []).includes(dateString);
};
