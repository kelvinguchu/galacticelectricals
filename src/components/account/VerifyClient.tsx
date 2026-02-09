'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'

type Status = 'loading' | 'success' | 'error'

export function VerifyClient({ token }: { readonly token: string }) {
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function verify() {
      try {
        const res = await fetch(`/api/users/verify/${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (cancelled) return

        if (res.ok) {
          setStatus('success')
          setMessage('Your email has been verified. You can now log in.')
        } else {
          const data = await res.json().catch(() => null)
          setStatus('error')
          setMessage(
            data?.errors?.[0]?.message ||
              data?.message ||
              'Verification failed. The token may have expired or already been used.',
          )
        }
      } catch {
        if (!cancelled) {
          setStatus('error')
          setMessage('Something went wrong. Please try again later.')
        }
      }
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [token])

  if (status === 'loading') {
    return <p className="px-3 text-sm text-muted-foreground">Verifying your email…</p>
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4">
        <HiOutlineCheckCircle className="size-12 text-green-600" />
        <p className="text-sm">{message}</p>
        <Button asChild className="cursor-pointer rounded-none uppercase tracking-widest" size="sm">
          <Link href="/account">Go to Account</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <HiOutlineXCircle className="size-12 text-red-600" />
      <p className="text-sm text-red-600">{message}</p>
      <Button
        asChild
        className="cursor-pointer rounded-none uppercase tracking-widest"
        size="sm"
        variant="outline"
      >
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
