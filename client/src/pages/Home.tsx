import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRive } from "@rive-app/react-canvas";
import { Check, ArrowLeft, Mic, Pause, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import landingBg from "@assets/landing_background.webp";

type AppState = "nameEntry" | "contextMenu" | "editingContext" | "recording";
type ContextField = "eventDetails" | "goals" | "participants";

interface Suggestion {
  text: string;
  type: string;
  priority: string;
}

export default function Home() {
  const { toast } = useToast();
  
  // App state
  const [appState, setAppState] = useState<AppState>("nameEntry");
  const [editingField, setEditingField] = useState<ContextField | null>(null);
  
  // Context data
  const [userName, setUserName] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [goals, setGoals] = useState("");
  const [participants, setParticipants] = useState("");
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  // Refs for speech recognition
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { RiveComponent, rive } = useRive({
    src: "/attached_assets/coco-v3.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  // Fire "Loading" trigger when rive instance becomes available
  useEffect(() => {
    if (rive) {
      const inputs = rive.stateMachineInputs("State Machine 1");
      console.log("State machine inputs:", inputs?.map(i => i.name));
      
      const loadingTrigger = inputs?.find(i => i.name === "Loading");
      if (loadingTrigger) {
        console.log("Firing Loading trigger");
        loadingTrigger.fire();
      }
    }
  }, [rive]);

  // Load saved context from localStorage on mount
  useEffect(() => {
    const savedContext = localStorage.getItem("conversationContext");
    if (savedContext) {
      try {
        const context = JSON.parse(savedContext);
        if (context.userName) {
          setUserName(context.userName);
          setAppState("contextMenu"); // Skip to context menu if name exists
        }
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

  // Confirm name and move to context menu
  const handleConfirmName = () => {
    if (userName.trim()) {
      setAppState("contextMenu");
    }
  };

  // Edit a specific context field
  const handleEditField = (field: ContextField) => {
    setEditingField(field);
    setAppState("editingContext");
  };

  // Go back to context menu
  const handleBackToMenu = () => {
    setEditingField(null);
    setAppState("contextMenu");
  };

  // Start recording
  const handleStartRecording = async () => {
    // First, try to request microphone permission explicitly
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (rive) {
        const inputs = rive.stateMachineInputs("State Machine 1");
        const voiceStartedTrigger = inputs?.find(i => i.name === "Voice started");
        if (voiceStartedTrigger) {
          console.log("Firing Voice started trigger");
          voiceStartedTrigger.fire();
        }
      }
      
      setAppState("recording");
      setIsRecording(true);
      setIsPaused(false);
      
      // Show mockup suggestion
      setSuggestions([{
        text: "Happy birthday to Jamie",
        type: "tip",
        priority: "high"
      }]);
      
      startSpeechRecognition();
    } catch (error: any) {
      console.error('Microphone permission error:', error);
      
      // Show detailed instructions based on the error
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast({
          title: "Microphone Access Blocked",
          description: "Please click the 🔒 or ⓘ icon in your browser's address bar and allow microphone access, then try again.",
          variant: "destructive",
          duration: 10000,
        });
      } else if (error.name === 'NotFoundError') {
        toast({
          title: "No Microphone Found",
          description: "Please connect a microphone to use this feature.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Microphone Error",
          description: error.message || "Could not access microphone. Please check your browser settings.",
          variant: "destructive",
        });
      }
    }
  };

  // Speech recognition setup
  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser. Please use Chrome.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
        generateSuggestions(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast({
          title: "Permission Denied",
          description: "Please allow microphone access to use this feature.",
          variant: "destructive",
        });
        // Stay in recording state to allow UI testing
        setIsPaused(true);
      }
    };

    recognition.onend = () => {
      if (isRecording && !isPaused) {
        restartTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && isRecording && !isPaused) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
            }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Generate AI suggestions
  const generateSuggestions = async (newTranscript: string) => {
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            userName,
            eventDetails,
            goals,
            participants,
          },
          transcript: newTranscript,
        }),
      });

      if (!response.ok) {
        if (response.status === 503) {
          toast({
            title: "API Key Missing",
            description: "Please add OPENAI_API_KEY to enable AI suggestions.",
          });
        }
        return;
      }

      const data = await response.json();
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions.slice(0, 3)); // Show top 3 suggestions
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  // Pause/Resume recording
  const handleTogglePause = () => {
    if (isPaused) {
      // Resume
      setIsPaused(false);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } else {
      // Pause
      setIsPaused(true);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    }
  };

  // End session
  const handleEndSession = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    setTranscript("");
    setSuggestions([]);
    setAppState("contextMenu");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col p-4"
      style={{
        backgroundImage: `url(${landingBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top Header */}
      <div className="w-full text-center pt-4 pb-2">
        <p className="text-sm font-medium text-[#ffffff]" data-testid="text-header">
          Conversation Companion
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <Card className="p-6 space-y-4 text-center bg-transparent border-0 shadow-none">
            {/* Rive Animation */}
            <div className="flex justify-center -mt-2">
              <div className="w-64 h-64">
                <RiveComponent />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-[#ffffff] tracking-tight">
                COCO
              </h1>
              <p className="text-sm text-[#ffffff]">
                Say a bit more about your chat!
              </p>
            </div>

          {/* NAME ENTRY STATE */}
          {appState === "nameEntry" && (
            <div className="space-y-4 pt-2">
              <Input
                placeholder="What's your name?"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-12 text-base text-center bg-white/90 rounded-full focus-visible:ring-yellow-400"
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmName()}
                autoFocus
                data-testid="input-user-name"
              />
              <Button
                onClick={handleConfirmName}
                disabled={!userName.trim()}
                size="lg"
                className="w-full h-14 text-base font-semibold rounded-full bg-[#FFE8C9] hover:bg-[#FFE8C9]/90 text-black border-0"
                data-testid="button-confirm-name"
              >
                Confirm
              </Button>
            </div>
          )}

          {/* CONTEXT MENU STATE */}
          {appState === "contextMenu" && (
            <div className="space-y-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setAppState("nameEntry")}
                className="text-[#ffffff] hover:bg-white/10 mb-2"
                data-testid="button-back-to-name"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <Button
                variant="outline"
                onClick={() => handleEditField("eventDetails")}
                className="w-full h-12 justify-between rounded-full text-sm font-medium border-0"
                data-testid="pill-event-details"
              >
                <span className="flex items-center gap-2 text-[#ffffff]">
                  {eventDetails && <Check className="h-4 w-4 text-primary" />}
                  Event Details
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleEditField("goals")}
                className="w-full h-12 justify-between rounded-full text-sm font-medium border-0"
                data-testid="pill-goals"
              >
                <span className="flex items-center gap-2 text-[#ffffff]">
                  {goals && <Check className="h-4 w-4 text-primary" />}
                  Your Goals
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleEditField("participants")}
                className="w-full h-12 justify-between rounded-full text-sm font-medium border-0"
                data-testid="pill-participants"
              >
                <span className="flex items-center gap-2 text-[#ffffff]">
                  {participants && <Check className="h-4 w-4 text-primary" />}
                  Participants & Relationships
                </span>
              </Button>

              <div className="pt-2">
                <Button
                  onClick={handleStartRecording}
                  size="lg"
                  className="w-full h-14 text-base font-semibold rounded-full bg-[#FFE8C9] hover:bg-[#FFE8C9]/90 text-black border-0"
                  data-testid="button-start-session"
                >
                  Let's Talk!
                </Button>
              </div>
            </div>
          )}

          {/* EDITING CONTEXT STATE */}
          {appState === "editingContext" && editingField && (
            <div className="space-y-4 pt-2">
              <Button
                variant="ghost"
                onClick={handleBackToMenu}
                className="text-[#ffffff] hover:bg-white/10"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {editingField === "eventDetails" && (
                <Input
                  placeholder="e.g., Team meeting"
                  value={eventDetails}
                  onChange={(e) => setEventDetails(e.target.value)}
                  className="h-12 text-base bg-white/90 rounded-full focus-visible:ring-yellow-400"
                  autoFocus
                  data-testid="input-event-details"
                />
              )}

              {editingField === "goals" && (
                <Textarea
                  placeholder="What do you want to achieve?"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="min-h-24 text-base bg-white/90 rounded-3xl focus-visible:ring-yellow-400"
                  autoFocus
                  data-testid="input-goals"
                />
              )}

              {editingField === "participants" && (
                <Textarea
                  placeholder="Who will you be talking to?"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="min-h-24 text-base bg-white/90 rounded-3xl focus-visible:ring-yellow-400"
                  autoFocus
                  data-testid="input-participants"
                />
              )}

              <Button
                onClick={handleBackToMenu}
                size="lg"
                className="w-full h-14 text-base font-semibold rounded-full bg-[#FFE8C9] hover:bg-[#FFE8C9]/90 text-black border-0"
                data-testid="button-save-context"
              >
                Save
              </Button>
            </div>
          )}

          {/* RECORDING STATE */}
          {appState === "recording" && (
            <div className="space-y-4 pt-2">
              {/* Recording indicator */}
              <div className="flex items-center justify-center gap-2 text-[#ffffff]">
                <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`} />
                <span className="text-sm font-medium">
                  {isPaused ? 'Paused' : 'Recording...'}
                </span>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-[#ffffff]/70">Suggestions:</p>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-white text-black px-4 py-3 rounded-full text-sm"
                      data-testid={`suggestion-${index}`}
                    >
                      {suggestion.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Control buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleTogglePause}
                  size="lg"
                  className="flex-1 h-14 text-base font-semibold rounded-full bg-white/90 hover:bg-white text-black border-0"
                  data-testid="button-toggle-pause"
                >
                  {isPaused ? <Mic className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                  <span className="ml-2">{isPaused ? 'Resume' : 'Pause'}</span>
                </Button>
                <Button
                  onClick={handleEndSession}
                  size="lg"
                  className="flex-1 h-14 text-base font-semibold rounded-full bg-red-500 hover:bg-red-600 text-white border-0"
                  data-testid="button-end-session"
                >
                  <Square className="h-5 w-5" />
                  <span className="ml-2">End</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
      </div>
    </div>
  );
}
