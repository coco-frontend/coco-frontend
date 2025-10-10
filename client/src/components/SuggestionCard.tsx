import { Card } from "@/components/ui/card";
import { Lightbulb, MessageCircle, AlertCircle, TrendingUp } from "lucide-react";

export interface Suggestion {
  id: string;
  type: "tip" | "response" | "warning" | "insight";
  title: string;
  content: string;
}

interface SuggestionCardProps {
  suggestion: Suggestion;
}

const iconMap = {
  tip: Lightbulb,
  response: MessageCircle,
  warning: AlertCircle,
  insight: TrendingUp,
};

const colorMap = {
  tip: "text-chart-3",
  response: "text-primary",
  warning: "text-destructive",
  insight: "text-chart-2",
};

export default function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const Icon = iconMap[suggestion.type];

  return (
    <Card
      className="p-3 md:p-4 border-l-4 animate-slide-up hover-elevate"
      style={{
        borderLeftColor: `hsl(var(--chart-${suggestion.type === "tip" ? "3" : suggestion.type === "warning" ? "1" : "2"}))`,
      }}
      data-testid={`suggestion-card-${suggestion.id}`}
    >
      <div className="flex gap-2.5 md:gap-3">
        <div className={`mt-0.5 shrink-0 ${colorMap[suggestion.type]}`}>
          <Icon className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <div className="flex-1 space-y-1 min-w-0">
          <h4 className="font-semibold text-sm md:text-base text-foreground leading-tight">
            {suggestion.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {suggestion.content}
          </p>
        </div>
      </div>
    </Card>
  );
}
