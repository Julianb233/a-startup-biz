'use client';

import { ChatMessage as ChatMessageType } from '@/lib/realtime-chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { File, Image as ImageIcon, CheckCheck, Check } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwn: boolean;
  showAvatar?: boolean;
  userName?: string;
  userAvatar?: string;
}

export function ChatMessage({
  message,
  isOwn,
  showAvatar = true,
  userName,
  userAvatar,
}: ChatMessageProps) {
  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={message.content}
              alt="Shared image"
              className="max-w-xs rounded-lg"
            />
          </div>
        );
      case 'file':
        return (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors"
          >
            <File className="w-5 h-5" />
            <span className="font-medium">
              {message.metadata?.filename || 'Download file'}
            </span>
          </a>
        );
      case 'system':
        return (
          <div className="text-center py-2 px-4 bg-muted rounded-lg text-sm text-muted-foreground">
            {message.content}
          </div>
        );
      default:
        return (
          <div
            className={cn(
              'px-4 py-2 rounded-2xl break-words max-w-xs md:max-w-md lg:max-w-lg',
              isOwn
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            )}
          >
            {message.content}
          </div>
        );
    }
  };

  if (message.type === 'system') {
    return <div className="flex justify-center my-2">{renderContent()}</div>;
  }

  return (
    <div
      className={cn(
        'flex gap-2 mb-4 group',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {showAvatar && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={userAvatar} alt={userName || message.user_name} />
          <AvatarFallback className="text-xs">
            {(userName || message.user_name).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        {!isOwn && showAvatar && (
          <span className="text-xs text-muted-foreground mb-1 px-1">
            {userName || message.user_name}
          </span>
        )}

        {renderContent()}

        <div
          className={cn(
            'flex items-center gap-1 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isOwn ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.created_at), 'p')}
          </span>

          {isOwn && (
            <div className="text-muted-foreground">
              {message.metadata?.read ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
