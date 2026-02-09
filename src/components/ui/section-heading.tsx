import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const sectionHeadingVariants = cva('font-bold uppercase tracking-tight text-black', {
  variants: {
    size: {
      sm: 'text-lg sm:text-xl',
      md: 'text-xl sm:text-2xl',
      lg: 'text-2xl sm:text-3xl',
      xl: 'text-3xl sm:text-4xl',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

type SectionHeadingProps = React.ComponentProps<'h2'> &
  VariantProps<typeof sectionHeadingVariants> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4'
  }

function SectionHeading({
  className,
  size,
  as: Tag = 'h2',
  children,
  ...props
}: SectionHeadingProps) {
  return (
    <Tag
      className={cn('flex items-center gap-3', sectionHeadingVariants({ size }), className)}
      {...props}
    >
      <span className="inline-block h-[0.75em] w-1.5 shrink-0 bg-primary" />
      <span className="min-w-0">{children}</span>
    </Tag>
  )
}

export { SectionHeading, sectionHeadingVariants }
