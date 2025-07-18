import { QuizResponse, QuizQuestion, ProcessedQuestion, QuizSettings, CategoryOption, DifficultyOption } from '@/types/quiz';

const BASE_API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

// Available categories from OpenTDB API
export const CATEGORIES: CategoryOption[] = [
  { id: 'any', name: 'Any Category' },
  { id: '9', name: 'General Knowledge' },
  { id: '10', name: 'Entertainment: Books' },
  { id: '11', name: 'Entertainment: Film' },
  { id: '12', name: 'Entertainment: Music' },
  { id: '13', name: 'Entertainment: Musicals & Theatres' },
  { id: '14', name: 'Entertainment: Television' },
  { id: '15', name: 'Entertainment: Video Games' },
  { id: '16', name: 'Entertainment: Board Games' },
  { id: '17', name: 'Science & Nature' },
  { id: '18', name: 'Science: Computers' },
  { id: '19', name: 'Science: Mathematics' },
  { id: '20', name: 'Mythology' },
  { id: '21', name: 'Sports' },
  { id: '22', name: 'Geography' },
  { id: '23', name: 'History' },
  { id: '24', name: 'Politics' },
  { id: '25', name: 'Art' },
  { id: '26', name: 'Celebrities' },
  { id: '27', name: 'Animals' },
  { id: '28', name: 'Vehicles' },
];

// Available difficulties
export const DIFFICULTIES: DifficultyOption[] = [
  { id: 'any', name: 'Any Difficulty' },
  { id: 'easy', name: 'Easy' },
  { id: 'medium', name: 'Medium' },
  { id: 'hard', name: 'Hard' },
];

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

export async function fetchQuizQuestions(settings?: QuizSettings): Promise<ProcessedQuestion[]> {
  try {
    let apiUrl = BASE_API_URL;
    
    // Add category parameter if specified
    if (settings?.category && settings.category !== 'any') {
      apiUrl += `&category=${settings.category}`;
    }
    
    // Add difficulty parameter if specified
    if (settings?.difficulty && settings.difficulty !== 'any') {
      apiUrl += `&difficulty=${settings.difficulty}`;
    }
    
    console.log('Fetching questions from:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: QuizResponse = await response.json();
    
    // Handle different API response codes
    if (data.response_code !== 0) {
      // If no results due to specific difficulty, try with any difficulty
      if (data.response_code === 1 && settings?.difficulty && settings.difficulty !== 'any') {
        console.log('Not enough questions for specific difficulty, trying with any difficulty...');
        
        let fallbackUrl = BASE_API_URL;
        if (settings?.category && settings.category !== 'any') {
          fallbackUrl += `&category=${settings.category}`;
        }
        // Don't add difficulty parameter for fallback
        
        const fallbackResponse = await fetch(fallbackUrl);
        if (fallbackResponse.ok) {
          const fallbackData: QuizResponse = await fallbackResponse.json();
          if (fallbackData.response_code === 0 && fallbackData.results.length > 0) {
            console.log('Successfully retrieved questions with mixed difficulty levels');
            // Add a property to indicate fallback was used
            const questions = processQuestions(fallbackData.results);
            // We could add a notification system here in the future
            return questions;
          }
        }
      }
      
      let errorMessage = 'Failed to fetch quiz questions from API';
      
      switch (data.response_code) {
        case 1:
          const categoryName = settings?.category && settings.category !== 'any' 
            ? CATEGORIES.find(c => c.id === settings.category)?.name || 'selected category'
            : 'this category';
          const difficultyName = settings?.difficulty && settings.difficulty !== 'any'
            ? settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)
            : 'this difficulty';
          
          errorMessage = `Not enough ${difficultyName.toLowerCase()} questions available for ${categoryName}. Try selecting "Any Difficulty" or a different category.`;
          break;
        case 2:
          errorMessage = 'Invalid parameters provided to the quiz API.';
          break;
        case 3:
          errorMessage = 'Token not found. Please try again.';
          break;
        case 4:
          errorMessage = 'Token empty. Please try again.';
          break;
        default:
          errorMessage = `Quiz API returned error code ${data.response_code}. Please try again.`;
      }
      
      throw new Error(errorMessage);
    }
    
    return processQuestions(data.results);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    if (error instanceof Error) {
      throw error; // Re-throw with original message
    }
    throw new Error('Failed to load quiz questions. Please try again.');
  }
}

function processQuestions(questions: QuizQuestion[]): ProcessedQuestion[] {
  return questions.map((question: QuizQuestion, index: number) => {
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
}
