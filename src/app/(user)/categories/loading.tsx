import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="mb-10 max-w-2xl space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border-0 bg-white/75 p-6 shadow-[0_10px_35px_rgba(22,78,57,0.05)] ring-1 ring-emerald-950/5"
          >
            <div className="flex items-start justify-between">
              <Skeleton className="size-11 rounded-2xl" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="size-4 rounded-full" />
              </div>
            </div>
            <Skeleton className="mt-4 h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
