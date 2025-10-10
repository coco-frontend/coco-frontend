import SuggestionCard, { Suggestion } from "../SuggestionCard";

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
    type: "warning",
    title: "Conversation Pace",
    content: "You might be speaking too quickly. Try slowing down slightly.",
  },
  {
    id: "4",
    type: "insight",
    title: "Positive Signal",
    content: "They seem interested! Their body language shows engagement.",
  },
];

export default function SuggestionCardExample() {
  return (
    <div className="space-y-3 p-4">
      {mockSuggestions.map((suggestion) => (
        <SuggestionCard key={suggestion.id} suggestion={suggestion} />
      ))}
    </div>
  );
}
