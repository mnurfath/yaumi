"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdhkarCounter } from "@/components/adhkar/adhkar-counter";
import { AdhkarSwiper } from "@/components/adhkar/adhkar-swiper";
import { ArrowLeft, BookOpen, Layers } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";

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
  icon: string | null;
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
  const router = useRouter();
  const [mode, setMode] = useState<"list" | "swipe">("list");

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 md:py-10">
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted transition-all hover:bg-muted/70 hover:text-foreground active:scale-90"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <CategoryIcon name={category.icon} className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Daily remembrance</p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-base text-muted-foreground">{category.description}</p>
        )}
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as "list" | "swipe")}>
        <TabsList className="mb-6 grid h-9 w-full grid-cols-2">
          <TabsTrigger value="list" className="gap-2">
            <BookOpen className="h-4 w-4" />
            List Mode
          </TabsTrigger>
          <TabsTrigger value="swipe" className="gap-2">
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
            categorySlug={category.slug}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
