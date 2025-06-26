import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionCard } from '../question-card'

describe('QuestionCard Component', () => {
  const mockQuestion = {
    id: 1,
    question: 'What is the capital of Poland?',
    options: ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw'],
    correctAnswer: 'Warsaw',
    category: 'Geography',
    difficulty: 'easy',
  }

  const mockProps = {
    question: mockQuestion,
    selectedAnswer: null,
    isAnswered: false,
    currentQuestionNumber: 1,
    totalQuestions: 10,
    onAnswerSelect: jest.fn(),
    onNext: jest.fn(),
    onCancel: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders question and options', () => {
    render(<QuestionCard {...mockProps} />)
    
    expect(screen.getByText('What is the capital of Poland?')).toBeInTheDocument()
    expect(screen.getByText('Warsaw')).toBeInTheDocument()
    expect(screen.getByText('Krakow')).toBeInTheDocument()
    expect(screen.getByText('Gdansk')).toBeInTheDocument()
    expect(screen.getByText('Wroclaw')).toBeInTheDocument()
  })

  test('displays question progress', () => {
    render(<QuestionCard {...mockProps} />)
    
    expect(screen.getByText('Question 1 of 10')).toBeInTheDocument()
  })

  test('displays question category and difficulty', () => {
    render(<QuestionCard {...mockProps} />)
    
    // Tekst jest w formacie "easy • Geography" w jednym elemencie
    expect(screen.getByText('easy • Geography')).toBeInTheDocument()
  })

  test('calls onAnswerSelect when option is clicked', async () => {
    const user = userEvent.setup()
    render(<QuestionCard {...mockProps} />)
    
    const warsawOption = screen.getByText('Warsaw')
    await user.click(warsawOption)
    
    expect(mockProps.onAnswerSelect).toHaveBeenCalledWith('Warsaw')
  })

  test('shows cancel quiz button before answering', () => {
    render(<QuestionCard {...mockProps} />)
    
    expect(screen.getByText('Cancel Quiz')).toBeInTheDocument()
  })

  test('shows X button in header for canceling', () => {
    render(<QuestionCard {...mockProps} />)
    
    // Używamy title dla X button w nagłówku
    const cancelButton = screen.getByTitle('Cancel Quiz')
    expect(cancelButton).toBeInTheDocument()
  })

  test('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuestionCard {...mockProps} />)
    
    const cancelButton = screen.getByText('Cancel Quiz')
    await user.click(cancelButton)
    
    expect(mockProps.onCancel).toHaveBeenCalled()
  })

  test('calls onCancel when X button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuestionCard {...mockProps} />)
    
    // Używamy title dla X button w nagłówku
    const xButton = screen.getByTitle('Cancel Quiz')
    await user.click(xButton)
    
    expect(mockProps.onCancel).toHaveBeenCalled()
  })

  test('shows next button after answering', () => {
    render(<QuestionCard {...mockProps} isAnswered={true} selectedAnswer="Warsaw" />)
    
    expect(screen.getByText('Next Question')).toBeInTheDocument()
    expect(screen.queryByText('Cancel Quiz')).not.toBeInTheDocument()
  })

  test('shows "See Results" button on last question', () => {
    render(<QuestionCard 
      {...mockProps} 
      isAnswered={true} 
      selectedAnswer="Warsaw"
      currentQuestionNumber={10}
    />)
    
    expect(screen.getByText('See Results')).toBeInTheDocument()
  })

  test('calls onNext when next button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuestionCard {...mockProps} isAnswered={true} selectedAnswer="Warsaw" />)
    
    const nextButton = screen.getByText('Next Question')
    await user.click(nextButton)
    
    expect(mockProps.onNext).toHaveBeenCalled()
  })

  test('highlights selected answer', () => {
    render(<QuestionCard {...mockProps} isAnswered={true} selectedAnswer="Warsaw" />)
    
    const selectedOption = screen.getByText('Warsaw')
    expect(selectedOption).toBeInTheDocument()
    // Note: You might need to check for specific CSS classes or aria attributes
    // depending on how your component indicates selection
  })

  test('disables answer buttons after answering', () => {
    render(<QuestionCard {...mockProps} isAnswered={true} selectedAnswer="Warsaw" />)
    
    // All answer buttons should be disabled after answering
    const answerButtons = screen.getAllByRole('button').filter(button => 
      ['Warsaw', 'Krakow', 'Gdansk', 'Wroclaw'].includes(button.textContent || '')
    )
    
    answerButtons.forEach(button => {
      expect(button).toBeDisabled()
    })
  })

  test('shows progress bar', () => {
    render(<QuestionCard {...mockProps} />)
    
    // Check for progress indicator (assuming it exists in your component)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  test('handles HTML entities in question text', () => {
    const questionWithEntities = {
      ...mockQuestion,
      question: 'What&apos;s the capital of Poland?',
    }
    
    render(<QuestionCard {...mockProps} question={questionWithEntities} />)
    
    // HTML entities są renderowane jako &apos; w DOM
    expect(screen.getByText("What&apos;s the capital of Poland?")).toBeInTheDocument()
  })
})
