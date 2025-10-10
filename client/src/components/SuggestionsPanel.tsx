import { ScrollArea } from "@/components/ui/scroll-area";
import SuggestionCard, { Suggestion } from "./SuggestionCard";

interface SuggestionsPanelProps {
  suggestions: Suggestion[];
}

export default function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  if (suggestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 md:h-40 text-center px-4">
        <p className="text-muted-foreground text-sm">
          💡 I'll share helpful suggestions here as your conversation flows
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-sm md:text-base font-semibold text-foreground mb-3 px-1">
        💡 COCO's Suggestions
      </h3>
      <ScrollArea className="h-72 md:h-80">
        <div className="space-y-3 pb-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
