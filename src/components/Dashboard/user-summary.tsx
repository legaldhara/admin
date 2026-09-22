"use client"

import { useEffect } from "react"

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { motion } from "framer-motion"
import { Users, UserCheck, UserPlus, Activity } from "lucide-react"
import { fetchUserSummary } from "../../Store/DashboardSlice"
import { AppDispatch, RootState } from "../../Store/Store"
import { useDispatch, useSelector } from "react-redux"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

const StatCard = ({
  label,
  value,
  percent,
  icon,
  color,
  delay,
}: {
  label: string
  value: number
  percent?: number
  icon: any
  color: string
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay / 1000, duration: 0.4 }}
    className="bg-card rounded-xl p-6 border border-border card-shadow hover:border-primary/30"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-foreground/70 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        {percent !== undefined && (
          <p
            className={`text-sm mt-1 font-semibold ${
              percent >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {percent >= 0 ? "↑" : "↓"} {Math.abs(percent).toFixed(1)}%
          </p>
        )}
      </div>
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
)

export default function UserSummary() {
  const dispatch = useDispatch<AppDispatch>()
  const { userSummary, loading } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchUserSummary())
  }, [dispatch])

  const data = [
    { name: "Admins", value: userSummary?.totalAdmins || 0 },
    { name: "Coadmins", value: userSummary?.totalCoadmins || 0 },
    { name: "Active", value: userSummary?.activeUsers || 0 },
    { name: "Other Users", value: (userSummary?.totalUsers || 0) - (userSummary?.activeUsers || 0) },
  ]

  if (loading) return <p className="text-center text-gray-500">Loading user stats...</p>

  return (
    <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2  gap-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <StatCard
          label="Total Users"
          value={userSummary?.totalUsers || 0}
          color="#3b82f6"
          icon={<Users />}
          delay={0}
        />
        <StatCard
          label="Admins"
          value={userSummary?.totalAdmins || 0}
          color="#10b981"
          icon={<UserCheck />}
          delay={100}
        />
        <StatCard
          label="New This Month"
          value={userSummary?.newThisMonth || 0}
          percent={userSummary?.percent?.monthly}
          color="#f59e0b"
          icon={<UserPlus />}
          delay={200}
        />
        <StatCard
          label="Active Users"
          value={userSummary?.activeUsers || 0}
          percent={userSummary?.percent?.daily}
          color="#ef4444"
          icon={<Activity />}
          delay={300}
        />
      </div>

      {/* ✅ Pie Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">User Role & Activity Distribution</h3>
        <PieChart width={350} height={300}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  )
}
