export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizResponse {
  response_code: number;
  results: QuizQuestion[];
}

export interface ProcessedQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: string;
}

export interface QuizState {
  questions: ProcessedQuestion[];
  currentQuestionIndex: number;
  score: number;
  answers: (string | null)[];
  isQuizComplete: boolean;
  isLoading: boolean;
  error: string | null;
}
