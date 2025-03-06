
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

export interface UserProgress {
  id?: string;
  user_id: string;
  total_courses: number;
  completed_courses: number;
  average_score: number;
  study_hours: number;
  iq_score?: number;
  selected_course?: string;
  created_at?: string;
  updated_at?: string;
}
