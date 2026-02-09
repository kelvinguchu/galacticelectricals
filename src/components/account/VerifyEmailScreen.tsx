'use client'

import { useState } from 'react'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import { resendVerificationAction } from '@/actions/auth'

function resendButtonLabel(resending: boolean, cooldown: number): string {
  if (resending) return 'Sending...'
  if (cooldown > 0) return `Resend in ${cooldown}s`
  return 'Resend Verification Email'
}

export function VerifyEmailScreen({
  email,
  onBack,
}: {
  readonly email: string
  readonly onBack: () => void
}) {
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [resendError, setResendError] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const startCooldown = () => {
    setCooldown(60)
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    setResending(true)
    setResendMsg(null)
    setResendError(false)

    const result = await resendVerificationAction(email)
    if (result.success) {
      const remaining = result.remaining ?? 0
      setResendMsg(
        `Verification email sent! ${remaining} resend${remaining === 1 ? '' : 's'} remaining.`,
      )
      setResendError(false)
      startCooldown()
    } else {
      setResendMsg(result.error ?? 'Failed to resend')
      setResendError(true)
    }
    setResending(false)
  }

  return (
    <div className="mx-auto max-w-md px-3 py-6 md:px-4 md:py-10">
      <div className="border-2 border-gray-300 bg-white">
        <div className="flex h-1">
          <div className="flex-1 bg-primary" />
          <div className="flex-1 bg-secondary" />
        </div>
        <div className="flex flex-col items-center gap-3 p-5 text-center sm:gap-4 sm:p-8">
          <HiOutlineEnvelope className="size-12 text-primary sm:size-16" />
          <h2 className="text-base font-bold uppercase tracking-widest sm:text-lg">
            Check Your Email
          </h2>
          <p className="text-xs leading-relaxed text-black/60 sm:text-sm">
            We&apos;ve sent a verification link to <strong className="text-black">{email}</strong>.
            Please open it and click the button to verify your account.
          </p>

          {resendMsg ? (
            <div
              className={`w-full border-2 p-3 text-sm ${
                resendError
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-green-200 bg-green-50 text-green-700'
              }`}
            >
              {resendMsg}
            </div>
          ) : (
            <p className="text-xs text-black/40">
              Didn&apos;t receive it? Check your spam folder or click resend below.
            </p>
          )}

          <button
            className="h-11 w-full cursor-pointer bg-primary text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={resending || cooldown > 0}
            onClick={handleResend}
            type="button"
          >
            {resendButtonLabel(resending, cooldown)}
          </button>

          <button
            className="h-11 w-full cursor-pointer border-2 border-gray-300 bg-white text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-accent"
            onClick={onBack}
            type="button"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
