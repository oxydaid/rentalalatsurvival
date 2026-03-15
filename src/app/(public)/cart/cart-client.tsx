"use client"

import { useCartStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import { Trash2, MessageCircle, Loader2, AlertTriangle, Download, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { createBooking } from "@/app/actions/booking"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { BackButton } from "@/components/back-button"
import { generateInvoicePDF, InvoiceData } from "@/lib/pdf-generator"

import { useRouter } from "next/navigation"

interface CartClientProps {
  whatsappNumber: string
}

interface BookingSuccessData {
  id: string
  name: string
  phone: string
  items: any[]
  totalPrice: number
  date: string
}

export function CartClient({ whatsappNumber }: CartClientProps) {
  const { items, removeItem, total, clearCart } = useCartStore()
  const router = useRouter()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccessData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "DP_50%" | "FULL_MAYAR">("COD")

  const handleCheckoutClick = () => {
    if (!name || !phone || !email) {
      toast.error("Mohon lengkapi nama, email dan nomor WhatsApp")
      return
    }
    setShowConfirm(true)
  }

  const generateInvoice = async () => {
    if (!bookingSuccess) return

    try {
      const invoiceData: InvoiceData = {
        id: bookingSuccess.id,
        customerName: bookingSuccess.name,
        customerPhone: bookingSuccess.phone,
        createdAt: bookingSuccess.date,
        totalPrice: bookingSuccess.totalPrice,
        items: bookingSuccess.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          startDate: item.startDate,
          endDate: item.endDate,
          pickupTime: item.pickupTime,
          returnTime: item.returnTime
        }))
      }
      generateInvoicePDF(invoiceData)
    } catch (error) {
      console.error("Failed to generate invoice", error)
      toast.error("Gagal membuat PDF invoice")
    }
  }

  const handleWhatsAppRedirect = () => {
    if (!bookingSuccess) return

    const totalAmount = formatCurrency(bookingSuccess.totalPrice)
    let message = `Halo Admin SayEquipment, saya ingin menyewa alat berikut:\n`
    message += `(Order ID: ${bookingSuccess.id})\n\n`
    
    bookingSuccess.items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.quantity}x)\n`
      message += `   Tgl: ${item.startDate} s/d ${item.endDate} (${item.duration} hari)\n`
      if (item.pickupTime) {
        message += `   Ambil: ${item.pickupTime.padStart(2, '0')}:00\n`
      }
      if (item.returnTime) {
        message += `   Kembali: ${item.returnTime.padStart(2, '0')}:00\n`
      }
    })

    message += `\nTotal Biaya: ${totalAmount}\n`
    message += `\nData Pemesan:\nNama: ${bookingSuccess.name}\nNo HP: ${bookingSuccess.phone}`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  const processCheckout = async () => {
    setShowConfirm(false)
    setIsSubmitting(true)

    try {
      const result = await createBooking({
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        items: items,
        totalPrice: total()
      })

      if (!result.success) {
        toast.error("Gagal menyimpan pesanan: " + result.error)
        setIsSubmitting(false)
        return
      }

      if (paymentMethod === "DP_50%" || paymentMethod === "FULL_MAYAR") {
        const paymentType = paymentMethod === "DP_50%" ? "DP_50" : "FULL"
        const res = await fetch("/api/payments/mayar/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: result.bookingId, paymentType })
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          toast.error(data?.error || "Gagal membuat link pembayaran Mayar")
          setIsSubmitting(false)
          return
        }
        const data = await res.json()
        clearCart()
        router.push(data.paymentPageUrl || `/payment/mayar?bookingId=${result.bookingId}`)
        return
      } else {
        setBookingSuccess({
          id: result.bookingId!,
          name,
          phone,
          items: [...items],
          totalPrice: total(),
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        })
        clearCart()
        setIsSubmitting(false)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat memproses pesanan")
      setIsSubmitting(false)
    }
  }

  if (bookingSuccess) {
    return (
      <div className="container-custom pt-32 pb-20 min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-earth-100 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-earth-900 mb-2">Booking Berhasil!</h2>
          <p className="text-earth-600 mb-8">
            Terima kasih telah melakukan pemesanan. Silakan download bukti booking dan konfirmasi via WhatsApp.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Konfirmasi via WhatsApp</span>
            </button>

            <button
              onClick={generateInvoice}
              className="w-full bg-white text-earth-900 border-2 border-earth-200 py-3 rounded-xl font-bold hover:bg-earth-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download Bukti Booking (PDF)</span>
            </button>

            <Link 
              href="/products"
              className="block text-primary-600 font-medium hover:underline text-sm mt-4"
            >
              Kembali ke Halaman Utama
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-earth-900 mb-4">Keranjang Kosong</h2>
        <p className="text-earth-600 mb-8">Belum ada barang yang disewa.</p>
        <Link href="/products" className="bg-primary-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-primary-400 transition-colors shadow-md hover:shadow-lg">
          Cari Barang
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom pt-32 pb-12">
      <BackButton href="/products" label="Lanjut Belanja" />
      <h1 className="text-3xl font-bold text-earth-900 mb-8">Keranjang Sewa</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id + item.startDate} className="bg-white p-4 rounded-xl shadow-sm border border-earth-100 flex gap-4">
              <div className="relative w-24 h-24 bg-earth-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-earth-900">{item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="text-sm text-earth-500 mt-1">
                  {item.startDate} - {item.endDate} ({item.duration} hari)
                  {item.pickupTime && (
                    <span className="block text-xs text-primary-600 font-medium mt-1">
                      Ambil: {item.pickupTime.padStart(2, '0')}:00
                    </span>
                  )}
                  {item.returnTime && (
                    <span className="block text-xs text-primary-600 font-medium mt-1">
                      Kembali: {item.returnTime.padStart(2, '0')}:00
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div className="text-sm">
                    {item.quantity} unit @ {formatCurrency(item.price)}
                  </div>
                  <div className="font-bold text-primary-700">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100 h-fit space-y-6">
          <h3 className="font-bold text-lg text-earth-900">Ringkasan Pesanan</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded-lg border border-earth-300 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Masukkan nama anda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Nomor WhatsApp</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg border border-earth-300 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-lg border border-earth-300 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="contoh@email.com"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-earth-100">
            <div className="space-y-3 mb-6">
              <span className="font-semibold text-earth-700">Metode Pembayaran</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`flex-1 px-4 py-2 rounded-lg border ${paymentMethod === "COD" ? "border-primary-600 text-primary-700 bg-primary-50" : "border-earth-300 text-earth-700 bg-white"}`}
                >
                  COD
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("DP_50%")}
                  className={`flex-1 px-4 py-2 rounded-lg border ${paymentMethod === "DP_50%" ? "border-primary-600 text-primary-700 bg-primary-50" : "border-earth-300 text-earth-700 bg-white"}`}
                >
                  DP 50% via Mayar
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("FULL_MAYAR")}
                  className={`flex-1 px-4 py-2 rounded-lg border ${paymentMethod === "FULL_MAYAR" ? "border-primary-600 text-primary-700 bg-primary-50" : "border-earth-300 text-earth-700 bg-white"}`}
                >
                  Lunas via Mayar
                </button>
              </div>
              {paymentMethod === "DP_50%" && (
                <p className="text-sm text-earth-600">
                  Nominal DP: <span className="font-semibold">{formatCurrency(Math.round(total() * 0.5))}</span>
                </p>
              )}
              {paymentMethod === "FULL_MAYAR" && (
                <p className="text-sm text-earth-600">
                  Nominal pembayaran: <span className="font-semibold">{formatCurrency(total())}</span>
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-earth-700">Total Pembayaran</span>
              <span className="text-2xl font-bold text-primary-700">{formatCurrency(total())}</span>
            </div>
            
            <button
              onClick={handleCheckoutClick}
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  <span>
                    {paymentMethod === "DP_50%"
                      ? "Bayar DP 50%"
                      : paymentMethod === "FULL_MAYAR"
                        ? "Bayar Lunas"
                        : "Checkout"}
                  </span>
                </>
              )}
            </button>
            <p className="text-xs text-center text-earth-500 mt-3">
              {paymentMethod === "COD"
                ? "Anda akan diarahkan ke WhatsApp untuk konfirmasi ketersediaan dan pembayaran."
                : "Anda akan diarahkan ke halaman pembayaran Mayar."}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Konfirmasi Pesanan</h3>
                <p className="text-gray-500">
                  Apakah data pesanan anda sudah benar? Kami akan mengarahkan anda ke WhatsApp untuk melanjutkan proses.
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Periksa Lagi
                </button>
                <button
                  onClick={processCheckout}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
                >
                  Ya, Lanjutkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
