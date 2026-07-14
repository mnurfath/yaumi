"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Something interrupted us</p>
      <h2 className="text-3xl font-semibold tracking-tight text-emerald-950">Something went wrong</h2>
      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <Button
        onClick={reset}
        variant="outline"
        size="lg"
        className="mt-2 h-11 rounded-full border-emerald-900/10 bg-white/70 px-6 backdrop-blur hover:bg-white"
      >
        Try again
      </Button>
    </div>
  );
}
