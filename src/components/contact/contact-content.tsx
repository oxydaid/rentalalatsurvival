"use client"

import React from "react"
import Link from "next/link"
import { Phone, MapPin, Clock, Instagram } from "lucide-react"
import { LocationMap } from "@/components/location-map"
import { motion } from "framer-motion"

interface ContactContentProps {
  settings: any
  adminContacts: any[]
  locations?: any[]
}

export function ContactContent({ settings, adminContacts, locations = [] }: ContactContentProps) {
  return (
    <div className="pt-32 pb-16">
      {/* Header Section */}
      <section className="container-custom mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-earth-900 mb-4"
        >
          Hubungi Kami
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-earth-600 max-w-2xl mx-auto"
        >
          Punya pertanyaan seputar sewa alat camping? Jangan ragu untuk menghubungi kami. Tim kami siap membantu petualangan Anda.
        </motion.p>
      </section>

      {/* Contact Cards */}
      <section className="container-custom mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* WhatsApp / Phone Cards */}
          {adminContacts.length > 0 ? (
            <div className="flex flex-col gap-6">
              {adminContacts.map((contact, index) => (
                <motion.div 
                  key={contact.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <Phone className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-earth-900 mb-2">{contact.name}</h3>
                  <p className="text-earth-500 mb-6">Siap melayani konsultasi dan booking 24/7</p>
                  <Link 
                    href={`https://wa.me/${contact.number}`}
                    target="_blank"
                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors w-full"
                  >
                    Chat WhatsApp
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-2">WhatsApp & Telepon</h3>
              <p className="text-earth-500 mb-6">Siap melayani konsultasi dan booking 24/7</p>
              <Link 
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors w-full"
              >
                Chat WhatsApp
              </Link>
            </motion.div>
          )}

          {/* Social Media */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100 text-center hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
              <Instagram className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-earth-900 mb-2">Social Media</h3>
            <p className="text-earth-500 mb-6">Ikuti update terbaru dan promo menarik</p>
            <div className="flex gap-4 justify-center">
              <Link 
                href={(() => {
                  if (!settings.instagram) return "#";
                  const ig = settings.instagram.trim();
                  if (ig.startsWith("http")) return ig;
                  if (ig.startsWith("instagram.com") || ig.startsWith("www.instagram.com")) return `https://${ig}`;
                  return `https://instagram.com/${ig.replace(/^@/, '')}`;
                })()}
                target="_blank"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity w-full"
              >
                Instagram
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Operational Hours */}
      <section className="container-custom mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-earth-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-earth-100"
        >
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-earth-900 mb-4 flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary-600" />
              Jam Operasional
            </h2>
            <p className="text-earth-600 mb-6">
              Kami buka setiap hari untuk melayani kebutuhan petualangan Anda. 
              Pastikan melakukan pengambilan dan pengembalian sesuai jam operasional.
            </p>
            {settings.operationalHours ? (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-lg font-bold text-earth-900 whitespace-pre-line text-center">{settings.operationalHours}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="block text-sm font-semibold text-earth-400 mb-1">Senin - Jumat</span>
                  <span className="text-lg font-bold text-earth-900">08:00 - 21:00 WIB</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="block text-sm font-semibold text-earth-400 mb-1">Sabtu - Minggu</span>
                  <span className="text-lg font-bold text-earth-900">07:00 - 22:00 WIB</span>
                </div>
              </div>
            )}
          </div>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="flex-1 w-full h-full min-h-[200px] bg-primary-100 rounded-xl flex items-center justify-center"
          >
             {/* Placeholder illustration or decorative element */}
             <div className="text-center p-6">
                <p className="font-bold text-primary-800 text-xl">Siap Mendaki?</p>
                <p className="text-primary-600">Booking alat sekarang juga!</p>
             </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Map Section */}
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
