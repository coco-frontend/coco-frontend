import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import SessionHeader from "@/components/SessionHeader";
import { TranscriptLine } from "@/components/TranscriptDisplay";
import SuggestionsPanel from "@/components/SuggestionsPanel";
import { Suggestion } from "@/components/SuggestionCard";
import { useToast } from "@/hooks/use-toast";

export default function SessionPage() {
  const [, setLocation] = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState("00:00");
  const [seconds, setSeconds] = useState(0);
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(false);
  const { toast } = useToast();

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser. Try Chrome or Edge.",
          variant: "destructive",
        });
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript;
          const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            minute: '2-digit', 
            second: '2-digit' 
          });
          
          const newTranscript: TranscriptLine = {
            id: Date.now().toString(),
            text: transcript,
            timestamp: timestamp.slice(0, 5),
            speaker: "user",
          };
          
          setTranscripts(prev => {
            const updated = [...prev, newTranscript];
            // Send to backend for AI suggestions
            fetchSuggestions(updated);
            return updated;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          return;
        }
        if (event.error === 'not-allowed') {
          toast({
            title: "Permission Denied",
            description: "Microphone access was denied. Please allow microphone access to use COCO.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch (error) {
            console.error('Failed to restart recognition:', error);
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  // Fetch AI suggestions from backend
  const fetchSuggestions = async (currentTranscripts: TranscriptLine[]) => {
    try {
      const context = localStorage.getItem('conversationContext');
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcripts: currentTranscripts,
          context: context ? JSON.parse(context) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  // Timer
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

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      isRecordingRef.current = false;
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        isRecordingRef.current = true;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        toast({
          title: "Recording Failed",
          description: "Could not start recording. Please check your microphone permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session?")) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SessionHeader
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        onEndSession={handleEndSession}
        onBack={() => setLocation("/")}
        duration={duration}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-3 md:p-4 pb-6">
          <section>
            <SuggestionsPanel suggestions={suggestions} />
          </section>
        </div>
      </main>
    </div>
  );
}
