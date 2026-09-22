
import { useEffect, useState } from "react"

interface User {
  fullName: string
  email: string
  phone?: string
  createdAt?: string
  lastLogin?: string
}

interface ActivityData {
  recentLogins: User[]
  recentSignups: User[]
}

export default function UserActivityCard({ userActivity }: { userActivity: ActivityData | null }) {
  const [activeTab, setActiveTab] = useState<"signups" | "logins">("signups")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const users = activeTab === "signups" ? userActivity?.recentSignups : userActivity?.recentLogins
  const isEmpty = !users || users.length === 0

  return (
    <div className={`fade-in transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="bg-card rounded-xl p-6 border border-border card-shadow">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">User Activity</h3>
          <p className="text-sm text-foreground/60">Recent account activities</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-muted/20 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("signups")}
            className={`px-4 py-2 rounded-md text-sm font-medium smooth-transition ${
              activeTab === "signups" ? "bg-primary text-white" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Recent Signups ({userActivity?.recentSignups?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("logins")}
            className={`px-4 py-2 rounded-md text-sm font-medium smooth-transition ${
              activeTab === "logins" ? "bg-primary text-white" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Recent Logins ({userActivity?.recentLogins?.length || 0})
          </button>
        </div>

        {/* User List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isEmpty ? (
            <div className="text-center py-8">
              <p className="text-foreground/50 text-sm">No {activeTab} yet</p>
            </div>
          ) : (
            users.slice(0, 8).map((user, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/50 hover:border-primary/30 smooth-transition group"
                style={{
                  animation: `slideUp ${0.3 + idx * 0.05}s ease-out`,
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                      <p className="text-xs text-foreground/60">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-foreground/60">{user.phone}</p>
                  {activeTab === "signups" && user.createdAt && (
                    <p className="text-xs text-primary font-medium mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
