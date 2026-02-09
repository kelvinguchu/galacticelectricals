'use client'

import { type ReactNode, useCallback, useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { HiOutlineAdjustmentsHorizontal, HiOutlineXMark } from 'react-icons/hi2'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  ProductFilterBody,
  getHasActiveFilters,
  getActiveFilterCount,
  type FilterCategory,
  type FilterValues,
} from '@/components/home/ProductFilterBody'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'

type Props = {
  readonly categories: FilterCategory[]
  readonly fixedCategoryId?: string
  readonly children: ReactNode
}

const emptyFilters: FilterValues = {
  q: '',
  categories: [],
  stockStatus: '',
  productType: '',
  minPrice: '',
  maxPrice: '',
  sort: '',
}

function filtersFromParams(params: URLSearchParams, fixedCategoryId?: string): FilterValues {
  const cats = fixedCategoryId
    ? [fixedCategoryId]
    : (params.get('categories')?.split(',').filter(Boolean) ?? [])
  return {
    q: params.get('q') ?? '',
    categories: cats,
    stockStatus: params.get('stockStatus') ?? '',
    productType: params.get('productType') ?? '',
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    sort: params.get('sort') ?? '',
  }
}

function filtersToParams(values: FilterValues, fixedCategoryId?: string): URLSearchParams {
  const params = new URLSearchParams()

  if (values.q) params.set('q', values.q)

  if (!fixedCategoryId && values.categories.length > 0) {
    params.set('categories', values.categories.join(','))
  }

  if (values.stockStatus) params.set('stockStatus', values.stockStatus)
  if (values.productType) params.set('productType', values.productType)
  if (values.minPrice) params.set('minPrice', values.minPrice)
  if (values.maxPrice) params.set('maxPrice', values.maxPrice)
  if (values.sort) params.set('sort', values.sort)

  return params
}

function FloatingFilterButton({ filterCount }: { readonly filterCount: number }) {
  const { isMobile, setOpenMobile } = useSidebar()
  if (!isMobile) return null
  return (
    <button
      aria-label="Open filters"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform active:scale-95"
      onClick={() => setOpenMobile(true)}
      type="button"
    >
      <HiOutlineAdjustmentsHorizontal className="size-5" />
      <span>Filters</span>
      {filterCount > 0 && (
        <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
          {filterCount}
        </span>
      )}
    </button>
  )
}

function FilterSidebar({ categories, fixedCategoryId, children }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const { setOpenMobile, isMobile } = useSidebar()

  const [values, setValues] = useState<FilterValues>(() =>
    filtersFromParams(searchParams, fixedCategoryId),
  )

  useEffect(() => {
    setValues(filtersFromParams(searchParams, fixedCategoryId))
  }, [searchParams, fixedCategoryId])

  const applyFilters = useCallback(
    (next: FilterValues) => {
      setValues(next)
      const params = filtersToParams(next, fixedCategoryId)
      const qs = params.toString()
      startTransition(() => {
        const url = qs ? `${pathname}?${qs}` : pathname
        router.push(url, { scroll: false })
      })
      if (isMobile) setOpenMobile(false)
    },
    [router, pathname, fixedCategoryId, startTransition, isMobile, setOpenMobile],
  )

  const handleReset = useCallback(() => {
    const reset = fixedCategoryId
      ? { ...emptyFilters, categories: [fixedCategoryId] }
      : emptyFilters
    applyFilters(reset)
  }, [applyFilters, fixedCategoryId])

  const filterableCategories = fixedCategoryId ? [] : categories
  const hasActiveFilters = getHasActiveFilters(values, fixedCategoryId)
  const filterCount = getActiveFilterCount(values, fixedCategoryId)

  return (
    <>
      <Sidebar collapsible="offcanvas" className="border-r-0">
        {/* Spacer so sidebar content starts below the sticky header (desktop only) */}
        <div className="hidden h-14 shrink-0 md:block md:h-15.5" />
        <SidebarHeader className="px-4 pb-0">
          <span className="text-xs font-bold uppercase tracking-widest text-sidebar-foreground/70">
            Filters
          </span>
        </SidebarHeader>
        <SidebarContent className="px-4 py-3">
          <ProductFilterBody
            categories={filterableCategories}
            values={values}
            onChange={applyFilters}
          />
        </SidebarContent>
        <SidebarFooter className="px-4 pb-4">
          <Button
            className="w-full cursor-pointer rounded-none uppercase tracking-widest"
            disabled={!hasActiveFilters}
            onClick={handleReset}
            size="sm"
            variant="outline"
          >
            <HiOutlineXMark className="size-3.5" />
            Clear All Filters
            {filterCount > 0 && (
              <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {filterCount}
              </span>
            )}
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="overflow-hidden pb-20 md:pb-0">
        {children}
        <FloatingFilterButton filterCount={filterCount} />
        <WhatsAppButton position="left" />
      </SidebarInset>
    </>
  )
}

export function ProductFilters({ categories, fixedCategoryId, children }: Props) {
  return (
    <SidebarProvider className="min-h-0" defaultOpen>
      <FilterSidebar categories={categories} fixedCategoryId={fixedCategoryId}>
        {children}
      </FilterSidebar>
    </SidebarProvider>
  )
}
