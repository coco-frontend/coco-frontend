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
      className="p-4 border-l-4 animate-slide-up hover-elevate"
      style={{
        borderLeftColor: `hsl(var(--chart-${suggestion.type === "tip" ? "3" : suggestion.type === "warning" ? "1" : "2"}))`,
      }}
      data-testid={`suggestion-card-${suggestion.id}`}
    >
      <div className="flex gap-3">
        <div className={`mt-0.5 ${colorMap[suggestion.type]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-medium text-sm text-foreground">
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
