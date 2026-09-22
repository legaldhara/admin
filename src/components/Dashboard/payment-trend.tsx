"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function PaymentTrendChart({ appTrend }: any) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!appTrend?.labels || !appTrend?.values) return null

  const data = appTrend.labels.map((label: string, idx: number) => ({
    month: label.substring(0, 3),
    value: appTrend.values[idx],
  }))

  return (
    <div className={`fade-in transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-card rounded-xl p-6 border border-border card-shadow">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Payment Trend</h3>
          <p className="text-sm text-foreground/60">Monthly payment activity</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-foreground)" opacity={0.6} />
            <YAxis stroke="var(--color-foreground)" opacity={0.6} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: "var(--color-primary)", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
