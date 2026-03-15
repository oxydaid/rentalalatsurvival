import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type MayarWebhookPayload = {
  event?: string
  type?: string
  data?: {
    id?: string
    transactionId?: string
    status?: string | boolean
    transactionStatus?: string
    amount?: number
    customerMobile?: string
    metadata?: {
      ref?: string
      bookingId?: string
    }
    ref?: string
    bookingId?: string
    custom_field?: unknown
    customField?: unknown
  }
}

function normalizePhone(phone?: string | null) {
  if (!phone) return ""
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("62")) return digits.slice(2)
  if (digits.startsWith("0")) return digits.slice(1)
  return digits
}

function extractBookingIdFromCustomField(customField: unknown) {
  if (!Array.isArray(customField)) return null

  for (const entry of customField) {
    if (!entry || typeof entry !== "object") continue

    const key = String((entry as Record<string, unknown>).key || (entry as Record<string, unknown>).name || "").toLowerCase()
    const value = (entry as Record<string, unknown>).value

    if (typeof value === "string" && value.length > 0) {
      if (key.includes("booking") || key === "ref" || key === "reference") {
        return value
      }
    }
  }

  return null
}

async function findPendingBookingFallback(amount?: number, customerMobile?: string) {
  if (!Number.isFinite(amount) || (amount as number) <= 0) {
    return null
  }

  const normalized = normalizePhone(customerMobile)
  const amountValue = Number(amount)

  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT b.id
    FROM booking b
    WHERE b.status = 'PENDING'
      AND (
        b.totalPrice = ${amountValue}
        OR ROUND(b.totalPrice * 0.5) = ${amountValue}
      )
      AND (
        ${normalized} = ''
        OR REPLACE(REPLACE(REPLACE(REPLACE(b.customerPhone, '+', ''), '-', ''), ' ', ''), '.', '') LIKE CONCAT('%', ${normalized})
      )
    ORDER BY b.createdAt DESC
    LIMIT 2
  `

  // Only auto-map when the fallback result is unique.
  if (rows.length === 1) {
    return rows[0].id
  }

  return null
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json().catch(() => ({}))) as MayarWebhookPayload
    const eventName = payload?.event || payload?.type
    const data = payload?.data || {}
    const mayarTransactionId = data?.transactionId || data?.id

    const isPaidEvent =
      eventName === "payment.received" ||
      eventName === "payment.paid"

    const status = data?.status
    const isPaidStatus =
      status === true ||
      status === "SUCCESS" ||
      status === "PAID"

    if (!isPaidEvent || !isPaidStatus) {
      return NextResponse.json({ ok: true, ignored: true, event: eventName || null })
    }

    const requestUrl = new URL(req.url)

    const bookingIdFromMetadata = data?.metadata?.bookingId || data?.metadata?.ref
    const bookingIdFromData = data?.bookingId || data?.ref
    const bookingIdFromCustomField = extractBookingIdFromCustomField(data?.custom_field || data?.customField)
    const bookingIdFromQuery = requestUrl.searchParams.get("bookingId") || requestUrl.searchParams.get("ref")

    let bookingId: string | null = null

    if (typeof mayarTransactionId === "string" && mayarTransactionId.length > 0) {
      const existing = await prisma.booking.findFirst({
        where: { mayarTransactionId },
        select: { id: true },
      })
      bookingId = existing?.id || null
    }

    bookingId = bookingId ||
      bookingIdFromMetadata ||
      bookingIdFromData ||
      bookingIdFromCustomField ||
      bookingIdFromQuery ||
      (await findPendingBookingFallback(data?.amount, data?.customerMobile))

    if (!bookingId) {
      return NextResponse.json({ ok: true, mapped: false })
    }

    const mayarStatus =
      typeof data?.status === "string"
        ? data.status
        : data?.status === true
          ? "SUCCESS"
          : null

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED",
        mayarTransactionId: typeof mayarTransactionId === "string" ? mayarTransactionId : undefined,
        mayarTransactionStatus: data?.transactionStatus || mayarStatus || undefined,
      },
    })

    return NextResponse.json({
      ok: true,
      mapped: true,
      bookingId,
      transactionId: mayarTransactionId || null,
    })
  } catch (error) {
    console.error("Mayar webhook error:", error)
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
