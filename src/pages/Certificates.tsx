// src/pages/CertificatesManagement.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../Store/Store";
import { fetchAllCertificateRequests } from "../Store/CertSlice";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
// import ActionButton from "../components/UI/Button";
import AdminCertificateModal from "../components/AdminCertificateModal";

/* ---------- Types ---------- */
type CertificateStatus = "PENDING" | "PAYMENT_REQUIRED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED" | "CLOSED";

interface UpdateItem {
  message: string;
  attachmentUrl?: string | null;
  createdAt: string;
  updateType: "USER_MESSAGE" | "STATUS_CHANGE" | "CERTIFICATE_PROVIDED" | string;
  updatedBy?: string | null;
}

interface CertificateRequest {
  id?: string;
  requestNo: string;
  subject?: string;
  description?: string | null;
  status: CertificateStatus;
  isResolved?: boolean;
  createdAt: string;
  resolvedAt?: string | null;
  user?: {
    fullName?: string;
    email?: string;
    phone?: string;
  };
  updates?: UpdateItem[] | null;
}


/* ---------- UI Helpers ---------- */
const ALL_STATUSES: CertificateStatus[] = [
  "PENDING",
  "UNDER_REVIEW",
  "PAYMENT_REQUIRED",
  "APPROVED",
  "COMPLETED",
  "REJECTED",
  "CLOSED",
];


/* ---------- Component ---------- */
const CertificatesManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests = [] as CertificateRequest[], pagination } = useSelector(
    (state: RootState) => state.certificate
  );

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"ALL" | CertificateStatus | string>("ALL");

  const [debouncedSearch, setDebouncedSearch] = useState("");


  const [showModal, setShowModal] = useState(false);
  const [selectedRequestNo, setSelectedRequestNo] = useState<string | null>(null);


  const [page, setPage] = useState(1);
  const limit = 10;


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchTerm]);



  useEffect(() => {
    dispatch(
      fetchAllCertificateRequests({
        page,
        limit,
        search: debouncedSearch,   // <-- Add search here
      }) as any
    );
  }, [dispatch, page, limit, debouncedSearch]);


  // Filtered list (search + status)
  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    return (requests || []).filter((r: any) => {
      // Status filter
      const matchesStatus =
        selectedStatusFilter === "ALL" ||
        r.status === selectedStatusFilter;

      // Search filter (client-side, same fields backend checks)
      const matchesQuery =
        !q ||
        (r.requestNo ?? "").toLowerCase().includes(q) ||
        (r.subject ?? "").toLowerCase().includes(q) ||
        (r.user?.fullName ?? "").toLowerCase().includes(q) ||
        (r.user?.email ?? "").toLowerCase().includes(q) ||
        (r.service?.name ?? "").toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [requests, debouncedSearch, selectedStatusFilter]);

  /* ---------- Handlers ---------- */
  const openDetails = (req: CertificateRequest) => {
    setSelectedRequestNo(req.requestNo);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequestNo(null);

  };


  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };


  /* ---------- Render ---------- */
  return (
    <div className="">
      <div className="">
        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-border p-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              className="w-full border border-border bg-card py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground rounded-lg"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search certificates"
            />
          </div>

          <select
            className="px-3 py-2 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-foreground rounded-lg"
            value={selectedStatusFilter}
            onChange={(e) => {
              setSelectedStatusFilter(e.target.value);
            }}
          >
            <option className="text-sm font-normal" value="">Select Status</option>
            {ALL_STATUSES.map((s) => (
              <option className="text-sm font-normal" value={s} key={s}>
                {s.split('_').join(' ')}
              </option>
            ))}
          </select>
          {/* <ActionButton label="Add Service" color="blue" onClick={() => setIsCreateModalOpen(true)} icon={<Plus size={18} />} /> */}
        </div>


        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto p-4">
          <table className="w-full border-collapse text-sm min-w-[700px] sm:min-w-full">
            <thead>
              <tr className="bg-foreground text-background">
                <th className="p-3 text-left">Request No.</th>
                <th className="p-3 hidden text-left lg:table-cell">User</th>
                <th className="p-3 hidden text-left lg:table-cell">Resolved</th>
                <th className="p-3 text-center">Subject</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 hidden md:table-cell text-center">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-300 transition border-b border-border">
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">{r.requestNo}</td>
                    <td className="px-3 py-3 text-sm ">
                      {r.user?.fullName ?? "N/A"}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-foreground whitespace-nowrap">{r.isResolved ? "Complete" : "In Progress"}</td>
                    <td className="px-4 py-3 text-sm text-center max-w-xs truncate">{r.subject}</td>
                    <td className="px-4 py-3 text-xs font-semibold capitalize text-center">{r.status.split('_').join(' ').toLowerCase()}</td>
                    <td className="px-4 py-3 text-sm text-center">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-2 flex justify-end gap-2">
                      <button
                        onClick={() => openDetails(r)}
                        className="border border-primary text-primary  hover:bg-primary hover:text-on-primary flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-md"
                      >
                        <Eye size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards (visible on small screens) */}
        <div className="md:hidden grid gap-3">
          {filtered.map((r: any) => (
            <div key={r.requestNo} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{r.subject}</div>
                  <div className="text-xs text-muted-foreground">{r.requestNo}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs px-2 py-1 rounded-full bg-gray-100">{r.status}</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  {r.user?.fullName} <div className="text-xs">{r.user?.phone}</div>
                </div>
                <button onClick={() => openDetails(r)} className="px-3 py-1 bg-primary text-white rounded-md text-sm">
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 left-0 w-full bg-background border-t border-border shadow-sm flex items-center justify-between px-4 py-3">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"}`}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
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
            disabled={page === pagination.totalPages}
            className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${page === pagination.totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"}`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {selectedRequestNo && (
        <AdminCertificateModal
          isOpen={showModal}
          onClose={closeModal}
          requestNo={selectedRequestNo}
        />
      )}
    </div>
  );
};

export default CertificatesManagement;
