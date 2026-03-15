import { getDashboardStats } from "@/app/actions/stats"
import { formatCurrency } from "@/lib/utils"
import { RevenueChart } from "@/components/admin/revenue-chart"

export const dynamic = "force-dynamic";

import { 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Clock
} from "lucide-react"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Ringkasan performa bisnis Anda hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pendapatan</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.revenue.total)}
              </h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+ {formatCurrency(stats.revenue.thisMonth)} (Bulan Ini)</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sewa</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.bookings.total}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>{stats.bookings.thisMonth} Transaksi Bulan Ini</span>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Sedang Disewa</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stats.bookings.active}
              </h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Barang sedang di tangan pelanggan
          </div>
        </div>

        {/* Expenses & Net Profit */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Keuntungan Bersih</p>
              <h3 className={`text-2xl font-bold mt-2 ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.netProfit)}
              </h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-500">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>Pengeluaran: {formatCurrency(stats.expenses.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Revenue & Expense Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Statistik Keuangan</h3>
            <p className="text-sm text-gray-500">Perbandingan Pendapatan dan Pengeluaran (6 Bulan Terakhir)</p>
          </div>
          <RevenueChart data={stats.chartData} />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sewa Terbaru</h3>
          <div className="space-y-6">
            {stats.bookings.recent.length > 0 ? (
              stats.bookings.recent.map((booking: any) => (
                <div key={booking.id} className="flex items-start justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(booking.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary-600">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1
                      ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Belum ada booking.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}