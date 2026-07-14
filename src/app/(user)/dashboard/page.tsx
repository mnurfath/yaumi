import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
      <div className="mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Today&apos;s overview</p>
        <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 md:text-5xl">
          Assalamu Alaikum, {profile?.display_name || "User"}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          May your day be filled with blessings
        </p>
      </div>

      <div className="mb-10 grid gap-5 md:grid-cols-3">
        <Card className="border-0 bg-white/75 py-6 shadow-[0_16px_45px_rgba(22,78,57,0.07)] ring-1 ring-emerald-950/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Progress</CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-emerald-950">
              {completedToday} / {totalToday}
            </div>
            <p className="text-xs text-muted-foreground">
              adhkar completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/75 py-6 shadow-[0_16px_45px_rgba(22,78,57,0.07)] ring-1 ring-emerald-950/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100">
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-emerald-950">{categories?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              available collections
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/75 py-6 shadow-[0_16px_45px_rgba(22,78,57,0.07)] ring-1 ring-emerald-950/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100">
              <Clock className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-emerald-950">0</div>
            <p className="text-xs text-muted-foreground">
              day streak
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-emerald-950">Quick Access</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {categories?.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group h-full cursor-pointer border-0 bg-white/75 py-6 shadow-[0_10px_35px_rgba(22,78,57,0.05)] ring-1 ring-emerald-950/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(22,78,57,0.1)]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-emerald-950">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        View adhkar
                      </p>
                    </div>
                    <span className="text-sm font-medium text-emerald-700 transition-colors group-hover:text-emerald-800">
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
