'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ChatRoom } from './ChatRoom';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createSupportRoomId } from '@/lib/realtime-chat';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  defaultOpen?: boolean;
  minimizable?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  accentColor?: string;
  welcomeMessage?: string;
  title?: string;
}

export function ChatWidget({
  position = 'bottom-right',
  defaultOpen = false,
  minimizable = true,
  theme = 'auto',
  accentColor,
  welcomeMessage = 'Hi! How can we help you today?',
  title = 'Support Chat',
}: ChatWidgetProps) {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      setRoomId(createSupportRoomId(user.id));
    }
  }, [user]);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  if (!isLoaded || !user) {
    return null;
  }

  return (
    <>
      {/* Main Chat Widget */}
      <div
        className={cn(
          'fixed z-50 transition-all duration-300 ease-in-out',
          positionClasses[position]
        )}
        style={accentColor ? { '--accent-color': accentColor } as any : undefined}
      >
        {isOpen ? (
          <div
            className={cn(
              'flex flex-col bg-background border rounded-lg shadow-2xl overflow-hidden transition-all duration-300',
              isMinimized
                ? 'w-80 h-14'
                : 'w-96 h-[600px]'
            )}
          >
            {isMinimized ? (
              <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">{title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleMinimize}
                    className="h-8 w-8 hover:bg-primary-foreground/20"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="h-8 w-8 hover:bg-primary-foreground/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <div>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="text-xs opacity-90">We typically reply in minutes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {minimizable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleMinimize}
                        className="h-8 w-8 hover:bg-primary-foreground/20"
                      >
                        <Minimize2 className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClose}
                      className="h-8 w-8 hover:bg-primary-foreground/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {welcomeMessage && (
                  <div className="p-4 bg-muted/50 border-b">
                    <p className="text-sm text-foreground">{welcomeMessage}</p>
                  </div>
                )}

                <ChatRoom
                  roomId={roomId}
                  roomName={title}
                  roomType="support"
                  showHeader={false}
                  maxHeight="calc(600px - 200px)"
                  className="border-0 flex-1"
                />
              </>
            )}
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleToggle}
                  size="lg"
                  className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform relative"
                  aria-label="Open chat"
                >
                  <MessageCircle className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Chat with us</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Backdrop for mobile */}
      {isOpen && !isMinimized && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={handleClose}
        />
      )}
    </>
  );
}
