import { prisma } from "@/lib/prisma"
import { createTerm } from "@/app/actions/admin"
import { Plus } from "lucide-react"
import TermListItem from "@/components/admin/term-list-item"

export const dynamic = "force-dynamic";

export default async function AdminTermsPage() {
  const terms = await prisma.rentalterm.findMany({
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Ketentuan Sewa</h1>
      </div>

      {/* Add Term Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" /> Tambah Ketentuan Baru
        </h2>
        <form action={async (formData) => {
          "use server"
          await createTerm(formData)
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Ketentuan</label>
            <textarea 
              name="content" 
              placeholder="Contoh: Wajib meninggalkan identitas asli (KTP/SIM) sebagai jaminan." 
              required 
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>
          <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
            Simpan Ketentuan
          </button>
        </form>
      </div>

      {/* Terms List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Daftar Ketentuan ({terms.length})</h3>
        </div>
        
        {terms.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada data ketentuan. Silakan tambah baru.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {terms.map((term, index) => (
              <TermListItem key={term.id} term={term} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
