import { getExpenses, deleteExpense } from "@/app/actions/expense"
import { formatCurrency } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ExpenseForm } from "@/components/admin/expense-form"

export const dynamic = "force-dynamic"

export default async function ExpensesPage() {
  const expenses = await getExpenses()
  
  // Calculate total expense
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengeluaran Operasional</h1>
          <p className="text-gray-500 mt-1">Catat dan pantau pengeluaran bisnis.</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full md:w-1/3">
        <p className="text-sm font-medium text-gray-500">Total Pengeluaran</p>
        <h3 className="text-2xl font-bold text-red-600 mt-2">
          {formatCurrency(totalExpense)}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <ExpenseForm />

        {/* List Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">Riwayat Pengeluaran</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Keterangan</th>
                  <th className="px-6 py-3 text-right">Nominal</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Belum ada data pengeluaran.
                    </td>
                  </tr>
                ) : (
                  expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 whitespace-nowrap">
                        {format(new Date(item.date), "dd MMM yyyy", { locale: id })}
                      </td>
                      <td className="px-6 py-3">{item.description}</td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <form action={async () => {
                          "use server"
                          await deleteExpense(item.id)
                        }}>
                          <button 
                            type="submit"
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
