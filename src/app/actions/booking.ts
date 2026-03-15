"use server"

import { prisma } from "@/lib/prisma"
import { CartItem } from "@/lib/store"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

export async function checkAvailability(
  productId: string,
  startDate: string,
  endDate: string,
  requestedQuantity: number
) {
  try {
    // Get product total stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, name: true }
    })

    if (!product) {
      return { available: false, message: "Produk tidak ditemukan", maxAvailable: 0 }
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Query overlapping bookings
    // Status: PENDING or CONFIRMED
    // Overlap: existing.start <= requested.end AND existing.end >= requested.start
    // Using Raw SQL for reliability with dates
    const overlappingItems = await prisma.$queryRaw`
      SELECT SUM(bi.quantity) as rentedCount
      FROM bookingitem bi
      JOIN booking b ON bi.bookingId = b.id
      WHERE bi.productId = ${productId}
      AND b.status IN ('PENDING', 'CONFIRMED')
      AND DATE(bi.startDate) <= DATE(${end})
      AND DATE(bi.endDate) >= DATE(${start})
    ` as { rentedCount: number | null }[]

    const rentedCount = Number(overlappingItems[0]?.rentedCount || 0)
    const availableStock = Math.max(0, product.stock - rentedCount)

    if (availableStock >= requestedQuantity) {
      return { available: true, maxAvailable: availableStock }
    } else {
      return { 
        available: false, 
        message: `Stok tidak cukup untuk tanggal tersebut. Sisa stok: ${availableStock}`, 
        maxAvailable: availableStock 
      }
    }
  } catch (error) {
    console.error("Availability check failed:", error)
    return { available: false, message: "Gagal mengecek ketersediaan", maxAvailable: 0 }
  }
}

export async function createBooking(data: {
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: CartItem[]
  totalPrice: number
}) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Keranjang kosong" }
    }

    // Determine overall start and end dates for the booking record
    // We'll take the earliest start date and latest end date from items
    const startDates = data.items.map(item => new Date(item.startDate).getTime())
    const endDates = data.items.map(item => new Date(item.endDate).getTime())
    
    const minStartDate = new Date(Math.min(...startDates))
    const maxEndDate = new Date(Math.max(...endDates))

    // Verify availability for all items first
    for (const item of data.items) {
      const check = await checkAvailability(item.id, item.startDate, item.endDate, item.quantity)
      if (!check.available) {
        return { success: false, error: `Stok ${item.name} habis/kurang untuk tanggal yang dipilih.` }
      }
    }

    // Create the booking using Raw SQL to bypass potentially outdated Prisma Client
    const bookingId = randomUUID()
    const now = new Date()

    // 1. Insert Booking
    await prisma.$executeRaw`
      INSERT INTO booking (id, customerName, customerPhone, customerEmail, startDate, endDate, totalPrice, status, paymentMethod, createdAt, updatedAt)
      VALUES (${bookingId}, ${data.customerName}, ${data.customerPhone}, ${data.customerEmail || null}, ${minStartDate}, ${maxEndDate}, ${data.totalPrice}, 'PENDING', 'COD', ${now}, ${now})
    `

    // 2. Insert BookingItems
    for (const item of data.items) {
      const itemId = randomUUID()
      
      // Insert BookingItem
      await prisma.$executeRaw`
        INSERT INTO bookingitem (id, bookingId, productId, quantity, startDate, endDate, pickupTime, returnTime)
        VALUES (${itemId}, ${bookingId}, ${item.id}, ${item.quantity}, ${new Date(item.startDate)}, ${new Date(item.endDate)}, ${item.pickupTime || null}, ${item.returnTime || null})
      `
    }

    revalidatePath("/admin/bookings")
    return { success: true, bookingId: bookingId }
  } catch (error) {
    console.error("Failed to create booking:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Gagal menyimpan booking" 
    }
  }
}
