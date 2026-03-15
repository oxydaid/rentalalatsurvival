'use client'

import { useState } from "react"
import { updateHeroInfo } from "@/app/actions/settings"
import { Save, Upload } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

interface HeroFormProps {
  initialImage: string | null
}

export function HeroForm({ initialImage }: HeroFormProps) {
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
      if (image) {
        formData.append('image', image)
        await updateHeroInfo(formData)
        toast.success("Foto Background Beranda berhasil disimpan!")
      } else {
        toast.error("Silakan pilih foto terlebih dahulu.")
      }
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
            Background Halaman Utama (Hero)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Foto ini akan muncul sebagai latar belakang di bagian atas halaman utama.
          </p>
          <div className="mt-2 flex flex-col gap-4">
            {preview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <Image 
                  src={preview} 
                  alt="Preview" 
                  fill 
                  className="object-cover" 
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                Belum ada foto
              </div>
            )}
            
            <div className="flex justify-between items-center">
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
                <p className="text-xs text-gray-500">
                Format: JPG, PNG, WebP. Maksimal 5MB.
                </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !image}
          className="flex items-center justify-center gap-2 w-full md:w-auto bg-primary-500 text-black px-6 py-2 rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  )
}
