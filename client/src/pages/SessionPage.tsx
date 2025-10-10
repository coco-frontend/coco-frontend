import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import SessionHeader from "@/components/SessionHeader";
import TranscriptDisplay, { TranscriptLine } from "@/components/TranscriptDisplay";
import SuggestionsPanel from "@/components/SuggestionsPanel";
import { Suggestion } from "@/components/SuggestionCard";
import { Separator } from "@/components/ui/separator";

// todo: remove mock functionality
const mockTranscripts: TranscriptLine[] = [
  {
    id: "1",
    text: "Hi, thanks for taking the time to meet with me today.",
    timestamp: "00:00",
    speaker: "user",
  },
  {
    id: "2",
    text: "Of course! I'm glad we could connect. What would you like to discuss?",
    timestamp: "00:05",
    speaker: "other",
  },
  {
    id: "3",
    text: "I wanted to talk about the project timeline and some ideas I have.",
    timestamp: "00:12",
    speaker: "user",
  },
];

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    type: "tip",
    title: "Active Listening",
    content: "Show you're engaged by nodding and maintaining eye contact.",
  },
  {
    id: "2",
    type: "response",
    title: "Suggested Response",
    content: "That's a great point. Can you tell me more about your approach?",
  },
  {
    id: "3",
    type: "insight",
    title: "Positive Signal",
    content: "They seem interested! Their body language shows engagement.",
  },
];

export default function SessionPage() {
  const [, setLocation] = useLocation();
  const [isRecording, setIsRecording] = useState(true);
  const [duration, setDuration] = useState("00:00");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  useEffect(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    setDuration(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
  }, [seconds]);

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session?")) {
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SessionHeader
        isRecording={isRecording}
        onToggleRecording={() => setIsRecording(!isRecording)}
        onEndSession={handleEndSession}
        onBack={() => setLocation("/")}
        duration={duration}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Live Transcript
            </h2>
            <TranscriptDisplay transcripts={mockTranscripts} />
          </section>

          <Separator />

          <section>
            <SuggestionsPanel suggestions={mockSuggestions} />
          </section>
        </div>
      </main>
    </div>
  );
}
