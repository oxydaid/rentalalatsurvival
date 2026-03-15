import { NextResponse } from "next/server"
import { createMayarPayment } from "@/lib/mayar"
import { prisma } from "@/lib/prisma"

type PaymentType = "DP_50" | "FULL"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const bookingId = body?.bookingId as string | undefined
    const paymentType = body?.paymentType as PaymentType | undefined

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId required" }, { status: 400 })
    }

    if (paymentType !== "DP_50" && paymentType !== "FULL") {
      return NextResponse.json({ error: "Invalid paymentType" }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } })
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const amount = paymentType === "DP_50"
      ? Math.round(booking.totalPrice * 0.5)
      : booking.totalPrice

    const payment = await createMayarPayment({ 
      amount,
      name: booking.customerName,
      email: booking.customerEmail || "customer@example.com",
      mobile: booking.customerPhone,
      description: `Payment for booking ${bookingId} (${paymentType})`
    })

    // Update booking dengan payment method dan transaction metadata
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentMethod: paymentType === "DP_50" ? "DP_50" : "FULL",
        mayarTransactionId: undefined, // akan di-set saat webhook diterima
      }
    })

    const pageParams = new URLSearchParams({
      bookingId,
      qrUrl: payment.url,
      amount: String(payment.amount),
    })

    return NextResponse.json({
      amount: payment.amount,
      bookingId: booking.id,
      paymentType,
      qrUrl: payment.url,
      paymentPageUrl: `/payment/mayar?${pageParams.toString()}`,
    })
  } catch (error) {
    console.error("Failed to create Mayar payment:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal error",
      },
      { status: 500 }
    )
  }
}
