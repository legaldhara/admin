"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const PAYMENT_COLORS = {
  SUCCESS: "#10b981",
  FAILED: "#f83939",
  PENDING: "#eab308",
  EXPIRED: "#7f8084",
}

export default function PaymentChart({ paymentSummary }: any) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!paymentSummary?.statusBreakdown) return null

  const data = Object.entries(paymentSummary.statusBreakdown).map(([key, value]: any) => ({
    name: key,
    value: value,
  }))

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className={`fade-in transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-card rounded-xl p-6 border border-border card-shadow">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Payment Status</h3>
          <p className="text-sm text-foreground/60">Transaction breakdown: {total} total</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PAYMENT_COLORS[entry.name as keyof typeof PAYMENT_COLORS] || "#3c84d2"}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
