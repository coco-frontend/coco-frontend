import { useState } from "react";
import { useLocation } from "wouter";
import StartSessionCard from "@/components/StartSessionCard";

export default function Home() {
  const [, setLocation] = useLocation();
  const [hasContext] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <StartSessionCard
        onStartSession={() => setLocation("/session")}
        onSetContext={() => setLocation("/context")}
        hasContext={hasContext}
      />
    </div>
  );
}
