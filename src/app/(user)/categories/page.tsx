import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse adhkar categories",
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      description,
      adhkars (id)
    `)
    .order("display_order");

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Browse the collection</p>
        <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 md:text-5xl">Adhkar Categories</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Choose a category to begin your remembrance
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {categories?.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="group h-full cursor-pointer border-0 bg-white/75 py-6 shadow-[0_10px_35px_rgba(22,78,57,0.05)] ring-1 ring-emerald-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(22,78,57,0.1)]">
              <CardHeader className="gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 transition-colors group-hover:bg-emerald-200">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full px-3">{category.adhkars?.length || 0} adhkar</Badge>
                    <ArrowUpRight className="size-4 text-emerald-800 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
                <CardTitle className="mt-4 text-xl font-semibold text-emerald-950">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {(!categories || categories.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No categories available yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
