'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { login, logout } from '@payloadcms/next/auth'
import config from '@payload-config'
import { loginSchema, registerSchema, profileSchema, formatPhone } from '@/lib/auth-schemas'
import { redis } from '@/lib/redis'
import { render } from '@react-email/render'
import { VerifyEmail } from '@/emails/VerifyEmail'
import crypto from 'node:crypto'

type AuthResult = {
  success: boolean
  user?: {
    id: string
    email: string
    roles: string[]
    firstName?: string
    lastName?: string
    phone?: string
  }
  error?: string
  fieldErrors?: Record<string, string>
  verifyEmail?: boolean
}

type ResendResult = {
  success: boolean
  error?: string
  remaining?: number
}

export async function getMe() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) return null

  const addr = user.shippingAddress as Record<string, string | null | undefined> | undefined

  return {
    id: user.id,
    email: user.email,
    roles: (user.roles as string[]) ?? [],
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    phone: user.phone || undefined,
    shippingAddress: addr
      ? {
          addressLine1: addr.addressLine1 ?? undefined,
          addressLine2: addr.addressLine2 ?? undefined,
          city: addr.city ?? undefined,
          county: addr.county ?? undefined,
          postalCode: addr.postalCode ?? undefined,
          country: addr.country ?? undefined,
        }
      : undefined,
  }
}

export async function loginAction(email: string, password: string): Promise<AuthResult> {
  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0])
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { success: false, fieldErrors }
  }

  try {
    const result = await login({
      collection: 'users',
      config,
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (!result.user) {
      return { success: false, error: 'Invalid email or password' }
    }

    return {
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        roles: (result.user.roles as string[]) ?? [],
        firstName: result.user.firstName || undefined,
        lastName: result.user.lastName || undefined,
        phone: result.user.phone || undefined,
      },
    }
  } catch {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: parsed.data.email.toLowerCase() } },
      limit: 1,
    })
    const found = docs[0]
    if (found?._verified === false) {
      return { success: false, error: 'Email not verified', verifyEmail: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }
}

export async function registerAction(data: {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
}): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0])
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { success: false, fieldErrors }
  }

  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'users',
      data: {
        email: parsed.data.email,
        password: parsed.data.password,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: formatPhone(parsed.data.phone),
        roles: ['user'],
      },
    })

    return { success: true, verifyEmail: true }
  } catch {
    return { success: false, error: 'Registration failed. Email may already be in use.' }
  }
}

export async function logoutAction(): Promise<void> {
  try {
    await logout({ config })
  } catch {
    // Logout should not throw to the client
  }
}

const RESEND_VERIFY_MAX = 5
const RESEND_VERIFY_TTL = 60 * 60 * 24 // 24 hours in seconds

type ProfileResult = {
  success: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function updateProfileAction(data: {
  firstName: string
  lastName: string
  phone: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  county?: string
  postalCode?: string
  country?: string
}): Promise<ProfileResult> {
  const parsed = profileSchema.safeParse(data)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0])
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return { success: false, fieldErrors }
  }

  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) return { success: false, error: 'Not authenticated' }

  try {
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        phone: formatPhone(parsed.data.phone),
        shippingAddress: {
          addressLine1: parsed.data.addressLine1 || null,
          addressLine2: parsed.data.addressLine2 || null,
          city: parsed.data.city || null,
          county: parsed.data.county || null,
          postalCode: parsed.data.postalCode || null,
          country: parsed.data.country || null,
        },
      },
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to update profile. Please try again.' }
  }
}

export async function resendVerificationAction(email: string): Promise<ResendResult> {
  if (!email) return { success: false, error: 'Email is required' }

  const rateLimitKey = `verify_resend:${email.toLowerCase()}`

  try {
    const count = await redis.get<number>(rateLimitKey)
    if (count !== null && count >= RESEND_VERIFY_MAX) {
      return {
        success: false,
        error: 'Maximum resend limit reached. Try again in 24 hours.',
        remaining: 0,
      }
    }

    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: email.toLowerCase() } },
      limit: 1,
    })

    const user = docs[0]
    if (!user) return { success: false, error: 'No account found with this email' }

    if (user._verified) {
      return { success: false, error: 'Email is already verified. You can sign in.' }
    }

    const token = crypto.randomBytes(20).toString('hex')

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { _verificationToken: token },
    })

    const serverUrl = payload.config.serverURL || 'http://localhost:3000'
    const html = await render(VerifyEmail({ serverUrl, token, userEmail: user.email }))

    await payload.sendEmail({
      to: user.email,
      subject: 'Verify your email – Galactic Solar & Electricals',
      html,
    })

    const newCount = (count ?? 0) + 1
    await redis.set(rateLimitKey, newCount, { ex: RESEND_VERIFY_TTL })

    return { success: true, remaining: RESEND_VERIFY_MAX - newCount }
  } catch {
    return { success: false, error: 'Failed to resend verification email. Please try again.' }
  }
}

export type OrderSummary = {
  id: string
  orderNumber: string
  paymentStatus: string
  fulfillmentStatus: string
  total: number
  currency: string
  itemCount: number
  createdAt: string
  items: {
    title: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }[]
}

export async function getMyOrders(): Promise<OrderSummary[]> {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) return []

  const result = await payload.find({
    collection: 'orders',
    where: { customer: { equals: user.id } },
    sort: '-createdAt',
    limit: 50,
    depth: 0,
    overrideAccess: false,
    user,
  })

  return result.docs.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber || order.id,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    total: order.pricing?.total ?? 0,
    currency: order.pricing?.currency || 'KES',
    itemCount: order.items?.length || 0,
    createdAt: order.createdAt,
    items: (order.items || []).map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
  }))
}
