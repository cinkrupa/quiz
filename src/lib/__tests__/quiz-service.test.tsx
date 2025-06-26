import { fetchQuizQuestions } from '../quiz-service'

// Mock fetch
global.fetch = jest.fn()

describe('Quiz Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('fetchQuizQuestions', () => {
    const mockApiResponse = {
      response_code: 0,
      results: [
        {
          question: 'What is 2+2?',
          correct_answer: '4',
          incorrect_answers: ['2', '3', '5'],
          category: 'Mathematics',
          difficulty: 'easy',
        },
        {
          question: 'What is the capital of France?',
          correct_answer: 'Paris',
          incorrect_answers: ['London', 'Berlin', 'Madrid'],
          category: 'Geography',
          difficulty: 'medium',
        },
      ],
    }

    test('fetches questions successfully', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const result = await fetchQuizQuestions()

      expect(fetch).toHaveBeenCalledWith(
        'https://opentdb.com/api.php?amount=10&type=multiple'
      )
      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: 0,
        question: 'What is 2+2?',
        correctAnswer: '4',
        category: 'Mathematics',
        difficulty: 'easy',
      })
    })

    test('includes category parameter when specified', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      await fetchQuizQuestions({ category: '9', difficulty: 'any' })

      expect(fetch).toHaveBeenCalledWith(
        'https://opentdb.com/api.php?amount=10&type=multiple&category=9'
      )
    })

    test('includes difficulty parameter when specified', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      await fetchQuizQuestions({ category: 'any', difficulty: 'easy' })

      expect(fetch).toHaveBeenCalledWith(
        'https://opentdb.com/api.php?amount=10&type=multiple&difficulty=easy'
      )
    })

    test('includes both category and difficulty when specified', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      await fetchQuizQuestions({ category: '24', difficulty: 'hard' })

      expect(fetch).toHaveBeenCalledWith(
        'https://opentdb.com/api.php?amount=10&type=multiple&category=24&difficulty=hard'
      )
    })

    test('shuffles answer options', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const result = await fetchQuizQuestions()

      expect(result[0].options).toHaveLength(4)
      expect(result[0].options).toContain('4')
      expect(result[0].options).toContain('2')
      expect(result[0].options).toContain('3')
      expect(result[0].options).toContain('5')
    })

    test('handles API error responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(fetchQuizQuestions()).rejects.toThrow('HTTP error! status: 500')
    })

    test('handles insufficient results (response_code: 1)', async () => {
      // Pierwszy fetch zwraca response_code: 1
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ response_code: 1, results: [] }),
      })
      
      // Drugi fetch (fallback) też zwraca pusty wynik
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ response_code: 1, results: [] }),
      })

      await expect(fetchQuizQuestions({ category: '24', difficulty: 'easy' })).rejects.toThrow(
        'Not enough easy questions available for Politics'
      )
    })

    test('falls back to any difficulty when insufficient results', async () => {
      // First call fails with response_code: 1
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ response_code: 1, results: [] }),
      })

      // Second call (fallback) succeeds
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApiResponse),
      })

      const result = await fetchQuizQuestions({ category: '24', difficulty: 'easy' })

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenNthCalledWith(1, 
        'https://opentdb.com/api.php?amount=10&type=multiple&category=24&difficulty=easy'
      )
      expect(fetch).toHaveBeenNthCalledWith(2, 
        'https://opentdb.com/api.php?amount=10&type=multiple&category=24'
      )
      expect(result).toHaveLength(2)
    })

    test('handles network errors', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(fetchQuizQuestions()).rejects.toThrow('Network error')
    })

    test('handles invalid parameters (response_code: 2)', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ response_code: 2, results: [] }),
      })

      await expect(fetchQuizQuestions()).rejects.toThrow(
        'Invalid parameters provided to the quiz API.'
      )
    })

    test('decodes HTML entities in questions and answers', async () => {
      const responseWithEntities = {
        response_code: 0,
        results: [
          {
            question: 'What&apos;s 2+2?',
            correct_answer: '4',
            incorrect_answers: ['2', '3', '5'],
            category: 'Mathematics',
            difficulty: 'easy',
          },
        ],
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(responseWithEntities),
      })

      const result = await fetchQuizQuestions()

      expect(result[0].question).toBe("What's 2+2?")
    })
  })
})
