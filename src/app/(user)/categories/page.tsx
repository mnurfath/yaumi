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
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Browse the collection</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Adhkar Categories</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Choose a category to begin your remembrance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {categories?.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="group h-full cursor-pointer transition-colors hover:border-primary/40">
              <CardHeader className="gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full px-3">{category.adhkars?.length || 0} adhkar</Badge>
                    <ArrowUpRight className="size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
                <CardTitle className="mt-4 text-xl font-semibold text-foreground">{category.name}</CardTitle>
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
