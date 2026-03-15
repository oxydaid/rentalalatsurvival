"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getExpenses() {
  try {
    return await prisma.expense.findMany({
      orderBy: { date: 'desc' }
    })
  } catch (error) {
    console.error("Failed to fetch expenses:", error)
    try {
      return await prisma.$queryRaw<any[]>`SELECT * FROM expense ORDER BY date DESC`
    } catch (e) {
      console.error("Raw query for expense failed:", e)
      return []
    }
  }
}

export async function addExpense(prevState: any, formData: FormData) {
  try {
    const description = formData.get("description") as string
    const amountStr = formData.get("amount")
    const dateStr = formData.get("date") as string

    if (!description || !amountStr || !dateStr) {
      return { success: false, error: "Mohon lengkapi semua data" }
    }

    const amount = Number(amountStr)
    if (isNaN(amount)) {
      return { success: false, error: "Nominal harus berupa angka" }
    }
    
    const date = new Date(dateStr)

    await prisma.expense.create({
      data: {
        description,
        amount,
        date
      }
    })

    revalidatePath("/admin/expenses")
    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Failed to add expense:", error)
    return { success: false, error: "Gagal menyimpan pengeluaran" }
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({
      where: { id }
    })
    
    revalidatePath("/admin/expenses")
    revalidatePath("/admin/dashboard")
  } catch (error) {
    console.error("Failed to delete expense:", error)
    // Try raw query
    try {
      await prisma.$executeRaw`DELETE FROM expense WHERE id = ${id}`
      revalidatePath("/admin/expenses")
      revalidatePath("/admin/dashboard")
    } catch (e) {
      throw new Error("Failed to delete expense")
    }
  }
}
