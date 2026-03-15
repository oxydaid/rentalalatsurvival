import { getTestimonials } from "@/app/actions/testimonials"
import { TestimonialsList } from "@/components/home/testimonials-list"

export async function Testimonials() {
  const testimonials = await getTestimonials()

  if (testimonials.length === 0) return null

  return (
    <section className="bg-earth-50 py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-earth-800">Kata Mereka</h2>
          <p className="text-earth-500 mt-2">Pengalaman seru teman-teman yang sudah menyewa</p>
        </div>

        <TestimonialsList testimonials={testimonials} />
      </div>
    </section>
  )
}
