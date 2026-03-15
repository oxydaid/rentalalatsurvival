import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import HistoryListClient from "./history-list"

export const dynamic = "force-dynamic"

export default async function HistoryPage() {
  // Fetch only COMPLETED/FINISHED bookings
  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        in: ['COMPLETED', 'FINISHED']
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

  // Calculate Total Income from History
  const totalIncome = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
          <p className="text-gray-500 mt-1">Daftar pesanan yang telah selesai.</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full md:w-1/3">
        <p className="text-sm font-medium text-gray-500">Total Pendapatan (Selesai)</p>
        <h3 className="text-2xl font-bold text-green-600 mt-2">
          {formatCurrency(totalIncome)}
        </h3>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Daftar Riwayat ({bookings.length})</h3>
        </div>
        
        <HistoryListClient bookings={bookings} />
      </div>
    </div>
  )
}
