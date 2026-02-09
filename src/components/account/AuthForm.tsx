'use client'

import { useEffect, useState } from 'react'
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineUserCircle,
  HiOutlineUser,
  HiOutlinePhone,
} from 'react-icons/hi2'
import { toast } from 'sonner'

import { useStore } from '@/stores/store'
import { loginSchema, registerSchema } from '@/lib/auth-schemas'
import { resendVerificationAction } from '@/actions/auth'
import { extractFieldErrors, type FieldErrors } from '@/lib/form-utils'
import { InputField } from './InputField'
import { VerifyEmailScreen } from './VerifyEmailScreen'

function getButtonLabel(submitting: boolean, tab: 'login' | 'register') {
  if (submitting) return 'Please wait...'
  return tab === 'login' ? 'Sign In' : 'Create Account'
}

function RegisterFields({
  firstName,
  lastName,
  phone,
  fieldErrors,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
}: {
  readonly firstName: string
  readonly lastName: string
  readonly phone: string
  readonly fieldErrors: FieldErrors
  readonly onFirstNameChange: (v: string) => void
  readonly onLastNameChange: (v: string) => void
  readonly onPhoneChange: (v: string) => void
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          autoComplete="given-name"
          error={fieldErrors.firstName}
          icon={HiOutlineUser}
          name="firstName"
          onChange={onFirstNameChange}
          placeholder="First name"
          value={firstName}
        />
        <InputField
          autoComplete="family-name"
          error={fieldErrors.lastName}
          icon={HiOutlineUser}
          name="lastName"
          onChange={onLastNameChange}
          placeholder="Last name"
          value={lastName}
        />
      </div>
      <InputField
        autoComplete="tel"
        error={fieldErrors.phone}
        icon={HiOutlinePhone}
        name="phone"
        onChange={onPhoneChange}
        placeholder="Phone number e.g. 0712345678"
        type="tel"
        value={phone}
      />
    </>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  readonly active: boolean
  readonly label: string
  readonly onClick: () => void
}) {
  return (
    <button
      className={`border-b-2 py-2 text-center text-sm font-semibold uppercase tracking-widest transition-colors ${
        active ? 'border-primary text-primary' : 'border-gray-300 text-black/50 hover:text-black'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

export function AuthForm() {
  const { login, register } = useStore()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [submitting, setSubmitting] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null)

  // Scroll to top when switching between login/register or verify screen
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [tab, verifyEmail])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  const clearErrors = () => {
    setGlobalError(null)
    setFieldErrors({})
  }

  const handleLogin = async () => {
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setFieldErrors(extractFieldErrors(parsed.error))
      return
    }

    const result = await login(email, password)
    if (result === '__verify__') {
      showUnverifiedToast(email)
    } else if (result) {
      setGlobalError(result)
    } else {
      setEmail('')
      setPassword('')
    }
  }

  const handleRegister = async () => {
    const formData = { firstName, lastName, phone, email, password, confirmPassword }
    const parsed = registerSchema.safeParse(formData)
    if (!parsed.success) {
      setFieldErrors(extractFieldErrors(parsed.error))
      return
    }

    const result = await register(formData)
    if (result === '__verify__') {
      setVerifyEmail(email)
    } else if (result) {
      setGlobalError(result)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()
    setSubmitting(true)
    await (tab === 'login' ? handleLogin() : handleRegister())
    setSubmitting(false)
  }

  if (verifyEmail) {
    return (
      <VerifyEmailScreen
        email={verifyEmail}
        onBack={() => {
          setVerifyEmail(null)
          setTab('login')
          setPassword('')
          setConfirmPassword('')
          clearErrors()
        }}
      />
    )
  }

  const isRegister = tab === 'register'

  return (
    <div className="mx-auto max-w-md px-3 py-6 md:px-4 md:py-10">
      <div className="border-2 border-gray-300 bg-white">
        <div className="flex h-1">
          <div className="flex-1 bg-primary" />
          <div className="flex-1 bg-secondary" />
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-center sm:mb-6">
            <HiOutlineUserCircle className="size-12 text-primary sm:size-16" />
          </div>

          <div className="mb-4 grid grid-cols-2 sm:mb-6">
            <TabButton
              active={tab === 'login'}
              label="Sign In"
              onClick={() => {
                setTab('login')
                clearErrors()
              }}
            />
            <TabButton
              active={isRegister}
              label="Create Account"
              onClick={() => {
                setTab('register')
                clearErrors()
              }}
            />
          </div>

          {globalError ? (
            <div className="mb-4 border-2 border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
              {globalError}
            </div>
          ) : null}

          <form className="flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
            {isRegister ? (
              <RegisterFields
                fieldErrors={fieldErrors}
                firstName={firstName}
                lastName={lastName}
                onFirstNameChange={setFirstName}
                onLastNameChange={setLastName}
                onPhoneChange={setPhone}
                phone={phone}
              />
            ) : null}

            <InputField
              autoComplete="email"
              error={fieldErrors.email}
              icon={HiOutlineEnvelope}
              name="email"
              onChange={setEmail}
              placeholder="Email address"
              type="email"
              value={email}
            />

            <InputField
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              error={fieldErrors.password}
              icon={HiOutlineLockClosed}
              minLength={6}
              name="password"
              onChange={setPassword}
              placeholder="Password"
              type="password"
              value={password}
            />

            {isRegister ? (
              <InputField
                autoComplete="new-password"
                error={fieldErrors.confirmPassword}
                icon={HiOutlineLockClosed}
                minLength={6}
                name="confirmPassword"
                onChange={setConfirmPassword}
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
              />
            ) : null}

            <button
              className="h-11 w-full cursor-pointer bg-primary text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              disabled={submitting}
              type="submit"
            >
              {getButtonLabel(submitting, tab)}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function showUnverifiedToast(email: string) {
  let sending = false

  function handleResend() {
    if (sending) return
    sending = true
    resendVerificationAction(email)
      .then((result) => {
        if (result.success) {
          toast.success('Verification email sent', {
            description: `Check your inbox. ${result.remaining ?? 0} resends remaining.`,
          })
        } else {
          toast.error('Failed to send', { description: result.error })
        }
      })
      .finally(() => {
        sending = false
      })
  }

  toast.error('Email not verified', {
    description: 'Please verify your email before signing in.',
    duration: 10000,
    action: {
      label: 'Resend Email',
      onClick: handleResend,
    },
  })
}
