"use client"

import { useState } from "react"
import { createProduct, updateProduct } from "@/app/actions/product"
import { X, Upload } from "lucide-react"
import { product } from "@prisma/client"
import toast from "react-hot-toast"

interface ProductFormProps {
  product?: product | null
  onClose: () => void
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [preview, setPreview] = useState<string | null>(product?.image || null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (product) {
        formData.append("id", product.id)
        await updateProduct(formData)
      } else {
        await createProduct(formData)
      }
      onClose()
      toast.success(product ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan")
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan saat menyimpan produk")
    } finally {
      setIsPending(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Produk</label>
              <input
                name="name"
                defaultValue={product?.name}
                placeholder="Contoh: Tenda Dome 4P"
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <select
                name="category"
                defaultValue={product?.category}
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Tenda">Tenda</option>
                <option value="Tas & Carrier">Tas & Carrier</option>
                <option value="Perlengkapan Tidur">Perlengkapan Tidur</option>
                <option value="Masak">Masak</option>
                <option value="Penerangan">Penerangan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">Harga 1 Hari</label>
                <input
                  name="price1Day"
                  type="number"
                  defaultValue={product?.price1Day}
                  placeholder="Rp"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">Harga 2 Hari</label>
                <input
                  name="price2Days"
                  type="number"
                  defaultValue={product?.price2Days}
                  placeholder="Rp"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">Harga 3 Hari</label>
                <input
                  name="price3Days"
                  type="number"
                  defaultValue={product?.price3Days}
                  placeholder="Rp"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 uppercase">Harga &gt;3 Hari</label>
                <input
                  name="priceOver3Days"
                  type="number"
                  defaultValue={product?.priceOver3Days}
                  placeholder="Per hari"
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stok Tersedia</label>
              <input
                name="stock"
                type="number"
                defaultValue={product?.stock}
                placeholder="Unit"
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              name="description"
              defaultValue={product?.description}
              rows={4}
              placeholder="Jelaskan spesifikasi dan kondisi barang..."
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gambar Produk</label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="mt-1 text-xs text-gray-500">Format: JPG, PNG, WEBP. Maks 2MB.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? (
                <>Menyimpan...</>
              ) : (
                <>
                  {product ? "Simpan Perubahan" : "Tambah Produk"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
