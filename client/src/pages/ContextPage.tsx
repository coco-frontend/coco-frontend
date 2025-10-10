import { useLocation } from "wouter";
import ContextForm from "@/components/ContextForm";

export default function ContextPage() {
  const [, setLocation] = useLocation();

  const handleSubmit = (context: {
    eventDetails: string;
    goals: string;
    participants: string;
  }) => {
    console.log("Context saved:", context);
    localStorage.setItem("conversationContext", JSON.stringify(context));
    setLocation("/session");
  };

  const handleSkip = () => {
    setLocation("/session");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <ContextForm onSubmit={handleSubmit} onSkip={handleSkip} />
    </div>
  );
}
