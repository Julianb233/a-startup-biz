# Voice Call Integration with LiveKit

This documentation covers the LiveKit WebRTC integration for the floating call button component.

## Components

### 1. FloatingCallButton (`floating-call-button.tsx`)
The main UI component that provides a floating action button for initiating voice calls.

**Features:**
- Floating action button with animation
- Expandable panel interface
- Integration with Clerk for authentication
- Error handling and retry logic
- Responsive design with dark mode support

**Props:**
```typescript
interface FloatingCallButtonProps {
  voiceApiUrl?: string // Default: "/api/voice/token"
}
```

**Usage:**
```tsx
import { FloatingCallButton } from "@/components/floating-call-button"

export default function Page() {
  return (
    <div>
      {/* Your page content */}
      <FloatingCallButton />
    </div>
  )
}
```

### 2. VoiceCallInterface (`voice-call-interface.tsx`)
The LiveKit WebRTC call interface component that handles the actual voice communication.

**Features:**
- Real-time WebRTC audio connection
- Connection state monitoring (Connecting, Connected, Reconnecting, Disconnected)
- Microphone mute/unmute controls
- Speaker mute/unmute controls
- Call duration timer
- Audio level visualization
- Remote participant detection
- Automatic reconnection handling
- Clean disconnection handling

**Props:**
```typescript
interface VoiceCallInterfaceProps {
  token: string              // LiveKit access token
  serverUrl: string          // LiveKit server WebSocket URL
  roomName: string           // Room identifier
  participantName: string    // Display name for the participant
  onDisconnect: () => void   // Callback when call ends
  onError?: (error: Error) => void // Optional error handler
}
```

## API Integration

### Token Endpoint (`/api/voice/token`)

**Request:**
```typescript
POST /api/voice/token
Content-Type: application/json

{
  "participantName": "John Doe",
  "roomType": "support"
}
```

**Response:**
```typescript
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "roomName": "support-user_123",
  "participantName": "John Doe",
  "livekitHost": "wss://your-livekit-server.livekit.cloud"
}
```

## Call Flow

1. **User clicks floating button** → Opens call panel
2. **User clicks "Start Voice Call"** → Fetches LiveKit token from `/api/voice/token`
3. **Token received** → Initializes LiveKit room connection
4. **Connecting state** → Shows loading indicator
5. **Connected** → Enables microphone, shows call controls
6. **During call** → User can mute/unmute mic and speaker
7. **End call** → Disconnects from room, cleans up resources

## Connection States

The component tracks and displays the following connection states:

- **Disconnected**: Initial state, not connected
- **Connecting**: Attempting to establish connection
- **Connected**: Successfully connected, call is active
- **Reconnecting**: Connection lost, attempting to reconnect

## Features

### Audio Controls

#### Microphone Control
- **Mute/Unmute**: Toggle local microphone
- **Visual Feedback**: Red background when muted, gray when active
- **Audio Visualization**: Shows real-time audio levels when speaking

#### Speaker Control
- **Mute/Unmute**: Toggle remote audio playback
- **Visual Feedback**: Red background when muted, gray when active

### Call Duration
Displays elapsed time in `MM:SS` format during active calls.

### Remote Participant Detection
Shows indicator when AI assistant is speaking with animated pulse effect.

### Automatic Reconnection
If connection is lost, the component automatically attempts to reconnect and displays reconnection status.

### Error Handling
- Failed token requests
- Connection errors
- LiveKit room errors
- Microphone permission errors
- Network disconnections

All errors display user-friendly messages with retry options.

## Environment Variables

Required in `.env.local`:

```bash
# LiveKit Configuration
LIVEKIT_API_KEY=your_api_key_here
LIVEKIT_API_SECRET=your_api_secret_here
LIVEKIT_HOST=wss://your-livekit-server.livekit.cloud

# Clerk Authentication (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## Dependencies

```json
{
  "@livekit/components-react": "^2.9.17",
  "livekit-client": "^2.16.1",
  "framer-motion": "latest",
  "@clerk/nextjs": "latest",
  "lucide-react": "latest"
}
```

## CSS/Styling

The component imports LiveKit's default styles:
```typescript
import "@livekit/components-styles"
```

Additional custom styling uses Tailwind CSS classes matching the A Startup Biz brand colors.

## Accessibility

- **ARIA Labels**: All interactive elements have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Status announcements and button descriptions
- **Focus Management**: Proper focus handling during state changes

## Browser Compatibility

Requires browsers with WebRTC support:
- Chrome/Edge 80+
- Firefox 75+
- Safari 14.1+
- Opera 67+

Mobile browsers:
- iOS Safari 14.1+
- Chrome for Android 80+

## Security

- **Token-based authentication**: Secure token generation with TTL
- **User verification**: Clerk authentication required
- **Room isolation**: Each call gets unique room identifier
- **Automatic expiration**: Tokens expire after 1 hour

## Performance Optimizations

- **Lazy loading**: LiveKit components load only when call starts
- **Audio-only**: No video processing for better performance
- **Automatic codec selection**: Uses optimal audio codec per connection
- **Adaptive bitrate**: Adjusts quality based on network conditions

## Troubleshooting

### Call won't connect
1. Check LiveKit environment variables
2. Verify firewall allows WebSocket connections
3. Check browser console for errors
4. Verify microphone permissions

### No audio
1. Check browser microphone permissions
2. Verify speaker is not muted
3. Check system audio settings
4. Try different browser

### Connection drops frequently
1. Check network stability
2. Verify LiveKit server status
3. Check for firewall/proxy issues
4. Try different network

## Testing

### Manual Testing Checklist
- [ ] Button appears for signed-in users
- [ ] Button doesn't appear for signed-out users
- [ ] Click opens call panel
- [ ] Start call initiates connection
- [ ] Microphone mute/unmute works
- [ ] Speaker mute/unmute works
- [ ] Call duration timer updates
- [ ] End call disconnects properly
- [ ] Panel closes after disconnection
- [ ] Error states display correctly
- [ ] Retry works after error
- [ ] Dark mode styling correct
- [ ] Animations smooth
- [ ] Responsive on mobile

### Integration Testing
```bash
# Start development server
npm run dev

# Navigate to a page with FloatingCallButton
# Sign in with Clerk
# Test call functionality
```

## Future Enhancements

Potential improvements:
- Call recording capability
- Call transfer functionality
- Multiple participant support
- Screen sharing
- Text chat during call
- Call history/logs
- Analytics and metrics
- Call quality indicators
- Background noise suppression
- Echo cancellation controls

## Support

For LiveKit-specific issues:
- [LiveKit Documentation](https://docs.livekit.io)
- [LiveKit GitHub](https://github.com/livekit)
- [LiveKit Discord](https://livekit.io/discord)

For component issues:
- Check component console logs
- Review API endpoint responses
- Verify environment variables
- Check browser compatibility
