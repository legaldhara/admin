"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown, FileText, Clock, Zap, AlertCircle, Plus } from "lucide-react"
import { useState } from "react"
import ActionButton from "./UI/Button"

interface ApplicationDetailsPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedApplication: any
  onSubmitUpdate: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  uploadedFiles: any[]
  onFilesSelected: (files: FileList | null) => void
  onDeleteFile: (publicId: string) => void
  uploading: boolean
  errorMsg: string | null
  successMsg: string | null
}

export default function ApplicationDetailsPanel({
  isOpen,
  onClose,
  selectedApplication,
  onSubmitUpdate,
  uploadedFiles,
  onFilesSelected,
  onDeleteFile,
  uploading,
  errorMsg,
  successMsg,
}: ApplicationDetailsPanelProps) {
  const [expandedUpdate, setExpandedUpdate] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)


  /* helper function - get file type for preview function */
  
  const getFileType = (url: string) => {
  if (!url) return "unknown";
  if (url.startsWith("blob:")) return "blob";  
  if (url.endsWith(".pdf")) return "pdf";
  if (url.includes("/raw/") || url.includes(".pdf")) return "pdf";
  return "image";
};


  if (!selectedApplication) return null

  const isCompleted =
    selectedApplication.applicationStatus === "COMPLETED" || selectedApplication.applicationStatus === "CLOSED"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAYMENT_REQUIRED":
        return { bg: "#fae5e5", text: "#c30707", border: "#ca0000" }
      case "DATA_REQUIRED":
        return { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" }
      case "UNDER_REVIEW":
        return { bg: "#F3E8FF", text: "#6B21A8", border: "#E9D5FF" }
      case "APPROVED":
        return { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" }
      case "REJECTED":
        return { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" }
      case "COMPLETED":
        return { bg: "#CCFBF1", text: "#134E4A", border: "#99F6E4" }
      case "CLOSED":
        return { bg: "#F3F4F6", text: "#374151", border: "#D1D5DB" }
      default:
        return { bg: "#F0F9FF", text: "#0C2340", border: "#BAE6FD" }
    }
  }

  console.log("selecteedn application :: ", selectedApplication)

  const currentStatus = getStatusColor(selectedApplication.applicationStatus)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Slide Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full bg-white overflow-hidden z-50 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-white via-white to-white border-b border-[#cecfd3] px-4 sm:px-6 py-4 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{selectedApplication.ticketNo}</h2>
                  <p className="text-sm text-foreground mt-1">
                    {selectedApplication.businessName} • {selectedApplication.serviceName}
                  </p>
                </div>
                <ActionButton label="Close" color="red" onClick={onClose} icon={<X className="w-4 h-4" />} />

              </div>

              {/* PAYMENT SUMMARY */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="border border-border p-3 transition-all hover:border-[#eab308]"
                >
                  <p className="text-xs text-foreground font-semibold capitalize tracking-wide">Total Paid</p>
                  <p className="text-lg sm:text-xl font-bold text-[#22863a] mt-1">
                    ₹{selectedApplication.totalPaid || "0"}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="border border-border p-3 transition-all hover:border-[#3c84d2]"
                >
                  <p className="text-xs text-foreground font-semibold capitalize tracking-wide">Payments</p>
                  <p className="text-lg sm:text-xl font-bold text-[#3c84d2] mt-1">
                    {selectedApplication.paymentCount || 0}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2 }}
                  className=" p-3 border-2 transition-all col-span-1 sm:col-span-1"
                  style={{
                    backgroundColor: currentStatus.bg,
                    borderColor: currentStatus.border,
                  }}
                >
                  <p className="text-xs text-foreground font-semibold capitalize tracking-wide">Status</p>
                  <p className="text-sm sm:text-lg font-bold mt-1" style={{ color: currentStatus.text }}>
                    {selectedApplication.applicationStatus.replace(/_/g, " ")}
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="bg-gradient-to-br from-white to-[#f2c79a]/10 border border-[#cecfd3]  p-3 transition-all hover:border-[#eab308]"
                >
                  <p className="text-xs text-foreground font-semibold capitalize tracking-wide">Created</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground mt-1">
                    {new Date(selectedApplication.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              </div>

              {/* Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(!showForm)}
                disabled={isCompleted}
                className="mt-4 py-2 px-4 text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isCompleted ? "#cecfd3" : "#3c84d2",
                  color: isCompleted ? "#fff4f0" : "#ffffff",
                  opacity: isCompleted ? 0.6 : 1,
                  cursor: isCompleted ? "not-allowed" : "pointer",
                }}
              >
                {showForm ? <X className="w-4 h-4" /> :
                  <Plus className="w-4 h-4" />}
                {showForm ? "Hide" : "Add Update"}
              </motion.button>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4 sm:p-6">
              {/* LEFT: PAYMENT HISTORY */}
              <motion.div layout className="flex-1 flex flex-col min-h-0 order-2 lg:order-1">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#eab308]" />
                  Payment History
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2" style={{ scrollbarWidth: "thin" }}>
                  {selectedApplication.paymentHistory && selectedApplication.paymentHistory.length > 0 ? (
                    selectedApplication.paymentHistory.map((payment: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-border  p-4 hover:border-foreground transition-all hover:shadow-md hover:bg-[#f2c79a]/5"
                      >
                        <div className="grid grid-cols-1 place-items-start space-y-[2px] ">
                          <div className="flex justify-between w-full">
                            <p className="font-bold text-foreground text-lg">Rs. ₹{payment.amount}</p>
                            <span>
                              <p className="text-sm text-end font-semibold text-foreground capitalize ">{payment.transactionId}</p>
                              <p className="text-xs text-end text-black/30 capitalize">{new Date(payment.paymentDate).toLocaleString()}</p>
                            </span>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <span>
                              <p className="text-sm font-semibold uppercase text-foreground  ">{payment.paymentMethod.split('_').join(' ').toLowerCase()}</p>
                              <p className="text-sm text-foreground capitalize ">{payment.purpose}</p>
                            </span>
                            <div
                              className="text-xs font-bold px-3 py-1 "
                              style={{
                                backgroundColor:
                                  payment.status === "SUCCESS"
                                    ? "#D1FAE5"
                                    : payment.status === "EXPIRED"
                                      ? "#FEE2E2"
                                      : "#FEF3C7",
                                color:
                                  payment.status === "SUCCESS"
                                    ? "#065F46"
                                    : payment.status === "EXPIRED"
                                      ? "#991B1B"
                                      : "#92400E",
                              }}
                            >
                              {payment.status}
                            </div>

                          </div>
                        </div>



                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-center text-foreground capitalize">No payments recorded</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* MIDDLE: UPDATE HISTORY */}
              <motion.div layout className="flex-1 flex flex-col min-h-0 order-1 lg:order-2">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-foreground" />
                  Update History
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2" style={{ scrollbarWidth: "thin" }}>
                  {selectedApplication.updateHistory && selectedApplication.updateHistory.length > 0 ? (
                    selectedApplication.updateHistory.map((update: any, index: number) => {
                      const updateStatusColor = getStatusColor(update.newStatus)
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border overflow-hidden hover:border-[#3c84d2] transition-all"
                        >
                          <motion.button
                            onClick={() => setExpandedUpdate(expandedUpdate === index ? null : index)}
                            className="w-full px-4 py-3 flex items-start justify-between gap-3 bg-white hover:bg-[#f2c79a]/5 transition-colors group"
                          >
                            <div className="flex items-start gap-3 flex-1 text-left min-w-0">
                              <div
                                className="mt-1 p-2  flex-shrink-0"
                                style={{ backgroundColor: updateStatusColor.bg }}
                              >
                                <FileText className="w-4 h-4" style={{ color: updateStatusColor.text }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-foreground truncate">{update.message}</p>
                                <p className="text-xs text-foreground mt-1">
                                  {update.updater?.fullName} • {update.updater?.role}
                                </p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <span
                                    className="text-xs px-2 py-1 rounded-full font-bold"
                                    style={{
                                      backgroundColor: updateStatusColor.bg,
                                      color: updateStatusColor.text,
                                    }}
                                  >
                                    {update.newStatus.replace(/_/g, " ")}
                                  </span>
                                  {update.pendingPayment && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold">
                                      💰 Payment
                                    </span>
                                  )}
                                  {update.pendingDocs && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-[#DBEAFE] text-[#1E40AF] font-bold">
                                      📄 Docs
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <motion.div
                              animate={{ rotate: expandedUpdate === index ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex-shrink-0 mt-1"
                            >
                              <ChevronDown className="w-5 h-5 text-foreground" />
                            </motion.div>
                          </motion.button>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {expandedUpdate === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t-2 border-[#cecfd3] bg-[#f2c79a]/5 px-4 py-4 space-y-4"
                              >
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <p className="text-foreground font-bold">Previous Status</p>
                                    <p className="font-semibold text-foreground mt-1">
                                      {update.prevStatus.replace(/_/g, " ")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-foreground font-bold">New Status</p>
                                    <p className="font-semibold text-foreground mt-1">
                                      {update.newStatus.replace(/_/g, " ")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-foreground font-bold">Update Charges</p>
                                    <p className="font-semibold text-foreground mt-1">₹{update.updateCharges || "0"}</p>
                                  </div>
                                  <div>
                                    <p className="text-foreground font-bold">Date & Time</p>
                                    <p className="font-semibold text-foreground mt-1">
                                      {new Date(update.createdAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                {/* Documents */}
                             {update.meta?.documents?.length > 0 && (
  <div>
    <p className="text-xs font-bold text-foreground mb-2">
      Attached Documents
    </p>

    <div className="grid grid-cols-3 gap-2">
      {update.meta.documents.map((doc: any, idx: number) => {
        // Handles both:
        // 1. { url: "https://cloudinary..." }
        // 2. { urls: ["blob:...."] }
        const previewUrl = doc.url || doc.urls?.[0];
        const fileType = getFileType(previewUrl);

        const isImage = fileType === "image";
        const isPdf = fileType === "pdf";
        // const isBlob = fileType === "blob";

        return (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer overflow-hidden border-2 border-[#cecfd3] hover:border-[#3c84d2] rounded"
            onClick={() => window.open(previewUrl, "_blank")}
          >
            {/* Preview Handler */}
            {isImage ? (
              <img
                src={previewUrl}
                alt="Document"
                className="w-full h-20 object-cover"
              />
            ) : (
              <div className="w-full h-20 bg-gray-200 flex items-center justify-center">
                {/* PDF fallback */}
                {isPdf ? (
                  <span className="text-sm font-semibold">PDF</span>
                ) : (
                  <span className="text-sm font-semibold">IMAGE</span>
                )}
              </div>
            )}

            <div className="absolute inset-0 bg-black/0
                group-hover:bg-black/30 transition-colors flex
                items-center justify-center opacity-0 group-hover:opacity-100">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
)}


                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-center text-foreground">No updates yet</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* RIGHT: ADMIN FORM */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: 20, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: 20, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col min-h-0 order-3 lg:order-3 max-w-md"
                  >
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4" style={{ scrollbarWidth: "thin" }}>
                      <div
                        className=" border-l border-border px-5  space-y-4 flex flex-col"
                      // style={{
                      //   backgroundColor: isCompleted ? "#f2c79a" : "#fff4f0",
                      // }}
                      >
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                          <Zap className="w-5 h-5 text-[#eab308]" />
                          Admin Update
                        </h3>

                        {/* Messages */}
                        {errorMsg && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3  bg-[#FEE2E2] text-[#991B1B] text-sm font-semibold border border-[#FCA5A5]"
                          >
                            {errorMsg}
                          </motion.div>
                        )}
                        {successMsg && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3  bg-[#D1FAE5] text-[#065F46] text-sm font-semibold border border-[#6EE7B7]"
                          >
                            {successMsg}
                          </motion.div>
                        )}

                        <form onSubmit={onSubmitUpdate} className="space-y-4 flex-1 flex flex-col">
                          {/* Message */}
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Message/Notes</label>
                            <textarea
                              name="message"
                              placeholder="Enter admin message..."
                              rows={4}
                              disabled={isCompleted}
                              className="w-full px-3 py-2 border border-border  bg-white text-foreground placeholder-foreground/50 focus:outline-none  focus:ring-1 focus:ring-foreground disabled:opacity-50 disabled:cursor-not-allowed resize-none font-normal text-sm"
                            />
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Change Status</label>
                            <select
                              name="statusAction"
                              disabled={isCompleted}
                              className="w-full px-3 py-2 border border-border  bg-white text-foreground focus:outline-none  focus:ring-1 focus:ring-foreground disabled:opacity-50 disabled:cursor-not-allowed font-normal text-sm"
                            >
                              <option value="">-- Select Status --</option>
                              {/* <option value="DATA_REQUIRED">Data Required</option> */}
                              <option value="PAYMENT_REQUIRED">Payment Required</option>
                              {/* <option value="UNDER_REVIEW">Under Review</option> */}
                              <option value="APPROVED">Approved</option>
                              <option value="REJECTED">Rejected</option>
                              {selectedApplication.applicationStatus !== "COMPLETED" && (
                                <option value="COMPLETED">Mark Completed</option>
                              )}
                              {selectedApplication.applicationStatus !== "CLOSED" && (
                                <option value="CLOSED">Close Application</option>
                              )}
                            </select>
                          </div>

                          {/* File Upload */}
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Upload Documents</label>
                            <input
                              type="file"
                              multiple
                              disabled={isCompleted}
                              onChange={(e) => onFilesSelected(e.target.files)}
                              className="w-full px-3 py-2 border border-border  bg-white text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed font-semibold file:font-bold file:bg-blue-950 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:cursor-pointer"
                            />
                            {uploading && <p className="text-xs text-foreground font-bold mt-1">⏳ Uploading...</p>}
                            {uploadedFiles.length > 0 && (
                              <div className="grid grid-cols-3 gap-2 mt-3">
                                {uploadedFiles.map((file) => (
                                  <motion.div
                                    key={file.publicId}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative group"
                                  >
                                    {file.url.endsWith(".pdf") || file.resourceType === "raw" ? (
                                      // PDF PREVIEW BLOCK
                                      <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full h-16 border-2 border-[#cecfd3] flex items-center justify-center bg-gray-100 text-sm font-semibold"
                                      >
                                        📄 View PDF
                                      </a>
                                    ) : (
                                      // IMAGE PREVIEW BLOCK
                                      <img
                                        src={file.url}
                                        alt="Upload"
                                        className="w-full h-16 object-cover border-2 border-[#cecfd3]"
                                      />
                                    )}

                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      type="button"
                                      onClick={() => onDeleteFile(file.publicId)}
                                      className="absolute -top-2 -right-2 bg-[#f83939] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white shadow-lg"
                                    >
                                      ✕
                                    </motion.button>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Checkboxes */}
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                name="paymentRequired"
                                value="true"
                                disabled={isCompleted}
                                className="w-5 h-5 rounded border-2 border-[#cecfd3] accent-[#eab308] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              />
                              <span className="text-sm font-medium text-foreground">💰 Request Payment</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <input
                                type="checkbox"
                                name="docRequired"
                                value="true"
                                disabled={isCompleted}
                                className="w-5 h-5 rounded border-2 border-[#cecfd3] accent-[#3c84d2] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              />
                              <span className="text-sm font-medium text-foreground">📄 Request Documents</span>
                            </label>
                          </div>

                          {/* Charges */}
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Update Charges (₹)</label>
                            <input
                              type="number"
                              name="updateCharges"
                              placeholder="0"
                              disabled={isCompleted}
                              className="w-full px-3 py-2 border border-border  bg-white text-foreground placeholder-[#7f8084] focus:outline-none focus:border-foreground focus:ring-1 focus:ring-[#3c84d2]/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                            />
                          </div>

                          {/* Submit Button */}
                          <motion.button
                            whileHover={!isCompleted ? { scale: 1.02 } : {}}
                            whileTap={!isCompleted ? { scale: 0.98 } : {}}
                            type="submit"
                            disabled={isCompleted}
                            className="w-full py-3  font-bold transition-all flex items-center justify-center gap-2 mt-auto text-white"
                            style={{
                              backgroundColor: isCompleted ? "#f2c79a" : "#3c84d2",
                              opacity: isCompleted ? 0.6 : 1,
                              cursor: isCompleted ? "not-allowed" : "pointer",
                            }}
                          >
                            {isCompleted ? (
                              <>
                                <AlertCircle className="w-4 h-4" />
                                Application {selectedApplication.applicationStatus}
                              </>
                            ) : (
                              <>
                                {/* <Zap className="w-4 h-4" /> */}
                                Submit
                              </>
                            )}
                          </motion.button>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
