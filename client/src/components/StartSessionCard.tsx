import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Settings } from "lucide-react";

interface StartSessionCardProps {
  onStartSession: () => void;
  onSetContext: () => void;
  hasContext?: boolean;
}

export default function StartSessionCard({
  onStartSession,
  onSetContext,
  hasContext = false,
}: StartSessionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <Card className="p-8 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">
            Conversation Companion
          </h1>
          <p className="text-muted-foreground">
            Get real-time suggestions to navigate your conversations with confidence
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Mic className="h-12 w-12 text-primary" />
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={onStartSession}
            size="lg"
            className="w-full h-14 text-base"
            data-testid="button-start-session"
          >
            <Mic className="mr-2 h-5 w-5" />
            Start Conversation
          </Button>
          
          <Button
            onClick={onSetContext}
            variant="outline"
            size="lg"
            className="w-full h-12"
            data-testid="button-set-context"
          >
            <Settings className="mr-2 h-4 w-4" />
            {hasContext ? "Update Context" : "Set Context First"}
          </Button>
        </div>

        {hasContext && (
          <p className="text-sm text-chart-3">
            ✓ Context set - we'll provide personalized suggestions
          </p>
        )}
      </Card>
    </div>
  );
}
