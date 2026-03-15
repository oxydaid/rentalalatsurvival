'use client'

import { useState } from 'react'
import { updateTerm, deleteTerm } from '@/app/actions/admin'
import { Pencil, Trash, X, Check, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface RentalTerm {
  id: string
  content: string
}

export default function TermListItem({ term, index }: { term: RentalTerm, index: number }) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(term.content)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('content', content)

    const result = await updateTerm(term.id, formData)
    
    setIsLoading(false)
    if (result.success) {
      setIsEditing(false)
      toast.success('Ketentuan berhasil diperbarui')
    } else {
      toast.error(result.error || 'Gagal memperbarui ketentuan')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus ketentuan ini?')) return
    
    const result = await deleteTerm(term.id)
    if (result.success) {
      toast.success('Ketentuan berhasil dihapus')
    } else {
      toast.error(result.error || 'Gagal menghapus ketentuan')
    }
  }

  if (isEditing) {
    return (
      <div className="p-6 bg-yellow-50/50 border border-yellow-200 rounded-lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Isi Ketentuan</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required 
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
            />
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
    <div className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors group">
      <div className="flex-1 pr-8 flex items-start gap-3">
        <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <p className="text-gray-700">{term.content}</p>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-primary-600 hover:text-primary-800 p-2 hover:bg-primary-50 rounded-full transition-colors"
          title="Edit Ketentuan"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
          title="Hapus Ketentuan"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
