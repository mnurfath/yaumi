import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 space-y-3 text-center md:text-left">
        <Skeleton className="mx-auto h-4 w-36 md:mx-0" />
        <Skeleton className="mx-auto h-10 w-56 md:mx-0" />
        <Skeleton className="mx-auto h-4 w-72 md:mx-0" />
      </div>

      <Skeleton className="mb-8 h-12 w-full rounded-2xl" />

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border-0 bg-white/75 p-4 shadow-[0_10px_35px_rgba(22,78,57,0.05)] ring-1 ring-emerald-950/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
