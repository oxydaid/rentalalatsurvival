"use client"

import { useState } from "react"
import { admin } from "@prisma/client"
import { createAdmin, deleteAdmin } from "@/app/actions/admin"
import { Plus, Trash, User, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

interface AdminWithDetails extends admin {
  name: string
}

interface AdminListClientProps {
  admins: AdminWithDetails[]
}

export function AdminListClient({ admins }: AdminListClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const result = await createAdmin(formData)
    
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Admin berhasil ditambahkan")
      setIsFormOpen(false)
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus admin ini?")) {
      const result = await deleteAdmin(id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Admin berhasil dihapus")
      }
    }
  }

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5" /> Tambah Admin Baru
        </button>

        {isFormOpen && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-bold text-gray-800 mb-4">Tambah Admin Baru</h3>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                name="name" 
                type="text" 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Nama Lengkap"
              />
            </div>
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  name="username" 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Username"
                />
              </div>
              <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  name="password" 
                  type="password" 
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Password"
                />
              </div>
              <div className="w-full md:w-auto">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{admin.name || 'Admin'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{admin.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-mono">
                      {visiblePasswords[admin.id] ? admin.password : "••••••••"}
                    </span>
                    <button 
                      onClick={() => togglePasswordVisibility(admin.id)}
                      className="text-gray-400 hover:text-primary-600 transition-colors focus:outline-none"
                    >
                      {visiblePasswords[admin.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
