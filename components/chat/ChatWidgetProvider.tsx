'use client';

import { ChatWidget } from './ChatWidget';

interface ChatWidgetProviderProps {
  enabled?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  defaultOpen?: boolean;
  welcomeMessage?: string;
  title?: string;
}

/**
 * Chat Widget Provider - Add this to your layout to enable site-wide chat
 *
 * Example usage in layout.tsx:
 * <ChatWidgetProvider enabled={true} position="bottom-right" />
 */
export function ChatWidgetProvider({
  enabled = true,
  position = 'bottom-right',
  defaultOpen = false,
  welcomeMessage = 'Hi! How can we help you today?',
  title = 'Support Chat',
}: ChatWidgetProviderProps) {
  if (!enabled) {
    return null;
  }

  return (
    <ChatWidget
      position={position}
      defaultOpen={defaultOpen}
      welcomeMessage={welcomeMessage}
      title={title}
    />
  );
}
