"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  icon: z.string().nullable().optional(),
  display_order: z.number().int().min(0).default(0),
});

const adhkarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category_id: z.string().uuid("Invalid category"),
  arabic_text: z.string().min(1, "Arabic text is required"),
  latin_transliteration: z.string().optional(),
  english_translation: z.string().optional(),
  recitation_context: z.string().optional(),
  target_count: z.number().int().min(1, "Target count must be at least 1").default(1),
  display_order: z.number().int().min(0).default(0),
});

async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Not authorized");
  }

  return supabase;
}

export async function createCategory(formData: FormData) {
  try {
    const supabase = await verifyAdmin();

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string || undefined,
      icon: (formData.get("icon") as string) || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    const validated = categorySchema.parse(data);

    const { error } = await supabase
      .from("categories")
      .insert(validated);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: (error as Error).message };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const supabase = await verifyAdmin();

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string || undefined,
      icon: (formData.get("icon") as string) || null,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    const validated = categorySchema.parse(data);

    const { error } = await supabase
      .from("categories")
      .update(validated)
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: (error as Error).message };
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await verifyAdmin();

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function createAdhkar(formData: FormData) {
  try {
    const supabase = await verifyAdmin();

    const data = {
      title: formData.get("title") as string,
      category_id: formData.get("category_id") as string,
      arabic_text: formData.get("arabic_text") as string,
      latin_transliteration: formData.get("latin_transliteration") as string || undefined,
      english_translation: formData.get("english_translation") as string || undefined,
      recitation_context: formData.get("recitation_context") as string || undefined,
      target_count: parseInt(formData.get("target_count") as string) || 1,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    const validated = adhkarSchema.parse(data);

    const { error } = await supabase
      .from("adhkars")
      .insert(validated);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/adhkars");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: (error as Error).message };
  }
}

export async function updateAdhkar(id: string, formData: FormData) {
  try {
    const supabase = await verifyAdmin();

    const data = {
      title: formData.get("title") as string,
      category_id: formData.get("category_id") as string,
      arabic_text: formData.get("arabic_text") as string,
      latin_transliteration: formData.get("latin_transliteration") as string || undefined,
      english_translation: formData.get("english_translation") as string || undefined,
      recitation_context: formData.get("recitation_context") as string || undefined,
      target_count: parseInt(formData.get("target_count") as string) || 1,
      display_order: parseInt(formData.get("display_order") as string) || 0,
    };

    const validated = adhkarSchema.parse(data);

    const { error } = await supabase
      .from("adhkars")
      .update(validated)
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/adhkars");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: (error as Error).message };
  }
}

export async function deleteAdhkar(id: string) {
  try {
    const supabase = await verifyAdmin();

    const { error } = await supabase
      .from("adhkars")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/adhkars");
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
