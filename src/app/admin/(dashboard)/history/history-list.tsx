"use client"

import { useState } from "react"
import { deleteBooking } from "@/app/actions/admin"
import { formatCurrency, calculateDuration, calculateItemPrice } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CheckCircle, CalendarClock, Trash2, Printer } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { generateInvoicePDF, InvoiceData } from "@/lib/pdf-generator"

interface HistoryListProps {
  bookings: any[] // Using any for simplicity with Prisma include types, but in prod should be typed
}

export default function HistoryListClient({ bookings: initialBookings }: HistoryListProps) {
  const router = useRouter()
  // We don't strictly need local state for bookings if we rely on router.refresh(), 
  // but optimistic updates feel better.
  const [bookings, setBookings] = useState(initialBookings)

  const handlePrintInvoice = (booking: any) => {
    try {
      const invoiceData: InvoiceData = {
        id: booking.id,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        createdAt: booking.createdAt,
        totalPrice: booking.totalPrice,
        items: booking.bookingitem.map((item: any) => {
          let start = new Date(item.startDate || booking.startDate)
          let end = new Date(item.endDate || booking.endDate)
          
          const pTime = item.pickupTime || "8"
          const rTime = item.returnTime || "8"
          
          start = new Date(start)
          end = new Date(end)
          
          start.setHours(parseInt(pTime))
          end.setHours(parseInt(rTime))
          
          const duration = calculateDuration(start, end)
          const price = calculateItemPrice(duration, item.product)
          
          return {
            name: item.product?.name || 'Produk dihapus',
            quantity: item.quantity,
            price: price,
            startDate: start,
            endDate: end,
            pickupTime: item.pickupTime,
            returnTime: item.returnTime
          }
        })
      }
      generateInvoicePDF(invoiceData)
    } catch (error) {
      console.error("Error generating invoice:", error)
      toast.error("Gagal membuat invoice PDF")
    }
  }

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus riwayat pesanan ini? Data yang dihapus tidak dapat dikembalikan.")) {
      return
    }

    const result = await deleteBooking(bookingId)
    if (result.success) {
      toast.success("Riwayat pesanan berhasil dihapus")
      // Optimistic update
      setBookings(bookings.filter(b => b.id !== bookingId))
      router.refresh()
    } else {
      toast.error(result.error || "Gagal menghapus pesanan")
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
        <CalendarClock size={48} className="mb-4 text-gray-300" />
        <p>Belum ada riwayat pesanan selesai.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {bookings.map((booking) => (
        <div key={booking.id} className="p-6 bg-gray-50/50 hover:bg-white transition-colors group">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-lg text-gray-900">{booking.customerName}</h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                  <CheckCircle size={10} />
                  SELESAI
                </span>
              </div>
              <p className="text-gray-500 text-sm">{booking.customerPhone}</p>
              <p className="text-gray-500 text-sm mt-1">
                {format(new Date(booking.startDate), "dd MMMM yyyy", { locale: id })} - {format(new Date(booking.endDate), "dd MMMM yyyy", { locale: id })}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-xs text-gray-400">Total Pembayaran</p>
              <p className="font-bold text-xl text-green-600">
                {formatCurrency(booking.totalPrice)}
              </p>
              
              {/* Delete Button - Visible on hover or always for mobile */}
              <button 
                onClick={() => handleDelete(booking.id)}
                className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition-opacity md:opacity-0 md:group-hover:opacity-100"
                title="Hapus Riwayat"
              >
                <Trash2 size={16} />
                <span>Hapus</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <h5 className="font-semibold text-sm text-gray-700 mb-2">Item Sewa:</h5>
            <ul className="space-y-2">
              {booking.bookingitem.map((item: any, idx: number) => (
                <li key={idx} className="text-sm text-gray-600 flex justify-between">
                  <span>• {item.product?.name || 'Produk dihapus'} x {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
