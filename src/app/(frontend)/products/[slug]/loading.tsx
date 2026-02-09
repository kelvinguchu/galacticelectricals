import { Skeleton } from '@/components/ui/skeleton'

export default function ProductSlugLoading() {
  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-6 md:gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          {/* Image column */}
          <div className="flex flex-col gap-3">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={`thumb-${i.toString()}`} className="aspect-square w-full" />
              ))}
            </div>
          </div>

          {/* Details column */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-9 w-3/4" />

            {/* Badges */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Short desc */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* SKU */}
            <Skeleton className="h-3 w-32" />

            {/* Actions */}
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-14" />
            </div>

            {/* Attributes */}
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-4">
              <Skeleton className="mb-2 h-3 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
