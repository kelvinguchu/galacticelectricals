import React from 'react'

type IconProps = {
  className?: string
}

export default function Icon({ className }: Readonly<IconProps>) {
  return (
    <img
      src="/favicon.png"
      alt="Galactic Solar Electricals"
      className={className}
      style={{ display: 'block', height: '20px', width: '20px' }}
    />
  )
}
