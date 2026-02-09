import React from 'react'

type LogoProps = {
  className?: string
}

export default function Logo({ className }: Readonly<LogoProps>) {
  return (
    <img
      src="/logo.png"
      alt="Galactic Solar Electricals"
      className={className}
      style={{ display: 'block', width: '30%', height: 'auto' }}
    />
  )
}
