import { z } from 'zod/v4'

export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^0\d{9}$/, 'Enter exactly 10 digits e.g. 0712345678'),
    email: z.email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterData = z.infer<typeof registerSchema>

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^0\d{9}$/, 'Enter exactly 10 digits e.g. 0712345678'),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
})

export type ProfileData = z.infer<typeof profileSchema>

export function formatPhone(phone: string): string {
  return `254${phone.slice(1)}`
}
