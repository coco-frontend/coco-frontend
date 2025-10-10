import TranscriptDisplay, { TranscriptLine } from "../TranscriptDisplay";

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

export default function TranscriptDisplayExample() {
  return <TranscriptDisplay transcripts={mockTranscripts} />;
}
