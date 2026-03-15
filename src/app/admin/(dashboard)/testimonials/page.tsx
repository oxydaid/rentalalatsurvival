import { getAllTestimonials } from "@/app/actions/testimonials"
import TestimonialListClient from "./testimonial-list"

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials()
  return <TestimonialListClient testimonials={testimonials} />
}
