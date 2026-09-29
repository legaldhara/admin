"use client"

import { Mail, Phone, Calendar, MapPin, CheckCircle2, Clock, UserCheck } from "lucide-react"

interface User {
  id?: string
  fullName: string
  email: string
  phone: string
  gender?: "Male" | "Female" | "Other"
  dob?: string
  role?: string
  kycVerified?: boolean
  city?: string
  lastLogin?: string
  avatar?: string
  color?: string
}

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="group">
      <div
        className={`   transition-all duration-500 border border-border
        }`}
       
      >
        {/* Animated background */}

        {/* Content */}
        <div className=" flex flex-col p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${
                user.color || "bg-foreground"
              } flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-bold text-sm sm:text-base">
                {user.avatar || user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            {user.kycVerified && (
              <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg px-2 py-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">KYC</span>
              </div>
            )}
          </div>

          {/* Name and role */}
          <div className="mb-2">
            <h3 className=" font-bold text-base sm:text-lg truncate leading-tight">
              {user.fullName}
            </h3>
            {user.role && (
              <div className="flex items-center gap-2 mt-1">
                <UserCheck className="w-3.5 h-3.5 " />
                <span className="text-xs font-semibold ">{user.role}</span>
              </div>
            )}
          </div>


          {/* Info */}
          <div className="space-y-3 flex-grow mt-2 border-t border-slate-700/50 pt-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1 ">
                <p className="text-xs text-slate-500  font-medium">Email</p>
                <p className="text-sm text-foreground lowercase truncate break-all">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 font-medium">Phone</p>
                <p className="text-sm lowercase text-foreground truncate">{user.phone}</p>
              </div>
            </div>

            {/* Gender */}
            {user.gender && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-pink-400/30 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-pink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 font-medium">Gender</p>
                  <p className="text-sm text-slate-200">{user.gender}</p>
                </div>
              </div>
            )}

            {/* DOB */}
            {user.dob && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400 font-medium">DOB</p>
                  <p className="text-sm text-slate-500 truncate">{new Date(user.dob).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {/* City */}
            {user.city && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-400 font-medium">City</p>
                  <p className="text-sm text-slate-200 truncate">{user.city}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {user.lastLogin && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium">Last Login</p>
                  <p className="text-xs text-slate-400/60 truncate">{new Date(user.lastLogin).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Button */}
          {/* <button
            className={`w-full mt-4 py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 border border-slate-600/50 ${
              isHovered
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400/50 shadow-lg"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
            }`}
          >
            View Profile
          </button> */}
        </div>
      </div>
    </div>
  )
}
