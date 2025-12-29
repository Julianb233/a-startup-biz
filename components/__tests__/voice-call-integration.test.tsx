/**
 * Voice Call Integration Tests
 *
 * These tests verify the floating call button and voice call interface
 * work correctly across different states and user interactions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FloatingCallButton } from '../floating-call-button'
import { useUser } from '@clerk/nextjs'

// Mock Clerk authentication
vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(),
}))

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock LiveKit components
vi.mock('@livekit/components-react', () => ({
  LiveKitRoom: ({ children }: any) => <div data-testid="livekit-room">{children}</div>,
  useLocalParticipant: () => ({
    isMicrophoneEnabled: true,
    microphoneTrack: {},
  }),
  useRoomContext: () => ({
    state: 'connected',
    localParticipant: {
      setMicrophoneEnabled: vi.fn(),
    },
    remoteParticipants: new Map(),
    on: vi.fn(),
    off: vi.fn(),
  }),
  useTracks: () => [],
  RoomAudioRenderer: () => <div data-testid="audio-renderer" />,
}))

// Mock VoiceCallInterface
vi.mock('../voice-call-interface', () => ({
  VoiceCallInterface: ({ onDisconnect }: any) => (
    <div data-testid="voice-interface">
      <button onClick={onDisconnect}>End Call</button>
    </div>
  ),
}))

describe('FloatingCallButton', () => {
  const mockUser = {
    id: 'user-123',
    fullName: 'John Doe',
    firstName: 'John',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('should not render when user is not signed in', () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: false,
      user: null,
      isLoaded: true,
    } as any)

    const { container } = render(<FloatingCallButton />)
    expect(container.firstChild).toBeNull()
  })

  it('should render floating button when user is signed in', () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: true,
      user: mockUser,
      isLoaded: true,
    } as any)

    render(<FloatingCallButton />)
    expect(screen.getByLabelText('Open voice call')).toBeInTheDocument()
  })

  it('should open panel when button is clicked', async () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: true,
      user: mockUser,
      isLoaded: true,
    } as any)

    render(<FloatingCallButton />)

    const button = screen.getByLabelText('Open voice call')
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Support Call')).toBeInTheDocument()
    })
  })

  it('should start call when "Start Voice Call" is clicked', async () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: true,
      user: mockUser,
      isLoaded: true,
    } as any)

    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'test-token',
        roomName: 'test-room',
        participantName: 'John Doe',
        livekitHost: 'wss://test.livekit.cloud',
      }),
    })

    // Mock getUserMedia
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue({}),
    } as any

    render(<FloatingCallButton />)

    // Open panel
    fireEvent.click(screen.getByLabelText('Open voice call'))

    await waitFor(() => {
      expect(screen.getByText('Start Voice Call')).toBeInTheDocument()
    })

    // Start call
    fireEvent.click(screen.getByText('Start Voice Call'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/voice/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })
  })

  it('should show error when API fails', async () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: true,
      user: mockUser,
      isLoaded: true,
    } as any)

    // Mock failed API response
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: 'Service unavailable' }),
    })

    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue({}),
    } as any

    render(<FloatingCallButton />)

    fireEvent.click(screen.getByLabelText('Open voice call'))

    await waitFor(() => {
      expect(screen.getByText('Start Voice Call')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Start Voice Call'))

    await waitFor(() => {
      expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument()
    })
  })

  it('should show error when microphone permission is denied', async () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: true,
      user: mockUser,
      isLoaded: true,
    } as any)

    // Mock microphone permission denied
    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockRejectedValue(new Error('Permission denied')),
    } as any

    render(<FloatingCallButton />)

    fireEvent.click(screen.getByLabelText('Open voice call'))

    await waitFor(() => {
      expect(screen.getByText('Start Voice Call')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Start Voice Call'))

    await waitFor(() => {
      expect(screen.getByText(/microphone access denied/i)).toBeInTheDocument()
    })
  })

  it('should handle call disconnection', async () => {
    vi.mocked(useUser).mockReturnValue({
      isSignedIn: true,
      user: mockUser,
      isLoaded: true,
    } as any)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        token: 'test-token',
        roomName: 'test-room',
        participantName: 'John Doe',
        livekitHost: 'wss://test.livekit.cloud',
      }),
    })

    global.navigator.mediaDevices = {
      getUserMedia: vi.fn().mockResolvedValue({}),
    } as any

    render(<FloatingCallButton />)

    // Open and start call
    fireEvent.click(screen.getByLabelText('Open voice call'))

    await waitFor(() => {
      expect(screen.getByText('Start Voice Call')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Start Voice Call'))

    await waitFor(() => {
      expect(screen.getByTestId('voice-interface')).toBeInTheDocument()
    })

    // End call
    fireEvent.click(screen.getByText('End Call'))

    await waitFor(() => {
      expect(screen.queryByTestId('voice-interface')).not.toBeInTheDocument()
    })
  })
})
