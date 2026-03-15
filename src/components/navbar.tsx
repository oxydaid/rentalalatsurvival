"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useCartStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const items = useCartStore((state) => state.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  // Force scrolled state on non-home pages
  const isScrolledState = scrolled || !isHome

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolledState ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
    )}>
      <div className="container-custom flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="SayEquipment Logo" 
            width={200} 
            height={200} 
            className={cn(
              "w-auto object-contain transition-all duration-300",
              isScrolledState ? "h-20" : "h-28"
            )} 
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <Link href="/" className={cn("font-semibold text-lg transition-colors hover:text-primary-500", isScrolledState ? "text-earth-900" : "text-white drop-shadow-md")}>Beranda</Link>
          <Link href="/products" className={cn("font-semibold text-lg transition-colors hover:text-primary-500", isScrolledState ? "text-earth-900" : "text-white drop-shadow-md")}>Katalog</Link>
          <Link href="/about" className={cn("font-semibold text-lg transition-colors hover:text-primary-500", isScrolledState ? "text-earth-900" : "text-white drop-shadow-md")}>Tentang Kami</Link>
          <Link href="/contact" className={cn("font-semibold text-lg transition-colors hover:text-primary-500", isScrolledState ? "text-earth-900" : "text-white drop-shadow-md")}>Kontak</Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link href="/cart" className={cn("relative p-2 hover:text-primary-500 transition-colors", isScrolledState ? "text-earth-900" : "text-white drop-shadow-md")}>
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary-500 text-earth-900 text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full border border-white">
                {itemCount}
              </span>
            )}
          </Link>
          
          <button 
            className={cn("md:hidden p-2", isScrolledState ? "text-earth-900" : "text-white drop-shadow-md")}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 border-t border-earth-100">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-earth-800 font-medium hover:text-primary-600">Beranda</Link>
          <Link href="/products" onClick={() => setIsOpen(false)} className="text-earth-800 font-medium hover:text-primary-600">Katalog</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-earth-800 font-medium hover:text-primary-600">Tentang Kami</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-earth-800 font-medium hover:text-primary-600">Kontak</Link>
        </div>
      )}
    </nav>
  )
}
