'use client'

import { useState } from 'react'
import {
  HiOutlinePencilSquare,
  HiOutlineMapPin,
  HiOutlineCheck,
  HiOutlineXMark,
} from 'react-icons/hi2'

import { useStore } from '@/stores/store'
import { profileSchema } from '@/lib/auth-schemas'
import { updateProfileAction } from '@/actions/auth'
import { extractFieldErrors, type FieldErrors } from '@/lib/form-utils'

function formatDisplayPhone(phone?: string): string {
  if (!phone) return '—'
  if (phone.startsWith('254') && phone.length === 12) {
    return `0${phone.slice(3)}`
  }
  return phone
}

function ProfileField({
  label,
  name,
  value,
  editing,
  error,
  onChange,
  placeholder,
}: {
  readonly label: string
  readonly name: string
  readonly value: string
  readonly editing: boolean
  readonly error?: string
  readonly onChange: (v: string) => void
  readonly placeholder?: string
}) {
  if (!editing) {
    return (
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-sm text-foreground">{value || '—'}</p>
      </div>
    )
  }
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        className={`mt-1 h-9 w-full border-2 bg-white px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none ${
          error ? 'border-rose-400 focus:border-rose-500' : 'border-input focus:border-primary'
        }`}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {error ? <p className="mt-0.5 text-xs text-rose-500">{error}</p> : null}
    </div>
  )
}

export function ProfileSection() {
  const { user, refreshUser } = useStore()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [phone, setPhone] = useState(formatDisplayPhone(user?.phone))
  const [addressLine1, setAddressLine1] = useState(user?.shippingAddress?.addressLine1 ?? '')
  const [addressLine2, setAddressLine2] = useState(user?.shippingAddress?.addressLine2 ?? '')
  const [city, setCity] = useState(user?.shippingAddress?.city ?? '')
  const [county, setCounty] = useState(user?.shippingAddress?.county ?? '')
  const [postalCode, setPostalCode] = useState(user?.shippingAddress?.postalCode ?? '')
  const [country, setCountry] = useState(user?.shippingAddress?.country ?? 'Kenya')

  const resetFields = () => {
    setFirstName(user?.firstName ?? '')
    setLastName(user?.lastName ?? '')
    setPhone(formatDisplayPhone(user?.phone))
    setAddressLine1(user?.shippingAddress?.addressLine1 ?? '')
    setAddressLine2(user?.shippingAddress?.addressLine2 ?? '')
    setCity(user?.shippingAddress?.city ?? '')
    setCounty(user?.shippingAddress?.county ?? '')
    setPostalCode(user?.shippingAddress?.postalCode ?? '')
    setCountry(user?.shippingAddress?.country ?? 'Kenya')
    setFieldErrors({})
    setFeedback(null)
  }

  const handleCancel = () => {
    resetFields()
    setEditing(false)
  }

  const handleSave = async () => {
    setFieldErrors({})
    setFeedback(null)

    const formData = {
      firstName,
      lastName,
      phone,
      addressLine1: addressLine1 || undefined,
      addressLine2: addressLine2 || undefined,
      city: city || undefined,
      county: county || undefined,
      postalCode: postalCode || undefined,
      country: country || undefined,
    }

    const parsed = profileSchema.safeParse(formData)
    if (!parsed.success) {
      setFieldErrors(extractFieldErrors(parsed.error))
      return
    }

    setSaving(true)
    const result = await updateProfileAction(formData)
    setSaving(false)

    if (result.success) {
      await refreshUser()
      setFeedback({ ok: true, msg: 'Profile updated!' })
      setEditing(false)
    } else if (result.fieldErrors) {
      setFieldErrors(result.fieldErrors)
    } else {
      setFeedback({ ok: false, msg: result.error ?? 'Update failed' })
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {editing ? (
          <div className="flex items-center gap-3">
            <button
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={handleCancel}
              type="button"
            >
              <HiOutlineXMark className="size-4" />
              Cancel
            </button>
            <button
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
              disabled={saving}
              onClick={handleSave}
              type="button"
            >
              <HiOutlineCheck className="size-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <button
            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80"
            onClick={() => {
              setFeedback(null)
              setEditing(true)
            }}
            type="button"
          >
            <HiOutlinePencilSquare className="size-4" />
            Edit Profile
          </button>
        )}
      </div>

      {feedback ? (
        <div
          className={`mb-4 border-2 p-2 text-xs ${
            feedback.ok
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-rose-200 bg-rose-50 text-rose-600'
          }`}
        >
          {feedback.msg}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <ProfileField
          editing={editing}
          error={fieldErrors.firstName}
          label="First Name"
          name="firstName"
          onChange={setFirstName}
          placeholder="Your first name"
          value={firstName}
        />
        <ProfileField
          editing={editing}
          error={fieldErrors.lastName}
          label="Last Name"
          name="lastName"
          onChange={setLastName}
          placeholder="Your last name"
          value={lastName}
        />
        <ProfileField
          editing={editing}
          error={fieldErrors.phone}
          label="Phone"
          name="phone"
          onChange={setPhone}
          placeholder="0712345678"
          value={phone}
        />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Email
          </p>
          <p className="text-sm text-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3 sm:mt-5 sm:pt-4">
        <div className="mb-2.5 flex items-center gap-1.5 sm:mb-3">
          <HiOutlineMapPin className="size-4 text-primary" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Shipping Address
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <ProfileField
            editing={editing}
            label="Address Line 1"
            name="addressLine1"
            onChange={setAddressLine1}
            placeholder="Street address"
            value={addressLine1}
          />
          <ProfileField
            editing={editing}
            label="Address Line 2"
            name="addressLine2"
            onChange={setAddressLine2}
            placeholder="Apt, Suite, etc."
            value={addressLine2}
          />
          <ProfileField
            editing={editing}
            label="City"
            name="city"
            onChange={setCity}
            placeholder="City"
            value={city}
          />
          <ProfileField
            editing={editing}
            label="County / State"
            name="county"
            onChange={setCounty}
            placeholder="County"
            value={county}
          />
          <ProfileField
            editing={editing}
            label="Postal Code"
            name="postalCode"
            onChange={setPostalCode}
            placeholder="00100"
            value={postalCode}
          />
          <ProfileField
            editing={editing}
            label="Country"
            name="country"
            onChange={setCountry}
            placeholder="Country"
            value={country}
          />
        </div>
      </div>
    </div>
  )
}
