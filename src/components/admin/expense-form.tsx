"use client"

import { useActionState } from "react"
import { addExpense } from "@/app/actions/expense"
import { Plus, Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"

const initialState = {
  success: false,
  error: ""
}

export function ExpenseForm() {
  const [state, formAction, isPending] = useActionState(addExpense, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      toast.success("Pengeluaran berhasil disimpan")
      formRef.current?.reset()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
      <h3 className="font-bold text-gray-900 mb-4">Tambah Pengeluaran</h3>
      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keterangan
          </label>
          <input
            type="text"
            name="description"
            required
            placeholder="Contoh: Beli Bensin, Servis Alat"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nominal (Rp)
          </label>
          <input
            type="number"
            name="amount"
            required
            min="0"
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal
          </label>
          <input
            type="date"
            name="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          {isPending ? "Menyimpan..." : "Simpan Pengeluaran"}
        </button>
      </form>
    </div>
  )
}
