"use client";

import { useState, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  type PanInfo,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle2, RotateCcw, X } from "lucide-react";
import { markCompleted } from "@/app/(user)/actions";
import { toast } from "sonner";

interface AdhkarItem {
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
}

interface AdhkarSwiperProps {
  adhkars: AdhkarItem[];
  isAuthenticated: boolean;
}

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

export function AdhkarSwiper({ adhkars, isAuthenticated }: AdhkarSwiperProps) {
  const [cards, setCards] = useState<AdhkarItem[]>(
    adhkars.filter((a) => !a.progress.is_completed)
  );
  const [completedCards, setCompletedCards] = useState<AdhkarItem[]>([]);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const pendingCards = useRef(new Set<string>());

  const activeIndex = cards.length - 1;
  const visibleCards = cards.slice(-3);
  const visibleStartIndex = cards.length - visibleCards.length;

  const handleSwipe = useCallback(
    async (card: AdhkarItem, direction: "left" | "right") => {
      if (pendingCards.current.has(card.id)) return false;

      pendingCards.current.add(card.id);
      setPendingCardId(card.id);

      try {
        if (direction === "right" && isAuthenticated) {
          const result = await markCompleted(card.id);

          if (result?.error) {
            toast.error("Could not save your progress. Please try again.");
            return false;
          }
        }

        setCards((prev) => prev.filter((c) => c.id !== card.id));

        if (direction === "right") {
          setCompletedCards((prev) => [...prev, card]);
        }

        return true;
      } catch {
        toast.error("Could not save your progress. Please try again.");
        return false;
      } finally {
        pendingCards.current.delete(card.id);
        setPendingCardId((current) => current === card.id ? null : current);
      }
    },
    [isAuthenticated]
  );

  const handleReset = () => {
    setCards(adhkars.filter((a) => !a.progress.is_completed));
    setCompletedCards([]);
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <CheckCircle2 className="h-16 w-16 text-primary" />
        <p className="text-xl font-medium">All caught up!</p>
        <p className="text-muted-foreground">
          {completedCards.length > 0
            ? `You completed ${completedCards.length} adhkar`
            : "No more adhkar to review"}
        </p>
        {completedCards.length > 0 && (
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-6">
      <p className="rounded-full border border-border bg-card px-4 py-2 text-center text-xs font-medium text-muted-foreground">
        Swipe right to complete, left to skip
      </p>

      <div className="relative h-[530px] w-full sm:h-[480px]">
        <AnimatePresence>
          {visibleCards.map((card, visibleIndex) => {
            const index = visibleStartIndex + visibleIndex;

            return (
              <SwipeableCard
                key={card.id}
                card={card}
                index={index}
                totalCards={cards.length}
              isActive={index === activeIndex}
              isPending={pendingCardId === card.id}
              onSwipe={handleSwipe}
              />
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3" aria-label="Swipe actions">
        <Button
          variant="destructive"
          className="rounded-full px-5"
          disabled={pendingCardId !== null}
          onClick={() => void handleSwipe(cards[activeIndex], "left")}
        >
          <X className="size-4" />
          Skip
        </Button>
        <Button
          className="rounded-full px-5"
          disabled={pendingCardId !== null}
          onClick={() => void handleSwipe(cards[activeIndex], "right")}
        >
          <Check className="size-4" />
          Complete
        </Button>
      </div>

      <p className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
        {cards.length} remaining
      </p>
    </div>
  );
}

interface SwipeableCardProps {
  card: AdhkarItem;
  index: number;
  totalCards: number;
  isActive: boolean;
  isPending: boolean;
  onSwipe: (card: AdhkarItem, direction: "left" | "right") => Promise<boolean>;
}

function SwipeableCard({
  card,
  index,
  totalCards,
  isActive,
  isPending,
  onSwipe,
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const stackIndex = totalCards - 1 - index;
  const zIndex = index + 1;
  const yOffset = stackIndex * 10;
  const scale = 1 - stackIndex * 0.035;

  const handleDragEnd = useCallback(
    async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (isPending) return;

      const isSwipedRight =
        info.offset.x > SWIPE_THRESHOLD || info.velocity.x > VELOCITY_THRESHOLD;
      const isSwipedLeft =
        info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD;

      if (isSwipedRight) {
        await onSwipe(card, "right");
      } else if (isSwipedLeft) {
        await onSwipe(card, "left");
      }
    },
    [card, isPending, onSwipe]
  );

  if (!isActive) {
    return (
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 mx-auto h-full w-[calc(100%-1rem)] max-w-md"
        style={{
          y: yOffset,
          scale,
          zIndex,
          opacity: 1,
        }}
      >
        <div className="h-full rounded-xl border border-border bg-card shadow-sm" />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-x-0 mx-auto h-full w-[calc(100%-1rem)] max-w-md cursor-grab touch-pan-y active:cursor-grabbing"
      style={{
        x,
        rotate,
        zIndex,
        transformOrigin: "center center",
        pointerEvents: isPending ? "none" : "auto",
      }}
      drag={isPending ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 1, right: 1 }}
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: x.get() > 0 ? 500 : -500,
        opacity: 0,
        scale: 0.5,
        transition: { duration: 0.3 },
      }}
    >
      <div className="relative h-full overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-md sm:p-8">
        <motion.div
          className="absolute -top-2 -right-2 z-20 rotate-12 rounded-lg border-4 border-primary px-4 py-1 text-2xl font-black text-primary"
          style={{ opacity: likeOpacity }}
        >
          DONE
        </motion.div>

        <motion.div
          className="absolute -top-2 -left-2 z-20 -rotate-12 rounded-lg border-4 border-destructive px-4 py-1 text-2xl font-black text-destructive"
          style={{ opacity: nopeOpacity }}
        >
          SKIP
        </motion.div>

        <ContentCard card={card} />
      </div>
    </motion.div>
  );
}

function ContentCard({ card }: { card: AdhkarItem }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4">
      {card.recitation_context && (
        <Badge
          variant="outline"
          className="rounded-full border-border bg-accent/60 px-3 text-accent-foreground"
        >
          {card.recitation_context}
        </Badge>
      )}

      <p className="text-center font-arabic text-2xl leading-[1.9] text-foreground" dir="rtl">
        {card.arabic_text}
      </p>

      {card.latin_transliteration && (
        <p className="text-center text-sm italic text-muted-foreground">
          {card.latin_transliteration}
        </p>
      )}

      {card.english_translation && (
        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          {card.english_translation}
        </p>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        Target: {card.target_count} times
      </p>
    </div>
  );
}
