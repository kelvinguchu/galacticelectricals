import { Skeleton } from '@/components/ui/skeleton'

export default function AccountLoading() {
  return (
    <div className="py-6 md:py-10">
      <div className="mx-auto max-w-2xl px-3 md:px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
          <Skeleton className="size-12 rounded-full sm:size-14" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  )
}
