import { NextResponse } from "next/server"
import { createMayarPayment } from "@/lib/mayar"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const bookingId = body?.bookingId as string | undefined
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const dpAmount = Math.round(booking.totalPrice * 0.5)
    
    // cast to any to avoid immediate type cache issue, though schema is updated
    const bookingData = booking as any

    const payment = await createMayarPayment({ 
      amount: dpAmount,
      name: booking.customerName,
      email: bookingData.customerEmail || "customer@example.com",
      mobile: booking.customerPhone,
      description: `DP Payment for booking ${bookingId}`
    })

    return NextResponse.json({
      amount: payment.amount,
      bookingId: booking.id,
      url: payment.url,
    })
  } catch (error) {
    console.error("Failed to create Mayar Payment:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal error",
      },
      { status: 500 }
    )
  }
}
