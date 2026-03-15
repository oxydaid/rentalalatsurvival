"use client"

import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  categories: string[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialSearch = searchParams.get("search") || ""
  const initialCategory = searchParams.get("category") || ""

  const [search, setSearch] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  
  // Debounce search to avoid too many URL updates
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    }

    if (selectedCategory) {
      params.set("category", selectedCategory)
    }

    const newQuery = params.toString()
    const currentQuery = searchParams.toString()

    if (newQuery !== currentQuery) {
      router.push(`/products?${newQuery}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory])

  return (
    <div className="space-y-6 mb-8">
      {/* Search Bar */}
      <div className="relative max-w-md w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Cari peralatan camping..."
          className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
            selectedCategory === "" 
              ? "bg-primary-500 text-black border-primary-500 font-bold shadow-sm" 
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          )}
        >
          Semua
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === selectedCategory ? "" : category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border capitalize",
              selectedCategory === category 
                ? "bg-primary-500 text-black border-primary-500 font-bold shadow-sm" 
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
