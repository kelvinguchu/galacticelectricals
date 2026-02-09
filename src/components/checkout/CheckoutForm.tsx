'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { HiOutlineShoppingBag } from 'react-icons/hi2'

import { useStore } from '@/stores/store'
import {
  sendCheckoutOtp,
  verifyCheckoutOtp,
  initiateCheckout,
  getCheckoutStatus,
  getCheckoutProfile,
  type CheckoutShippingAddress,
} from '@/actions/checkout'

import { ErrorStep } from './ErrorStep'
import { OtpStep } from './OtpStep'
import { ProcessingStep } from './ProcessingStep'
import { ReviewStep } from './ReviewStep'
import { ShippingStep } from './ShippingStep'
import { SuccessStep } from './SuccessStep'

type Step = 'otp' | 'shipping' | 'review' | 'processing' | 'success' | 'error'

const POLL_INTERVAL_MS = 4000
const POLL_TIMEOUT_MS = 2 * 60 * 1000 // 2 minutes

export function CheckoutForm() {
  const { user, cart, clearCart } = useStore()

  // Step management
  const [step, setStep] = useState<Step>('shipping')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Email + OTP (guest only)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  // Contact
  const [phone, setPhone] = useState('')

  // Shipping address
  const [address, setAddress] = useState<CheckoutShippingAddress>({
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postalCode: '',
    country: 'Kenya',
  })

  const [notes, setNotes] = useState('')

  // Order result
  const [orderNumber, setOrderNumber] = useState('')
  const [orderTotal, setOrderTotal] = useState(0)

  // Polling state
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Pre-fill from user profile on mount
  useEffect(() => {
    if (!user) return

    getCheckoutProfile().then((profile) => {
      if (!profile) return
      setPhone(profile.phone || '')
      if (profile.shippingAddress) {
        setAddress(profile.shippingAddress)
      } else {
        setAddress((prev) => ({
          ...prev,
          firstName: profile.firstName || prev.firstName,
          lastName: profile.lastName || prev.lastName,
        }))
      }
    })
  }, [user])

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.salePrice ?? item.price
    return sum + price * item.quantity
  }, 0)

  const effectiveEmail = user?.email ?? email

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const handleVerifyOtp = async () => {
    setError(null)
    setSubmitting(true)
    const result = await verifyCheckoutOtp(email, otp)
    setSubmitting(false)
    if (result.success) {
      setStep('review')
    } else {
      setError(result.error ?? 'Invalid code.')
    }
  }

  const handleShippingNext = async () => {
    setError(null)
    if (!user && !email.includes('@')) {
      setError('A valid email address is required.')
      return
    }
    if (!phone.trim()) {
      setError('Phone number is required for M-Pesa payment.')
      return
    }
    if (!address.firstName.trim() || !address.lastName.trim()) {
      setError('First and last name are required.')
      return
    }
    if (!address.addressLine1.trim() || !address.city.trim()) {
      setError('Address and city are required.')
      return
    }
    if (!address.county?.trim()) {
      setError('County is required.')
      return
    }

    // Guests need email verification before review
    if (!user) {
      setSubmitting(true)
      const result = await sendCheckoutOtp(email)
      setSubmitting(false)
      if (result.success) {
        setStep('otp')
      } else {
        setError(result.error ?? 'Failed to send verification code.')
      }
      return
    }

    setStep('review')
  }

  // ── Polling logic ───────────────────────────────────────────────────────────

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  const startPolling = useCallback(
    (reqID: string) => {
      stopPolling()
      const startedAt = Date.now()

      pollingRef.current = setInterval(async () => {
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          stopPolling()
          setError('Payment confirmation timed out. If you paid, please contact support.')
          setStep('error')
          return
        }

        try {
          const status = await getCheckoutStatus(reqID)

          if (status.status === 'paid') {
            stopPolling()
            setOrderNumber(status.orderNumber ?? '')
            setOrderTotal(status.total ?? cartTotal)
            clearCart()
            setStep('success')
          } else if (status.status === 'failed') {
            stopPolling()
            setError(status.error ?? 'Payment was not completed.')
            setStep('error')
          }
        } catch {
          // network error → keep trying
        }
      }, POLL_INTERVAL_MS)
    },
    [stopPolling, cartTotal, clearCart],
  )

  useEffect(() => stopPolling, [stopPolling])

  // ── Place order ─────────────────────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    setError(null)
    setSubmitting(true)
    setStep('processing')

    const result = await initiateCheckout({
      customerEmail: effectiveEmail,
      customerPhone: phone,
      shippingAddress: address,
      items: cart.map((item) => ({
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
      })),
      notes: notes || undefined,
    })

    setSubmitting(false)

    if (result.success && result.checkoutRequestID) {
      startPolling(result.checkoutRequestID)
    } else {
      setError(result.error ?? 'Failed to initiate payment.')
      setStep('error')
    }
  }

  // ── Empty cart guard ──────────────────────────────────────────────────────────

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <HiOutlineShoppingBag className="size-16 text-black/15" />
        <p className="text-sm text-black/50">Your cart is empty</p>
        <Link
          className="inline-flex h-10 items-center justify-center bg-primary px-6 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90"
          href="/"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  // ── Step navigation ───────────────────────────────────────────────────────────

  const handleOtpBack = () => {
    setStep('shipping')
    setOtp('')
    setError(null)
  }
  const handleReviewBack = () => setStep('shipping')
  const handleErrorRetry = () => {
    setError(null)
    setStep('review')
  }

  // ── Render current step ───────────────────────────────────────────────────────

  switch (step) {
    case 'shipping':
      return (
        <ShippingStep
          address={address}
          email={email}
          error={error}
          isGuest={!user}
          notes={notes}
          onAddressChange={setAddress}
          onEmailChange={setEmail}
          onNotesChange={setNotes}
          onPhoneChange={setPhone}
          onSubmit={handleShippingNext}
          phone={phone}
          submitting={submitting}
        />
      )
    case 'otp':
      return (
        <OtpStep
          email={email}
          error={error}
          onBack={handleOtpBack}
          onOtpChange={setOtp}
          onSubmit={handleVerifyOtp}
          otp={otp}
          submitting={submitting}
        />
      )
    case 'review':
      return (
        <ReviewStep
          address={address}
          cart={cart}
          cartTotal={cartTotal}
          effectiveEmail={effectiveEmail}
          error={error}
          onBack={handleReviewBack}
          onSubmit={handlePlaceOrder}
          phone={phone}
          submitting={submitting}
        />
      )
    case 'processing':
      return <ProcessingStep />
    case 'success':
      return (
        <SuccessStep
          effectiveEmail={effectiveEmail}
          orderNumber={orderNumber}
          orderTotal={orderTotal}
        />
      )
    case 'error':
      return <ErrorStep error={error} onRetry={handleErrorRetry} />
  }
}
