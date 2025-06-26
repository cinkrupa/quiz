import { renderHook, act } from '@testing-library/react'
import { useQuiz } from '../use-quiz'

// Mock zewnętrznych zależności
jest.mock('@/lib/quiz-service', () => ({
  fetchQuizQuestions: jest.fn(),
}))

jest.mock('@/lib/player-service', () => ({
  createOrUpdatePlayer: jest.fn(),
  updatePlayerStats: jest.fn(),
}))

import { fetchQuizQuestions } from '@/lib/quiz-service'
import { createOrUpdatePlayer, updatePlayerStats } from '@/lib/player-service'

const mockFetchQuizQuestions = fetchQuizQuestions as jest.MockedFunction<typeof fetchQuizQuestions>
const mockCreateOrUpdatePlayer = createOrUpdatePlayer as jest.MockedFunction<typeof createOrUpdatePlayer>
const mockUpdatePlayerStats = updatePlayerStats as jest.MockedFunction<typeof updatePlayerStats>

describe('useQuiz Hook', () => {
  const mockPlayer = {
    id: '1',
    name: 'Test Player',
    score: 0,
    total_answers: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const mockQuestions = [
    {
      id: 0,
      question: 'Test question 1?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'A',
      category: 'Test',
      difficulty: 'easy',
    },
    {
      id: 1,
      question: 'Test question 2?',
      options: ['X', 'Y', 'Z', 'W'],
      correctAnswer: 'X',
      category: 'Test',
      difficulty: 'medium',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateOrUpdatePlayer.mockResolvedValue(mockPlayer)
    mockFetchQuizQuestions.mockResolvedValue(mockQuestions)
    mockUpdatePlayerStats.mockResolvedValue({ ...mockPlayer, score: 1, total_answers: 2 })
  })

  test('initializes with correct default state', () => {
    const { result } = renderHook(() => useQuiz())
    
    expect(result.current.gamePhase).toBe('player-setup')
    expect(result.current.questions).toEqual([])
    expect(result.current.score).toBe(0)
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.isQuizComplete).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.player).toBe(null)
  })

  test('setupPlayer creates player and transitions to quiz settings', async () => {
    const { result } = renderHook(() => useQuiz())
    
    await act(async () => {
      await result.current.setupPlayer('Test Player')
    })
    
    expect(mockCreateOrUpdatePlayer).toHaveBeenCalledWith('Test Player')
    expect(result.current.player).toEqual(mockPlayer)
    expect(result.current.gamePhase).toBe('quiz-settings')
    expect(result.current.isLoading).toBe(false)
  })

  test('setupPlayer handles errors', async () => {
    const error = new Error('Failed to create player')
    mockCreateOrUpdatePlayer.mockRejectedValue(error)
    
    const { result } = renderHook(() => useQuiz())
    
    await act(async () => {
      await result.current.setupPlayer('Test Player')
    })
    
    expect(result.current.error).toBe('Failed to create player')
    expect(result.current.gamePhase).toBe('player-setup')
    expect(result.current.isLoading).toBe(false)
  })

  test('startQuiz fetches questions and transitions to active state', async () => {
    const { result } = renderHook(() => useQuiz())
    
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'easy' })
    })
    
    expect(mockFetchQuizQuestions).toHaveBeenCalledWith({ category: 'any', difficulty: 'easy' })
    expect(result.current.questions).toEqual(mockQuestions)
    expect(result.current.gamePhase).toBe('quiz-active')
    expect(result.current.answers).toEqual([null, null])
  })

  test('startQuiz handles API errors', async () => {
    const error = new Error('API Error')
    mockFetchQuizQuestions.mockRejectedValue(error)
    
    const { result } = renderHook(() => useQuiz())
    
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'easy' })
    })
    
    expect(result.current.error).toBe('API Error')
    expect(result.current.gamePhase).toBe('quiz-settings')
  })

  test('answerQuestion updates score and answers', async () => {
    const { result } = renderHook(() => useQuiz())
    
    // Setup quiz state
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    // Answer correctly
    act(() => {
      result.current.answerQuestion('A')
    })
    
    expect(result.current.score).toBe(1)
    expect(result.current.answers[0]).toBe('A')
  })

  test('answerQuestion with wrong answer does not increase score', async () => {
    const { result } = renderHook(() => useQuiz())
    
    // Setup quiz state
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    // Answer incorrectly
    act(() => {
      result.current.answerQuestion('B')
    })
    
    expect(result.current.score).toBe(0)
    expect(result.current.answers[0]).toBe('B')
  })

  test('nextQuestion advances to next question', async () => {
    const { result } = renderHook(() => useQuiz())
    
    // Setup quiz with questions
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    expect(result.current.currentQuestionIndex).toBe(0)
    
    await act(async () => {
      await result.current.nextQuestion()
    })
    
    expect(result.current.currentQuestionIndex).toBe(1)
  })

  test('nextQuestion completes quiz on last question', async () => {
    const { result } = renderHook(() => useQuiz())
    
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    // Go to last question
    act(() => {
      result.current.nextQuestion()
    })
    
    expect(result.current.currentQuestionIndex).toBe(1)
    
    // Complete quiz
    await act(async () => {
      await result.current.nextQuestion()
    })
    
    expect(result.current.isQuizComplete).toBe(true)
    expect(result.current.gamePhase).toBe('quiz-complete')
  })

  test('cancelQuiz resets to settings without updating stats', async () => {
    const { result } = renderHook(() => useQuiz())
    
    // Start quiz and answer question
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    act(() => {
      result.current.answerQuestion('A')
    })
    
    expect(result.current.score).toBe(1)
    
    // Cancel quiz
    act(() => {
      result.current.cancelQuiz()
    })
    
    expect(result.current.gamePhase).toBe('quiz-settings')
    expect(result.current.questions).toEqual([])
    expect(result.current.score).toBe(0)
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(mockUpdatePlayerStats).not.toHaveBeenCalled()
  })

  test('updateSettings changes settings and clears errors', () => {
    const { result } = renderHook(() => useQuiz())
    
    // Set an error first
    act(() => {
      result.current.startQuiz({ category: 'invalid', difficulty: 'invalid' })
    })
    
    const newSettings = { category: '9', difficulty: 'easy' }
    
    act(() => {
      result.current.updateSettings(newSettings)
    })
    
    expect(result.current.settings).toEqual(newSettings)
    expect(result.current.error).toBe(null)
  })

  test('resetQuiz returns to settings keeping player data', async () => {
    const { result } = renderHook(() => useQuiz())
    
    // Setup player and complete quiz
    await act(async () => {
      await result.current.setupPlayer('Test Player')
    })
    
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    act(() => {
      result.current.resetQuiz()
    })
    
    expect(result.current.gamePhase).toBe('quiz-settings')
    expect(result.current.player).toEqual(mockPlayer)
    expect(result.current.questions).toEqual([])
    expect(result.current.score).toBe(0)
  })

  test('getCurrentQuestion returns current question', async () => {
    const { result } = renderHook(() => useQuiz())
    
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    expect(result.current.getCurrentQuestion()).toEqual(mockQuestions[0])
  })

  test('isAnswered returns correct answer state', async () => {
    const { result } = renderHook(() => useQuiz())
    
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    expect(result.current.isAnswered()).toBe(false)
    
    act(() => {
      result.current.answerQuestion('A')
    })
    
    expect(result.current.isAnswered()).toBe(true)
  })

  test('getCurrentAnswer returns current answer', async () => {
    const { result } = renderHook(() => useQuiz())
    
    await act(async () => {
      await result.current.startQuiz({ category: 'any', difficulty: 'any' })
    })
    
    expect(result.current.getCurrentAnswer()).toBe(null)
    
    act(() => {
      result.current.answerQuestion('A')
    })
    
    expect(result.current.getCurrentAnswer()).toBe('A')
  })
})
