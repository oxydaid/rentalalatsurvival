import Link from "next/link"
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-earth-900 text-earth-200 py-12 border-t border-earth-800">
      <div className="container-custom grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center">
            {/* Logo placeholder - replace with actual logo path if available */}
            <h2 className="text-2xl font-bold text-white tracking-tight">
              SAY<span className="text-primary-500">EQUIPMENT</span>
            </h2>
          </div>
          <p className="text-earth-400 text-sm leading-relaxed">
            Partner terbaik petualangan alam Anda. Menyediakan peralatan outdoor berkualitas untuk pengalaman tak terlupakan di Bojonegoro.
          </p>
        </div>
        
        {/* Navigasi */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-primary-500 transition-colors">Beranda</Link></li>
            <li><Link href="/products" className="hover:text-primary-500 transition-colors">Katalog Produk</Link></li>
            <li><Link href="/about" className="hover:text-primary-500 transition-colors">Tentang Kami</Link></li>
            <li><Link href="/cara-sewa" className="hover:text-primary-500 transition-colors">Cara Sewa</Link></li>
            <li><Link href="/faq" className="hover:text-primary-500 transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div className="md:col-span-1">
          <h3 className="text-white font-semibold mb-4 text-lg">Lokasi Shelter</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <div>
                  <strong className="text-white block">Shelter Temayang:</strong>
                  <span className="text-earth-400">Depan Pasar Temayang, Bojonegoro</span>
                </div>
                <div>
                  <strong className="text-white block">Shelter Kalitidu:</strong>
                  <span className="text-earth-400">Jl. Raya Bojonegoro-Cepu (Dekat Polsek)</span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Sosmed */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Ikuti Kami</h3>
          <div className="flex space-x-4">
            <a 
              href="https://instagram.com/say_equipments" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-earth-800 p-2 rounded-full hover:bg-primary-500 hover:text-black transition-all group"
              title="@say_equipments"
            >
              <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
          <p className="mt-4 text-xs text-earth-500">
            Dapatkan info terbaru dan promo menarik di Instagram kami!
          </p>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="container-custom mt-12 pt-8 border-t border-earth-800 text-center text-sm text-earth-500">
        &copy; {new Date().getFullYear()} SayEquipment Rental. All rights reserved.
      </div>
    </footer>
  )
}
