import { QuizResponse, QuizQuestion, ProcessedQuestion } from '@/types/quiz';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

// Decode HTML entities
function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function fetchQuizQuestions(): Promise<ProcessedQuestion[]> {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: QuizResponse = await response.json();
    
    if (data.response_code !== 0) {
      throw new Error('Failed to fetch quiz questions from API');
    }
    
    return data.results.map((question: QuizQuestion, index: number) => {
      // Decode HTML entities in question and answers
      const decodedQuestion = decodeHtml(question.question);
      const decodedCorrectAnswer = decodeHtml(question.correct_answer);
      const decodedIncorrectAnswers = question.incorrect_answers.map(decodeHtml);
      
      // Combine and shuffle answers
      const allAnswers = [decodedCorrectAnswer, ...decodedIncorrectAnswers];
      const shuffledAnswers = shuffleArray(allAnswers);
      
      return {
        id: index,
        question: decodedQuestion,
        options: shuffledAnswers,
        correctAnswer: decodedCorrectAnswer,
        category: question.category,
        difficulty: question.difficulty,
      };
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    throw new Error('Failed to load quiz questions. Please try again.');
  }
}
