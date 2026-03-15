"use client"

import { useState } from "react"
import { product } from "@prisma/client"
import { useCartStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { differenceInDays, differenceInHours } from "date-fns"
import { useRouter } from "next/navigation"
import { Clock, Info } from "lucide-react"
import { checkAvailability } from "@/app/actions/booking"
import toast from "react-hot-toast"

interface BookingFormProps {
  product: product
}

const TIME_MAP: Record<string, number> = {}

export function BookingForm({ product }: BookingFormProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [pickupTime, setPickupTime] = useState("8")
  const [returnTime, setReturnTime] = useState("8")
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()

  const today = new Date().toISOString().split('T')[0]
  
  // Generate hours 00-23
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const calculateDuration = (startStr: string, endStr: string, pickup: string, ret: string) => {
    if (!startStr || !endStr) return 0
    
    const start = new Date(startStr)
    start.setHours(parseInt(pickup) || 0)
    
    const end = new Date(endStr)
    end.setHours(parseInt(ret) || 0)
    
    const diffHours = differenceInHours(end, start)
    
    // Formula: (TotalHours - 4 Free Hours) / 24 rounded up
    const duration = Math.ceil((diffHours - 4) / 24)
    
    return Math.max(1, duration)
  }

  const calculatePrice = (duration: number) => {
    if (duration <= 0) return 0
    if (duration === 1) return product.price1Day
    if (duration === 2) return product.price2Days
    if (duration === 3) return product.price3Days
    return product.price3Days + (duration - 3) * product.priceOver3Days
  }

  const duration = calculateDuration(startDate, endDate, pickupTime, returnTime)
  const unitPrice = calculatePrice(duration)
  const totalPrice = unitPrice * quantity

  const handleAddToCart = async () => {
    if (!startDate || !endDate) {
      toast.error("Mohon pilih tanggal ambil dan kembali terlebih dahulu")
      return
    }

    if (duration < 1) {
      toast.error("Durasi sewa minimal 1 hari (24 jam)")
      return
    }

    // Check availability
    const check = await checkAvailability(product.id, startDate, endDate, quantity)
    if (!check.available) {
      toast.error(check.message || "Stok tidak tersedia")
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: unitPrice,
      image: product.image,
      quantity: quantity,
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      pickupTime: pickupTime,
      returnTime: returnTime
    })

    router.push("/cart")
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-200 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Mulai Sewa</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-earth-600">Tanggal Ambil</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-earth-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-earth-600">Tanggal Kembali</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 rounded-lg border border-earth-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-earth-600">Jam Berangkat / Ambil</label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full p-2 rounded-lg border border-earth-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-earth-600">Jam Kembali</label>
              <select
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full p-2 rounded-lg border border-earth-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2 text-sm text-yellow-800 border border-yellow-100">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Ketentuan Waktu Sewa:</span>
              <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                <li>Hitungan 1 hari = 24 jam dari jam berangkat.</li>
                <li>Free time 4 jam untuk pengembalian alat.</li>
                <li>Contoh: Ambil Senin Sore (16:00), kembali Selasa Malam (20:00) masih dihitung 1 hari.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-earth-600">Jumlah Barang</label>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg border border-earth-300 flex items-center justify-center hover:bg-earth-50"
          >
            -
          </button>
          <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-10 h-10 rounded-lg border border-earth-300 flex items-center justify-center hover:bg-earth-50"
          >
            +
          </button>
          <span className="text-sm text-earth-500 ml-2">Stok: {product.stock}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-earth-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-earth-600">Durasi Sewa</span>
          <span className="font-medium text-earth-900">{duration > 0 ? `${duration} Hari` : '-'}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg text-earth-800">Total</span>
          <span className="font-bold text-2xl text-primary-700">{formatCurrency(totalPrice)}</span>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-500 text-black py-3 rounded-xl font-bold hover:bg-primary-400 transition-colors shadow-md hover:shadow-lg active:scale-95"
        >
          Masuk Keranjang
        </button>
      </div>
    </div>
  )
}
