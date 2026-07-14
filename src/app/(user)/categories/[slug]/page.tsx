import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryDetailView } from "./category-detail-view";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: category.description || undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      description,
      adhkars (
        id,
        title,
        arabic_text,
        latin_transliteration,
        english_translation,
        recitation_context,
        target_count,
        display_order
      )
    `)
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  let progress: Record<string, { completed_count: number; is_completed: boolean }> = {};

  if (user) {
    const today = new Date().toISOString().split("T")[0];
    const adhkarIds = category.adhkars?.map((a) => a.id) || [];

    if (adhkarIds.length > 0) {
      const { data: userProgress } = await supabase
        .from("user_progress")
        .select("adhkar_id, completed_count, is_completed")
        .eq("user_id", user.id)
        .eq("date", today)
        .in("adhkar_id", adhkarIds);

      if (userProgress) {
        progress = userProgress.reduce(
          (acc, p) => {
            acc[p.adhkar_id] = {
              completed_count: p.completed_count,
              is_completed: p.is_completed,
            };
            return acc;
          },
          {} as Record<string, { completed_count: number; is_completed: boolean }>
        );
      }
    }
  }

  const adhkarsWithProgress = (category.adhkars || [])
    .sort((a, b) => a.display_order - b.display_order)
    .map((adhkar) => ({
      ...adhkar,
      progress: progress[adhkar.id] || { completed_count: 0, is_completed: false },
    }));

  return (
    <CategoryDetailView
      category={{
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      }}
      adhkars={adhkarsWithProgress}
      isAuthenticated={!!user}
    />
  );
}
