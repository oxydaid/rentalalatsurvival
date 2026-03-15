import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { BackButton } from "@/components/back-button"

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const category = typeof searchParams.category === 'string' ? searchParams.category : undefined

  // Build filter conditions
  const where: Prisma.productWhereInput = {}
  
  if (search) {
    where.name = {
      contains: search,
      // mode: 'insensitive' // SQLite might not support insensitive mode directly in all Prisma versions depending on collation, but typically it does.
      // If error occurs, we might need to remove mode or ensure case match. 
      // For SQLite provider in Prisma, 'insensitive' is supported for contains.
    }
  }

  if (category) {
    where.category = {
      equals: category
    }
  }

  // Fetch products with filters
  const productsData = await prisma.product.findMany({
    where,
    orderBy: {
      category: 'asc'
    }
  })

  // Fetch active rented items using Raw SQL to bypass outdated Prisma Client validation
   // We want items that are currently active: endDate >= NOW and startDate <= NOW
   // Using DATE() to compare dates only, ignoring time, to ensure bookings ending today are still counted
   const activeItems = await prisma.$queryRaw`
     SELECT bi.productId, bi.quantity 
     FROM bookingitem bi 
     JOIN booking b ON bi.bookingId = b.id 
     WHERE b.status IN ('PENDING', 'CONFIRMED') 
     AND DATE(bi.endDate) >= CURRENT_DATE
     AND DATE(bi.startDate) <= CURRENT_DATE
   ` as { productId: string, quantity: number }[]

  // Calculate active rented quantity per product
  const rentedMap = new Map<string, number>()
  activeItems.forEach(item => {
    const current = rentedMap.get(item.productId) || 0
    rentedMap.set(item.productId, current + item.quantity)
  })

  // Calculate virtual stock (Total - Currently Rented)
  const products = productsData.map(product => {
    const rentedCount = rentedMap.get(product.id) || 0
    return {
      ...product,
      stock: Math.max(0, product.stock - rentedCount)
    }
  })

  // Get all unique categories for the filter list
  // Since we want to show all available categories regardless of current filter, we fetch distinct categories from all products
  const categoriesResult = await prisma.product.findMany({
    select: {
      category: true
    },
    distinct: ['category'],
    orderBy: {
      category: 'asc'
    }
  })

  const categories = categoriesResult.map(c => c.category)

  return (
    <div className="container-custom pt-32 pb-12">
      <BackButton href="/" label="Kembali ke Beranda" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-earth-900">Katalog Peralatan</h1>
        <p className="text-earth-500 mt-2">Temukan perlengkapan outdoor terbaik untuk petualangan Anda</p>
      </div>

      <ProductFilters categories={categories} />

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan.</p>
          <p className="text-gray-400 text-sm mt-2">Coba kata kunci lain atau reset filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
