import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
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

  test('renders welcome message', () => {
    render(<PlayerSetup {...mockProps} />)
    
    expect(screen.getByText('Welcome to Knowledge Quiz!')).toBeInTheDocument()
  })
})
