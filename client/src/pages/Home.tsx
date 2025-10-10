import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Mic, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isContextOpen, setIsContextOpen] = useState(true);
  const [hasContext, setHasContext] = useState(false);
  
  const [eventDetails, setEventDetails] = useState("");
  const [goals, setGoals] = useState("");
  const [participants, setParticipants] = useState("");

  const handleSaveContext = () => {
    const context = { eventDetails, goals, participants };
    console.log("Context saved:", context);
    localStorage.setItem("conversationContext", JSON.stringify(context));
    setHasContext(true);
    setIsContextOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <Card className="p-8 text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              COCO
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Your Conversation Companion
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Get real-time suggestions to navigate your conversations with confidence ✨
            </p>
          </div>

          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center hover-elevate">
              <Mic className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={() => setLocation("/session")}
              size="lg"
              className="w-full h-14 text-base"
              data-testid="button-start-session"
            >
              <Mic className="mr-2 h-5 w-5" />
              Let's Talk!
            </Button>
          </div>

          {hasContext && (
            <p className="text-sm text-chart-3 font-medium">
              ✨ Context set - I'll provide personalized suggestions just for you!
            </p>
          )}
        </Card>

        <Collapsible open={isContextOpen} onOpenChange={setIsContextOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12"
              data-testid="button-toggle-context"
            >
              {isContextOpen ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Hide Context
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  {hasContext ? "Update My Context" : "Set Context (Optional)"}
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Help COCO Understand 💭
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Share some context so I can give you better, more personalized suggestions!
                  </p>
                </div>

                <div className="space-y-4">
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

                  <Button
                    onClick={handleSaveContext}
                    className="w-full h-12"
                    data-testid="button-save-context"
                  >
                    Save Context
                  </Button>
                </div>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
