// import type React from "react"
// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import {
//     Edit,
//     MessageSquare,
//     CreditCard,
//     Clock,
//     User,
//     FileText,
//     X,
//     CheckCircle,
//     AlertCircle,
//     Calendar,
//     Phone,
//     Mail,
// } from "lucide-react"
// import { useParams } from "react-router-dom"
// import { getStatusBadge } from "../components/Bagdes"
// import { useSelector } from "react-redux"
// import type { RootState } from "../Store/Store"
// import { useAppDispatch } from "../hooks/hookType"
// import { getApplicationById } from "../Store/ApplicationSlice"
// import ApplicationDetailSkeleton from "../skeletons/ApplicationDetials"
// import { formatDate } from "../lib/static"

export default function ApplicationDetail() {
    // const { id } = useParams<{ id: string }>() || {}
    // const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    // const [isAnimating, setIsAnimating] = useState(false)
    // const [activeTab, setActiveTab] = useState("details")
    // const { application } = useSelector((state: RootState) => state.application)
    // const dispatch = useAppDispatch()

    // useEffect(() => {
    //     if (id && /^[0-9a-fA-F-]{36}$/.test(id)) {
    //         dispatch(getApplicationById(id))
    //     }
    // }, [dispatch, id])

    // const [updates, setUpdates] = useState([
    //     {
    //         id: "upd1",
    //         message: "Application submitted successfully",
    //         updaterBy: "system",
    //         updaterName: "System",
    //         createdAt: "2024-01-20T10:30:00Z",
    //     },
    //     {
    //         id: "upd2",
    //         message: "Payment received and verified",
    //         updaterBy: "admin1",
    //         updaterName: "Admin User",
    //         createdAt: "2024-01-20T10:35:00Z",
    //     },
    // ])

    // const handleAddUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault()
    //     setIsAnimating(true)
    //     const formData = new FormData(e.currentTarget)
    //     const message = formData.get("message") as string
    //     const newUpdate = {
    //         id: `upd${Date.now()}`,
    //         message,
    //         updaterBy: "admin",
    //         updaterName: "Admin User",
    //         createdAt: new Date().toISOString(),
    //     }

    //     setTimeout(() => {
    //         setUpdates([newUpdate, ...updates])
    //         setIsUpdateDialogOpen(false)
    //         setIsAnimating(false)
    //     }, 1000)
    // }

   

    // if (!application) {
    //     return <ApplicationDetailSkeleton />
    // }

    // const tabs = [
    //     { id: "details", label: "Details", icon: FileText },
    //     { id: "payments", label: "Payments", icon: CreditCard },
    //     { id: "updates", label: "Updates", icon: MessageSquare },
    // ]

    // return (
    //     <div className="">
    //         <div className=" mx-auto">
    //             <div className="relative bg-dark-surface-bg1  backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
    //                 {/* Header */}
    //                 <div className="p-4 ">
    //                     <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
    //                         <div>

    //                         </div>
    //                         <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3 ">
    //                             <Link
    //                                 to={`/applications/${application.id}/edit`}
    //                                 className="group inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-gray-50 rounded-full border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
    //                             >
    //                                 <Edit className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
    //                                 Edit Application
    //                             </Link>
    //                             <button
    //                                 onClick={() => setIsUpdateDialogOpen(true)}
    //                                 className="group inline-flex items-center justify-center px-4 py-2.5 text-xs font-semibold text-light-brand-primary border border-light-brand-primary rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
    //                             >
    //                                 <MessageSquare className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
    //                                 Add Update
    //                             </button>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* Status Banner */}
    //                 <div className="bg-light-brand-primary p-4 ">
    //                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
    //                         <div className="flex items-center space-x-3">
    //                             <div className="p-2 bg-blue-100 rounded-lg">
    //                                 <FileText className="h-5 w-5 text-dark-surface-bg1 animate-pulse" />
    //                             </div>
    //                             <div className="-space-y-1">
    //                                 <h2 className="text-lg font-bold text-dark-surface-bg1">{application.ServiceName}</h2>
    //                                 <p className="text-xs font-medium text-dark-surface-bg2 ">Service Application</p>
    //                             </div>
    //                         </div>
    //                         <div className="flex items-center space-x-4">
    //                             <div className="transform hover:scale-105 transition-transform duration-200">
    //                                 {getStatusBadge("ApplicationStatus", application.applicationStatus)}
    //                             </div>
    //                             <div className="text-right">
    //                                 <p className="text-xs font-bold text-slate-900">{formatDate(application.createdAt)}</p>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 {/* Navigation Tabs */}
    //                 <div className=" px-6 pt-4 border-b-2 border-light-brand-primary">
    //                     <div className="flex space-x-1 overflow-x-auto scrollbar-hide px-2">
    //                         {tabs.map((tab) => {
    //                             const Icon = tab.icon
    //                             return (
    //                                 <button
    //                                     key={tab.id}
    //                                     onClick={() => setActiveTab(tab.id)}
    //                                     className={`flex items-center px-6 py-3 text-sm font-semibold rounded-t-lg whitespace-nowrap transition-all duration-300 min-w-0 flex-shrink-0 ${activeTab === tab.id
    //                                             ? "bg-gradient-to-r from-light-brand-primary to-orange-600 text-dark-surface-bg1 shadow-lg transform scale-105 rounded-t-lg"
    //                                             : "text-dark-text-white hover:text-slate-900 hover:bg-slate-50"
    //                                         }`}
    //                                 >
    //                                     <Icon className={`h-4 w-4 mr-2 flex-shrink-0 ${activeTab === tab.id ? "animate-pulse" : ""}`} />
    //                                     <span className="truncate">{tab.label}</span>
    //                                 </button>
    //                             )
    //                         })}
    //                     </div>
    //                 </div>

    //                 {/* Tab Content */}
    //                 <div className="p-4 sm:p-6 lg:p-8">
    //                     {/* Details Tab */}
    //                     {activeTab === "details" && (
    //                         <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
    //                             {/* Application Details */}
    //                             <div className="group rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
    //                                 <div className="bg-gradient-to-r from-light-brand-primary to-orange-600 p-4 sm:p-6">
    //                                     <h3 className="flex items-center text-lg font-bold text-dark-surface-bg1">
    //                                         <div className="p-2 bg-white/20 rounded-lg mr-3 animate-pulse">
    //                                             <FileText className="h-5 w-5" />
    //                                         </div>
    //                                         Application Information
    //                                     </h3>
    //                                 </div>
    //                                 <div className="p-4 sm:p-6 space-y-6 border h-full">
    //                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
    //                                         <div className="space-y-2 group/item">
    //                                             <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
    //                                                 <FileText className="h-3 w-3 mr-1" />
    //                                                 Ticket Number
    //                                             </label>
    //                                             <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 group-hover/item:bg-slate-100 transition-colors">
    //                                                 <p className="font-bold text-lg text-slate-900 break-all font-mono">{application.ticketNo}</p>
    //                                             </div>
    //                                         </div>
    //                                         <div className="space-y-2 group/item">
    //                                             <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
    //                                                 <AlertCircle className="h-3 w-3 mr-1" />
    //                                                 Status
    //                                             </label>
    //                                             <div className="transform hover:scale-105 transition-transform duration-200">
    //                                                 {getStatusBadge("ApplicationStatus", application.applicationStatus)}
    //                                             </div>
    //                                         </div>
    //                                         <div className="space-y-2 group/item">
    //                                             <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
    //                                                 <FileText className="h-3 w-3 mr-1" />
    //                                                 Service
    //                                             </label>
    //                                             <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 group-hover/item:bg-slate-100 transition-colors">
    //                                                 <p className="font-bold text-slate-900">{application.ServiceName}</p>
    //                                             </div>
    //                                         </div>
    //                                         <div className="space-y-2 group/item">
    //                                             <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
    //                                                 <Calendar className="h-3 w-3 mr-1" />
    //                                                 Created Date
    //                                             </label>
    //                                             <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 group-hover/item:bg-slate-100 transition-colors">
    //                                                 <p className="font-bold text-slate-900">{formatDate(application.createdAt)}</p>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                     {application.autoCloseAt && (
    //                                         <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 animate-pulse-slow">
    //                                             <label className="flex items-center text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
    //                                                 <Clock className="h-3 w-3 mr-1 animate-spin-slow" />
    //                                                 Auto Close Date
    //                                             </label>
    //                                             <p className="font-bold text-amber-800 flex items-center">
    //                                                 <Clock className="mr-2 h-4 w-4" />
    //                                                 {formatDate(application.autoCloseAt)}
    //                                             </p>
    //                                         </div>
    //                                     )}
    //                                     {application.objectionReason && (
    //                                         <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
    //                                             <label className="flex items-center text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
    //                                                 <AlertCircle className="h-3 w-3 mr-1" />
    //                                                 Objection Reason
    //                                             </label>
    //                                             <p className="text-red-800 font-semibold">{application.objectionReason}</p>
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                             </div>

    //                             {/* User Details */}
    //                             <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
    //                                 <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 sm:p-6">
    //                                     <h3 className="flex items-center text-lg font-bold text-white">
    //                                         <div className="p-2 bg-white/20 rounded-lg mr-3 animate-bounce">
    //                                             <User className="h-5 w-5" />
    //                                         </div>
    //                                         User Information
    //                                     </h3>
    //                                 </div>
    //                                 <div className="p-4 sm:p-6 space-y-6">
    //                                     <div className="space-y-2 group/item">
    //                                         <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
    //                                             <User className="h-3 w-3 mr-1" />
    //                                             Full Name
    //                                         </label>
    //                                         <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 group-hover/item:bg-slate-100 transition-colors">
    //                                             <p className="font-bold text-lg text-slate-900">{application.user.fullName}</p>
    //                                         </div>
    //                                     </div>
    //                                     <div className="space-y-2 group/item">
    //                                         <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
    //                                             <Mail className="h-3 w-3 mr-1" />
    //                                             Email Address
    //                                         </label>
    //                                         <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 group-hover/item:bg-slate-100 transition-colors">
    //                                             <p className="font-semibold text-slate-900 break-all font-mono text-sm">
    //                                                 {application.user.email}
    //                                             </p>
    //                                         </div>
    //                                     </div>
    //                                     <div className="space-y-2 group/item">
    //                                         <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
    //                                             <Phone className="h-3 w-3 mr-1" />
    //                                             Phone Number
    //                                         </label>
    //                                         <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 group-hover/item:bg-slate-100 transition-colors">
    //                                             <p className="font-semibold text-slate-900 font-mono">{application.user.phone}</p>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )}

    //                     {/* Payments Tab */}
    //                     {activeTab === "payments" && (
    //                         <div className="animate-fade-in">
    //                             <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
    //                                 <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 sm:p-6">
    //                                     <h3 className="flex items-center text-lg font-bold text-white mb-2">
    //                                         <div className="p-2 bg-white/20 rounded-lg mr-3 animate-pulse">
    //                                             <CreditCard className="h-5 w-5" />
    //                                         </div>
    //                                         Payment History
    //                                     </h3>
    //                                     <p className="text-purple-100 text-sm font-medium">All payments associated with this application</p>
    //                                 </div>
    //                                 <div className="p-4 sm:p-6">
    //                                     {/* Desktop Table */}
    //                                     <div className="hidden lg:block">
    //                                         <div className="overflow-x-auto">
    //                                             <table className="min-w-full">
    //                                                 <thead>
    //                                                     <tr className="border-b-2 border-purple-200">
    //                                                         <th className="px-4 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
    //                                                             Transaction ID
    //                                                         </th>
    //                                                         <th className="px-4 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
    //                                                             Amount
    //                                                         </th>
    //                                                         <th className="px-4 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
    //                                                             Type
    //                                                         </th>
    //                                                         <th className="px-4 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
    //                                                             Method
    //                                                         </th>
    //                                                         <th className="px-4 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
    //                                                             Status
    //                                                         </th>
    //                                                         <th className="px-4 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider">
    //                                                             Date
    //                                                         </th>
    //                                                     </tr>
    //                                                 </thead>
    //                                                 <tbody className="divide-y divide-purple-100">
    //                                                     {application.payments.map((payment, index) => (
    //                                                         <tr
    //                                                             key={payment.id}
    //                                                             className="hover:bg-purple-50 transition-all duration-300 hover:scale-[1.01] animate-fade-in-up"
    //                                                             style={{ animationDelay: `${index * 100}ms` }}
    //                                                         >
    //                                                             <td className="px-4 py-4 text-sm font-bold text-slate-900 font-mono">
    //                                                                 {payment.transactionId}
    //                                                             </td>
    //                                                             <td className="px-4 py-4 text-sm font-bold text-green-600">
    //                                                                 ${payment.amount.toFixed(2)}
    //                                                             </td>
    //                                                             <td className="px-4 py-4 text-xs font-bold text-slate-700 uppercase">
    //                                                                 {payment.paymentType}
    //                                                             </td>
    //                                                             <td className="px-4 py-4 text-xs font-bold text-slate-700 uppercase">
    //                                                                 {payment.paymentMethod.replace("_", " ")}
    //                                                             </td>
    //                                                             <td className="px-4 py-4">
    //                                                                 <div className="transform hover:scale-105 transition-transform duration-200">
    //                                                                     {getStatusBadge("ApplicationStatus", application.applicationStatus)}
    //                                                                 </div>
    //                                                             </td>
    //                                                             <td className="px-4 py-4 text-xs font-bold text-slate-700">
    //                                                                 {formatDate(payment.paymentDate)}
    //                                                             </td>
    //                                                         </tr>
    //                                                     ))}
    //                                                 </tbody>
    //                                             </table>
    //                                         </div>
    //                                     </div>

    //                                     {/* Mobile/Tablet Cards */}
    //                                     <div className="block lg:hidden space-y-4">
    //                                         {application.payments.map((payment, index) => (
    //                                             <div
    //                                                 key={payment.id}
    //                                                 className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
    //                                                 style={{ animationDelay: `${index * 100}ms` }}
    //                                             >
    //                                                 <div className="flex items-start justify-between mb-4">
    //                                                     <div className="flex-1 min-w-0">
    //                                                         <h4 className="font-bold text-slate-900 truncate text-lg font-mono">
    //                                                             {payment.transactionId}
    //                                                         </h4>
    //                                                         <p className="text-sm text-purple-600 font-bold mt-1">{payment.paymentType} Payment</p>
    //                                                     </div>
    //                                                     <div className="ml-4">
    //                                                         {getStatusBadge("ApplicationStatus", application.applicationStatus)}
    //                                                     </div>
    //                                                 </div>
    //                                                 <div className="grid grid-cols-2 gap-4 text-sm">
    //                                                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-3 rounded-lg">
    //                                                         <span className="text-green-700 font-bold block text-xs uppercase tracking-wider">
    //                                                             Amount:
    //                                                         </span>
    //                                                         <p className="font-bold text-green-800 text-lg">${payment.amount.toFixed(2)}</p>
    //                                                     </div>
    //                                                     <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-3 rounded-lg">
    //                                                         <span className="text-blue-700 font-bold block text-xs uppercase tracking-wider">
    //                                                             Method:
    //                                                         </span>
    //                                                         <p className="font-bold text-blue-800">{payment.paymentMethod.replace("_", " ")}</p>
    //                                                     </div>
    //                                                     <div className="col-span-2 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 p-3 rounded-lg">
    //                                                         <span className="text-slate-700 font-bold block text-xs uppercase tracking-wider">
    //                                                             Date:
    //                                                         </span>
    //                                                         <p className="font-bold text-slate-800">{formatDate(payment.paymentDate)}</p>
    //                                                     </div>
    //                                                 </div>
    //                                             </div>
    //                                         ))}
    //                                     </div>

    //                                     {application.payments.length === 0 && (
    //                                         <div className="text-center py-12">
    //                                             <div className="w-24 h-24 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
    //                                                 <CreditCard className="h-12 w-12 text-purple-400 animate-pulse" />
    //                                             </div>
    //                                             <p className="text-slate-500 font-semibold">No payments found for this application.</p>
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )}

    //                     {/* Updates Tab */}
    //                     {activeTab === "updates" && (
    //                         <div className="animate-fade-in">
    //                             <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
    //                                 <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 sm:p-6">
    //                                     <h3 className="flex items-center text-lg font-bold text-white mb-2">
    //                                         <div className="p-2 bg-white/20 rounded-lg mr-3 animate-bounce">
    //                                             <MessageSquare className="h-5 w-5" />
    //                                         </div>
    //                                         Application Updates
    //                                     </h3>
    //                                     <p className="text-indigo-100 text-sm font-medium">
    //                                         Timeline of all updates and changes to this application
    //                                     </p>
    //                                 </div>
    //                                 <div className="p-4 sm:p-6">
    //                                     {updates.length > 0 ? (
    //                                         <div className="space-y-6">
    //                                             {updates.map((update, index) => (
    //                                                 <div
    //                                                     key={update.id}
    //                                                     className="flex space-x-4 animate-fade-in-up"
    //                                                     style={{ animationDelay: `${index * 200}ms` }}
    //                                                 >
    //                                                     <div className="flex flex-col items-center">
    //                                                         <div className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex-shrink-0 mt-2 animate-pulse"></div>
    //                                                         {index < updates.length - 1 && (
    //                                                             <div className="h-12 w-px bg-gradient-to-b from-indigo-300 to-transparent mt-2"></div>
    //                                                         )}
    //                                                     </div>
    //                                                     <div className="flex-1 min-w-0 pb-6">
    //                                                         <div className="bg-white border border-indigo-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
    //                                                             <p className="text-sm font-bold leading-relaxed text-slate-900 mb-3">
    //                                                                 {update.message}
    //                                                             </p>
    //                                                             <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-indigo-600 font-bold">
    //                                                                 <div className="flex items-center">
    //                                                                     <User className="h-3 w-3 mr-1" />
    //                                                                     <span>by {update.updaterName}</span>
    //                                                                 </div>
    //                                                                 <div className="flex items-center mt-1 sm:mt-0">
    //                                                                     <Clock className="h-3 w-3 mr-1" />
    //                                                                     <span>{formatDate(update.createdAt)}</span>
    //                                                                 </div>
    //                                                             </div>
    //                                                         </div>
    //                                                     </div>
    //                                                 </div>
    //                                             ))}
    //                                         </div>
    //                                     ) : (
    //                                         <div className="text-center py-12">
    //                                             <div className="w-24 h-24 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
    //                                                 <MessageSquare className="h-12 w-12 text-indigo-400 animate-pulse" />
    //                                             </div>
    //                                             <p className="text-slate-500 font-semibold">No updates available for this application.</p>
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )}
    //                 </div>

    //                 {/* Add Update Modal */}
    //                 {isUpdateDialogOpen && (
    //                     <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
    //                         <div
    //                             className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
    //                             onClick={() => setIsUpdateDialogOpen(false)}
    //                         />
    //                         <div className="flex min-h-screen items-center justify-center p-4">
    //                             <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 transform transition-all animate-scale-in border border-gray-200">
    //                                 <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-t-2xl">
    //                                     <div className="flex items-center justify-between">
    //                                         <h3 className="text-xl font-bold text-white">Add Application Update</h3>
    //                                         <button
    //                                             onClick={() => setIsUpdateDialogOpen(false)}
    //                                             className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
    //                                         >
    //                                             <X className="h-5 w-5" />
    //                                         </button>
    //                                     </div>
    //                                 </div>
    //                                 <div className="p-6">
    //                                     <form onSubmit={handleAddUpdate} className="space-y-6">
    //                                         <div>
    //                                             <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-3">
    //                                                 Update Message
    //                                             </label>
    //                                             <textarea
    //                                                 id="message"
    //                                                 name="message"
    //                                                 placeholder="Enter update message..."
    //                                                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-h-[120px] resize-none text-sm bg-slate-50 hover:bg-white"
    //                                                 required
    //                                             />
    //                                         </div>
    //                                         <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
    //                                             <button
    //                                                 type="button"
    //                                                 onClick={() => setIsUpdateDialogOpen(false)}
    //                                                 className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
    //                                             >
    //                                                 Cancel
    //                                             </button>
    //                                             <button
    //                                                 type="submit"
    //                                                 disabled={isAnimating}
    //                                                 className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    //                                             >
    //                                                 {isAnimating ? (
    //                                                     <>
    //                                                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
    //                                                         Adding...
    //                                                     </>
    //                                                 ) : (
    //                                                     <>
    //                                                         <CheckCircle className="h-4 w-4 mr-2" />
    //                                                         Add Update
    //                                                     </>
    //                                                 )}
    //                                             </button>
    //                                         </div>
    //                                     </form>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 )}
    //             </div>
    //         </div>

    //         <style>{`
    //     @keyframes float {
    //       0%, 100% { transform: translateY(0px) rotate(0deg); }
    //       50% { transform: translateY(-20px) rotate(180deg); }
    //     }
    //     @keyframes float-delayed {
    //       0%, 100% { transform: translateY(0px) rotate(0deg); }
    //       50% { transform: translateY(-30px) rotate(-180deg); }
    //     }
    //     @keyframes fade-in {
    //       from { opacity: 0; }
    //       to { opacity: 1; }
    //     }
    //     @keyframes fade-in-up {
    //       from { opacity: 0; transform: translateY(20px); }
    //       to { opacity: 1; transform: translateY(0); }
    //     }
    //     @keyframes scale-in {
    //       from { opacity: 0; transform: scale(0.9); }
    //       to { opacity: 1; transform: scale(1); }
    //     }
    //     @keyframes spin-slow {
    //       from { transform: rotate(0deg); }
    //       to { transform: rotate(360deg); }
    //     }
    //     @keyframes pulse-slow {
    //       0%, 100% { opacity: 0.1; }
    //       50% { opacity: 0.3; }
    //     }
    //     .animate-float { animation: float 6s ease-in-out infinite; }
    //     .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
    //     .animate-fade-in { animation: fade-in 0.5s ease-out; }
    //     .animate-fade-in-up { animation: fade-in-up 0.6s ease-out both; }
    //     .animate-scale-in { animation: scale-in 0.3s ease-out; }
    //     .animate-spin-slow { animation: spin-slow 3s linear infinite; }
    //     .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
    //     .scrollbar-hide {
    //       -ms-overflow-style: none;
    //       scrollbar-width: none;
    //     }
    //     .scrollbar-hide::-webkit-scrollbar {
    //       display: none;
    //     }
    //   `}</style>
    //     </div>
    // )

    return (
        <>  
        </>
    )
}
