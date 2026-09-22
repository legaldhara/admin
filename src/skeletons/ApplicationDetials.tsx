
import type React from "react"

const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
  ></div>
)

const SkeletonText = ({
  width = "w-full",
  height = "h-4",
  className = "",
}: { width?: string; height?: string; className?: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded ${width} ${height} ${className}`}
  ></div>
)

const SkeletonCard = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div
    className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden ${className}`}
  >
    {children}
  </div>
)

export default function ApplicationDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Header Skeleton */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
              <SkeletonText width="w-32" height="h-10" className="rounded-full" />
              <div className="space-y-2">
                <SkeletonText width="w-48" height="h-8" />
                <SkeletonText width="w-32" height="h-4" />
              </div>
            </div>
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
              <SkeletonText width="w-36" height="h-10" className="rounded-full" />
              <SkeletonText width="w-28" height="h-10" className="rounded-full" />
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Application Details Skeleton */}
            <SkeletonCard>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
                <div className="flex items-center">
                  <SkeletonPulse className="w-10 h-10 rounded-lg mr-3 bg-white/20" />
                  <SkeletonText width="w-40" height="h-6" className="bg-white/30" />
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <SkeletonText width="w-24" height="h-3" />
                      <SkeletonText width="w-full" height="h-8" className="rounded-lg" />
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <SkeletonText width="w-32" height="h-4" className="mb-2" />
                  <SkeletonText width="w-48" height="h-6" />
                </div>
              </div>
            </SkeletonCard>

            {/* User Details Skeleton */}
            <SkeletonCard>
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 sm:p-6">
                <div className="flex items-center">
                  <SkeletonPulse className="w-10 h-10 rounded-lg mr-3 bg-white/20" />
                  <SkeletonText width="w-36" height="h-6" className="bg-white/30" />
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <SkeletonText width="w-20" height="h-3" />
                    <SkeletonText width="w-full" height="h-8" className="rounded-lg" />
                  </div>
                ))}
              </div>
            </SkeletonCard>
          </div>

          {/* Payment History Skeleton */}
          <SkeletonCard>
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6">
              <div className="flex items-center mb-2">
                <SkeletonPulse className="w-10 h-10 rounded-lg mr-3 bg-white/20" />
                <SkeletonText width="w-40" height="h-6" className="bg-white/30" />
              </div>
              <SkeletonText width="w-64" height="h-4" className="bg-white/20" />
            </div>
            <div className="p-4 sm:p-6">
              {/* Desktop Table Skeleton */}
              <div className="hidden lg:block">
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 gap-4 pb-4 border-b border-purple-200">
                    {[...Array(6)].map((_, i) => (
                      <SkeletonText key={i} width="w-full" height="h-4" />
                    ))}
                  </div>
                  {/* Table Rows */}
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="grid grid-cols-6 gap-4 py-4">
                      {[...Array(6)].map((_, j) => (
                        <SkeletonText key={j} width="w-full" height="h-5" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cards Skeleton */}
              <div className="block lg:hidden space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 space-y-2">
                        <SkeletonText width="w-32" height="h-5" />
                        <SkeletonText width="w-24" height="h-4" />
                      </div>
                      <SkeletonText width="w-16" height="h-6" className="rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="bg-gray-50 p-3 rounded-lg">
                          <SkeletonText width="w-16" height="h-3" className="mb-1" />
                          <SkeletonText width="w-20" height="h-5" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SkeletonCard>

          {/* Updates Timeline Skeleton */}
          <SkeletonCard>
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 sm:p-6">
              <div className="flex items-center mb-2">
                <SkeletonPulse className="w-10 h-10 rounded-lg mr-3 bg-white/20" />
                <SkeletonText width="w-44" height="h-6" className="bg-white/30" />
              </div>
              <SkeletonText width="w-72" height="h-4" className="bg-white/20" />
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <SkeletonPulse className="h-3 w-3 rounded-full" />
                      {i < 3 && <div className="h-12 w-px bg-gray-200 mt-2"></div>}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="bg-white border border-indigo-200 rounded-xl p-4 shadow-sm">
                        <SkeletonText width="w-full" height="h-4" className="mb-3" />
                        <SkeletonText width="w-3/4" height="h-4" className="mb-3" />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                          <SkeletonText width="w-24" height="h-3" />
                          <SkeletonText width="w-32" height="h-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SkeletonCard>
        </div>
      </div>

      <style >{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
