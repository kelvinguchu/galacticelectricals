import type { ZodError } from 'zod/v4'

export type FieldErrors = Record<string, string>

export function extractFieldErrors(zodError: ZodError): FieldErrors {
  const errs: FieldErrors = {}
  for (const issue of zodError.issues) {
    const key = String(issue.path[0])
    if (!errs[key]) errs[key] = issue.message
  }
  return errs
}
