"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdhkarCounter } from "@/components/adhkar/adhkar-counter";
import { AdhkarSwiper } from "@/components/adhkar/adhkar-swiper";
import { BookOpen, Layers } from "lucide-react";

interface AdhkarWithProgress {
  id: string;
  title: string;
  arabic_text: string;
  latin_transliteration: string | null;
  english_translation: string | null;
  recitation_context: string | null;
  target_count: number;
  display_order: number;
  progress: {
    completed_count: number;
    is_completed: boolean;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface CategoryDetailViewProps {
  category: Category;
  adhkars: AdhkarWithProgress[];
  isAuthenticated: boolean;
}

export function CategoryDetailView({
  category,
  adhkars,
  isAuthenticated,
}: CategoryDetailViewProps) {
  const [mode, setMode] = useState<"list" | "swipe">("list");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 text-center md:text-left">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Daily remembrance</p>
        <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 md:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-base text-muted-foreground">{category.description}</p>
        )}
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as "list" | "swipe")}>
        <TabsList className="mb-8 grid h-11 w-full grid-cols-2 rounded-2xl border border-emerald-950/5 bg-white/60 p-1 shadow-sm backdrop-blur">
          <TabsTrigger value="list" className="gap-2 rounded-xl data-active:bg-white data-active:text-emerald-900 group-data-[variant=default]/tabs-list:data-active:shadow-none">
            <BookOpen className="h-4 w-4" />
            List Mode
          </TabsTrigger>
          <TabsTrigger value="swipe" className="gap-2 rounded-xl data-active:bg-white data-active:text-emerald-900 group-data-[variant=default]/tabs-list:data-active:shadow-none">
            <Layers className="h-4 w-4" />
            Swipe Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-4">
            {adhkars.map((adhkar) => (
              <AdhkarCounter
                key={adhkar.id}
                adhkar={adhkar}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="swipe">
          <AdhkarSwiper
            adhkars={adhkars}
            isAuthenticated={isAuthenticated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
