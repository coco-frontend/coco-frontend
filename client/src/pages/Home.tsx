import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRive } from "@rive-app/react-canvas";
import { Mic } from "lucide-react";
import ContextPill from "@/components/ContextPill";

export default function Home() {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [goals, setGoals] = useState("");
  const [participants, setParticipants] = useState("");

  const [riveError, setRiveError] = useState(false);
  
  const { RiveComponent, rive } = useRive({
    src: "/attached_assets/coco.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    onLoad: () => {
      if (rive) {
        const inputs = rive.stateMachineInputs("State Machine 1");
        const loadingTrigger = inputs?.find(i => i.name === "Loading");
        if (loadingTrigger) {
          loadingTrigger.fire();
        }
      }
    },
    onLoadError: () => {
      setRiveError(true);
    },
  });

  // Load saved context from localStorage on mount
  useEffect(() => {
    const savedContext = localStorage.getItem("conversationContext");
    if (savedContext) {
      try {
        const context = JSON.parse(savedContext);
        if (context.userName) setUserName(context.userName);
        if (context.eventDetails) setEventDetails(context.eventDetails);
        if (context.goals) setGoals(context.goals);
        if (context.participants) setParticipants(context.participants);
      } catch (error) {
        console.error("Failed to load saved context:", error);
      }
    }
  }, []);

  // Save context to localStorage whenever values change
  useEffect(() => {
    const context = { userName, eventDetails, goals, participants };
    localStorage.setItem("conversationContext", JSON.stringify(context));
  }, [userName, eventDetails, goals, participants]);

  const handleStartSession = () => {
    if (rive) {
      const inputs = rive.stateMachineInputs("State Machine 1");
      const voiceStartsTrigger = inputs?.find(i => i.name === "voice starts");
      if (voiceStartsTrigger) {
        voiceStartsTrigger.fire();
      }
    }
    setTimeout(() => {
      setLocation("/session");
    }, 300);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: 'url(/attached_assets/landing_background.webp), linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, hsl(var(--accent) / 0.2) 50%, hsl(var(--chart-3) / 0.2) 100%)',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
      {/* Semi-transparent overlay for depth */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      
      {/* Centered content container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="space-y-6">
          {/* Main card with animation and title */}
          <Card className="p-6 space-y-4 text-center bg-card/95 backdrop-blur">
            {/* Rive Animation or Fallback */}
            <div className="flex justify-center -mt-2">
              {riveError ? (
                <div className="w-40 h-40 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mic className="w-12 h-12 text-primary" />
                  </div>
                </div>
              ) : (
                <div className="w-40 h-40">
                  <RiveComponent />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-foreground tracking-tight">
                COCO
              </h1>
              <p className="text-sm text-muted-foreground">
                Your Conversation Companion
              </p>
            </div>

            {/* Context Pills */}
            <div className="space-y-2 pt-2">
              <ContextPill
                label="Your Name"
                value={userName}
                onChange={setUserName}
                placeholder="e.g., Alex Johnson"
                type="input"
                testId="input-user-name"
              />
              
              <ContextPill
                label="Event Details"
                value={eventDetails}
                onChange={setEventDetails}
                placeholder="e.g., Team meeting"
                type="input"
                testId="input-event-details"
              />
              
              <ContextPill
                label="Your Goals"
                value={goals}
                onChange={setGoals}
                placeholder="What do you want to achieve?"
                type="textarea"
                testId="input-goals"
              />
              
              <ContextPill
                label="Participants & Relationships"
                value={participants}
                onChange={setParticipants}
                placeholder="Who will you be talking to?"
                type="textarea"
                testId="input-participants"
              />
            </div>

            {/* Start button */}
            <div className="pt-2">
              <Button
                onClick={handleStartSession}
                size="lg"
                className="w-full h-14 text-base font-semibold rounded-full"
                data-testid="button-start-session"
              >
                Let's Talk!
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
