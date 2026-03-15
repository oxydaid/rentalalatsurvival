'use client'

import { useState } from 'react'
import { updateStep, deleteStep } from '@/app/actions/admin'
import { Pencil, Trash, X, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface BookingStep {
  id: string
  title: string
  description: string
  icon: string
  stepOrder: number
}

const iconOptions = [
  "Search", "MessageCircle", "CreditCard", "PackageCheck", "Smile", 
  "Calendar", "MapPin", "Truck", "CheckCircle", "AlertCircle"
]

export default function StepListItem({ step }: { step: BookingStep }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(step.title)
  const [description, setDescription] = useState(step.description)
  const [icon, setIcon] = useState(step.icon)
  const [stepOrder, setStepOrder] = useState(step.stepOrder.toString())
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('icon', icon)
    formData.append('stepOrder', stepOrder)

    const result = await updateStep(step.id, formData)
    
    setIsLoading(false)
    if (result.success) {
      setIsEditing(false)
      toast.success('Langkah booking berhasil diperbarui')
    } else {
      toast.error(result.error || 'Gagal memperbarui langkah booking')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus langkah ini?')) return
    
    const result = await deleteStep(step.id)
    if (result.success) {
      toast.success('Langkah booking berhasil dihapus')
    } else {
      toast.error(result.error || 'Gagal menghapus langkah booking')
    }
  }

  if (isEditing) {
    return (
      <div className="p-6 bg-yellow-50/50 border border-yellow-200 rounded-lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Langkah</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input 
                type="number"
                value={stepOrder}
                onChange={(e) => setStepOrder(e.target.value)}
                required 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ikon</label>
              <select 
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {iconOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required 
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 rounded-md flex items-center gap-1 text-sm transition-colors"
            >
              <X className="h-4 w-4" /> Batal
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-3 py-1.5 bg-primary-600 text-white hover:bg-primary-700 rounded-md flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : <><Check className="h-4 w-4" /> Simpan</>}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg flex-shrink-0">
          {step.stepOrder}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 flex items-center gap-2">
            {step.title}
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
              Icon: {step.icon}
            </span>
          </h4>
          <p className="text-gray-600 text-sm">{step.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-primary-600 hover:text-primary-800 p-2 hover:bg-primary-50 rounded-full transition-colors"
          title="Edit Langkah"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
          title="Hapus Langkah"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
