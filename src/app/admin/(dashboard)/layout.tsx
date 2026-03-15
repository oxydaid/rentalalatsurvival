import { getCurrentUser } from "@/app/actions/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar currentUser={currentUser} />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
