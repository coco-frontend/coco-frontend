import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";

interface ContextFormProps {
  onSubmit: (context: {
    eventDetails: string;
    goals: string;
    participants: string;
  }) => void;
  onSkip: () => void;
}

export default function ContextForm({ onSubmit, onSkip }: ContextFormProps) {
  const [eventDetails, setEventDetails] = useState("");
  const [goals, setGoals] = useState("");
  const [participants, setParticipants] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ eventDetails, goals, participants });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Help Coco Understand 💭
        </h1>
        <p className="text-muted-foreground">
          Share some context so I can give you better, more personalized suggestions!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="event-details" className="text-sm font-medium">
            Event Details
          </Label>
          <Input
            id="event-details"
            data-testid="input-event-details"
            placeholder="e.g., Team meeting, Coffee with a friend, Job interview"
            value={eventDetails}
            onChange={(e) => setEventDetails(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals" className="text-sm font-medium">
            Your Goals
          </Label>
          <Textarea
            id="goals"
            data-testid="input-goals"
            placeholder="What do you want to achieve in this conversation?"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="min-h-24 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="participants" className="text-sm font-medium">
            Participants & Relationships
          </Label>
          <Textarea
            id="participants"
            data-testid="input-participants"
            placeholder="Who will you be talking to? What's your relationship?"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="min-h-24 resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            data-testid="button-skip-context"
            className="flex-1 h-12"
          >
            I'll Skip This
          </Button>
          <Button
            type="submit"
            data-testid="button-save-context"
            className="flex-1 h-12"
          >
            Let's Go!
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
