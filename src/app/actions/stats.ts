'use server'

import { prisma } from '@/lib/prisma'

export interface DashboardStats {
  revenue: {
    total: number
    thisMonth: number
  }
  expenses: {
    total: number
    thisMonth: number
  }
  netProfit: number
  chartData: {
    month: string
    revenue: number
    expense: number
  }[]
  bookings: {
    total: number
    thisMonth: number
    active: number
    recent: any[]
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // 1. Total Revenue (Confirmed/Completed)
    const totalRevenueResult = await prisma.$queryRaw<any[]>`
      SELECT SUM(totalPrice) as total 
      FROM booking 
      WHERE status IN ('COMPLETED', 'FINISHED')
    `
    const totalRevenue = Number(totalRevenueResult[0]?.total || 0)

    // 2. This Month Revenue
    const thisMonthRevenueResult = await prisma.$queryRaw<any[]>`
      SELECT SUM(totalPrice) as total 
      FROM booking 
      WHERE status IN ('COMPLETED', 'FINISHED')
      AND MONTH(createdAt) = MONTH(CURRENT_DATE())
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
    `
    const thisMonthRevenue = Number(thisMonthRevenueResult[0]?.total || 0)

    // 3. Monthly Stats (Revenue & Expenses) - Last 6 Months
    const monthlyRevenueResult = await prisma.$queryRaw<any[]>`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month, 
        SUM(totalPrice) as amount 
      FROM booking 
      WHERE status IN ('COMPLETED', 'FINISHED')
      GROUP BY month 
      ORDER BY month DESC 
      LIMIT 6
    `
    
    // 4. Expenses
    let totalExpenses = 0
    let thisMonthExpenses = 0
    let monthlyExpenses: { month: string, amount: number }[] = []

    try {
      const totalExpenseResult = await prisma.$queryRaw<any[]>`SELECT SUM(amount) as total FROM expense`
      totalExpenses = Number(totalExpenseResult[0]?.total || 0)

      const thisMonthExpenseResult = await prisma.$queryRaw<any[]>`
        SELECT SUM(amount) as total 
        FROM expense 
        WHERE MONTH(date) = MONTH(CURRENT_DATE())
        AND YEAR(date) = YEAR(CURRENT_DATE())
      `
      thisMonthExpenses = Number(thisMonthExpenseResult[0]?.total || 0)

      const monthlyExpenseResult = await prisma.$queryRaw<any[]>`
        SELECT 
          DATE_FORMAT(date, '%Y-%m') as month, 
          SUM(amount) as amount 
        FROM expense 
        GROUP BY month 
        ORDER BY month DESC 
        LIMIT 6
      `
      monthlyExpenses = (monthlyExpenseResult || []).map((row: any) => ({
        month: row.month,
        amount: Number(row.amount)
      }))

    } catch (e) {
      console.warn("Failed to fetch expenses for stats (table might not exist yet):", e)
    }

    // Combine Revenue and Expenses into Chart Data
    // Create a map of all unique months from both results
    const allMonths = new Set([
      ...monthlyRevenueResult.map((r: any) => r.month),
      ...monthlyExpenses.map((e) => e.month)
    ])
    
    // Sort months (oldest first for chart)
    const sortedMonths = Array.from(allMonths).sort()
    // Take last 6 months if there are gaps
    const last6Months = sortedMonths.slice(-6)

    const chartData = last6Months.map(month => {
      const revenueItem = monthlyRevenueResult.find((r: any) => r.month === month)
      const expenseItem = monthlyExpenses.find(e => e.month === month)
      
      return {
        month,
        revenue: Number(revenueItem?.amount || 0),
        expense: Number(expenseItem?.amount || 0)
      }
    })

    // 5. Booking Stats
    const totalBookingsResult = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count FROM booking
    `
    const totalBookings = Number(totalBookingsResult[0]?.count || 0)

    const thisMonthBookingsResult = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count 
      FROM booking 
      WHERE MONTH(createdAt) = MONTH(CURRENT_DATE())
      AND YEAR(createdAt) = YEAR(CURRENT_DATE())
    `
    const thisMonthBookings = Number(thisMonthBookingsResult[0]?.count || 0)

    // Active Bookings (Today)
    const activeBookingsResult = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count 
      FROM booking 
      WHERE status IN ('CONFIRMED', 'TAKEN')
      AND startDate <= CURRENT_DATE() 
      AND endDate >= CURRENT_DATE()
    `
    const activeBookings = Number(activeBookingsResult[0]?.count || 0)

    // 6. Recent Bookings
    const recentBookings = await prisma.$queryRaw<any[]>`
      SELECT * FROM booking 
      ORDER BY createdAt DESC 
      LIMIT 5
    `

    return {
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonthRevenue
      },
      expenses: {
        total: totalExpenses,
        thisMonth: thisMonthExpenses
      },
      netProfit: totalRevenue - totalExpenses,
      chartData,
      bookings: {
        total: totalBookings,
        thisMonth: thisMonthBookings,
        active: activeBookings,
        recent: recentBookings
      }
    }
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return {
      revenue: { total: 0, thisMonth: 0 },
      expenses: { total: 0, thisMonth: 0 },
      netProfit: 0,
      chartData: [],
      bookings: { total: 0, thisMonth: 0, active: 0, recent: [] }
    }
  }
}