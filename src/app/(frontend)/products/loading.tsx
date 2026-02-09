import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsLoading() {
  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-6 md:gap-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`prod-${i.toString()}`} className="flex flex-col border-2 border-gray-300">
              <Skeleton className="h-32 w-full" />
              <div className="flex flex-col gap-2 p-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="mt-auto h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
