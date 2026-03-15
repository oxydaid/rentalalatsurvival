"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  LogOut, 
  HelpCircle, 
  FileText, 
  ListOrdered, 
  CalendarCheck, 
  Settings, 
  UserCircle,
  Menu,
  X,
  History,
  DollarSign
} from "lucide-react"
import { logout } from "@/app/actions/auth"

interface AdminSidebarProps {
  currentUser: string
}

export function AdminSidebar({ currentUser }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Helper to check if link is active
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  const closeSidebar = () => setIsOpen(false)

  const NavLink = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => (
    <Link 
      href={href} 
      onClick={closeSidebar}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive(href) 
          ? "bg-earth-800 text-white" 
          : "bg-earth-800/50 text-earth-200 hover:bg-earth-800 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  )

  return (
    <>
      {/* Mobile Header / Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-earth-900 text-white z-40 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">SayEquipment Admin</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 hover:bg-earth-800 rounded-md transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-earth-900 text-white overflow-y-auto transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:shadow-none
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center md:block">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <button onClick={closeSidebar} className="md:hidden text-earth-300 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-earth-300 text-sm bg-earth-800/30 p-2 rounded-lg">
            <UserCircle className="w-8 h-8" />
            <div className="overflow-hidden">
              <p className="text-xs text-earth-400">Login sebagai</p>
              <p className="font-medium truncate" title={currentUser}>{currentUser}</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2 pb-6">
          <NavLink href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavLink href="/admin/products" icon={Package} label="Produk" />
          <NavLink href="/admin/bookings" icon={CalendarCheck} label="Bookings" />
          <NavLink href="/admin/history" icon={History} label="Riwayat Pesanan" />
          <NavLink href="/admin/expenses" icon={DollarSign} label="Pengeluaran" />

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-earth-400 uppercase tracking-wider">
            Konten Website
          </div>

          <NavLink href="/admin/faq" icon={HelpCircle} label="FAQ" />
          <NavLink href="/admin/terms" icon={FileText} label="Ketentuan Sewa" />
          <NavLink href="/admin/steps" icon={ListOrdered} label="Langkah Booking" />
          <NavLink href="/admin/testimonials" icon={Users} label="Testimoni" />

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-earth-400 uppercase tracking-wider">
            Konfigurasi
          </div>

          <NavLink href="/admin/admins" icon={Users} label="Kelola Admin" />
          <NavLink href="/admin/settings" icon={Settings} label="Pengaturan" />
          
          <form action={logout} className="mt-8 pt-8 border-t border-earth-700">
            <button className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-earth-800 hover:text-red-300 w-full rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </form>
        </nav>
      </aside>
    </>
  )
}
