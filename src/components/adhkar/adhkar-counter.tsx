"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Plus, RotateCcw } from "lucide-react";
import { incrementProgress, resetProgress } from "@/app/(user)/actions";
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

  const handleReset = () => {
    if (!isAuthenticated) return;
    setCount(0);
    setIsCompleted(false);
    startTransition(async () => {
      const result = await resetProgress(adhkar.id);
      if (result?.error) {
        setCount(adhkar.progress.completed_count);
        setIsCompleted(adhkar.progress.is_completed);
      }
    });
  };

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
        isCompleted && "border-primary/40 bg-primary/5"
      )}
    >
      <CardContent>
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
                  className="text-primary transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isCompleted ? (
                  <CheckCircle2 className="h-8 w-8 text-primary" />
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
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}

            {isCompleted && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                disabled={isPending}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
