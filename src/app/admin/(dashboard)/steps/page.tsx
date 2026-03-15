import { prisma } from "@/lib/prisma"
import { createStep } from "@/app/actions/admin"
import { Plus } from "lucide-react"
import StepListItem from "@/components/admin/step-list-item"

export const dynamic = "force-dynamic";

// Icon options for selection
const iconOptions = [
  "Search", "MessageCircle", "CreditCard", "PackageCheck", "Smile", 
  "Calendar", "MapPin", "Truck", "CheckCircle", "AlertCircle"
]

export default async function AdminStepsPage() {
  const steps = await prisma.bookingstep.findMany({
    orderBy: { stepOrder: 'asc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Langkah Booking</h1>
      </div>

      {/* Add Step Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" /> Tambah Langkah Baru
        </h2>
        <form action={async (formData) => {
          "use server"
          await createStep(formData)
        }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul Langkah</label>
            <input 
              name="title" 
              placeholder="Contoh: 1. Pilih Barang" 
              required 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
            <input 
              name="stepOrder" 
              type="number" 
              placeholder="1" 
              required 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ikon</label>
            <select 
              name="icon" 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {iconOptions.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea 
              name="description" 
              placeholder="Jelaskan langkah ini..." 
              required 
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors w-full md:w-auto">
              Simpan Langkah
            </button>
          </div>
        </form>
      </div>

      {/* Steps List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Daftar Langkah Booking ({steps.length})</h3>
        </div>
        
        {steps.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada data langkah. Silakan tambah baru.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {steps.map((step) => (
              <StepListItem key={step.id} step={step} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
