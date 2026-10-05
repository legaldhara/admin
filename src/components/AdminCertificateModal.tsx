import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Clock, CheckCircle, XCircle, AlertCircle, IndianRupee, FileCheck, } from 'lucide-react';
import { secureApi } from '../config/apiClient';
import { motion, AnimatePresence } from "framer-motion"
import ActionButton from './UI/Button';
import UserCard from './UserCard';


interface AdminCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestNo: string;
}

interface UpdateHistory {
  chargesRequired: string | null;
  message: string;
  transactionId: string | null;
  attachmentUrl: string | null;
  attachmentPublicId: string | null;
  updateType: string;
  createdAt: string;
  updater: {
    fullName: string;
    role: string;
  };
}

interface PaymentHistory {
  amount: string;
  status: string;
  purpose: string;
  paymentType: string;
  transactionId: string;
  paymentMethod: string;
  paymentDate: string;
}

interface CertificateData {
  requestNo: string;
  subject: string;
  description: string;
  status: string;
  docRequired: boolean;
  pendingPayment: boolean;
  isResolved: boolean;
  createdAt: string;
  resolvedAt: string | null;
  totalPaid: number;
  paymentCount: number;
  latestUpdate: UpdateHistory;
  userDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  paymentHistory: PaymentHistory[];
  updateHistory: UpdateHistory[];
}

interface UploadedFile {
  assetId: string;
  url: string;
  publicId: string;
  mimeType?: string;
}

const statusConfig = {
  PENDING: { color: 'bg-yellow-500', icon: Clock, label: 'Pending' },
  UNDER_REVIEW: { color: 'bg-blue-500', icon: Clock, label: 'Under Review' },
  APPROVED: { color: 'bg-green-500', icon: CheckCircle, label: 'Approved' },
  REJECTED: { color: 'bg-red-500', icon: XCircle, label: 'Rejected' },
  COMPLETED: { color: 'bg-green-600', icon: CheckCircle, label: 'Completed' },
  CLOSED: { color: 'bg-gray-500', icon: XCircle, label: 'Closed' },
};

const STATUS_OPTIONS = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED', 'CLOSED'];

export default function AdminCertificateModal({
  isOpen,
  onClose,
  requestNo,
}: AdminCertificateModalProps) {
  const [data, setData] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [message, setMessage] = useState('');
  const [chargesRequired, setChargesRequired] = useState('');
  const [pendingPayment, setPendingPayment] = useState(false);
  const [docRequired, setDocRequired] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen && requestNo) {
      fetchCertificateDetails();
    }
  }, [isOpen, requestNo]);

  useEffect(() => {
    if (data) {
      setSelectedStatus(data.status);
      setPendingPayment(data.pendingPayment);
      setDocRequired(data.docRequired);
      if (data.latestUpdate?.chargesRequired) {
        setChargesRequired(data.latestUpdate.chargesRequired);
      }
    }
  }, [data]);

  const fetchCertificateDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await secureApi.get(`/api/v1/certificate/${requestNo}`);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch certificate details');
    } finally {
      setLoading(false);
    }
  };

  const uploadFilesToServer = async (files: File[]): Promise<UploadedFile[]> => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const res = await secureApi.post("/api/v1/media/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data?.assets || [];
  };

  const deleteFileFromServer = async (assetId: string) => {
    await secureApi.delete(`/api/v1/media/${encodeURIComponent(assetId)}`);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setIsUploading(true);

      try {
        const uploaded = await uploadFilesToServer(files);
        setUploadedFiles([...uploadedFiles, ...uploaded]);

        // Clear the input so same file can be uploaded again
        e.target.value = '';
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to upload files');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDeleteFile = async (assetId: string) => {
    try {
      await deleteFileFromServer(assetId);
      setUploadedFiles(uploadedFiles.filter(f => f.assetId !== assetId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete file');
    }
  };

  const handleSubmitUpdate = async () => {
    if (!message.trim() && !selectedStatus && !chargesRequired && uploadedFiles.length === 0) {
      alert('Please provide at least one update (message, status, charges, or attachment)');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      // Build request body
      const requestBody: any = {};

      if (message.trim()) requestBody.message = message.trim();
      if (selectedStatus && selectedStatus !== data?.status) requestBody.status = selectedStatus;
      if (chargesRequired) requestBody.chargesRequired = chargesRequired;
      if (pendingPayment !== data?.pendingPayment) requestBody.pendingPayment = pendingPayment;
      if (docRequired !== data?.docRequired) requestBody.docRequired = docRequired;

      // Add first uploaded file as attachment
      if (uploadedFiles.length > 0) {
        requestBody.attachmentAssetId = uploadedFiles[0].assetId;
      }

      const response = await secureApi.put(
        `/api/v1/certificate/${requestNo}/update`,
        requestBody
      );

      if (response.data.success) {
        setSuccessMessage('Update submitted successfully!');
        setMessage('');
        setUploadedFiles([]);
        setChargesRequired('');

        // Refresh data
        setTimeout(() => {
          fetchCertificateDetails();
          setSuccessMessage('');
        }, 2000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit update');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"> */}

          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full bg-white overflow-hidden z-50 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="w-full overflow-hidden">
              {/* Header */}
              <div className=" px-6 py-5 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">{requestNo}</h2>
                  <p className="text-sm text-black/80  mt-1 ">{data?.subject}</p>
                </div>

                <ActionButton onClick={onClose} label='Close' icon={<X className="w-6 h-6" />} color='red' />
                {/*                 
                <button
                  onClick={onClose}
                  className="hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                >
                </button> */}
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-orange border-t-transparent"></div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center text-red-600">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                    <p>{error}</p>
                  </div>
                ) : data ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Left Column - Details & History */}
                    <div className="lg:col-span-2 space-y-6">

                      {/* User Details */}
                      <UserCard user={data.userDetails} />

                      {/* Basic Info */}
                      <div className=" p-5 border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-foreground text-xl mb-2">{data.subject}</h3>
                        <p className="text-foreground mb-3">{data.description.toLowerCase()}</p>
                        <div className="flex items-center w-full gap-3 mt-4">
                          <div className='flex-col flex px-5'>
                            <span className="text-sm font-semibold text-foreground whitespace-nowrap ">Current Status:</span>
                            <span
                              className={`px-4 py-1.5 rounded-md text-white text-sm font-bold whitespace-nowrap shadow-md ${statusConfig[data.status as keyof typeof statusConfig]?.color || 'bg-gray-500'

                                }`}
                            >
                              {statusConfig[data.status as keyof typeof statusConfig]?.label || data.status.split('_').join(' ')}
                            </span>
                          </div>
                          {/* Status Indicators */}
                          <div className=" grid grid-cols-3 w-full gap-4">
                            <div className={`p-4 border-2 shadow-md transition-all ${data.pendingPayment ? 'bg-yellow-50 border-yellow-400 scale-105' : 'bg-gray-50 border-gray-300'}`}>
                              <IndianRupee className={`w-6 h-6 mb-2 ${data.pendingPayment ? 'text-yellow-600' : 'text-gray-400'}`} />
                              <p className="text-xs font-semibold text-foreground">Payment Pending</p>
                              <p className="text-xl font-bold text-foreground mt-1">{data.pendingPayment ? 'Yes' : 'No'}</p>
                            </div>
                            <div className={`p-4 border-2 shadow-md transition-all ${data.docRequired ? 'bg-orange-50 border-brand-orange scale-105' : 'bg-gray-50 border-gray-300'}`}>
                              <FileCheck className={`w-6 h-6 mb-2 ${data.docRequired ? 'text-brand-orange' : 'text-gray-400'}`} />
                              <p className="text-xs font-semibold text-foreground">Doc Required</p>
                              <p className="text-xl font-bold text-foreground mt-1">{data.docRequired ? 'Yes' : 'No'}</p>
                            </div>
                            <div className={`p-4 border-2 shadow-md transition-all ${data.isResolved ? 'bg-green-50 border-green-400 scale-105' : 'bg-gray-50 border-gray-300'}`}>
                              <CheckCircle className={`w-6 h-6 mb-2 ${data.isResolved ? 'text-green-600' : 'text-gray-400'}`} />
                              <p className="text-xs font-semibold text-foreground">Resolved</p>
                              <p className="text-xl font-bold text-foreground mt-1">{data.isResolved ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                          <div className="bg-white rounded-lg p-3 border shadow-sm">
                            <span className="text-gray-600 font-medium">Created:</span>
                            <p className="font-semibold text-foreground mt-1">{formatDate(data.createdAt)}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border shadow-sm">
                            <span className="text-gray-600 font-medium">Total Paid:</span>
                            <p className="font-bold text-green-600 text-lg mt-1">₹{data.totalPaid}</p>
                          </div>
                        </div>
                      </div>




                      {/* Update History with Stepper */}
                      <div>
                        <h4 className="font-bold text-foreground mb-4 text-xl flex items-center gap-2">
                          <Clock className="w-6 h-6 text-brand-orange" />
                          Update History
                        </h4>
                        <div className="relative">
                          {data.updateHistory.map((update, index) => {
                            const isLast = index === data.updateHistory.length - 1;
                            const isStatusChange = update.updateType === 'STATUS_CHANGE';
                            const isUserMessage = update.updateType === 'USER_MESSAGE';
                            // const isAdminMessage = update.updateType === 'ADMIN_MESSAGE';

                            return (
                              <div key={index} className="relative pb-8">
                                {!isLast && (
                                  <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gradient-to-b from-gray-400 to-gray-200" />
                                )}

                                <div className="flex gap-4">
                                  <div
                                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center z-10 shadow-lg ${isStatusChange
                                      ? 'bg-gradient-to-br from-brand-orange to-yellow-500 text-white'
                                      : isUserMessage
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                        : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                                      }`}
                                  >
                                    {isStatusChange ? (
                                      <CheckCircle className="w-5 h-5" />
                                    ) : isUserMessage ? (
                                      <Upload className="w-4 h-4" />
                                    ) : (
                                      <FileText className="w-4 h-4" />
                                    )}
                                  </div>

                                  <div className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <p className="font-bold text-foreground">
                                          {update.updater.fullName}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${update.updater.role === 'ADMIN'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-blue-100 text-blue-700'
                                          }`}>
                                          {update.updater.role}
                                        </span>
                                      </div>
                                      <span className="text-xs text-gray-500 font-medium">
                                        {formatDate(update.createdAt)}
                                      </span>
                                    </div>

                                    <p className="text-gray-800 text-sm mb-2 leading-relaxed">{update.message}</p>

                                    {update.chargesRequired && parseFloat(update.chargesRequired) > 0 && (
                                      <div className="bg-yellow-100 px-3 py-2 rounded-lg inline-block text-sm font-bold text-yellow-800 mt-2 shadow-sm">
                                        💰 Charges: ₹{update.chargesRequired}
                                      </div>
                                    )}

                                    {update.attachmentUrl && (
                                      <a
                                        href={update.attachmentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-3 text-sm text-brand-orange hover:text-deep-blue font-semibold transition-colors"
                                      >
                                        <FileText className="w-4 h-4" />
                                        View Attachment
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Payment History */}
                      {data.paymentHistory.length > 0 && (
                        <div>
                          <h4 className="font-bold text-foreground mb-4 text-xl flex items-center gap-2">
                            <IndianRupee className="w-6 h-6 text-brand-orange" />
                            Payment History
                          </h4>
                          <div className="space-y-3">
                            {data.paymentHistory.map((payment, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4 flex justify-between items-center shadow-md"
                              >
                                <div>
                                  <p className="font-bold text-gray-800 text-lg">₹{payment.amount}</p>
                                  <p className="text-sm text-gray-600 font-medium">{payment.purpose}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {payment.paymentMethod} • {formatDate(payment.paymentDate)}
                                  </p>
                                </div>
                                <span
                                  className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${payment.status === 'PENDING'
                                    ? 'bg-yellow-400 text-yellow-900'
                                    : payment.status === 'COMPLETED'
                                      ? 'bg-green-500 text-white'
                                      : 'bg-gray-400 text-gray-900'
                                    }`}
                                >
                                  {payment.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Admin Update Form */}
                    <div className="lg:col-span-1">
                      <div className="bg-white border sticky top-0 max-h-[calc(95vh-120px)] overflow-y-auto">
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-5 flex items-center gap-2 text-foreground border-b-2 border-brand-orange pb-3">
                            <FileText className="w-6 h-6 text-brand-orange" />
                            Admin Update Form
                          </h3>

                          {successMessage && (
                            <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm font-semibold border-2 border-green-300">
                              ✓ {successMessage}
                            </div>
                          )}

                          <div className="space-y-5">
                            {/* Status Dropdown */}
                            <div>
                              <label className="block text-sm font-normal mb-2 text-foreground">Status</label>
                              <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 text-foreground border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all font-medium"
                              >
                                {STATUS_OPTIONS.map((status) => (
                                  <option className='text-xs' key={status} value={status}>
                                    {status.replace('_', ' ')}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Message */}
                            <div>
                              <label className="block text-sm font-bold mb-2 text-foreground">Message</label>
                              <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Enter update message..."
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 text-foreground border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange resize-none transition-all"
                                rows={4}
                              />
                            </div>

                            {/* Charges Required */}
                            <div>
                              <label className="block text-sm font-bold mb-2 text-foreground">Charges Required (₹)</label>
                              <input
                                type="number"
                                value={chargesRequired}
                                onChange={(e) => setChargesRequired(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 text-foreground border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all font-medium"
                              />
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                              <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={pendingPayment}
                                  onChange={(e) => setPendingPayment(e.target.checked)}
                                  className="w-5 h-5 rounded border-2 border-gray-400 text-brand-orange focus:ring-2 focus:ring-brand-orange cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-foreground group-hover:text-brand-orange transition-colors">Pending Payment</span>
                              </label>

                              <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={docRequired}
                                  onChange={(e) => setDocRequired(e.target.checked)}
                                  className="w-5 h-5 rounded border-2 border-gray-400 text-brand-orange focus:ring-2 focus:ring-brand-orange cursor-pointer"
                                />
                                <span className="text-sm font-semibold text-foreground group-hover:text-brand-orange transition-colors">Document Required</span>
                              </label>
                            </div>

                            {/* File Upload */}
                            <div>
                              <label className="block text-sm font-bold mb-2 text-foreground">Attachments</label>
                              <input
                                type="file"
                                onChange={handleFileSelect}
                                accept="image/*,.pdf"
                                multiple
                                disabled={isUploading}
                                className="block w-full text-sm text-foreground file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-deep-blue file:text-white hover:file:bg-deep-blue file:cursor-pointer cursor-pointer disabled:opacity-50"
                              />
                              {isUploading && (
                                <p className="mt-2 text-xs text-brand-orange font-semibold animate-pulse">
                                  ⏳ Uploading...
                                </p>
                              )}
                            </div>

                            {/* Uploaded Files Preview */}
                            {uploadedFiles.length > 0 && (
                              <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg border-2 border-gray-200">
                                <p className="text-xs font-bold text-foreground mb-2">Uploaded Files ({uploadedFiles.length})</p>
                                {uploadedFiles.map((file, idx) => {
                                  // Extract filename from URL or use publicId
                                  const fileName = file.publicId.split('/').pop() || `File ${idx + 1}`;
                                  const isImage = file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                                  return (
                                    <div
                                      key={file.assetId}
                                      className="flex items-center gap-3 bg-white border-2 border-green-300 rounded-lg p-3 group hover:border-green-400 transition-all relative"
                                    >
                                      {/* Close/Delete button */}
                                      <button
                                        onClick={() => handleDeleteFile(file.assetId)}
                                        className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg z-10"
                                        title="Remove file"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>

                                      {/* Thumbnail */}
                                      {isImage ? (
                                        <img
                                          src={file.url}
                                          alt="Preview"
                                          className="w-14 h-14 object-cover rounded border-2 border-green-400 flex-shrink-0"
                                        />
                                      ) : (
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded border-2 border-blue-400 flex items-center justify-center flex-shrink-0">
                                          <FileText className="w-6 h-6 text-blue-600" />
                                        </div>
                                      )}

                                      {/* File info */}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate" title={fileName}>
                                          {fileName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate" title={file.publicId}>
                                          {file.publicId}
                                        </p>
                                        <a
                                          href={file.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-brand-orange hover:underline font-medium inline-flex items-center gap-1 mt-1"
                                        >
                                          <Upload className="w-3 h-3" />
                                          View Full Size
                                        </a>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Submit Button */}
                            <button
                              onClick={handleSubmitUpdate}
                              disabled={isSubmitting || isUploading}
                              className="w-full bg-deep-blue text-white font-bold px-6 py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-3"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                                  Submitting...
                                </>
                              ) : isUploading ? (
                                <>
                                  <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  Submit Update
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>

          {/* </div> */}

        </>
      )}
    </AnimatePresence>
  );
}
