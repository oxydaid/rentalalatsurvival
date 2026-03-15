"use client"

import { useState } from "react"
import { addBookingItem, removeBookingItem, getAvailableProducts } from "@/app/actions/edit-booking"
import { formatCurrency } from "@/lib/utils"
import { X, Plus, Trash2, Save, Search } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface EditBookingModalProps {
  booking: any
  isOpen: boolean
  onClose: () => void
}

export function EditBookingModal({ booking, isOpen, onClose }: EditBookingModalProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleRemoveItem = async (itemId: string) => {
    if (!confirm("Hapus item ini dari booking?")) return
    
    setLoading(true)
    const result = await removeBookingItem(booking.id, itemId)
    setLoading(false)
    
    if (result.success) {
      toast.success("Item berhasil dihapus")
      router.refresh()
    } else {
      toast.error("Gagal menghapus item")
    }
  }

  const handleStartAdd = async () => {
    setLoading(true)
    const fetchedProducts = await getAvailableProducts()
    setProducts(fetchedProducts)
    setIsAdding(true)
    setLoading(false)
  }

  const handleAddItem = async () => {
    if (!selectedProduct) return
    
    setLoading(true)
    const result = await addBookingItem(booking.id, selectedProduct, quantity)
    setLoading(false)
    
    if (result.success) {
      toast.success("Item berhasil ditambahkan")
      setIsAdding(false)
      setSelectedProduct("")
      setQuantity(1)
      router.refresh()
    } else {
      toast.error("Gagal menambahkan item")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit Booking: {booking.customerName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Daftar Item</h3>
            <div className="space-y-3">
              {booking.bookingitem.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">{item.product?.name || 'Produk dihapus'}</div>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={loading}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {isAdding ? (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
              <h4 className="font-semibold text-blue-900 mb-3">Tambah Item Baru</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Pilih Produk</label>
                  <select 
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-2 border border-blue-200 rounded-lg bg-white"
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">Jumlah</label>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-2 border border-blue-200 rounded-lg"
                  />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleAddItem}
                    disabled={!selectedProduct || loading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleStartAdd}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={20} />
              Tambah Barang
            </button>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
             <div>
                <p className="text-sm text-gray-500">Total Harga Baru</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(booking.totalPrice)}</p>
             </div>
             <button 
               onClick={onClose}
               className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
             >
               Selesai
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
