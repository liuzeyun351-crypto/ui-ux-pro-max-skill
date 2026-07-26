import { Skeleton } from "@/components/ui/skeleton";

export default function DirectoryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8">
      <Skeleton className="mb-4 h-4 w-28" />
      <Skeleton className="mb-4 h-14 w-full max-w-lg" />
      <Skeleton className="mb-10 h-5 w-full max-w-md" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-11 w-64 rounded-full" />
        <Skeleton className="h-11 w-40 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-full" />
      </div>
      <div className="mb-10 flex gap-2">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[3/4] w-full rounded-[var(--radius-lg)]" />
            <Skeleton className="mt-3 h-5 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
