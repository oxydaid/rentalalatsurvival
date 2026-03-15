import React from "react"
import { prisma } from "@/lib/prisma"
import { BookingStepsList } from "@/components/home/booking-steps-list"

export async function BookingSteps() {
  let steps: any[] = []
  try {
    steps = await prisma.bookingstep.findMany({
      orderBy: { stepOrder: 'asc' }
    })
  } catch {
    steps = []
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-earth-800">Cara Booking</h2>
          <p className="text-earth-600 max-w-2xl mx-auto">
            Ikuti langkah mudah berikut untuk menyewa perlengkapan camping di SayEquipment.
          </p>
        </div>

        <BookingStepsList steps={steps} />
      </div>
    </section>
  )
}
