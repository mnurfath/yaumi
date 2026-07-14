import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const today = new Date().toISOString().split("T")[0];

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("display_order");

  const { data: todayProgress } = await supabase
    .from("user_progress")
    .select("id, is_completed")
    .eq("user_id", user.id)
    .eq("date", today);

  const completedToday = todayProgress?.filter((p) => p.is_completed).length || 0;
  const totalToday = todayProgress?.length || 0;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Today&apos;s overview</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Assalamu Alaikum, {profile?.display_name || "User"}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          May your day be filled with blessings
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today&apos;s Progress</CardTitle>
            <CardAction>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {completedToday} / {totalToday}
            </div>
            <p className="text-xs text-muted-foreground">
              adhkar completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <CardAction>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">{categories?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              available collections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <CardAction>
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">0</div>
            <p className="text-xs text-muted-foreground">
              day streak
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {categories?.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group h-full cursor-pointer transition-colors hover:border-primary/40">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        View adhkar
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                      Open
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
