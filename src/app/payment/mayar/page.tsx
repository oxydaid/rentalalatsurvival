export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { getAdminContacts } from "@/app/actions/admin-contacts"
import { getSiteSettings } from "@/app/actions/settings"
import Link from "next/link"
import { redirect } from "next/navigation"
import MayarPaymentClient from "./mayar-client"

export default async function MayarPaymentPage(props: {
  searchParams: Promise<{ bookingId?: string; qrUrl?: string; amount?: string }>
}) {
  const searchParams = await props.searchParams
  const bookingId = searchParams?.bookingId
  const initialQrUrl = searchParams?.qrUrl
  const parsedAmount = Number(searchParams?.amount)
  const initialAmount = Number.isFinite(parsedAmount) ? parsedAmount : undefined

  if (!bookingId) {
    return (
      <div className="container-custom pt-32 pb-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-earth-900 mb-3">Booking ID Tidak Ditemukan</h1>
        <p className="text-earth-600 mb-8">Silakan kembali ke keranjang dan coba lagi.</p>
        <Link href="/cart" className="bg-primary-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-primary-400">
          Kembali ke Keranjang
        </Link>
      </div>
    )
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      bookingitem: {
        include: { product: true },
      },
    },
  })

  if (!booking) {
    return (
      <div className="container-custom pt-32 pb-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-earth-900 mb-3">Pesanan Tidak Ditemukan</h1>
        <p className="text-earth-600 mb-8">ID: {bookingId}</p>
        <Link href="/products" className="bg-primary-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-primary-400">
          Kembali Belanja
        </Link>
      </div>
    )
  }

  if (booking.status === "CONFIRMED") {
    redirect("/payment/success?bookingId=" + bookingId)
  }

  const paymentAmount = booking.paymentMethod === "DP_50"
    ? Math.round(booking.totalPrice * 0.5)
    : booking.totalPrice

  const adminContacts = await getAdminContacts()
  const activeAdmins = adminContacts.filter((c: any) => c?.isActive)
  const settings = await getSiteSettings()
  const selectedAdminId = String((settings as any)?.confirmationAdminContactId || "").trim()
  const selectedAdmin = selectedAdminId
    ? adminContacts.find((c: any) => c?.id === selectedAdminId)
    : null
  const primaryAdmin = selectedAdmin || activeAdmins[0] || adminContacts[0] || null
  const adminWhatsappNumber = (primaryAdmin?.number || (settings as any)?.whatsappNumber || null) as string | null
  const adminName = (primaryAdmin?.name || "Admin") as string

  return (
    <MayarPaymentClient 
      booking={booking}
      paymentAmount={paymentAmount}
      bookingId={bookingId}
      initialQrUrl={initialQrUrl}
      initialAmount={initialAmount}
      adminWhatsappNumber={adminWhatsappNumber}
      adminName={adminName}
    />
  )
}
