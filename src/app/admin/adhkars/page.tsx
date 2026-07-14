import { createClient } from "@/lib/supabase/server";
import { AdhkarsManager } from "@/components/admin/adhkars-manager";

export default async function AdminAdhkarsPage() {
  const supabase = await createClient();

  const [{ data: adhkars }, { data: categories }] = await Promise.all([
    supabase
      .from("adhkars")
      .select("*, categories(name)")
      .order("display_order"),
    supabase
      .from("categories")
      .select("id, name")
      .order("display_order"),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Adhkars</h1>
      <AdhkarsManager
        initialAdhkars={adhkars || []}
        categories={categories || []}
      />
    </div>
  );
}
