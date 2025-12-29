'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  X,
  Minimize2,
  Users,
  Phone,
  Video,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
}

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  participants?: Participant[];
  onlineCount?: number;
  onClose?: () => void;
  onMinimize?: () => void;
  onInfo?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  showActions?: boolean;
  className?: string;
}

export function ChatHeader({
  title,
  subtitle,
  participants = [],
  onlineCount,
  onClose,
  onMinimize,
  onInfo,
  onCall,
  onVideoCall,
  showActions = true,
  className,
}: ChatHeaderProps) {
  const displayParticipants = participants.slice(0, 3);
  const remainingCount = Math.max(0, participants.length - 3);

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 p-4 border-b border-border bg-background',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {displayParticipants.length > 0 ? (
          <div className="flex -space-x-2">
            {displayParticipants.map((participant) => (
              <Avatar key={participant.id} className="w-10 h-10 border-2 border-background">
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback>
                  {participant.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {remainingCount > 0 && (
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs font-medium">+{remainingCount}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
          {onlineCount !== undefined && (
            <p className="text-xs text-muted-foreground">
              {onlineCount} {onlineCount === 1 ? 'participant' : 'participants'} online
            </p>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex items-center gap-1">
          {onVideoCall && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onVideoCall}
              className="shrink-0"
            >
              <Video className="w-5 h-5" />
            </Button>
          )}

          {onCall && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCall}
              className="shrink-0"
            >
              <Phone className="w-5 h-5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onInfo && (
                <>
                  <DropdownMenuItem onClick={onInfo}>
                    <Info className="w-4 h-4 mr-2" />
                    Room info
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {onMinimize && (
                <DropdownMenuItem onClick={onMinimize}>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Minimize
                </DropdownMenuItem>
              )}
              {onClose && (
                <DropdownMenuItem onClick={onClose} className="text-destructive">
                  <X className="w-4 h-4 mr-2" />
                  Close
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
