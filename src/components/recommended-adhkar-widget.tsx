"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTimes } from "@/lib/prayer-times";
import { currentSalahEvent } from "@/lib/current-salah-event";
import { getRecommendedAdhkarsAction } from "@/app/(user)/actions";

type AdhkarRow = { title: string; target_count: number };

type State =
  | { status: "loading" }
  | { status: "error" }
  | {
      status: "ready";
      event: { name: string; slug: string };
      adhkars: AdhkarRow[];
    };

export function RecommendedAdhkarWidget() {
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
      .then((data) => {
        if (!data) {
          setState({ status: "error" });
          return;
        }
        setState({
          status: "ready",
          event: { name: data.event.name, slug: data.event.slug },
          adhkars: data.adhkars,
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
            setState({
              status: "ready",
              event: { name: data.event.name, slug: data.event.slug },
              adhkars: data.adhkars,
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
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between px-2 py-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (state.status === "error") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle>Recommended now</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load recommendations.
          </p>
          <Button variant="outline" size="sm" onClick={load}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { event, adhkars } = state;
  const visible = adhkars.slice(0, 5);
  const remaining = adhkars.length - 5;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <CardTitle>Recommended now</CardTitle>
        </div>
        <CardAction>
          <Badge>{event.name}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {adhkars.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No adhkar linked to this time yet.
          </p>
        ) : (
          <ul className="-mx-2">
            {visible.map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-md px-2 py-1.5"
              >
                <span className="text-sm font-medium">{a.title}</span>
                {a.target_count > 1 && (
                  <span className="text-sm text-muted-foreground">
                    &times;{a.target_count}
                  </span>
                )}
              </li>
            ))}
            {remaining > 0 && (
              <li className="px-2 py-1 text-sm text-muted-foreground">
                + {remaining} more
              </li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}