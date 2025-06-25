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

export interface Player {
  id?: string;
  name: string;
  score: number;
  total_answers: number;
  updated_at?: string;
}

export interface QuizSettings {
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
  settings: QuizSettings;
  player: Player | null;
  gamePhase: 'player-setup' | 'quiz-settings' | 'quiz-active' | 'quiz-complete';
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface DifficultyOption {
  id: string;
  name: string;
}
