
export interface IQQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // Index of the correct answer
  image?: string;
}

export interface TestState {
  selectedAnswers: Record<number, number>;
  timeLeft: number;
  testCompleted: boolean;
  score: number;
  showResult: boolean;
  isSaving: boolean;
}
