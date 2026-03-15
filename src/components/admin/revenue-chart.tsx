"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

interface RevenueChartProps {
  data: {
    month: string
    revenue: number
    expense: number
  }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Prevent hydration mismatch and resize loops by only rendering on client
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[350px] w-full bg-gray-50 rounded-lg animate-pulse" />
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            formatter={(value: any) => [formatCurrency(Number(value) || 0), ""]}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Bar 
            name="Pendapatan" 
            dataKey="revenue" 
            fill="#16a34a" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
          <Bar 
            name="Pengeluaran" 
            dataKey="expense" 
            fill="#dc2626" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
