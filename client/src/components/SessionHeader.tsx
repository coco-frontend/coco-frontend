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
      <div className="flex items-center justify-between h-14 md:h-16 px-3 md:px-4 max-w-7xl mx-auto gap-2">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              data-testid="button-back"
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <Badge
              variant={isRecording ? "default" : "secondary"}
              className={`text-xs md:text-sm ${isRecording ? "animate-pulse-recording" : ""}`}
              data-testid="badge-recording-status"
            >
              {isRecording ? "Recording" : "Paused"}
            </Badge>
            <span className="text-sm text-muted-foreground font-medium tabular-nums" data-testid="text-duration">
              {duration}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <Button
            variant={isRecording ? "secondary" : "default"}
            size="icon"
            onClick={onToggleRecording}
            data-testid="button-toggle-recording"
            className="shrink-0"
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
            className="h-9 px-3 md:px-4 shrink-0"
          >
            <Square className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden md:inline">End</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
