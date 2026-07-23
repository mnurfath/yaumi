"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const THRESHOLD = 72;

function atTop(target: EventTarget | null): boolean {
  let el = target as HTMLElement | null;
  while (el && el !== document.body) {
    if (el.scrollTop > 0) return false;
    if (/(auto|scroll)/.test(getComputedStyle(el).overflowY)) return true;
    el = el.parentElement;
  }
  return window.scrollY <= 0;
}

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, startTransition] = useTransition();

  function onTouchStart(e: React.TouchEvent) {
    if (!refreshing && atTop(e.target)) startY.current = e.touches[0].clientY;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0 || !atTop(e.target)) {
      startY.current = null;
      setPull(0);
      return;
    }
    setPull(Math.min(dy * 0.5, THRESHOLD * 1.4));
  }

  function onTouchEnd() {
    if (startY.current === null) return;
    startY.current = null;
    if (pull >= THRESHOLD) {
      startTransition(() => router.refresh());
    }
    setPull(0);
  }

  const active = pull >= THRESHOLD || refreshing;

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center transition-opacity duration-200"
        style={{ opacity: pull > 8 || refreshing ? 1 : 0 }}
      >
        <div className="rounded-full bg-background p-2 shadow-md ring-1 ring-border">
          <Loader2
            className={cn("h-5 w-5 text-primary", active && "animate-spin")}
            style={!active ? { transform: `rotate(${pull * 3}deg)` } : undefined}
          />
        </div>
      </div>
      <div
        className={pull === 0 ? "transition-transform duration-200" : undefined}
        style={pull ? { transform: `translateY(${pull}px)` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
