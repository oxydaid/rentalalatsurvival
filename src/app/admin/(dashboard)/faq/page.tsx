import { prisma } from "@/lib/prisma"
import { createFAQ } from "@/app/actions/admin"
import { Plus } from "lucide-react"
import FAQListItem from "@/components/admin/faq-list-item"

export const dynamic = "force-dynamic";

export default async function AdminFAQPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola FAQ</h1>
      </div>

      {/* Add FAQ Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5" /> Tambah FAQ Baru
        </h2>
        <form action={async (formData) => {
          "use server"
          await createFAQ(formData)
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
            <input 
              name="question" 
              placeholder="Contoh: Apakah bisa COD?" 
              required 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
            <textarea 
              name="answer" 
              placeholder="Jelaskan jawabannya di sini..." 
              required 
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>
          <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
            Simpan FAQ
          </button>
        </form>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Daftar Pertanyaan ({faqs.length})</h3>
        </div>
        
        {faqs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada data FAQ. Silakan tambah baru.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {faqs.map((faq) => (
              <FAQListItem key={faq.id} faq={faq} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
