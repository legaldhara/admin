"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = ["#3c84d2", "#eab308", "#f83939", "#10b981", "#7f8084"]

export default function StatusBreakdown({ appStatus }: any) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!appStatus) return null

  const data = [
    { name: "Completed", value: appStatus.COMPLETED || 0 },
    { name: "Awaiting Action", value: appStatus.AWAITING_ACTION || 0 },
    { name: "Payment Required", value: appStatus.PAYMENT_REQUIRED || 0 },
    { name: "Data Required", value: appStatus.DATA_REQUIRED || 0 },
    { name: "Payment Done", value: appStatus.PAYMENT_DONE || 0 },
  ]

  // const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className={`fade-in transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-card rounded-xl p-6 border border-border card-shadow h-full flex flex-col">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Case Status</h3>
          <p className="text-sm text-foreground/60">Current breakdown</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-foreground/70">{item.name}</span>
              </div>
              <span className="font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
