'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getAdminContacts() {
  try {
    return await prisma.admin_contact.findMany({
      orderBy: { createdAt: 'asc' }
    })
  } catch (error) {
    console.error("Failed to fetch admin contacts:", error)
    try {
      return await prisma.$queryRaw<any[]>`SELECT * FROM admin_contact ORDER BY createdAt ASC`
    } catch (e) {
      console.error("Raw query for admin_contact failed:", e)
      return []
    }
  }
}

export async function addAdminContact(data: { name: string; number: string }) {
  await prisma.admin_contact.create({
    data: {
      name: data.name,
      number: data.number,
      isActive: true
    }
  })
  revalidatePath('/admin/settings')
  revalidatePath('/contact')
}

export async function updateAdminContact(id: string, data: { name: string; number: string; isActive: boolean }) {
  await prisma.admin_contact.update({
    where: { id },
    data: {
      name: data.name,
      number: data.number,
      isActive: data.isActive
    }
  })
  revalidatePath('/admin/settings')
  revalidatePath('/contact')
}

export async function deleteAdminContact(id: string) {
  await prisma.admin_contact.delete({
    where: { id }
  })
  revalidatePath('/admin/settings')
  revalidatePath('/contact')
}
