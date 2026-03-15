
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import { FAQItem } from "@/components/faq-item"
import { BackButton } from "@/components/back-button"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ | SayEquipment",
  description: "Pertanyaan yang sering diajukan seputar layanan sewa alat outdoor di SayEquipment.",
}

export default async function FAQPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-500 py-16">
        <div className="container-custom">
          <BackButton href="/" label="Kembali ke Beranda" className="mb-4 text-black hover:text-white" />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">FAQ</h1>
            <p className="text-lg text-black/80 max-w-2xl mx-auto">
              Pertanyaan yang sering diajukan oleh pelanggan kami.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ List Section */}
      <section className="py-16">
        <div className="container-custom max-w-3xl space-y-4">
          {faqs.length > 0 ? (
            faqs.map((faq) => (
              <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))
          ) : (
            <div className="text-center py-12 bg-earth-50 rounded-2xl border border-earth-100">
              <p className="text-earth-500 text-lg">Belum ada FAQ yang ditambahkan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
