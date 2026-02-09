'use client'

import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'

export function InputField({
  icon: Icon,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
  minLength,
}: {
  readonly icon: React.ComponentType<{ className?: string }>
  readonly name: string
  readonly type?: string
  readonly placeholder: string
  readonly autoComplete?: string
  readonly value: string
  readonly onChange: (v: string) => void
  readonly error?: string
  readonly minLength?: number
}) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && visible ? 'text' : type

  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-black/40" />
        <input
          autoComplete={autoComplete}
          className={`h-11 w-full border-2 bg-white pl-10 text-sm text-black placeholder:text-black/40 focus:outline-none ${
            isPassword ? 'pr-10' : 'pr-3'
          } ${error ? 'border-rose-400 focus:border-rose-500' : 'border-gray-300 focus:border-primary'}`}
          minLength={minLength}
          name={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={inputType}
          value={value}
        />
        {isPassword ? (
          <button
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-black/40 hover:text-black/70"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            type="button"
          >
            {visible ? (
              <HiOutlineEyeSlash className="size-5" />
            ) : (
              <HiOutlineEye className="size-5" />
            )}
          </button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-rose-500">{error}</p> : null}
    </div>
  )
}
