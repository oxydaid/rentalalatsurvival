"use client"

import { useState } from "react"
import { updateContactSettings } from "@/app/actions/settings"
import { Save } from "lucide-react"

interface SettingsFormProps {
  initialNumber: string
  initialAddress: string | null
  initialMapsUrl: string | null
  initialHours: string | null
  initialInstagram: string | null
  initialConfirmationAdminContactId?: string | null
  adminContacts?: any[]
}

export function SettingsForm({ 
  initialNumber,
  initialAddress,
  initialMapsUrl,
  initialHours,
  initialInstagram,
  initialConfirmationAdminContactId,
  adminContacts = [],
}: SettingsFormProps) {
  const [number, setNumber] = useState(initialNumber)
  const [address, setAddress] = useState(initialAddress || "")
  const [mapsUrl, setMapsUrl] = useState(initialMapsUrl || "")
  const [hours, setHours] = useState(initialHours || "")
  const [instagram, setInstagram] = useState(initialInstagram || "")
  const [confirmationAdminContactId, setConfirmationAdminContactId] = useState(initialConfirmationAdminContactId || "")
  
  const [isPending, setIsPending] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setMessage("")
    
    try {
      await updateContactSettings({
        whatsappNumber: number,
        address,
        googleMapsUrl: mapsUrl,
        operationalHours: hours,
        instagram,
        confirmationAdminContactId: confirmationAdminContactId || null,
      })
      setMessage("Informasi kontak berhasil disimpan!")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal menyimpan informasi.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor WhatsApp Admin
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Nomor ini akan digunakan sebagai tujuan pesan saat customer melakukan Checkout.
            Gunakan format internasional tanpa tanda plus (contoh: 6281234567890).
          </p>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="628..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Konfirmasi Pembayaran (Mayar)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Nomor ini akan dituju saat customer klik tombol Konfirmasi ke Admin dari halaman pembayaran.
          </p>
          <select
            value={confirmationAdminContactId}
            onChange={(e) => setConfirmationAdminContactId(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            <option value="">Otomatis (Admin aktif pertama)</option>
            {adminContacts
              .filter((c) => c?.isActive)
              .map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} ({contact.number})
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Lengkap
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Jl. Contoh No. 123, Bojonegoro..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Google Maps (Embed)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Masukkan URL dari src iframe Google Maps.
          </p>
          <input
            type="text"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://www.google.com/maps/embed?..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jam Operasional
          </label>
          <input
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Senin - Minggu: 08.00 - 20.00 WIB"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instagram Username
          </label>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="@sayequipment"
          />
        </div>

        {message && (
          <p className={`text-sm ${message.includes("Gagal") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  )
}
