import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInHours } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateDuration(start: Date, end: Date) {
  const diffHours = differenceInHours(end, start)
  // Formula: (TotalHours - 4 Free Hours) / 24 rounded up
  const duration = Math.ceil((diffHours - 4) / 24)
  return Math.max(1, duration)
}

export function calculateItemPrice(duration: number, product: any) {
  if (duration <= 0) return 0
  if (!product) return 0
  
  if (duration === 1) return product.price1Day || 0
  if (duration === 2) return product.price2Days || 0
  if (duration === 3) return product.price3Days || 0
  
  const basePrice = product.price3Days || 0
  const overPrice = product.priceOver3Days || 0
  return basePrice + (duration - 3) * overPrice
}
