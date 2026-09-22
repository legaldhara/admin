"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ServiceChart({ appService }: any) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!appService || appService.length === 0) return null

  const data = appService.slice(0, 8).map((item: any) => ({
    name: item.serviceName.substring(0, 15) + (item.serviceName.length > 15 ? "..." : ""),
    count: item.count,
    fullName: item.serviceName,
  }))

  return (
    <div className={`fade-in transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-card rounded-xl p-6 border border-border card-shadow">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Service Distribution</h3>
          <p className="text-sm text-foreground/60">Usage by service type</p>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" stroke="var(--color-foreground)" opacity={0.6} />
            <YAxis dataKey="name" type="category" stroke="var(--color-foreground)" opacity={0.6} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-foreground)" }}
            />
            <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
