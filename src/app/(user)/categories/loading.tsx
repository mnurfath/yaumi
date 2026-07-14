import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 md:py-10">
      <div className="mb-8 max-w-2xl">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="size-11 rounded-lg" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="size-4" />
              </div>
            </div>
            <Skeleton className="mt-4 h-5 w-32" />
            <Skeleton className="mt-1.5 h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
