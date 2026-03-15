'use client'

import { useState } from 'react'
import { updateFAQ, deleteFAQ } from '@/app/actions/admin'
import { Pencil, Trash, X, Check, HelpCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function FAQListItem({ faq }: { faq: FAQ }) {
  const [isEditing, setIsEditing] = useState(false)
  const [question, setQuestion] = useState(faq.question)
  const [answer, setAnswer] = useState(faq.answer)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData()
    formData.append('question', question)
    formData.append('answer', answer)

    const result = await updateFAQ(faq.id, formData)
    
    setIsLoading(false)
    if (result.success) {
      setIsEditing(false)
      toast.success('FAQ berhasil diperbarui')
    } else {
      toast.error(result.error || 'Gagal memperbarui FAQ')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) return
    
    const result = await deleteFAQ(faq.id)
    if (result.success) {
      toast.success('FAQ berhasil dihapus')
    } else {
      toast.error(result.error || 'Gagal menghapus FAQ')
    }
  }

  if (isEditing) {
    return (
      <div className="p-6 bg-yellow-50/50 border border-yellow-200 rounded-lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
            <input 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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
      <div className="flex-1 pr-8">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
          <h4 className="font-medium text-gray-900">{faq.question}</h4>
        </div>
        <p className="text-gray-600 text-sm ml-7 whitespace-pre-line">{faq.answer}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors"
          title="Edit FAQ"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
          title="Hapus FAQ"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
