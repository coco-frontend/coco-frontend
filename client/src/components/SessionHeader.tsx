import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, MicOff, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SessionHeaderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  onEndSession: () => void;
  onBack?: () => void;
  duration: string;
}

export default function SessionHeader({
  isRecording,
  onToggleRecording,
  onEndSession,
  onBack,
  duration,
}: SessionHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <Badge
              variant={isRecording ? "default" : "secondary"}
              className={isRecording ? "animate-pulse-recording" : ""}
              data-testid="badge-recording-status"
            >
              {isRecording ? "Recording" : "Paused"}
            </Badge>
            <span className="text-sm text-muted-foreground" data-testid="text-duration">
              {duration}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isRecording ? "secondary" : "default"}
            size="icon"
            onClick={onToggleRecording}
            data-testid="button-toggle-recording"
          >
            {isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={onEndSession}
            data-testid="button-end-session"
          >
            <Square className="h-4 w-4 mr-2" />
            End
          </Button>
        </div>
      </div>
    </header>
  );
}
