import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContextPillProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "input" | "textarea";
  testId?: string;
}

export default function ContextPill({
  label,
  value,
  onChange,
  placeholder,
  type = "input",
  testId,
}: ContextPillProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const isFilled = value.trim() !== "";

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleToggle = () => {
    if (!isExpanded) {
      setLocalValue(value);
    }
    setIsExpanded(!isExpanded);
  };

  const handleSave = () => {
    if (localValue.trim()) {
      onChange(localValue);
      setIsExpanded(false);
    }
  };

  const handleCancel = () => {
    setLocalValue(value);
    setIsExpanded(false);
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        onClick={handleToggle}
        className={`w-full h-12 justify-between rounded-full text-sm font-medium transition-all ${
          isFilled ? "bg-primary/10 border-primary/30" : ""
        }`}
        data-testid={`pill-${testId}`}
      >
        <span className="flex items-center gap-2">
          {isFilled && <Check className="h-4 w-4 text-primary" />}
          {label}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <div className="space-y-3 px-2 animate-in slide-in-from-top-2 duration-200">
          <Label htmlFor={testId} className="text-sm font-medium sr-only">
            {label}
          </Label>
          {type === "textarea" ? (
            <Textarea
              id={testId}
              data-testid={testId}
              placeholder={placeholder}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              className="min-h-24 resize-none text-base"
              autoFocus
            />
          ) : (
            <Input
              id={testId}
              data-testid={testId}
              placeholder={placeholder}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              className="h-12 text-base"
              autoFocus
            />
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="rounded-full"
              disabled={!localValue.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
