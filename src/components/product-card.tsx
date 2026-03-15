"use client"

import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { product } from "@prisma/client"
import { motion } from "framer-motion"

interface ProductCardProps {
  product: product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isAvailable = product.stock > 0

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300 overflow-hidden border border-earth-100 hover:border-primary-500/50 flex flex-col h-full"
    >
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-earth-50 cursor-pointer">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${!isAvailable ? 'grayscale opacity-70' : ''}`}
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-earth-800 shadow-sm border border-white/50">
            {product.category}
          </span>
          
          {isAvailable ? (
             <span className="bg-green-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-sm uppercase tracking-wider">
               Ready
             </span>
          ) : (
            <span className="bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-sm uppercase tracking-wider">
               Habis
             </span>
          )}
        </div>

        {/* Quick Action Overlay (Visible on Hover) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <span className="bg-white text-earth-900 px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
             Lihat Detail
           </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow relative">
        <h3 className="font-bold text-lg text-earth-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-earth-500 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-earth-100/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-earth-400 font-semibold">Harga Sewa</span>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-lg text-primary-600">{formatCurrency(product.price1Day)}</span>
              <span className="text-xs text-earth-400 font-medium">/hari</span>
            </div>
          </div>
          
          <Link 
            href={`/products/${product.id}`}
            className="w-10 h-10 rounded-full bg-earth-100 flex items-center justify-center text-earth-600 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-primary-500/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:rotate-45 transition-transform duration-300"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
