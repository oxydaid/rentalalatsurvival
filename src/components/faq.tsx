import React from "react"
import { prisma } from "@/lib/prisma"
import { FAQItem } from "./faq-item"

export async function FAQ() {
  let faqs: any[] = []
  try {
    faqs = await prisma.faq.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch {
    faqs = []
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-earth-800">Sering Ditanyakan (FAQ)</h2>
          <p className="text-earth-600">
            Jawaban untuk pertanyaan yang sering diajukan oleh pelanggan kami.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
