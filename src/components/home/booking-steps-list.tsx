"use client"

import React from "react"
import { 
  Search, MessageCircle, CreditCard, PackageCheck, Smile, 
  Calendar, MapPin, Truck, CheckCircle, AlertCircle 
} from "lucide-react"
import { motion } from "framer-motion"
import { bookingstep } from "@prisma/client"

// Map string names to Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  Search, MessageCircle, CreditCard, PackageCheck, Smile,
  Calendar, MapPin, Truck, CheckCircle, AlertCircle
}

interface BookingStepsListProps {
  steps: bookingstep[]
}

export function BookingStepsList({ steps }: BookingStepsListProps) {
  if (steps.length === 0) {
    return <p className="text-center text-gray-500">Belum ada langkah booking yang ditambahkan.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      {steps.map((step, index) => {
        const IconComponent = iconMap[step.icon] || Search // Fallback to Search icon

        return (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative flex flex-col items-center text-center group"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4 shadow-sm"
            >
              <IconComponent size={32} />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
            
            {/* Connector line for desktop (except last item) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute right-0 top-8 w-full h-0.5 bg-gray-200 -z-10 translate-x-1/2" />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
