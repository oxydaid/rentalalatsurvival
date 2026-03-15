"use client"

import { useState, useEffect } from "react"
import { createTestimonial, deleteTestimonial, toggleTestimonialVisibility } from "@/app/actions/testimonials"
import { Plus, Trash2, Eye, EyeOff, Star } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  isShow: boolean
  avatar?: string
}

export default function TestimonialListClient({ testimonials: initialTestimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState(initialTestimonials)

  useEffect(() => {
    setTestimonials(initialTestimonials)
  }, [initialTestimonials])

  const [isAdding, setIsAdding] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await createTestimonial(newTestimonial)
    if (result.success) {
      setIsAdding(false)
      setNewTestimonial({ name: "", role: "", content: "", rating: 5 })
      toast.success("Testimoni berhasil ditambahkan")
      // Refresh logic would ideally re-fetch data, but for now we rely on revalidatePath
      window.location.reload()
    } else {
      toast.error("Gagal menambahkan testimoni")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus testimoni ini?")) return
    const result = await deleteTestimonial(id)
    if (result.success) {
      toast.success("Testimoni dihapus")
      setTestimonials(testimonials.filter(t => t.id !== id))
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const result = await toggleTestimonialVisibility(id, !currentStatus)
    if (result.success) {
      toast.success(currentStatus ? "Testimoni disembunyikan" : "Testimoni ditampilkan")
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, isShow: !currentStatus } : t
      ))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Testimoni</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary-500 text-black px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-400 font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Testimoni</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="font-semibold text-lg mb-4">Tambah Testimoni Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  required
                  value={newTestimonial.name}
                  onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role/Status</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mahasiswa, Pendaki Pemula"
                  value={newTestimonial.role}
                  onChange={e => setNewTestimonial({...newTestimonial, role: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
              <select
                value={newTestimonial.rating}
                onChange={e => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              >
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Bintang</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Testimoni</label>
              <textarea
                required
                rows={3}
                value={newTestimonial.content}
                onChange={e => setNewTestimonial({...newTestimonial, content: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Belum ada testimoni.</p>
        ) : (
          testimonials.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <span className="text-sm text-gray-500">• {item.role}</span>
                  {!item.isShow && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Disembunyikan</span>
                  )}
                </div>
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < item.rating ? "fill-current" : "text-gray-300"}`} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{item.content}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleToggle(item.id, item.isShow)}
                  className={`p-2 rounded-lg ${item.isShow ? 'text-gray-400 hover:text-gray-600' : 'text-green-600 hover:bg-green-50'}`}
                  title={item.isShow ? "Sembunyikan" : "Tampilkan"}
                >
                  {item.isShow ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Hapus"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
