'use client'

import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type FilterCategory = {
  readonly id: string
  readonly name: string
  readonly slug: string
}

export type FilterValues = {
  q: string
  categories: string[]
  stockStatus: string
  productType: string
  minPrice: string
  maxPrice: string
  sort: string
}

type Props = {
  readonly categories: FilterCategory[]
  readonly values: FilterValues
  readonly onChange: (values: FilterValues) => void
}

const stockOptions = [
  { label: 'In Stock', value: 'instock' },
  { label: 'Out of Stock', value: 'outofstock' },
  { label: 'On Backorder', value: 'onbackorder' },
]

const typeOptions = [
  { label: 'Simple', value: 'simple' },
  { label: 'Variable', value: 'variable' },
]

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Name: A → Z', value: 'title-asc' },
  { label: 'Name: Z → A', value: 'title-desc' },
]

export function getHasActiveFilters(values: FilterValues, fixedCategoryId?: string): boolean {
  return getActiveFilterCount(values, fixedCategoryId) > 0
}

export function getActiveFilterCount(values: FilterValues, fixedCategoryId?: string): number {
  let count = 0
  if (values.q) count++
  if (!fixedCategoryId && values.categories.length > 0) count += values.categories.length
  if (values.stockStatus) count++
  if (values.productType) count++
  if (values.minPrice) count++
  if (values.maxPrice) count++
  if (values.sort) count++
  return count
}

export function ProductFilterBody({ categories, values, onChange }: Props) {
  const update = (partial: Partial<FilterValues>) => {
    onChange({ ...values, ...partial })
  }

  const toggleCategory = (catId: string) => {
    const next = values.categories.includes(catId)
      ? values.categories.filter((c) => c !== catId)
      : [...values.categories, catId]
    update({ categories: next })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Search
        </Label>
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="rounded-none pl-8"
            placeholder="Search products..."
            type="search"
            value={values.q}
            onChange={(e) => update({ q: e.target.value })}
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Sort By
        </Label>
        <Select
          value={values.sort || 'newest'}
          onValueChange={(v) => update({ sort: v === 'newest' ? '' : v })}
        >
          <SelectTrigger className="w-full cursor-pointer rounded-none">
            <SelectValue placeholder="Newest" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      {categories.length > 0 ? (
        <div>
          <Label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Categories
          </Label>
          <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <Checkbox
                  className="cursor-pointer"
                  id={`cat-${cat.id}`}
                  checked={values.categories.includes(cat.id)}
                  onCheckedChange={() => toggleCategory(cat.id)}
                />
                <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer text-sm font-normal">
                  {cat.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Stock Status */}
      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Stock Status
        </Label>
        <div className="flex flex-col gap-2">
          {stockOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                className="cursor-pointer"
                id={`stock-${opt.value}`}
                checked={values.stockStatus === opt.value}
                onCheckedChange={(checked) => update({ stockStatus: checked ? opt.value : '' })}
              />
              <Label htmlFor={`stock-${opt.value}`} className="cursor-pointer text-sm font-normal">
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Product Type */}
      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Product Type
        </Label>
        <div className="flex flex-col gap-2">
          {typeOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                className="cursor-pointer"
                id={`type-${opt.value}`}
                checked={values.productType === opt.value}
                onCheckedChange={(checked) => update({ productType: checked ? opt.value : '' })}
              />
              <Label htmlFor={`type-${opt.value}`} className="cursor-pointer text-sm font-normal">
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Price Range (KES)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            className="rounded-none"
            placeholder="Min"
            type="number"
            min={0}
            value={values.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
          />
          <span className="text-xs text-muted-foreground">–</span>
          <Input
            className="rounded-none"
            placeholder="Max"
            type="number"
            min={0}
            value={values.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
