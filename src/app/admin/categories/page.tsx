import { createClient } from "@/lib/supabase/server";
import { CategoriesManager } from "@/components/admin/categories-manager";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Categories</h1>
      <CategoriesManager initialCategories={categories || []} />
    </div>
  );
}
