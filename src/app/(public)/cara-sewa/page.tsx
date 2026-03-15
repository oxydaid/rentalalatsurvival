
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"
import { BackButton } from "@/components/back-button"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cara Sewa | SayEquipment",
  description: "Panduan cara menyewa peralatan outdoor di SayEquipment Bojonegoro.",
}

export default async function CaraSewaPage() {
  const steps = await prisma.bookingstep.findMany({
    orderBy: { stepOrder: "asc" },
  })

  const terms = await prisma.rentalterm.findMany({
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary-500 py-16">
        <div className="container-custom">
          <BackButton href="/" label="Kembali ke Beranda" className="mb-4 text-black hover:text-white" />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Cara Sewa</h1>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              Panduan mudah untuk menyewa peralatan outdoor kebutuhan petualangan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-earth-900 text-center mb-12">
            Langkah-Langkah Penyewaan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              // Dynamic Icon
              const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[step.icon] || Icons.HelpCircle

              return (
                <div key={step.id} className="bg-earth-50 p-6 rounded-2xl border border-earth-100 relative group hover:shadow-md transition-shadow">
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-sm">
                    {index + 1}
                  </div>
                  <div className="mb-4 text-primary-600">
                    <IconComponent className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-earth-900 mb-3">{step.title}</h3>
                  <p className="text-earth-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>

          {steps.length === 0 && (
            <div className="text-center text-earth-500 py-12">
              <p>Belum ada informasi langkah penyewaan.</p>
            </div>
          )}
        </div>
      </section>

      {/* Terms Section */}
      <section className="py-16 bg-earth-50 border-t border-earth-100">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-earth-900 text-center mb-12">
            Syarat & Ketentuan
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-earth-200 p-8">
            <ul className="space-y-4">
              {terms.map((term, index) => (
                <li key={term.id} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                  </div>
                  <p className="text-earth-700">{term.content}</p>
                </li>
              ))}
            </ul>

            {terms.length === 0 && (
              <p className="text-center text-earth-500">Belum ada informasi syarat & ketentuan.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
