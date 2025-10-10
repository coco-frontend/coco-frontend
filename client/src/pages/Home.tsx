import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRive } from "@rive-app/react-canvas";
import ContextPill from "@/components/ContextPill";

export default function Home() {
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [goals, setGoals] = useState("");
  const [participants, setParticipants] = useState("");

  const { RiveComponent, rive } = useRive({
    src: "/attached_assets/coco_1760095148906.riv",
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

  const hasContext = userName || eventDetails || goals || participants;

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
    <div className="min-h-screen bg-background flex items-start md:items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-2xl space-y-4 md:space-y-5 py-4 md:py-0">
        <Card className="p-6 md:p-8 text-center space-y-4 md:space-y-6">
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              COCO
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-medium">
              Your Conversation Companion
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto px-2">
              Get real-time suggestions to navigate your conversations with confidence ✨
            </p>
          </div>

          <div className="flex justify-center py-2">
            <div className="w-32 h-32 md:w-40 md:h-40">
              <RiveComponent />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleStartSession}
              size="lg"
              className="w-full h-14 md:h-16 text-base md:text-lg font-semibold rounded-full"
              data-testid="button-start-session"
            >
              Let's Talk!
            </Button>
          </div>

          {hasContext && (
            <p className="text-sm text-chart-3 font-medium">
              ✨ Context set - I'll provide personalized suggestions just for you!
            </p>
          )}
        </Card>

        <Card className="p-4 md:p-6">
          <div className="space-y-4 md:space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-base md:text-lg font-bold text-foreground">
                Customize your session
              </h3>
              <p className="text-sm text-muted-foreground">
                Share some context so I can give you personalized suggestions!
              </p>
            </div>

            <div className="space-y-3">
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
                placeholder="e.g., Team meeting, Coffee chat..."
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
          </div>
        </Card>
      </div>
    </div>
  );
}
