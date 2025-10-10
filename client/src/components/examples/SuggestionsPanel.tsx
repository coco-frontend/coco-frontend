import SuggestionsPanel from "../SuggestionsPanel";
import { Suggestion } from "../SuggestionCard";

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

export default function SuggestionsPanelExample() {
  return <SuggestionsPanel suggestions={mockSuggestions} />;
}
