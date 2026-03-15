'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTestimonials() {
  try {
    // @ts-ignore
    if (prisma.testimonial) {
      return await prisma.testimonial.findMany({
        where: { isShow: true },
        orderBy: { createdAt: 'desc' }
      })
    }
    // Fallback if client not ready
    return await prisma.$queryRaw`SELECT * FROM testimonial WHERE isShow = 1 ORDER BY createdAt DESC` as any[]
  } catch (error) {
    console.error('Failed to fetch testimonials:', error)
    return []
  }
}

export async function getAllTestimonials() {
  try {
    // @ts-ignore
    if (prisma.testimonial) {
      return await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' }
      })
    }
    // Fallback
    return await prisma.$queryRaw`SELECT * FROM testimonial ORDER BY createdAt DESC` as any[]
  } catch (error) {
    console.error('Failed to fetch all testimonials:', error)
    return []
  }
}

export async function createTestimonial(data: {
  name: string
  role: string
  content: string
  rating: number
  avatar?: string
}) {
  try {
    // @ts-ignore
    if (prisma.testimonial) {
      await prisma.testimonial.create({
        data: {
          ...data,
          id: crypto.randomUUID(),
          updatedAt: new Date()
        }
      })
    } else {
      const id = crypto.randomUUID()
      await prisma.$executeRaw`
        INSERT INTO testimonial (id, name, role, content, rating, avatar, isShow, createdAt, updatedAt)
        VALUES (${id}, ${data.name}, ${data.role}, ${data.content}, ${data.rating}, ${data.avatar || null}, true, NOW(), NOW())
      `
    }
    revalidatePath('/')
    revalidatePath('/admin/testimonials')
    return { success: true }
  } catch (error) {
    console.error('Failed to create testimonial:', error)
    return { success: false, error }
  }
}

export async function deleteTestimonial(id: string) {
  try {
    // @ts-ignore
    if (prisma.testimonial) {
      await prisma.testimonial.delete({ where: { id } })
    } else {
      await prisma.$executeRaw`DELETE FROM Testimonial WHERE id = ${id}`
    }
    revalidatePath('/')
    revalidatePath('/admin/testimonials')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete testimonial:', error)
    return { success: false, error }
  }
}

export async function toggleTestimonialVisibility(id: string, isShow: boolean) {
  try {
    // @ts-ignore
    if (prisma.testimonial) {
      await prisma.testimonial.update({
        where: { id },
        data: { isShow, updatedAt: new Date() }
      })
    } else {
      await prisma.$executeRaw`UPDATE testimonial SET isShow = ${isShow}, updatedAt = NOW() WHERE id = ${id}`
    }
    revalidatePath('/')
    revalidatePath('/admin/testimonials')
    return { success: true }
  } catch (error) {
    console.error('Failed to toggle testimonial:', error)
    return { success: false, error }
  }
}
