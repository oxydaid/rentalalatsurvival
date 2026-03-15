'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { differenceInHours } from 'date-fns'

// Helper to calculate duration (same logic as BookingForm)
function calculateDuration(start: Date, end: Date) {
  const diffHours = differenceInHours(end, start)
  // Formula: (TotalHours - 4 Free Hours) / 24 rounded up
  const duration = Math.ceil((diffHours - 4) / 24)
  return Math.max(1, duration)
}

// Helper to calculate price based on duration and product pricing
function calculateItemPrice(duration: number, product: any) {
  if (duration <= 0) return 0
  if (duration === 1) return product.price1Day
  if (duration === 2) return product.price2Days
  if (duration === 3) return product.price3Days
  return product.price3Days + (duration - 3) * product.priceOver3Days
}

// Helper to recalculate booking total price
async function recalculateBookingTotal(bookingId: string) {
  const items = await prisma.bookingitem.findMany({
    where: { bookingId },
    include: { product: true }
  })

  let total = 0

  for (const item of items) {
    // If item has specific dates, use them. Otherwise, fall back to booking dates.
    // However, the schema says bookingitem has nullable startDate/endDate. 
    // In practice, we should ensure they are populated or use booking's dates.
    // Let's fetch booking dates just in case.
    
    let start = item.startDate
    let end = item.endDate
    
    // Construct Date objects with time if pickupTime/returnTime are present
    // The startDate/endDate in DB usually are just dates (00:00:00) if coming from simple date inputs,
    // but in BookingForm they are strings passed to new Date().
    // The pickupTime/returnTime are separate fields.
    
    if (start && end) {
      const s = new Date(start)
      const e = new Date(end)
      
      if (item.pickupTime) s.setHours(parseInt(item.pickupTime))
      if (item.returnTime) e.setHours(parseInt(item.returnTime))
      
      const duration = calculateDuration(s, e)
      const unitPrice = calculateItemPrice(duration, item.product)
      total += unitPrice * item.quantity
    }
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { totalPrice: total }
  })
}

export async function removeBookingItem(bookingId: string, itemId: string) {
  try {
    await prisma.bookingitem.delete({
      where: { id: itemId }
    })

    await recalculateBookingTotal(bookingId)
    revalidatePath('/admin/bookings')
    return { success: true }
  } catch (error) {
    console.error('Failed to remove booking item:', error)
    return { error: 'Gagal menghapus item' }
  }
}

export async function addBookingItem(bookingId: string, productId: string, quantity: number) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })
    
    if (!booking) return { error: 'Booking tidak ditemukan' }

    // Use booking's dates/times as default for the new item
    // But wait, booking table doesn't have pickupTime/returnTime columns in the schema shown earlier?
    // Let's check schema again. 
    // `booking` has startDate, endDate. `bookingitem` has startDate, endDate, pickupTime, returnTime.
    // We should try to find an existing item in this booking to copy times from, or default to 8:00 if none.
    
    const existingItem = await prisma.bookingitem.findFirst({
      where: { bookingId }
    })

    const pickupTime = existingItem?.pickupTime || "8"
    const returnTime = existingItem?.returnTime || "8"
    
    // Create new item
    await prisma.bookingitem.create({
      data: {
        id: crypto.randomUUID(),
        bookingId,
        productId,
        quantity,
        startDate: booking.startDate,
        endDate: booking.endDate,
        pickupTime,
        returnTime
      }
    })

    await recalculateBookingTotal(bookingId)
    revalidatePath('/admin/bookings')
    return { success: true }
  } catch (error) {
    console.error('Failed to add booking item:', error)
    return { error: 'Gagal menambah item' }
  }
}

export async function getAvailableProducts() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' }
        })
        return products
    } catch (error) {
        return []
    }
}
