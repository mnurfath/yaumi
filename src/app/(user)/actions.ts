"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getRecommendedAdhkars } from "@/lib/supabase/queries";

export async function incrementProgress(adhkarId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("user_progress")
    .select("id, completed_count")
    .eq("user_id", user.id)
    .eq("adhkar_id", adhkarId)
    .eq("date", today)
    .single();

  const { data: adhkar } = await supabase
    .from("adhkars")
    .select("target_count")
    .eq("id", adhkarId)
    .single();

  if (!adhkar) {
    return { error: "Adhkar not found" };
  }

  if (existing) {
    const newCount = existing.completed_count + 1;
    const isCompleted = newCount >= adhkar.target_count;

    const { error } = await supabase
      .from("user_progress")
      .update({
        completed_count: newCount,
        is_completed: isCompleted,
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const isCompleted = adhkar.target_count <= 1;

    const { error } = await supabase
      .from("user_progress")
      .insert({
        user_id: user.id,
        adhkar_id: adhkarId,
        date: today,
        completed_count: 1,
        is_completed: isCompleted,
      });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function markCompleted(adhkarId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: adhkar } = await supabase
    .from("adhkars")
    .select("target_count")
    .eq("id", adhkarId)
    .single();

  if (!adhkar) {
    return { error: "Adhkar not found" };
  }

  const { data: existing } = await supabase
    .from("user_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("adhkar_id", adhkarId)
    .eq("date", today)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("user_progress")
      .update({
        completed_count: adhkar.target_count,
        is_completed: true,
      })
      .eq("id", existing.id);

    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase
      .from("user_progress")
      .insert({
        user_id: user.id,
        adhkar_id: adhkarId,
        date: today,
        completed_count: adhkar.target_count,
        is_completed: true,
      });

    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function resetProgress(adhkarId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("user_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("adhkar_id", adhkarId)
    .eq("date", today);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function resetCategoryProgress(categorySlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) {
    return { error: "Category not found" };
  }

  const { data: adhkars } = await supabase
    .from("adhkars")
    .select("id")
    .eq("category_id", category.id);

  if (!adhkars) {
    return { error: "No adhkars found" };
  }

  const adhkarIds = adhkars.map((a) => a.id);

  const { error } = await supabase
    .from("user_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("date", today)
    .in("adhkar_id", adhkarIds);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function getProgressForCategory(categorySlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) {
    return null;
  }

  const { data: adhkars } = await supabase
    .from("adhkars")
    .select("id")
    .eq("category_id", category.id);

  if (!adhkars) {
    return null;
  }

  const adhkarIds = adhkars.map((a) => a.id);

  const { data: progress } = await supabase
    .from("user_progress")
    .select("adhkar_id, completed_count, is_completed")
    .eq("user_id", user.id)
    .eq("date", today)
    .in("adhkar_id", adhkarIds);

  return progress || [];
}

export async function getRecommendedAdhkarsAction(eventSlug: string) {
  return getRecommendedAdhkars(eventSlug);
}

export async function getProgressForAdhkars(adhkarIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || adhkarIds.length === 0) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: progress } = await supabase
    .from("user_progress")
    .select("adhkar_id, completed_count, is_completed")
    .eq("user_id", user.id)
    .eq("date", today)
    .in("adhkar_id", adhkarIds);

  return progress || [];
}
