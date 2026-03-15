'use client'

import { useState } from "react"
import { updateAboutInfo } from "@/app/actions/settings"
import { Save, Upload } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

interface AboutFormProps {
  initialTitle: string
  initialDescription: string
  initialImage: string | null
}

export function AboutForm({ initialTitle, initialDescription, initialImage }: AboutFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initialImage)
  const [isPending, setIsPending] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      if (image) {
        formData.append('image', image)
      }

      await updateAboutInfo(formData)
      toast.success("Informasi Tentang Kami berhasil disimpan!")
    } catch (error) {
      toast.error("Gagal menyimpan informasi.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Halaman
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="Tentang SayEquipment"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi / Cerita Kami
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Ceritakan tentang sejarah, visi, dan misi penyewaan alat camping ini.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            placeholder="Tuliskan cerita kami di sini..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto Cerita Kami (Background)
          </label>
          <div className="mt-2 flex items-center gap-4">
            {preview && (
              <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200">
                <Image 
                  src={preview} 
                  alt="Preview" 
                  fill 
                  className="object-cover" 
                />
              </div>
            )}
            <label className="cursor-pointer flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-lg border border-gray-200 transition-colors">
              <Upload className="h-4 w-4" />
              <span>{image ? 'Ganti Foto' : 'Upload Foto'}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Format: JPG, PNG, WebP. Maksimal 5MB.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full md:w-auto bg-primary-500 text-black px-6 py-2 rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  )
}
