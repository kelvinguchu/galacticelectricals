import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatKES = (value: number) =>
  `KES ${Math.round(Number.isFinite(value) ? value : 0).toLocaleString()}`
