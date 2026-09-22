"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function UserGrowthChart({ monthlyUsers }: any) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!monthlyUsers || monthlyUsers.length === 0) return null

  const data = monthlyUsers.map((item: any) => ({
    month: new Date(item.month).toLocaleDateString("en-US", { month: "short" }),
    users: item.count,
  }))

  return (
    <div className={`fade-in transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-card rounded-xl p-6 border border-border card-shadow">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">User Growth</h3>
          <p className="text-sm text-foreground/60">New signups per month</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            <Bar dataKey="users" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
