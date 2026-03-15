'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createAdmin(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string || 'Admin'

  if (!username || !password) {
    return { error: 'Username dan Password harus diisi' }
  }

  try {
    // Note: In production, password should be hashed!
    // Use raw query because Prisma Client is outdated
    const id = crypto.randomUUID()
    await prisma.$executeRaw`
      INSERT INTO admin (id, username, password, name) 
      VALUES (${id}, ${username}, ${password}, ${name})
    `
    revalidatePath('/admin/admins')
    return { success: true }
  } catch (error) {
    return { error: 'Gagal membuat admin. Username mungkin sudah digunakan.' }
  }
}

export async function deleteAdmin(id: string) {
  try {
    await prisma.admin.delete({
      where: { id }
    })
    revalidatePath('/admin/admins')
    return { success: true }
  } catch (error) {
    return { error: 'Gagal menghapus admin' }
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    await prisma.booking.update({
      where: { id },
      data: { status }
    })
    revalidatePath('/admin/bookings')
    revalidatePath('/admin/dashboard')
    revalidatePath('/admin/history')
    return { success: true }
  } catch (error) {
    return { error: 'Gagal mengupdate status pesanan' }
  }
}

export async function deleteBooking(id: string) {
  try {
    // Delete related items first (cascade usually handles this but let's be safe if no cascade)
    // Actually Prisma handles cascade if defined, but using raw queries for safety as per pattern
    // However, let's try standard Prisma first
    
    // Check if we can use prisma delete
    await prisma.bookingitem.deleteMany({
      where: { bookingId: id }
    })
    
    await prisma.booking.delete({
      where: { id }
    })
    
    revalidatePath('/admin/history')
    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete booking:', error)
    return { error: 'Gagal menghapus pesanan' }
  }
}

export async function createFAQ(formData: FormData) {
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string

  if (!question || !answer) {
    return { error: 'Pertanyaan dan Jawaban harus diisi' }
  }

  try {
    // Use raw query to ensure compatibility
    const id = crypto.randomUUID()
    const now = new Date()
    
    // Using prisma.faq.create if possible, but fallback to raw if needed. 
    // Given previous pattern of using raw for new tables or changes, let's try standard Prisma first if model exists in client.
    // However, schema showed `model faq`.
    // Let's use standard prisma first. If it fails due to outdated client, I'll switch to raw.
    // Actually, user previously had issues with outdated client.
    // Safest bet is to try standard, but if user reported "Prisma Client is outdated" before, maybe I should be careful.
    // The previous error in admin.ts comment says "// Use raw query because Prisma Client is outdated".
    // So I should probably use raw query for consistency if the client is indeed outdated.
    
    // Let's try to use Prisma Client first, usually it works if `npx prisma generate` was run.
    // If not, I'll use raw. 
    // Wait, the previous developer used raw for `Admin` table insert.
    // Let's stick to the pattern or try standard. 
    // Let's try standard first for FAQ.
    
    await prisma.faq.create({
      data: {
        id,
        question,
        answer,
        updatedAt: now
      }
    })

    revalidatePath('/admin/faq')
    return { success: true }
  } catch (error) {
    console.error('Failed to create FAQ:', error)
    return { error: 'Gagal membuat FAQ' }
  }
}

export async function deleteFAQ(id: string) {
  try {
    await prisma.faq.delete({
      where: { id }
    })
    revalidatePath('/admin/faq')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete FAQ:', error)
    return { error: 'Gagal menghapus FAQ' }
  }
}

export async function updateFAQ(id: string, formData: FormData) {
  const question = formData.get('question') as string
  const answer = formData.get('answer') as string

  if (!question || !answer) {
    return { error: 'Pertanyaan dan Jawaban harus diisi' }
  }

  try {
    await prisma.faq.update({
      where: { id },
      data: {
        question,
        answer,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/faq')
    return { success: true }
  } catch (error) {
    console.error('Failed to update FAQ:', error)
    return { error: 'Gagal mengupdate FAQ' }
  }
}

export async function createTerm(formData: FormData) {
  const content = formData.get('content') as string

  if (!content) {
    return { error: 'Isi ketentuan harus diisi' }
  }

  try {
    const id = crypto.randomUUID()
    await prisma.rentalterm.create({
      data: {
        id,
        content,
        updatedAt: new Date(),
      }
    })

    revalidatePath('/admin/terms')
    revalidatePath('/terms')
    return { success: true }
  } catch (error) {
    console.error('Failed to create rental term:', error)
    return { error: 'Gagal membuat ketentuan sewa' }
  }
}

export async function deleteTerm(id: string) {
  try {
    await prisma.rentalterm.delete({
      where: { id }
    })
    revalidatePath('/admin/terms')
    revalidatePath('/terms')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete rental term:', error)
    return { error: 'Gagal menghapus ketentuan sewa' }
  }
}

export async function updateTerm(id: string, formData: FormData) {
  const content = formData.get('content') as string

  if (!content) {
    return { error: 'Isi ketentuan harus diisi' }
  }

  try {
    await prisma.rentalterm.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date(),
      }
    })

    revalidatePath('/admin/terms')
    revalidatePath('/terms')
    return { success: true }
  } catch (error) {
    console.error('Failed to update rental term:', error)
    return { error: 'Gagal mengupdate ketentuan sewa' }
  }
}

export async function createStep(formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const icon = formData.get('icon') as string
  const stepOrder = parseInt(formData.get('stepOrder') as string)

  if (!title || !description || !icon || isNaN(stepOrder)) {
    return { error: 'Semua field harus diisi dengan benar' }
  }

  try {
    const id = crypto.randomUUID()
    const now = new Date()
    await prisma.bookingstep.create({
      data: {
        id,
        title,
        description,
        icon,
        stepOrder,
        updatedAt: now
      }
    })

    revalidatePath('/admin/steps')
    return { success: true }
  } catch (error) {
    console.error('Failed to create booking step:', error)
    return { error: 'Gagal membuat langkah booking' }
  }
}

export async function deleteStep(id: string) {
  try {
    await prisma.bookingstep.delete({
      where: { id }
    })
    revalidatePath('/admin/steps')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete booking step:', error)
    return { error: 'Gagal menghapus langkah booking' }
  }
}

export async function updateStep(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const icon = formData.get('icon') as string
  const stepOrder = parseInt(formData.get('stepOrder') as string)

  if (!title || !description || !icon || isNaN(stepOrder)) {
    return { error: 'Semua field harus diisi dengan benar' }
  }

  try {
    await prisma.bookingstep.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        stepOrder,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/steps')
    return { success: true }
  } catch (error) {
    console.error('Failed to update booking step:', error)
    return { error: 'Gagal mengupdate langkah booking' }
  }
}
