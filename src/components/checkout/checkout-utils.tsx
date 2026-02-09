import * as React from 'react'

export function StepHeader({
  icon: Icon,
  title,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>
  title: string
}>) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="size-5 text-primary" />
      <h2 className="text-sm font-bold uppercase tracking-widest">{title}</h2>
    </div>
  )
}

export function ErrorBox({ message }: Readonly<{ message: string }>) {
  return (
    <div className="mb-4 border-2 border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
      {message}
    </div>
  )
}

export function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}: Readonly<{
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  type?: string
}>) {
  const id = `field-${label.toLowerCase().replaceAll(/\s+/g, '-')}`
  return (
    <div>
      <label
        className="mb-1 block text-xs font-semibold uppercase tracking-widest text-black/60"
        htmlFor={id}
      >
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </label>
      <input
        className="h-11 w-full border-2 border-gray-300 bg-white px-3 text-sm focus:border-primary focus:outline-none"
        id={id}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </div>
  )
}
