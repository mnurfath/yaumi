import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mx-auto w-full max-w-md px-4 py-6 pb-4 md:py-10">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Today&apos;s overview</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Assalamu Alaikum, {profile?.display_name || (user.is_anonymous ? "Guest" : "User")}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          May your day be filled with blessings
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-2">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Progress</span>
          </div>
          <p className="mt-1.5 text-lg font-semibold text-foreground">
            {completedToday} / {totalToday}
          </p>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Categories</span>
          </div>
          <p className="mt-1.5 text-lg font-semibold text-foreground">{categories?.length || 0}</p>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
              <Clock className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Streak</span>
          </div>
          <p className="mt-1.5 text-lg font-semibold text-foreground">0</p>
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
