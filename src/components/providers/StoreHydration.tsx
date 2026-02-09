'use client'

import { useEffect } from 'react'

import { useStore } from '@/stores/store'

export function StoreHydration() {
  const hydrate = useStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return null
}
