import { prisma } from "@/lib/prisma"
import { BookingForm } from "@/components/booking-form"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { Check, Shield, Info } from "lucide-react"
import { BackButton } from "@/components/back-button"

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  
  // Fetch product
  const productData = await prisma.product.findUnique({
    where: { id }
  })

  if (!productData) {
    return (
      <div className="container-custom pt-32 pb-20">
        <BackButton href="/products" />
        <div className="text-center mt-8">Produk tidak ditemukan</div>
      </div>
    )
  }

  // Fetch active rented count for this product using Raw SQL
  const activeItems = await prisma.$queryRaw`
    SELECT SUM(bi.quantity) as rentedCount
    FROM bookingitem bi 
    JOIN booking b ON bi.bookingId = b.id 
    WHERE bi.productId = ${id}
    AND b.status IN ('PENDING', 'CONFIRMED') 
    AND DATE(bi.endDate) >= CURRENT_DATE
    AND DATE(bi.startDate) <= CURRENT_DATE
  ` as { rentedCount: number | null }[]

  // Calculate available stock
  const rentedCount = Number(activeItems[0]?.rentedCount || 0)
  const product = {
    ...productData,
    stock: Math.max(0, productData.stock - rentedCount)
  }

  return (
    <div className="container-custom pt-32 pb-12">
      <BackButton href="/products" label="Kembali ke Produk" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Image */}
        <div className="space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-earth-100 shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <span className="inline-block bg-earth-200 text-earth-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-earth-900 mb-2">{product.name}</h1>
            
            {/* Pricing Table */}
            <div className="bg-earth-50 rounded-xl p-4 border border-earth-100 mb-6">
              <h3 className="font-semibold text-earth-800 mb-3 text-sm uppercase tracking-wider">Daftar Harga Sewa</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="bg-white p-2 rounded border border-earth-200">
                  <div className="text-xs text-earth-500 mb-1">1 Hari</div>
                  <div className="font-bold text-primary-700">{formatCurrency(product.price1Day)}</div>
                </div>
                <div className="bg-white p-2 rounded border border-earth-200">
                  <div className="text-xs text-earth-500 mb-1">2 Hari</div>
                  <div className="font-bold text-primary-700">{formatCurrency(product.price2Days)}</div>
                </div>
                <div className="bg-white p-2 rounded border border-earth-200">
                  <div className="text-xs text-earth-500 mb-1">3 Hari</div>
                  <div className="font-bold text-primary-700">{formatCurrency(product.price3Days)}</div>
                </div>
                <div className="bg-white p-2 rounded border border-earth-200">
                  <div className="text-xs text-earth-500 mb-1">&gt;3 Hari</div>
                  <div className="font-bold text-primary-700">{formatCurrency(product.priceOver3Days)}/hari</div>
                </div>
              </div>
            </div>

            <div className="prose prose-earth text-earth-600 mb-6">
              <p>{product.description}</p>
            </div>
          </div>
          
          <div className="bg-primary-50 p-6 rounded-2xl flex items-start space-x-4">
            <Shield className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-primary-800">Jaminan Kualitas</h4>
              <p className="text-sm text-primary-700/80 mt-1">
                Semua peralatan telah disterilisasi dan dicek fungsinya sebelum disewakan kepada Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Info & Booking */}
        <div className="space-y-8">
          <div className="border-b border-earth-200 pb-6">
            <BookingForm product={product} />
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-earth-800 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Syarat Sewa
            </h4>
            <ul className="space-y-2 text-sm text-earth-600">
              <li className="flex items-center"><Check className="h-4 w-4 text-primary-500 mr-2" /> KTP Asli sebagai jaminan</li>
              <li className="flex items-center"><Check className="h-4 w-4 text-primary-500 mr-2" /> Pembayaran lunas saat pengambilan</li>
              <li className="flex items-center"><Check className="h-4 w-4 text-primary-500 mr-2" /> Bisa COD Area Bojonegoro Kota</li>
              <li className="flex items-center"><Check className="h-4 w-4 text-primary-500 mr-2" /> Denda keterlambatan berlaku</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
