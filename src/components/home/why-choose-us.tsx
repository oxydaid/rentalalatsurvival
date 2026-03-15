"use client"

import { ShieldCheck, ThumbsUp, Clock } from "lucide-react"
import { motion } from "framer-motion"

export function WhyChooseUs() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Barang Terawat",
      description: "Semua peralatan selalu dibersihkan dan dicek kondisinya sebelum dan sesudah penyewaan."
    },
    {
      icon: ThumbsUp,
      title: "Bisa COD",
      description: "Melayani Cash On Delivery (COD) untuk area Bojonegoro Kota. Barang diantar sampai lokasi Anda."
    },
    {
      icon: Clock,
      title: "Booking Mudah",
      description: "Sistem booking online 24 jam. Cek ketersediaan real-time dan pesan langsung dari website."
    }
  ]

  return (
    <section className="container-custom">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-earth-800"
        >
          Kenapa Memilih Kami?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-earth-500 mt-2"
        >
          Kami memberikan pelayanan terbaik untuk petualangan Anda
        </motion.p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 text-center space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary-600">
              <item.icon className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl text-earth-800">{item.title}</h3>
            <p className="text-earth-500">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
