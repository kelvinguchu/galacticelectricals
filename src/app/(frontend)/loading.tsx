import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="flex flex-col border-b-2 border-gray-300 bg-white md:h-[calc(100dvh-63px)]">
        <div className="grid min-h-0 flex-1 md:grid-cols-9">
          <div className="flex min-h-0 flex-col gap-4 px-3 py-5 md:col-span-5 md:border-r-2 md:border-gray-300 md:px-6 md:py-7 lg:px-8">
            <div className="space-y-3">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="mt-4 h-14 w-full max-w-lg" />
            </div>
            <div className="flex gap-2.5">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <div className="flex min-h-0 flex-col bg-accent md:col-span-4">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 border-t-2 border-gray-300 sm:grid-cols-3 lg:grid-cols-9">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={`hero-card-${i.toString()}`} className="border-r border-gray-200 p-2">
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
        <div className="border-t-2 border-gray-300 bg-black">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={`hero-point-${i.toString()}`} className="h-5 w-48 bg-white/10" />
            ))}
          </div>
        </div>
      </section>

      {/* Category strip skeleton */}
      <section className="border-b-2 border-gray-300 bg-white py-6 md:py-7">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={`cat-${i.toString()}`} className="h-36 w-full md:h-44" />
            ))}
          </div>
        </div>
      </section>

      {/* Product shelves skeleton (3 sections) */}
      {Array.from({ length: 3 }).map((_, s) => (
        <section
          key={`shelf-${s.toString()}`}
          className="border-b-2 border-gray-300 bg-background py-6 md:py-8"
        >
          <div className="mx-auto max-w-7xl px-3 md:px-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 md:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`prod-${i.toString()}`}
                  className="flex flex-col border-2 border-gray-300"
                >
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
      ))}

      {/* Trust band skeleton */}
      <section className="bg-gray-950 py-6 md:py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2.5 px-3 md:gap-4 md:px-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`trust-${i.toString()}`} className="h-20 w-full bg-white/5" />
          ))}
        </div>
      </section>
    </>
  )
}
