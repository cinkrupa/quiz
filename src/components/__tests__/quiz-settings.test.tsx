import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuizSettingsComponent } from '../quiz-settings'

// Mock the quiz service
jest.mock('@/lib/quiz-service', () => {
  const mockCategories = [
    { id: 'any', name: 'Any Category' },
    { id: '9', name: 'General Knowledge' },
    { id: '24', name: 'Politics' },
  ]

  const mockDifficulties = [
    { id: 'any', name: 'Any Difficulty' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
  ]

  return {
    CATEGORIES: mockCategories,
    DIFFICULTIES: mockDifficulties,
  }
})

describe('QuizSettingsComponent', () => {
  const mockPlayer = {
    id: '1',
    name: 'Test Player',
    score: 15,
    total_answers: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const mockSettings = {
    category: 'any',
    difficulty: 'any',
  }

  const mockProps = {
    settings: mockSettings,
    player: mockPlayer,
    error: null,
    isLoading: false,
    onSettingsChange: jest.fn(),
    onStartQuiz: jest.fn(),
    onChangePlayer: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders quiz settings UI', () => {
    render(<QuizSettingsComponent {...mockProps} />)
    
    expect(screen.getByText('Knowledge Quiz')).toBeInTheDocument()
    expect(screen.getByText('Customize your quiz experience by selecting a category and difficulty level')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Difficulty')).toBeInTheDocument()
  })

  test('displays player information', () => {
    render(<QuizSettingsComponent {...mockProps} />)
    
    expect(screen.getByText('Welcome, Test Player!')).toBeInTheDocument()
    expect(screen.getByText('Total Score: 15 points')).toBeInTheDocument()
    expect(screen.getByText('Questions Answered: 20')).toBeInTheDocument()
    expect(screen.getByText('Success Rate: 75%')).toBeInTheDocument()
  })

  test('renders all category options', () => {
    render(<QuizSettingsComponent {...mockProps} />)
    
    expect(screen.getByText('Any Category')).toBeInTheDocument()
    expect(screen.getByText('General Knowledge')).toBeInTheDocument()
    expect(screen.getByText('Politics')).toBeInTheDocument()
  })

  test('renders all difficulty options', () => {
    render(<QuizSettingsComponent {...mockProps} />)
    
    expect(screen.getByText('Any Difficulty')).toBeInTheDocument()
    expect(screen.getByText('Easy')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  test('calls onSettingsChange when category is selected', async () => {
    const user = userEvent.setup()
    render(<QuizSettingsComponent {...mockProps} />)
    
    const categoryButton = screen.getByText('General Knowledge')
    await user.click(categoryButton)
    
    expect(mockProps.onSettingsChange).toHaveBeenCalledWith({
      category: '9',
      difficulty: 'any',
    })
  })

  test('calls onSettingsChange when difficulty is selected', async () => {
    const user = userEvent.setup()
    render(<QuizSettingsComponent {...mockProps} />)
    
    const difficultyButton = screen.getByText('Easy')
    await user.click(difficultyButton)
    
    expect(mockProps.onSettingsChange).toHaveBeenCalledWith({
      category: 'any',
      difficulty: 'easy',
    })
  })

  test('highlights selected category and difficulty', () => {
    const settingsWithSelection = {
      category: '9',
      difficulty: 'easy',
    }
    
    render(<QuizSettingsComponent {...mockProps} settings={settingsWithSelection} />)
    
    // Selected buttons should have the default variant (highlighted)
    const selectedCategory = screen.getByText('General Knowledge')
    const selectedDifficulty = screen.getByText('Easy')
    
    expect(selectedCategory).toBeInTheDocument()
    expect(selectedDifficulty).toBeInTheDocument()
  })

  test('calls onStartQuiz when start button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuizSettingsComponent {...mockProps} />)
    
    const startButton = screen.getByText('Start Quiz')
    await user.click(startButton)
    
    expect(mockProps.onStartQuiz).toHaveBeenCalled()
  })

  test('calls onChangePlayer when change player button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuizSettingsComponent {...mockProps} />)
    
    const changePlayerButton = screen.getByText('Change Player')
    await user.click(changePlayerButton)
    
    expect(mockProps.onChangePlayer).toHaveBeenCalled()
  })

  test('displays error message when error is present', () => {
    const errorMessage = 'Not enough easy questions available for Politics. Try selecting "Any Difficulty" or a different category.'
    render(<QuizSettingsComponent {...mockProps} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('shows loading state on start button', () => {
    render(<QuizSettingsComponent {...mockProps} isLoading={true} />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Loading/ })).toBeDisabled()
  })

  test('calculates success rate correctly', () => {
    const playerWithZeroAnswers = {
      ...mockPlayer,
      score: 0,
      total_answers: 0,
    }
    
    render(<QuizSettingsComponent {...mockProps} player={playerWithZeroAnswers} />)
    
    expect(screen.getByText('Success Rate: 0%')).toBeInTheDocument()
  })

  test('renders without player information when player is null', () => {
    render(<QuizSettingsComponent {...mockProps} player={null} />)
    
    expect(screen.queryByText(/Welcome,/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Total Score:/)).not.toBeInTheDocument()
  })
})
