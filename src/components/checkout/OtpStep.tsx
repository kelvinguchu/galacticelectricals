import { HiOutlineShieldCheck } from 'react-icons/hi2'

import { StepHeader, ErrorBox } from './checkout-utils'

export function OtpStep({
  email,
  error,
  onBack,
  onOtpChange,
  onSubmit,
  otp,
  submitting,
}: Readonly<{
  email: string
  error: string | null
  onBack: () => void
  onOtpChange: (v: string) => void
  onSubmit: () => void
  otp: string
  submitting: boolean
}>) {
  return (
    <div className="mx-auto max-w-md">
      <StepHeader icon={HiOutlineShieldCheck} title="Enter Verification Code" />
      {error ? <ErrorBox message={error} /> : null}

      <p className="mb-3 text-xs text-black/60 sm:mb-4 sm:text-sm">
        We sent a 6-digit code to <strong className="text-black">{email}</strong>.
      </p>

      <div className="mb-3 sm:mb-4">
        <input
          autoComplete="one-time-code"
          className="h-12 w-full border-2 border-gray-300 bg-white text-center text-xl font-bold tracking-[0.3em] focus:border-primary focus:outline-none sm:h-14 sm:text-2xl"
          inputMode="numeric"
          maxLength={6}
          onChange={(e) => onOtpChange(e.target.value.replaceAll(/\D/g, ''))}
          placeholder="000000"
          value={otp}
        />
      </div>

      <button
        className="h-11 w-full cursor-pointer bg-primary text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
        disabled={submitting || otp.length < 6}
        onClick={onSubmit}
        type="button"
      >
        {submitting ? 'Verifying...' : 'Verify & Continue'}
      </button>

      <button
        className="mt-2 w-full cursor-pointer py-2 text-center text-xs text-black/50 hover:text-black"
        onClick={onBack}
        type="button"
      >
        Use a different email
      </button>
    </div>
  )
}
