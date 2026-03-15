"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2, Phone, Save, X } from "lucide-react"
import { addAdminContact, updateAdminContact, deleteAdminContact } from "@/app/actions/admin-contacts"

interface AdminContact {
  id: string
  name: string
  number: string
  isActive: boolean
}

interface AdminContactManagerProps {
  contacts: AdminContact[]
}

export function AdminContactManager({ contacts }: AdminContactManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form states
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [editName, setEditName] = useState("")
  const [editNumber, setEditNumber] = useState("")
  
  const [isPending, setIsPending] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    try {
      await addAdminContact({ name: newName, number: newNumber })
      setNewName("")
      setNewNumber("")
      setIsAdding(false)
    } finally {
      setIsPending(false)
    }
  }

  const handleUpdate = async (id: string, isActive: boolean) => {
    setIsPending(true)
    try {
      await updateAdminContact(id, { 
        name: editName, 
        number: editNumber,
        isActive 
      })
      setEditingId(null)
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kontak ini?")) return
    setIsPending(true)
    try {
      await deleteAdminContact(id)
    } finally {
      setIsPending(false)
    }
  }

  const startEdit = (contact: AdminContact) => {
    setEditingId(contact.id)
    setEditName(contact.name)
    setEditNumber(contact.number)
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Daftar Admin WhatsApp</h3>
          <p className="text-sm text-gray-500">Kelola kontak admin yang akan muncul di halaman Kontak.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          disabled={isAdding || isPending}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Tambah Admin
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Admin / Divisi</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Contoh: Admin Booking, CS 1"
                className="w-full p-2 border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="628..."
                className="w-full p-2 border rounded-md text-sm"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-800 text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center gap-2"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Belum ada kontak admin tambahan.
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-200 transition-colors">
              {editingId === contact.id ? (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mr-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="p-2 border rounded-md text-sm"
                  />
                  <input
                    type="text"
                    value={editNumber}
                    onChange={(e) => setEditNumber(e.target.value)}
                    className="p-2 border rounded-md text-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{contact.name}</h4>
                    <p className="text-sm text-gray-500">+{contact.number}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                {editingId === contact.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(contact.id, contact.isActive)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Simpan"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      title="Batal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(contact)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
