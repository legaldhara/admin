import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  ListTree,
  ChevronDown,
} from "lucide-react";
import { useAppDispatch } from "../hooks/hookType";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import { fetchAllPayments } from "../Store/PaymentSlice";
import { AnimatedCard } from "../components/AnimatedCard";
import ActionButton from "../components/UI/Button";
import CircularText from "../components/UI/CircularText/CircularText";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function PaymentPage() {
  const dispatch = useAppDispatch();
  const { payments, loading, pagination } = useSelector(
    (state: RootState) => state.payment
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview");
  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;

  // useEffect(() => {
  //   dispatch(fetchAllPayments({ page, limit }));
  // }, [dispatch, page]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchAllPayments({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
      })
    );
  }, [page, limit, debouncedSearch, statusFilter]);


  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
    setIsDetailsOpen(true);
    setActiveTab("overview");
  };

  console.log(payments);
  console.log(pagination);


  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  const filteredPayments = payments.filter((p: any) => {
    const search = debouncedSearch.toLowerCase();

    // Check search conditions (same as backend)
    const matchesSearch =
      !debouncedSearch ||
      p.transactionId?.toLowerCase().includes(search) ||
      p.purpose?.toLowerCase().includes(search) ||
      p.paymentMethod?.toLowerCase().includes(search) ||
      p.application?.ticketNo?.toLowerCase().includes(search) ||
      p.user?.fullName?.toLowerCase().includes(search) ||
      p.user?.email?.toLowerCase().includes(search) ||
      p.service?.name?.toLowerCase().includes(search);

    // Check status filter
    const matchesStatus =
      !statusFilter || p.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    if (status === "SUCCESS") return "bg-green-100 text-green-800";
    if (status === "PENDING") return "bg-yellow-100 text-yellow-800";
    if (status === "FAILED") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <>
      {loading ?
        <div className="md:h-[calc(100vh-10rem)] p-8 flex items-center justify-center">
          <CircularText text="LEGALDHARA PVT LTD. *" spinDuration={5} onHover="speedUp" />
        </div> :
        <div className="text-foreground relative">

          <AnimatedCard>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border p-4">

              {/* LEFT — Search + Status */}
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">

                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    className="w-full border border-border rounded-md bg-card py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Dropdown */}
                <div className="relative w-full md:w-40">
                  <select
                    className="w-full border border-border bg-card p-2 pr-8 rounded-md text-sm cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-foreground"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                    <option value="PENDING">Pending</option>
                  </select>

                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>

              </div>

              {/* RIGHT — PhonePe Button */}
              <Link
                to="https://business.phonepe.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold py-2 px-4 text-purple-600 border border-purple-600 hover:text-white hover:bg-purple-600 transition-colors w-fit"
              >
                <img src="/admin/phonepe.png" alt="phonepe" className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </Link>

            </div>


            {/* Table */}
            <div className="hidden md:block overflow-x-auto p-4">
              <table className="w-full border-collapse text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-foreground text-background">
                    <th className="p-3 text-left">Transaction ID</th>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Service | Certificates</th>
                    <th className="p-3 text-center">Amount</th>
                    <th className="p-3 text-center">Mode</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((p: any, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-300 transition border-b border-border"
                      >
                        <td className="p-3 text-xs font-semibold text-foreground">{p.transactionId}</td>
                        <td className="p-3">{p.user?.fullName ?? "-"}</td>
                        {/* <td className="p-3">{p.serviceId ? p.service?.name : p.certificateRequestId ? p.certificateRequest.subject : p.planId ? p.plan.name : undefined || "-"}</td> */}
                        <td className="p-3">
                          {(
                            p.service
                              ? p.service?.name
                              : p.certificateRequest
                                ? p.certificateRequest?.subject
                                : p.plan
                                  ? p.plan?.name
                                  : "-"
                          ) || "-"}
                        </td>
                        <td className="p-3 text-center font-semibold">
                          ₹{p.amount}
                        </td>
                        <td className="p-3 text-center">{p.paymentMethod.split("_").join(" ") || "-"}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-xl ${getStatusBadgeClass(
                              p.status
                            )}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {new Date(p.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="p-3 flex justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(p)}
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
                      <td
                        colSpan={8}
                        className="p-6 text-center text-muted-foreground"
                      >
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AnimatedCard>

          {/* Mobile View */}
          <div className="block md:hidden space-y-4 p-4">
            {filteredPayments.map((p: any, i: number) => (
              <AnimatedCard key={i}>
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold">{p.transactionId}</h4>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-xl ${getStatusBadgeClass(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="text-sm mt-2">
                  <strong>User:</strong> {p.user?.name || "-"}
                </p>
                <p className="text-sm">
                  <strong>Service:</strong> {p.service?.name || "-"}
                </p>
                <p className="text-sm">
                  <strong>Amount:</strong> ₹{p.amount}
                </p>
                <p className="text-sm">
                  <strong>Mode:</strong> {p.mode || "-"}
                </p>
                <div className="flex justify-end gap-2 mt-3">
                  <ActionButton
                    label=""
                    color="accent"
                    onClick={() => handleViewDetails(p)}
                    icon={<Eye size={14} />}
                  />
                  {/* <ActionButton
                    label=""
                    color="red"
                    onClick={() => handleDeletePayment(p.id)}
                    icon={<Trash2 size={14} />}
                  /> */}
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Pagination */}
          <div className="sticky bottom-0 left-0 w-full bg-background border-t border-border shadow-sm flex items-center justify-between px-4 py-3">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${page === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-accent"
                }`}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm border ${page === i + 1
                    ? "bg-foreground text-background"
                    : "hover:bg-accent"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={page === pagination.totalPages}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm ${page === pagination.totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-accent"
                }`}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          {/* DETAILS PANEL */}
          {isDetailsOpen && selectedPayment && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[550px] bg-card border-l border-border shadow-xl z-50 overflow-y-auto"
            >
              <div className="flex justify-between items-center px-5 py-6 border-b border-border">
                <h3 className="text-xl font-semibold">
                  Payment: {selectedPayment.transactionId}
                </h3>
                <ActionButton
                  label="Close"
                  color="red"
                  onClick={() => setIsDetailsOpen(false)}
                  icon={<X size={14} />}
                />
              </div>

              <div className="flex justify-around border-b border-border">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "overview"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                    }`}
                >
                  <FileText size={16} /> Overview
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "details"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                    }`}
                >
                  <ListTree size={16} /> Details
                </button>
              </div>

              <div className="p-5 space-y-4">
                {activeTab === "overview" ? (
                  <>
                    <p>
                      <strong>User:</strong> {selectedPayment.user?.name || "-"}
                    </p>
                    <p>
                      <strong>Service:</strong>{" "}
                      {selectedPayment.service?.name || "-"}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{selectedPayment.amount}
                    </p>
                    <p>
                      <strong>Mode:</strong> {selectedPayment.mode || "-"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-2 py-1 rounded ${getStatusBadgeClass(
                          selectedPayment.status
                        )}`}
                      >
                        {selectedPayment.status}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Transaction Reference:</strong>{" "}
                      {selectedPayment.transactionReference || "-"}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {new Date(selectedPayment.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Updated At:</strong>{" "}
                      {new Date(selectedPayment.updatedAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Remarks:</strong>{" "}
                      {selectedPayment.note || "No remarks."}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      }
    </>
  );
}

