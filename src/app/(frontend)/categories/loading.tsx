import { Skeleton } from '@/components/ui/skeleton'

export default function CategoriesLoading() {
  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-6 md:gap-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`cat-${i.toString()}`}
              className="relative min-h-36 overflow-hidden border-2 border-gray-300 md:min-h-44"
            >
              <Skeleton className="h-full w-full" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 p-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
