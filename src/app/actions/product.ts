'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { saveFile, deleteFile } from '@/lib/file-upload'

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (product?.image) {
    await deleteFile(product.image)
  }

  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/dashboard')
  revalidatePath('/products')
}

export async function toggleFeatured(id: string, isFeatured: boolean) {
  if (isFeatured) {
    // Get currently featured products sorted by latest first
    const featuredProducts = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM product WHERE isFeatured = 1 ORDER BY updatedAt DESC
    `
    
    // If we have 3 or more, remove the oldest ones to make room (FIFO)
    // We keep the 2 newest, so when we add the current one, we have 3 total.
    if (featuredProducts.length >= 3) {
      const productsToRemove = featuredProducts.slice(2)
      
      for (const product of productsToRemove) {
        await prisma.$executeRaw`
            UPDATE product SET isFeatured = 0, updatedAt = ${new Date()} WHERE id = ${product.id}
          `
      }
    }
  }

  // Use executeRaw to avoid Prisma Client validation error if client is not regenerated
  await prisma.$executeRaw`
    UPDATE product SET isFeatured = ${isFeatured ? 1 : 0}, updatedAt = ${new Date()} WHERE id = ${id}
  `

  revalidatePath('/')
  revalidatePath('/admin/dashboard')
}

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const price1Day = Number(formData.get('price1Day'))
  const price2Days = Number(formData.get('price2Days'))
  const price3Days = Number(formData.get('price3Days'))
  const priceOver3Days = Number(formData.get('priceOver3Days'))
  const stock = Number(formData.get('stock'))
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  
  const imageFile = formData.get('image') as File
  let image = 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80'

  if (imageFile && imageFile.size > 0) {
    image = await saveFile(imageFile)
  }

  await prisma.product.create({
    data: {
      id: crypto.randomUUID(),
      updatedAt: new Date(),
      name,
      price1Day,
      price2Days,
      price3Days,
      priceOver3Days,
      stock,
      category,
      description,
      image
    }
  })
  
  revalidatePath('/admin/dashboard')
  revalidatePath('/products')
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const price1Day = Number(formData.get('price1Day'))
  const price2Days = Number(formData.get('price2Days'))
  const price3Days = Number(formData.get('price3Days'))
  const priceOver3Days = Number(formData.get('priceOver3Days'))
  const stock = Number(formData.get('stock'))
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  
  const imageFile = formData.get('image') as File
  
  const data: any = {
    name,
    price1Day,
    price2Days,
    price3Days,
    priceOver3Days,
    stock,
    category,
    description,
    updatedAt: new Date()
  }

  if (imageFile && imageFile.size > 0) {
    // Get old product to delete old image
    const oldProduct = await prisma.product.findUnique({ where: { id } })
    if (oldProduct?.image) {
      await deleteFile(oldProduct.image)
    }
    
    data.image = await saveFile(imageFile)
  }

  await prisma.product.update({
    where: { id },
    data
  })
  
  revalidatePath('/admin/dashboard')
  revalidatePath('/products')
}
