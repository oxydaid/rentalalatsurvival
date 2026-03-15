"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface HeroSectionProps {
  backgroundImage: string
}

export function HeroSection({ backgroundImage }: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 10,
        mass: 0.8
      }
    }
  }

  const leftSpringVariant = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring" as const, 
        stiffness: 120, // Lebih kaku = lebih cepat
        damping: 10,    // Redaman dikurangi sedikit biar tetap bouncy tapi cepat settle
        mass: 0.5       // Massa diringankan = gerakan lebih enteng/cepat
      } 
    }
  }

  const rightSpringVariant = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring" as const, 
        stiffness: 120,
        damping: 10,
        mass: 0.5
      } 
    }
  }

  const textContainerVariant = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Dipercepat dari 0.15 jadi 0.08
        delayChildren: 0
      }
    }
  }

  const line1Words = "Rental Alat Outdoor".split(" ")
  const line2Words = "Terlengkap & Termurah".split(" ")

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-earth-900/90 z-10" />
      <motion.div 
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${backgroundImage || 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1600&q=80'}")` }}
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container-custom relative z-20 text-center text-white space-y-8"
      >
        <motion.div 
          variants={itemVariants}
          className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 text-yellow-300 px-6 py-2 rounded-full font-bold text-sm mb-4"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          <span>#1 Rental Outdoor Bojonegoro</span>
        </motion.div>
        
        <div className="overflow-visible">
          <motion.h1 
            variants={textContainerVariant}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight drop-shadow-lg flex flex-col items-center gap-2"
          >
            {/* Line 1 - From Left */}
            <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-5">
              {line1Words.map((word, i) => (
                <motion.span key={i} variants={leftSpringVariant} className="inline-block">
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Line 2 - From Right */}
            <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-5">
              {line2Words.map((word, i) => (
                <motion.span key={i} variants={rightSpringVariant} className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.h1>
        </div>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 font-medium leading-relaxed drop-shadow-md"
        >
          Sewa peralatan camping lengkap dan berkualitas. Siap antar dan <strong className="text-yellow-400">Bisa COD</strong> area Bojonegoro Kota.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
        >
          <Link 
            href="/products" 
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-400 text-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.5)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]"
          >
            <span>Mulai Sewa Sekarang</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            href="/contact" 
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
          >
            <span>Hubungi Kami</span>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-white/50"
      >
         <ArrowRight className="h-6 w-6 rotate-90" />
      </motion.div>
    </section>
  )
}
