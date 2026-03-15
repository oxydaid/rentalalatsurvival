"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  className?: string
  label?: string
  href?: string
}

export function BackButton({ className = "", label = "Kembali", href }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-earth-200 text-earth-700 hover:text-primary-700 hover:bg-white hover:border-primary-500 transition-all duration-300 font-medium mb-6 group shadow-sm hover:shadow-md ${className}`}
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span>{label}</span>
    </button>
  )
}
