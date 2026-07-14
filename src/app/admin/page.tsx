import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: categoriesCount },
    { count: adhkarsCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("adhkars").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <CardAction>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-4 w-4 text-primary" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Adhkars</CardTitle>
            <CardAction>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adhkarsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <CardAction>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/categories">
          <Card className="transition-colors hover:border-foreground/20 cursor-pointer">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <Layers className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Categories</h3>
                  <p className="text-sm text-muted-foreground">
                    Create, edit, and organize adhkar categories
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/adhkars">
          <Card className="transition-colors hover:border-foreground/20 cursor-pointer">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Adhkars</h3>
                  <p className="text-sm text-muted-foreground">
                    Add and edit individual adhkar with Arabic text
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
