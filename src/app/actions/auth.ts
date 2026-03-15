'use server'
 
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  // Use raw query to get name as well
  const admins = await prisma.$queryRaw<any[]>`SELECT * FROM admin WHERE username = ${username} LIMIT 1`
  const admin = admins[0]

  if (admin && admin.password === password) {
    // In production, verify hash
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'true', { httpOnly: true })
    cookieStore.set('admin_username', admin.username, { httpOnly: true })
    cookieStore.set('admin_name', admin.name || admin.username, { httpOnly: true })
    redirect('/admin/dashboard')
  }

  return { error: 'Invalid credentials' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  cookieStore.delete('admin_username')
  cookieStore.delete('admin_name')
  redirect('/admin/login')
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const name = cookieStore.get('admin_name')?.value
  const username = cookieStore.get('admin_username')?.value
  return name || username || 'Admin'
}
