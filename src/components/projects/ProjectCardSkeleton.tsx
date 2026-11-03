import { Skeleton } from '../ui/Skeleton'

/** Mesma altura mínima do card real para evitar CLS. */
export function ProjectCardSkeleton() {
  return (
    <div className="flex min-h-60 flex-col gap-3 rounded-md border border-line bg-surface p-6">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex-1" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  )
}
