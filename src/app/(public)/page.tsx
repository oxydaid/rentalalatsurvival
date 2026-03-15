import { ProductCard } from "@/components/product-card"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { RentalTerms } from "@/components/rental-terms"
import { BookingSteps } from "@/components/booking-steps"
import { FAQ } from "@/components/faq"
import { Testimonials } from "@/components/testimonials"
import { LocationMap } from "@/components/location-map"
import { getSiteSettings, getLocations } from "@/app/actions/settings"
import { HeroSection } from "@/components/home/hero-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"

import { product } from "@prisma/client"

export const revalidate = 120;

export default async function Home() {
  const settings = await getSiteSettings()
  const locations = await getLocations()

  // Try to fetch featured products first
  // Use queryRaw to avoid Prisma Client validation error if client is not regenerated
  let featuredProducts: product[] = []
  
  try {
    featuredProducts = await prisma.$queryRaw<product[]>`
      SELECT * FROM product WHERE isFeatured = 1 ORDER BY updatedAt DESC LIMIT 3
    `
  } catch (error) {
    console.error("Failed to fetch featured products via raw query, falling back to regular findMany", error)
  }

  // Fallback if no featured products are set
  if (!featuredProducts || featuredProducts.length === 0) {
    try {
      featuredProducts = await prisma.product.findMany({
        take: 3,
        orderBy: {
          stock: 'desc'
        }
      })
    } catch {
      featuredProducts = []
    }
  }

  return (
    <div className="flex flex-col gap-16 pb-16 overflow-hidden">
      {/* Hero Section */}
      <HeroSection backgroundImage={settings.heroBackgroundImage} />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Featured Products */}
      <section className="bg-earth-50 py-16">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-earth-800">Produk Pilihan</h2>
              <p className="text-earth-500 mt-2">Peralatan favorit para petualang</p>
            </div>
            <Link href="/products" className="text-primary-600 font-semibold hover:text-primary-700 flex items-center">
              Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Booking Steps */}
      <BookingSteps />

      {/* Rental Terms */}
      <RentalTerms />

      {/* FAQ */}
      <FAQ />

      {/* Location Map */}
      <LocationMap locations={locations} />

      {/* CTA Bottom */}
      <section className="container-custom mb-8">
        <div className="bg-earth-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Siap untuk petualangan berikutnya?</h2>
            <p className="text-earth-200 max-w-2xl mx-auto">
              Jangan biarkan perlengkapan yang kurang memadai menghambat langkahmu. Sewa sekarang dan nikmati alam dengan nyaman.
            </p>
            <Link 
              href="/products" 
              className="inline-block bg-white text-earth-900 hover:bg-earth-100 px-8 py-3 rounded-full font-bold transition-colors"
            >
              Cek Katalog
            </Link>
          </div>
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  )
}
