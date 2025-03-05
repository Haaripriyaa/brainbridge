
// Utility functions for the IQ Test
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const calculateIQScore = (correctAnswers: number, totalQuestions: number): number => {
  const calculatedScore = 80 + (correctAnswers / totalQuestions) * 40;
  return Math.round(calculatedScore);
};
