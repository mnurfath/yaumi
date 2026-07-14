"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Plus } from "lucide-react";
import { incrementProgress } from "@/app/(user)/actions";
import { cn } from "@/lib/utils";

interface AdhkarCounterProps {
  adhkar: {
    id: string;
    title: string;
    arabic_text: string;
    latin_transliteration: string | null;
    english_translation: string | null;
    recitation_context: string | null;
    target_count: number;
    progress: {
      completed_count: number;
      is_completed: boolean;
    };
  };
  isAuthenticated: boolean;
}

export function AdhkarCounter({ adhkar, isAuthenticated }: AdhkarCounterProps) {
  const [count, setCount] = useState(adhkar.progress.completed_count);
  const [isCompleted, setIsCompleted] = useState(adhkar.progress.is_completed);
  const [isPending, startTransition] = useTransition();

  const handleIncrement = () => {
    if (!isAuthenticated || isCompleted) return;

    const newCount = count + 1;
    setCount(newCount);

    if (newCount >= adhkar.target_count) {
      setIsCompleted(true);
    }

    startTransition(async () => {
      const result = await incrementProgress(adhkar.id);
      if (result?.error) {
        setCount(count);
        setIsCompleted(adhkar.progress.is_completed);
      }
    });
  };

  const progress = Math.min((count / adhkar.target_count) * 100, 100);

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isCompleted && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium truncate">{adhkar.title}</h3>
              {adhkar.recitation_context && (
                <Badge variant="outline" className="shrink-0">
                  {adhkar.recitation_context}
                </Badge>
              )}
            </div>

            <p className="text-xl leading-relaxed text-right mb-3 font-arabic" dir="rtl">
              {adhkar.arabic_text}
            </p>

            {adhkar.latin_transliteration && (
              <p className="text-sm italic text-muted-foreground mb-1">
                {adhkar.latin_transliteration}
              </p>
            )}

            {adhkar.english_translation && (
              <p className="text-sm text-muted-foreground">
                {adhkar.english_translation}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${progress * 1.76} 176`}
                  strokeLinecap="round"
                  className={cn(
                    "transition-all duration-300",
                    isCompleted ? "text-emerald-500" : "text-emerald-600"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                ) : (
                  <span className="text-sm font-medium">
                    {count}/{adhkar.target_count}
                  </span>
                )}
              </div>
            </div>

            {isAuthenticated && !isCompleted && (
              <Button
                size="sm"
                onClick={handleIncrement}
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}

            {isCompleted && (
              <Badge className="bg-emerald-500">Complete</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
