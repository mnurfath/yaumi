"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin, MoonStar } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { fetchTimes, type PrayerTime } from "@/lib/prayer-times";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; times: PrayerTime[]; isFallback: boolean };

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
});

export function PrayerTimesWidget() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(() => {
    setState({ status: "loading" });
    fetchTimes()
      .then(({ times, isFallback }) => setState({ status: "ready", times, isFallback }))
      .catch(() => setState({ status: "error" }));
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, [load]);

  if (state.status === "loading") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="size-7 rounded-md" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between px-2 py-1.5">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-16" />
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
              <MoonStar className="h-3.5 w-3.5 text-primary" />
            </div>
            <CardTitle>Prayer times</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load prayer times.
          </p>
          <Button variant="outline" size="sm" onClick={load}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const next =
    state.times.find((t) => t.date > now) ??
    // All prayers passed — next is Fajr tomorrow.
    { ...state.times[0], date: new Date(state.times[0].date.getTime() + 86_400_000) };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
            <MoonStar className="h-3.5 w-3.5 text-primary" />
          </div>
          <CardTitle>Prayer times</CardTitle>
        </div>
        <CardAction>
          <Badge>Up next: {next.name}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="-mx-2">
          {state.times.map((t) => {
            const isNext = t.name === next.name;
            return (
              <li
                key={t.name}
                className={cn(
                  "flex items-center justify-between rounded-md px-2 py-1.5",
                  isNext && "bg-primary/10"
                )}
              >
                <span
                  className={cn(
                    "text-sm",
                    isNext ? "font-medium text-primary" : "text-foreground"
                  )}
                >
                  {t.name}
                </span>
                <span
                  className={cn(
                    "text-sm tabular-nums",
                    isNext ? "font-medium text-primary" : "text-muted-foreground"
                  )}
                >
                  {timeFormatter.format(t.date)}
                </span>
              </li>
            );
          })}
        </ul>
        {state.isFallback && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            Showing Mecca times — enable location for local times
          </p>
        )}
      </CardContent>
    </Card>
  );
}
