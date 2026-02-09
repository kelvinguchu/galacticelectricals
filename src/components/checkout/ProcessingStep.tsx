import { HiOutlineDevicePhoneMobile } from 'react-icons/hi2'

export function ProcessingStep() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center sm:gap-4 sm:py-16">
      <div className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary sm:size-12" />
      <p className="text-xs font-semibold uppercase tracking-widest sm:text-sm">
        Waiting for M-Pesa...
      </p>
      <div className="flex items-start gap-2 border-2 border-amber-200 bg-amber-50 p-2.5 sm:p-3">
        <HiOutlineDevicePhoneMobile className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-800">
          An M-Pesa payment prompt has been sent to your phone. Enter your PIN to complete the
          purchase. This page will update automatically.
        </p>
      </div>
    </div>
  )
}
