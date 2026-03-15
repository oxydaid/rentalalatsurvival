"use client"

import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"
import { testimonial } from "@prisma/client"

interface TestimonialsListProps {
  testimonials: testimonial[]
}

export function TestimonialsList({ testimonials }: TestimonialsListProps) {
  if (testimonials.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((item, index) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 flex flex-col h-full hover:shadow-lg transition-shadow"
        >
          <div className="flex text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < item.rating ? "fill-current" : "text-gray-200"}`} />
            ))}
          </div>
          <div className="flex-grow">
            <Quote className="h-8 w-8 text-primary-400 mb-2" />
            <p className="text-earth-600 italic">"{item.content}"</p>
          </div>
          <div className="mt-6 flex items-center pt-4 border-t border-earth-50">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg overflow-hidden">
              {item.avatar ? (
                 <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                item.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="ml-3">
              <h4 className="font-bold text-earth-900">{item.name}</h4>
              <p className="text-sm text-earth-500">{item.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
