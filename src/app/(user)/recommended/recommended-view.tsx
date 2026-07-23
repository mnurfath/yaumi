"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchTimes } from "@/lib/prayer-times";
import { currentSalahEvent } from "@/lib/current-salah-event";
import {
  getRecommendedAdhkarsAction,
  getProgressForAdhkars,
} from "@/app/(user)/actions";
import { CategoryDetailView } from "@/app/(user)/categories/[slug]/category-detail-view";

type ProgressRow = { adhkar_id: string; completed_count: number; is_completed: boolean };

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "empty" }
  | {
      status: "ready";
      event: { name: string; slug: string };
      adhkars: Array<Record<string, unknown> & { id: string; title: string; arabic_text: string; latin_transliteration: string | null; english_translation: string | null; recitation_context: string | null; target_count: number; display_order: number; progress: { completed_count: number; is_completed: boolean } }>;
      isAuthenticated: boolean;
    };

export function RecommendedView() {
  const [state, setState] = useState<State>({ status: "loading" });
  const slugRef = useRef<string | null>(null);

  const load = useCallback(() => {
    setState({ status: "loading" });
    fetchTimes()
      .then(({ times, sunrise }) => {
        const slug = currentSalahEvent(times, sunrise, new Date());
        slugRef.current = slug;
        return getRecommendedAdhkarsAction(slug);
      })
      .then(async (data) => {
        if (!data || data.adhkars.length === 0) {
          setState({ status: "empty" });
          return;
        }
        const progress = await getProgressForAdhkars(
          data.adhkars.map((a) => a.id)
        );
        const isAuthenticated = progress !== null;
        const progressMap: Record<string, ProgressRow> = {};
        if (progress) {
          for (const row of progress) {
            progressMap[row.adhkar_id] = row;
          }
        }
        const adhkars = data.adhkars.map((a) => ({
          id: a.id,
          title: a.title,
          arabic_text: a.arabic_text,
          latin_transliteration: a.latin_transliteration,
          english_translation: a.english_translation,
          recitation_context: a.recitation_context,
          target_count: a.target_count,
          display_order: a.display_order,
          progress: progressMap[a.id]
            ? {
                completed_count: progressMap[a.id].completed_count,
                is_completed: progressMap[a.id].is_completed,
              }
            : { completed_count: 0, is_completed: false },
        }));
        setState({
          status: "ready",
          event: { name: data.event.name, slug: data.event.slug },
          adhkars,
          isAuthenticated,
        });
      })
      .catch(() => setState({ status: "error" }));
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(async () => {
      try {
        const { times, sunrise } = await fetchTimes();
        const newSlug = currentSalahEvent(times, sunrise, new Date());
        if (newSlug !== slugRef.current) {
          slugRef.current = newSlug;
          const data = await getRecommendedAdhkarsAction(newSlug);
          if (data) {
            const progress = await getProgressForAdhkars(
              data.adhkars.map((a) => a.id)
            );
            const isAuthenticated = progress !== null;
            const progressMap: Record<string, ProgressRow> = {};
            if (progress) {
              for (const row of progress) {
                progressMap[row.adhkar_id] = row;
              }
            }
            const adhkars = data.adhkars.map((a) => ({
              id: a.id,
              title: a.title,
              arabic_text: a.arabic_text,
              latin_transliteration: a.latin_transliteration,
              english_translation: a.english_translation,
              recitation_context: a.recitation_context,
              target_count: a.target_count,
              display_order: a.display_order,
              progress: progressMap[a.id]
                ? {
                    completed_count: progressMap[a.id].completed_count,
                    is_completed: progressMap[a.id].is_completed,
                  }
                : { completed_count: 0, is_completed: false },
            }));
            setState({
              status: "ready",
              event: { name: data.event.name, slug: data.event.slug },
              adhkars,
              isAuthenticated,
            });
          }
        }
      } catch {
        // keep current state
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [load]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-6 md:py-10">
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <Skeleton className="size-4" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-6 md:py-10">
        <div className="flex flex-col items-center gap-4 pt-12 text-center">
          <Sparkles className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            Couldn&apos;t load recommendations.
          </p>
          <Button variant="outline" onClick={load}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (state.status === "empty") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-6 md:py-10">
        <div className="flex flex-col items-center gap-4 pt-12 text-center">
          <Sparkles className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            No adhkar recommended for this time.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { event, adhkars, isAuthenticated } = state;

  return (
    <CategoryDetailView
      category={{
        id: "recommended",
        name: "Recommended now",
        slug: "",
        description: `Adhkar for ${event.name}`,
        icon: "Sparkles",
      }}
      adhkars={adhkars}
      isAuthenticated={isAuthenticated}
    />
  );
}