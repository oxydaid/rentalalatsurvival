'use client'

import { useState } from "react"
import { createLocation, updateLocation, deleteLocation } from "@/app/actions/settings"
import { Plus, MapPin, Pencil, Trash2, X, Save } from "lucide-react"
import toast from "react-hot-toast"

interface Location {
  id: string
  name: string
  address: string
  mapUrl: string
}

interface LocationManagerProps {
  locations: Location[]
}

export function LocationManager({ locations }: LocationManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mapUrl: ""
  })

  const resetForm = () => {
    setFormData({ name: "", address: "", mapUrl: "" })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (loc: Location) => {
    setFormData({
      name: loc.name,
      address: loc.address,
      mapUrl: loc.mapUrl
    })
    setEditingId(loc.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus lokasi ini?")) return
    
    try {
      await deleteLocation(id)
      toast.success("Lokasi berhasil dihapus")
    } catch (e) {
      toast.error("Gagal menghapus lokasi")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation for Embed URL
    const isEmbedUrl = formData.mapUrl.includes("/embed") || formData.mapUrl.includes("output=embed")
    if (!isEmbedUrl) {
      toast.error("URL tidak valid. Pastikan menggunakan link 'Embed a map' dari Google Maps (bukan link Share biasa).")
      return
    }

    setIsPending(true)

    try {
      if (editingId) {
        await updateLocation(editingId, formData)
        toast.success("Lokasi berhasil diperbarui")
      } else {
        await createLocation(formData)
        toast.success("Lokasi baru berhasil ditambahkan")
      }
      resetForm()
    } catch (e) {
      toast.error("Gagal menyimpan lokasi")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Daftar Cabang</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-400 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Tambah Cabang
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">{editingId ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}</h4>
            <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cabang</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Contoh: Cabang Bojonegoro Kota"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Jl. Ahmad Yani No..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Maps Embed</label>
              <p className="text-xs text-gray-500 mb-2">
                Copy link dari menu "Embed a map" di Google Maps (ambil bagian src="..." saja).
              </p>
              <input
                type="text"
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                placeholder="https://www.google.com/maps/embed?..."
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isPending ? "Menyimpan..." : "Simpan Lokasi"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-primary-200 transition-colors">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-primary-700 font-semibold">
                  <MapPin className="h-5 w-5" />
                  <h3>{loc.name}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(loc)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{loc.address}</p>
            </div>
            
            <div className="bg-gray-100 rounded-lg h-32 w-full overflow-hidden relative">
              <iframe
                src={loc.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>
        ))}

        {locations.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada lokasi yang ditambahkan.</p>
          </div>
        )}
      </div>
    </div>
  )
}
