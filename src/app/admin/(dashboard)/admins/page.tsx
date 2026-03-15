import { prisma } from "@/lib/prisma"
import { AdminListClient } from "./admin-list-client"

export const dynamic = "force-dynamic";

export default async function AdminsPage() {
  // Use raw query to get name as well
  const admins = await prisma.$queryRaw<any[]>`SELECT * FROM admin ORDER BY username ASC`

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Admin</h1>
      </div>

      <AdminListClient admins={admins} />
    </div>
  )
}
