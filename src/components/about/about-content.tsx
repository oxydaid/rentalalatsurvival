"use client"

import React from "react"
import Image from "next/image"
import { MapPin, Phone, Clock, CheckCircle2 } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { motion } from "framer-motion"
import { LocationMap } from "@/components/location-map"

interface AboutContentProps {
  settings: any // Using any for simplicity as strict type isn't available here, but preferably match siteSettings type
  locations?: any[]
}

export function AboutContent({ settings, locations = [] }: AboutContentProps) {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Hero Section */}
      <section className="container-custom mb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton href="/" label="Kembali ke Beranda" className="mb-4" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-earth-900 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="relative z-10 space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold"
            >
              {settings.aboutTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-earth-200 max-w-2xl mx-auto text-lg"
            >
              Partner setia petualangan Anda di Bojonegoro. Kami hadir untuk memudahkan hobi outdoor Anda dengan peralatan berkualitas.
            </motion.p>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="container-custom mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg"
          >
            <Image
              src={settings.aboutBackgroundImage || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"}
              alt="Camping Atmosphere"
              fill
              className="object-cover"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-earth-800">Cerita Kami</h2>
            <div className="space-y-4 text-earth-600 leading-relaxed whitespace-pre-line">
              {settings.aboutDescription ? (
                <p>{settings.aboutDescription}</p>
              ) : (
                <>
                <p>
                  SayEquipment bermula dari kecintaan kami terhadap alam bebas. Kami menyadari bahwa menikmati keindahan alam Bojonegoro dan sekitarnya seringkali terkendala oleh perlengkapan yang mahal dan sulit didapat.
                </p>
                <p>
                  Didirikan pada tahun 2023, kami berkomitmen untuk menyediakan solusi sewa peralatan camping yang terjangkau, bersih, dan berkualitas. Kami ingin setiap orang bisa merasakan nikmatnya berkemah tanpa harus pusing memikirkan peralatan.
                </p>
                <p>
                  Mulai dari tenda, sleeping bag, hingga alat masak, semua kami rawat dengan sepenuh hati agar Anda merasa nyaman seperti menggunakan barang sendiri.
                </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Us / Values */}
      <section className="bg-earth-50 py-16 mb-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-earth-800">Nilai Utama Kami</h2>
              <p className="text-earth-500 mt-2">Apa yang membuat kami berbeda</p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Kebersihan Terjamin",
                desc: "Peralatan selalu dicuci dan disterilkan setelah pemakaian. Tidak ada bau apek atau kotoran tertinggal."
              },
              {
                title: "Kualitas Premium",
                desc: "Kami hanya menyewakan barang dari brand outdoor terpercaya yang sudah teruji ketahanannya."
              },
              {
                title: "Pelayanan Ramah",
                desc: "Tim kami siap membantu Anda memilih alat yang tepat dan memberikan tips penggunaan bagi pemula."
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-earth-100"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-earth-800 mb-2">{item.title}</h3>
                <p className="text-earth-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="container-custom">
        <div className="grid grid-cols-1 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-earth-800 mb-6">Hubungi Kami</h2>
              <p className="text-earth-600 mb-8">
                Punya pertanyaan atau ingin booking? Jangan ragu untuk menghubungi kami.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-earth-100 p-3 rounded-full text-earth-700">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-earth-800">Alamat</h4>
                  <p className="text-earth-600 text-sm mt-1 whitespace-pre-line">
                    {settings.address || "Jl. Lettu Suyitno, Bojonegoro, Jawa Timur\n(Dekat Alun-Alun Bojonegoro)"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-earth-100 p-3 rounded-full text-earth-700">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-earth-800">Telepon / WhatsApp</h4>
                  <p className="text-earth-600 text-sm mt-1">
                    +{settings.whatsappNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-earth-100 p-3 rounded-full text-earth-700">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-earth-800">Jam Operasional</h4>
                  <p className="text-earth-600 text-sm mt-1">
                    {settings.operationalHours || "Senin - Minggu: 08.00 - 20.00 WIB"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <LocationMap locations={locations} />
      </motion.div>
    </div>
  )
}
