
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Search, X, Check, AlertCircle, Inbox, PenIcon, ChevronDown } from "lucide-react"
import { useSelector } from "react-redux"
import { useAppDispatch } from "../hooks/hookType"
import { fetchQueries, resolveQuery } from "../Store/QuerySlice"
import CircularText from "../components/UI/CircularText/CircularText"
import { AnimatedCard } from "../components/AnimatedCard"
import { motion } from "framer-motion"
import type { RootState } from "../Store/Store"
import UserCard from "../components/UserCard"
import ActionButton from "../components/UI/Button"

export default function QueriesPage() {
  const dispatch = useAppDispatch()
  const { queries, loading, pagination } = useSelector((state: RootState) => state.query)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedQuery, setSelectedQuery] = useState<any | null>(null)
  const [newResponse, setNewResponse] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10
  const [isDetailsOpen, setIsDetailsOpen] = useState(false) // Declare isDetailsOpen here
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 3000);
  
    return () => clearTimeout(handler);
  }, [searchTerm]);
  
  


useEffect(() => {
  dispatch(
    fetchQueries({
      page,
      limit,
      search: debouncedSearch,
      startDate,
      endDate,
    })
  );
}, [
  dispatch,
  page,
  debouncedSearch,
  startDate,
  endDate,
]);


  const filteredQueries = queries.filter((q: any) =>
  debouncedSearch
    ? (
        q.subject?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.message?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        q.user?.fullName?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : true
);


  const handleViewDetails = (query: any) => {
    setSelectedQuery(query)
    setNewResponse(query.response || "")
    setIsDetailsOpen(true)
  }

  const handleResolve = () => {
    if (selectedQuery && newResponse.trim()) {
      dispatch(resolveQuery({ queryNo: selectedQuery.queryNo, response: newResponse }))
      setIsDetailsOpen(false)
    }
  }

  const closeDetails = () => {
    setSelectedQuery(null)
    setIsDetailsOpen(false)
    setNewResponse("")
  }

  const getStatusClass = (resolved: boolean) =>
    resolved
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"

  // Pagination Handlers
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (page < pagination?.totalPages) setPage((prev) => prev + 1)
  }

  return (
    <>
      {loading ? (
        <div className="md:h-[calc(100vh-4rem)] p-8 flex items-center justify-center">
          <CircularText text="LEGALDHARA PVT LTD. *" spinDuration={5} onHover="speedUp" />
        </div>
      ) : (
        <div className="text-foreground relative">
          {/* Search + Header */}
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
                <option >All status</option>
                <option value="resolved">Resolved</option>
              
                <option value="unresolved">Unresolved</option>
              
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
            <table className="w-full text-sm border-collapse overflow-hidden">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="p-3 text-left">Query No.</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Subject</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Posted At</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.length > 0 ? (
                  filteredQueries.map((q: any, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-border hover:bg-gray-300 cursor-pointer transition-colors"
                      onClick={() => handleViewDetails(q)}
                    >
                      <td className="capitalize p-4 font-semibold text-foreground text-xs">{q.queryNo}</td>
                      <td className="capitalize p-4 font-medium">{q.user.fullName ?? '-'}</td>
                      <td className="capitalize p-4">{q.subject}</td>
                      <td className="p-4 capitalize">{q.message}</td>
                      <td className="capitalize p-4 text-center">
                        <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${getStatusClass(q.isResolved)}`}>
                          {q.isResolved ? "Resolved" : "Unresolved"}
                        </span>
                      </td>
                      <td className="capitalize  p-4 text-center">{new Date(q.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-5 text-muted-foreground">
                      No queries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-4 p-4">
            {filteredQueries.map((q: any, i: number) => (
              <AnimatedCard key={i} >
                <div className="cursor-pointer" onClick={() => handleViewDetails(q)}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{q.user.fullName}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(q.isResolved)}`}>
                      {q.isResolved ? "Resolved" : "Unresolved"}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{q.subject}</p>
                  <p className="text-sm">{q.message}</p>
                  <p className="text-sm text-muted-foreground">Posted At: {new Date(q.createdAt).toLocaleString()}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {isDetailsOpen && selectedQuery && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={closeDetails}
                className="fixed inset-0 bg-black/30 z-40"
              />

              {/* Slide-in Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}

                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className=" pointer-events-auto fixed top-0 right-0 h-full w-full sm:w-[500px] bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
              >
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border p-5 flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-foreground truncate">{selectedQuery.subject}</h2>
                    <p className="text-sm font-semibold text-foreground mt-1">Query {selectedQuery.queryNo}</p>
                  </div>
                  <ActionButton onClick={closeDetails} aria-label="Close panel" color="red" label="Close" icon={<X size={14} />} />
                </div>

                <div className="p-5 space-y-6">
                  <UserCard user={selectedQuery.user} />

                  {/* Original Query Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-muted/40 border-border border-b p-4"
                  >
                    <h3 className="text-sm font-semibold text-foreground capitalize tracking-wide mb-2">

                      <Inbox className="inline-block h-4  w-4 mr-2 mb-1" />
                      Query Message
                    </h3>
                    <p className="text-sm leading-relaxed text-foreground">{selectedQuery.message}</p>
                  </motion.div>

                  {/* Existing Response (if resolved) */}
                  {selectedQuery.isResolved && selectedQuery.response && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Check size={18} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                        <h3 className="text-sm font-semibold text-green-900 dark:text-green-300 capitalize tracking-wide">
                          Response Sent
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-green-900 dark:text-green-200">
                        {selectedQuery.response}
                      </p>
                    </motion.div>
                  )}

                  <motion.div >
                    {selectedQuery.isResolved && (
                      <p className="text-xs text-foreground mt-2 flex items-center gap-2">
                        <AlertCircle size={14} className="flex-shrink-0" />
                        This query has been resolved
                      </p>
                    )}
                  </motion.div>


                  {/* New Response Input Section */}

                  {!selectedQuery.isResolved && <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className={`border-b border-border p-4`}
                    >
                      <h3 className="text-sm font-semibold text-foreground capitalize tracking-wide mb-3">
                        <PenIcon className="inline-block h-4 w-4 mr-2 mb-1" />
                        {"Write Response"}
                      </h3>
                      <textarea
                        className={`w-full px-3 py-2 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-foreground resize-none transition-all `}
                        rows={5}
                        placeholder="Write your response here..."
                        value={newResponse}
                        disabled={selectedQuery.isResolved}
                        onChange={(e) => setNewResponse(e.target.value)}
                        aria-label="Response text area"
                      />

                    </motion.div>
                  </>}

                  {/* Info Box */}
                  {!selectedQuery.isResolved && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-accent border border-foreground rounded-lg p-3"
                    >
                      <p className="text-xs text-foreground leading-relaxed">
                        <span className="font-semibold ">Note:</span> Your response will be sent to the user's email upon
                        submission and this query will be marked as resolved.
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  {!selectedQuery.isResolved &&
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex gap-2 pt-2 items-center justify-end"
                      >
                        <ActionButton
                          onClick={closeDetails}
                          label="close"
                          color="red"
                          icon={<X size={14} />}
                        />
                        <ActionButton
                          onClick={handleResolve}
                          label="Submit Response"
                          color="primary"
                          icon={<Check size={14} />}
                        />
                      </motion.div>
                    </>

                  }
                </div>
              </motion.div>
            </>
          )}

          {/* Pagination */}
          <div className="sticky bottom-0 left-0 w-full bg-background border-t border-border shadow-sm flex items-center justify-between px-4 py-3">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm transition-colors ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-accent border-border"
                }`}
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm border transition-colors ${page === i + 1 ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={page === pagination.totalPages}
              className={`flex items-center gap-1 px-3 py-1 border rounded-md text-sm transition-colors ${page === pagination.totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-accent border-border"
                }`}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

