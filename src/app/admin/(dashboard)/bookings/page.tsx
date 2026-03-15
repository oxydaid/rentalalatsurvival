import { prisma } from "@/lib/prisma"
import { BookingList } from "./booking-list"

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  // Fetch only ACTIVE bookings (Pending, Confirmed, Taken)
  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        in: ['PENDING', 'CONFIRMED', 'TAKEN']
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      bookingitem: {
        include: {
          product: true
        }
      }
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Bookings (Aktif)</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Daftar Pesanan Aktif ({bookings.length})</h3>
        </div>
        
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Tidak ada pesanan aktif saat ini.
          </div>
        ) : (
          <BookingList bookings={bookings} />
        )}
      </div>
    </div>
  )
}
