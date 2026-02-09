export function ErrorStep({
  error,
  onRetry,
}: Readonly<{
  error: string | null
  onRetry: () => void
}>) {
  return (
    <div className="mx-auto max-w-md">
      <div className="border-2 border-gray-300 bg-white">
        <div className="flex h-1">
          <div className="flex-1 bg-rose-500" />
          <div className="flex-1 bg-rose-300" />
        </div>
        <div className="flex flex-col items-center gap-2.5 p-5 text-center sm:gap-3 sm:p-8">
          <div className="flex size-12 items-center justify-center rounded-full bg-rose-50 sm:size-16">
            <span className="text-xl font-bold text-rose-500 sm:text-2xl">!</span>
          </div>
          <h2 className="text-base font-bold uppercase tracking-widest sm:text-lg">Order Failed</h2>
          <p className="text-xs text-black/60 sm:text-sm">
            {error || 'Something went wrong. Please try again.'}
          </p>

          <button
            className="mt-2 h-11 w-full cursor-pointer border-2 border-gray-300 bg-white text-sm font-semibold uppercase tracking-widest text-black hover:bg-accent"
            onClick={onRetry}
            type="button"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
