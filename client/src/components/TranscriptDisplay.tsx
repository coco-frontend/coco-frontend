import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

export interface TranscriptLine {
  id: string;
  text: string;
  timestamp: string;
  speaker?: "user" | "other";
}

interface TranscriptDisplayProps {
  transcripts: TranscriptLine[];
}

export default function TranscriptDisplay({ transcripts }: TranscriptDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  if (transcripts.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-center">
        <p className="text-muted-foreground text-sm">
          🎙️ Start recording to see your conversation transcript here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-64 w-full rounded-lg border bg-card p-4" ref={scrollRef}>
      <div className="space-y-3">
        {transcripts.map((line) => (
          <div
            key={line.id}
            className={`flex flex-col ${line.speaker === "user" ? "items-end" : "items-start"}`}
            data-testid={`transcript-line-${line.id}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                line.speaker === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm leading-relaxed">{line.text}</p>
            </div>
            <span className="text-xs text-muted-foreground mt-1 px-2">
              {line.timestamp}
            </span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
