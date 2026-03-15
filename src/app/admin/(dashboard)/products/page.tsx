import { prisma } from "@/lib/prisma"
import { deleteProduct } from "@/app/actions/product"
import { formatCurrency } from "@/lib/utils"
import { Trash } from "lucide-react"
import { ProductListClient } from "./product-list-client"
import { product } from "@prisma/client"

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // Use queryRaw to fetch products including isFeatured column (which is missing in old Prisma Client)
  let products: product[] = []
  
  try {
    products = await prisma.$queryRaw<product[]>`
      SELECT * FROM product ORDER BY createdAt DESC
    `
  } catch (error) {
    console.error("Failed to fetch products via raw query, falling back to regular findMany", error)
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
      </div>

      <ProductListClient products={products} />
    </div>
  )
}