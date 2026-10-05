import { useState, useEffect } from "react";
import {
  Eye, Edit,
  Search, ChevronLeft, ChevronRight,
  ChevronDown
} from "lucide-react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import { useAppDispatch } from "../hooks/hookType";
import {
  fetchApplications,
  getApplicationById, updateApplicationStatus
} from "../Store/ApplicationSlice";
import ActionButton from "../components/UI/Button";
import { AnimatedCard } from "../components/AnimatedCard";
import { motion } from "framer-motion";
import { formatDate, splitter } from "../lib/static";
import { Application } from "../utils/types";
import { getStatusBadge } from "../components/Bagdes";
import CircularText from "../components/UI/CircularText/CircularText";
import { secureApi } from "../config/apiClient";
import ApplicationDetailsPanel from "../components/ApplicationDetailsSidebar";

interface UploadedFile {
  assetId: string;
  url: string;
  publicId: string;
  mimeType?: string;
}

/* ---------- Upload files ---------- */
const uploadFilesToServer = async (files: File[]): Promise<UploadedFile[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await secureApi.post("/api/v1/media/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data?.assets || [];
};


/* ---------- Delete file ---------- */
const deleteFileFromServer = async (assetId: string) => {
  await secureApi.delete(`/api/v1/media/${encodeURIComponent(assetId)}`);
};

export default function Applications() {
  
  const dispatch = useAppDispatch();
  const { applications, loading, pagination, application: selectedApplication } = useSelector((state: RootState) => state.application);

  // Filters & UI state
  
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Details panel + upload
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- Debounce searchTerm into debouncedSearch (300ms) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- Fetch applications when relevant params change ---
  useEffect(() => {
    dispatch(
      fetchApplications({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
        startDate,
        endDate,
      })
    );
  }, [dispatch, page, debouncedSearch, statusFilter, startDate, endDate]);

  /* ---------- File handlers ---------- */
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);
    if (arr.length + uploadedFiles.length > 4) {
      setErrorMsg("You can upload up to 4 files only.");
      return;
    }

    setErrorMsg(null);
    setUploading(true);
    try {
      const uploaded = await uploadFilesToServer(arr);
      setUploadedFiles((prev) => [...prev, ...uploaded]);
      setSuccessMsg("Upload successful");
    } catch {
      setErrorMsg("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteUploaded = async (assetId: string) => {
    const prev = [...uploadedFiles];
    setUploadedFiles((p) => p.filter((f) => f.assetId !== assetId));
    try {
      await deleteFileFromServer(assetId);
      setSuccessMsg("File deleted successfully");
    } catch {
      setUploadedFiles(prev);
      setErrorMsg("Failed to delete file");
    }
  };

  /* ---------- Submit Update ---------- */
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const form = new FormData(e.currentTarget);
    const message = (form.get("message") as string) || "";
    const statusAction = (form.get("statusAction") as string) || undefined;
    const paymentRequired =
      form.get("paymentRequired") === "true" ? true : undefined;
    const updateCharges = form.get("updateCharges")
      ? Number(form.get("updateCharges"))
      : undefined;
    const docRequired =
      form.get("docRequired") === "true" ? true : undefined;

    try {
      const meta =
        uploadedFiles.length > 0
          ? {
            documents: uploadedFiles.map((file) => ({ assetId: file.assetId })),
          }
          : {};

      dispatch(
        updateApplicationStatus({
          ticketNo: selectedApplication!.ticketNo,
          data: {
            message,
            statusAction,
            paymentRequired,
            updateCharges,
            docRequired,
            updateType: "ADMIN_MESSAGE",
            meta,
          },
        })
      );

      setUploadedFiles([]);
      e.currentTarget.reset();
      setSuccessMsg("Application updated successfully!");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  // --- Filtering note:
  // Server fetch is authoritative (we pass filters to fetchApplications).
  // For local list display we apply the debouncedSearch (so UI is consistent with server).
  const filteredApplications = applications.filter((app) =>
    debouncedSearch
      ? (
        app.ticketNo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        app.user.fullName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        app.service.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      : true
  );

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

  /* ---------- Actions ---------- */
  const handleViewDetails = async (app: Application) => {
    try {
      const res = await dispatch(getApplicationById(app.ticketNo)).unwrap();
      if (res) {
        setIsDetailsOpen(true);
      }
    } catch {
      setErrorMsg("Failed to load application details");
    }
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  // --- Pagination handlers
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < (pagination?.totalPages || 1)) setPage((prev) => prev + 1);
  };


  return (
    <>
      {loading ? (
        <div className="md:h-[calc(100vh-10rem)] p-8 flex items-center justify-center">
          <CircularText text="LEGALDHARA PVT LTD. *" spinDuration={5} onHover="speedUp" />
        </div>
      ) : (
        <div className="text-foreground relative">

          {/* ---------------- FILTER ROW ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border-b border-border bg-background">

            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                className="w-full border border-border bg-card py-2 pl-10 pr-3 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Search by name, ticket, service..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                className="w-full border border-border bg-card p-2 pr-8 rounded-md text-sm cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="AWAITING_ACTION">Awaiting Action</option>
                <option value="PAYMENT_REQUIRED">Payment Required</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>

            {/* Start Date */}
            <input
              type="date"
              className="w-full border border-border bg-card p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />

            {/* End Date */}
            <input
              type="date"
              className="w-full border border-border bg-card p-2 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setStartDate("");
                setEndDate("");
                setPage(1);
              }}
              className=" py-2 rounded-md text-sm bg-red-600 font-medium text-background hover:text-white transition"
            >
              Reset Filters
            </button>
          </div>


          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto p-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-2 py-3 text-left">Ticket No.</th>
                  <th className="px-2 py-3 text-left">User</th>
                  <th className="px-2 py-3 text-left">Service</th>
                  <th className="px-2 py-3 text-center">Payments</th>
                  <th className="px-2 py-3 text-center">Pending</th>
                  <th className="px-2 py-3 text-center">Status</th>
                  <th className="px-2 py-3 text-center">Created At</th>
                  <th className="px-2 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b border-border hover:bg-gray-100">
                      <td className="px-2 py-3 font-semibold ">{app.ticketNo}</td>
                      <td className="px-2 py-3">{app.user.fullName}</td>
                      <td className="px-2 py-3 font-semibold">{app.service.name}</td>
                      <td className="px-2 py-3 text-center font-bold">{app.payments?.length ?? 0}</td>
                      <td className="px-2 py-3 text-center">{app.updates?.pendingPayment ? 'Payment' : app.updates?.pendingDocs ? 'Documents' : 'None'}</td>
                      <td className="px-2 py-3 text-center capitalize">
                        {getStatusColor(app.applicationStatus) && (
                          <span
                            className="px-2 py-1  text-xs font-semibold"
                            style={{
                              backgroundColor: getStatusColor(app.applicationStatus).bg,
                              color: getStatusColor(app.applicationStatus).text,
                            }}
                          >
                            {app.applicationStatus.replace(/_/g, " ")}
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-center">{formatDate(app.createdAt)}</td>
                      <td className="px-2 py-3 flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className="border border-primary text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-md"
                        >
                          <Eye size={12} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center p-5 text-muted-foreground">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-4 p-4">
            {filteredApplications.map((app) => (
              <AnimatedCard key={app.id}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg truncate">{app.ticketNo}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full">
                    {getStatusBadge("ApplicationStatus", splitter(app.applicationStatus))}
                  </span>
                </div>
                <p className="text-sm mt-1">{app.service.name}</p>
                <p className="text-sm">{app.user.fullName}</p>
                <div className="flex justify-between text-sm mt-2">
                  <p>Payments: {app.payments?.length ?? 0}</p>
                  <p>{formatDate(app.createdAt)}</p>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <ActionButton label="" color="accent" icon={<Eye size={14} />} onClick={() => handleViewDetails(app)} />
                  <Link to={`/applications/${app.id}/edit`}>
                    <ActionButton label="View" color="primary" icon={<Edit size={14} />} />
                  </Link>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Sticky Pagination Bar */}
          <div className="sticky bottom-0 left-0 w-full bg-background border-t border-border shadow-sm flex items-center justify-between px-4 py-3">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"}`}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination?.totalPages || 1 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm border ${page === i + 1 ? "bg-foreground text-background" : "hover:bg-accent"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={page === (pagination?.totalPages || 1)}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${page === (pagination?.totalPages || 1) ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"}`}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          {/* Details Side Panel */}
          {isDetailsOpen && selectedApplication && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-end"
            >
              <ApplicationDetailsPanel
                isOpen={isDetailsOpen}
                onClose={closeDetails}
                selectedApplication={selectedApplication}
                onSubmitUpdate={handleUpdate}
                uploadedFiles={uploadedFiles}
                onFilesSelected={handleFilesSelected}
                onDeleteFile={handleDeleteUploaded}
                uploading={uploading}
                errorMsg={errorMsg}
                successMsg={successMsg}
              />
            </motion.div>
          )}

        </div>
      )}
    </>
  );
}
