"use client"

import { useEffect, useState } from "react"

interface StatsGridProps {
  paymentSummary: any
  certStats: any
  queryStats: any
  appStatus: any
}

const StatCard = ({ label, value, icon, color, delay }: any) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`transform transition-all duration-500 ${isVisible ? "scale-in" : "opacity-0 scale-95"}`}>
      <div className="bg-card rounded-xl p-6 border border-border card-shadow hover:border-primary/30 smooth-transition">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-foreground/70 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StatsGrid({ paymentSummary, certStats, 
  // queryStats,
   appStatus }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <StatCard label="Total Payments" value={paymentSummary?.totalPayments || 0} icon="💳" color="#3c84d2" delay={0} />
      <StatCard
        label="Total Revenue"
        value={`₹${paymentSummary?.totalRevenue || 0}`}
        icon="💰"
        color="#eab308"
        delay={100}
      />
      <StatCard
        label="Pending Cases"
        value={(certStats?.PENDING || 0) + (appStatus?.PENDING || 0) + (appStatus?.AWAITING_ACTION || 0)}
        icon="⏳"
        color="#f83939"
        delay={200}
      />
      <StatCard
        label="Completed"
        value={(certStats?.APPROVED || 0) + (appStatus?.COMPLETED || 0)}
        icon="✓"
        color="#10b981"
        delay={300}
      />
    </div>
  )
}
