import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/hookType"
import {
  fetchUserSummary,
  fetchMonthlyUsers,
  fetchRecentUserActivity,
  fetchAppStatus,
  fetchAppService,
  fetchAppTrend,
  fetchPaymentSummary,
  fetchPaymentType,
  fetchCertificateStats,
  fetchQueryStats,
} from "../Store/DashboardSlice"
import StatsGrid from "../components/Dashboard/stats-grid"
import PaymentChart from "../components/Dashboard/payment-chart"
import ServiceChart from "../components/Dashboard/service-chart"
import StatusBreakdown from "../components/Dashboard/status-breakdown"
import UserActivityCard from "../components/Dashboard/user-activity"
import PaymentTrendChart from "../components/Dashboard/payment-trend"
import UserGrowthChart from "../components/Dashboard/user-growth"
import UserSummary from "../components/Dashboard/user-summary"

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const {
    userSummary,
    monthlyUsers,
    userActivity,
    appStatus,
    appService,
    appTrend,
    paymentSummary,
    paymentType,
    certStats,
    queryStats,
    loading,
    error,
  } = useAppSelector((state) => state.dashboard)

  console.log(userSummary);
  

  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([
          dispatch(fetchUserSummary()).unwrap(),
          dispatch(fetchMonthlyUsers()).unwrap(),
          dispatch(fetchRecentUserActivity()).unwrap(),
          dispatch(fetchAppStatus()).unwrap(),
          dispatch(fetchAppService()).unwrap(),
          dispatch(fetchAppTrend()).unwrap(),
          dispatch(fetchPaymentSummary()).unwrap(),
          dispatch(fetchPaymentType()).unwrap(),
          dispatch(fetchCertificateStats()).unwrap(),
          dispatch(fetchQueryStats()).unwrap(),
        ])
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      }
    }

    loadAll()
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full border-4 border-border border-t-primary animate-spin mx-auto"></div>
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-warn text-lg">Error loading dashboard</p>
          <p className="text-foreground/60">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <StatsGrid
          paymentSummary={paymentSummary}
          certStats={certStats}
          queryStats={queryStats}
          appStatus={appStatus}
        />


        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentTrendChart appTrend={appTrend} />
          <UserGrowthChart monthlyUsers={monthlyUsers} />
        </div>
        
        <UserSummary />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ServiceChart appService={appService} />
          </div>
          <div className="lg:col-span-1">
            <StatusBreakdown appStatus={appStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentChart paymentType={paymentType} />
          <UserActivityCard userActivity={userActivity} />
        </div>
      </div>
    </main>
  )
}
