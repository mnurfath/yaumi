import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border p-6">
            <Skeleton className="h-4 w-[100px] mb-4" />
            <Skeleton className="h-8 w-[60px] mb-2" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        ))}
      </div>

      <Skeleton className="h-6 w-[150px] mb-4" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-5 w-[120px] mb-2" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
