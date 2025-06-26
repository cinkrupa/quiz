import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlayerSetup } from '../player-setup'

describe('PlayerSetup Component', () => {
  const mockProps = {
    onPlayerSetup: jest.fn(),
    onShowLeaderboard: jest.fn(),
    isLoading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders welcome message and input field', () => {
    render(<PlayerSetup {...mockProps} />)
    
    expect(screen.getByText('Welcome to Knowledge Quiz!')).toBeInTheDocument()
    expect(screen.getByText('Enter your name to start playing and track your progress')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your name here...')).toBeInTheDocument()
    expect(screen.getByText('Leave empty for an anonymous name')).toBeInTheDocument()
  })

  test('renders all buttons', () => {
    render(<PlayerSetup {...mockProps} />)
    
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '🏆 View Leaderboard' })).toBeInTheDocument()
  })

  test('calls onPlayerSetup with entered name on form submit', async () => {
    const user = userEvent.setup()
    render(<PlayerSetup {...mockProps} />)
    
    const input = screen.getByPlaceholderText('Your name here...')
    const submitButton = screen.getByRole('button', { name: 'Next' })
    
    await user.type(input, 'John Doe')
    await user.click(submitButton)
    
    expect(mockProps.onPlayerSetup).toHaveBeenCalledWith('John Doe')
  })

  test('generates anonymous name when input is empty', async () => {
    const user = userEvent.setup()
    render(<PlayerSetup {...mockProps} />)
    
    const submitButton = screen.getByRole('button', { name: 'Next' })
    await user.click(submitButton)
    
    expect(mockProps.onPlayerSetup).toHaveBeenCalledWith(
      expect.stringMatching(/^Anonymous .+/)
    )
  })

  test('trims whitespace from player name', async () => {
    const user = userEvent.setup()
    render(<PlayerSetup {...mockProps} />)
    
    const input = screen.getByPlaceholderText('Your name here...')
    const submitButton = screen.getByRole('button', { name: 'Next' })
    
    await user.type(input, '   Trimmed Name   ')
    await user.click(submitButton)
    
    expect(mockProps.onPlayerSetup).toHaveBeenCalledWith('Trimmed Name')
  })

  test('calls onShowLeaderboard when leaderboard button is clicked', async () => {
    const user = userEvent.setup()
    render(<PlayerSetup {...mockProps} />)
    
    const leaderboardButton = screen.getByRole('button', { name: '🏆 View Leaderboard' })
    await user.click(leaderboardButton)
    
    expect(mockProps.onShowLeaderboard).toHaveBeenCalled()
  })

  test('displays loading state', () => {
    render(<PlayerSetup {...mockProps} isLoading={true} />)
    
    expect(screen.getByText('Setting up...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Setting up...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '🏆 View Leaderboard' })).toBeDisabled()
  })

  test('displays error message', () => {
    const errorMessage = 'Failed to setup player'
    render(<PlayerSetup {...mockProps} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('disables input and buttons when loading', () => {
    render(<PlayerSetup {...mockProps} isLoading={true} />)
    
    expect(screen.getByPlaceholderText('Your name here...')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Setting up...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '🏆 View Leaderboard' })).toBeDisabled()
  })

  test('allows form submission via Enter key', async () => {
    const user = userEvent.setup()
    render(<PlayerSetup {...mockProps} />)
    
    const input = screen.getByPlaceholderText('Your name here...')
    
    await user.type(input, 'Test Player{enter}')
    
    expect(mockProps.onPlayerSetup).toHaveBeenCalledWith('Test Player')
  })
})
