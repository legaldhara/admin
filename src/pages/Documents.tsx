import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../Store/Store"
import { useState, useMemo } from "react"
import { Search, X, Download, Trash2, FileText, Clock, User, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { fetchDocuments } from "../Store/DocSlice"
import ActionButton from "../components/UI/Button"

interface Document {
  title: string
  url: string
  createdAt: string
  publicId: string
}

interface UserData {
  fullName: string
  email: string
  createdAt: string
  documents: Document[]
}


const AVATARS = [
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Alex",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Taylor",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Jordan",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Sam",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Casey",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Jamie",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Riley",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Drew",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Chris",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Blake",
]

const getAvatarForUser = (email: string) => {
  const index = Math.abs(email.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % AVATARS.length
  return AVATARS[index]
}

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date">("date")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [page, setPage] = useState(1);

  const limit = 10;


  const dispatch = useDispatch<AppDispatch>()
  const { documents, pagination } = useSelector((state: RootState) => state.document)
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- Debounce searchTerm into debouncedSearch (300ms) ---
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);


 useEffect(() => {
  dispatch(
    fetchDocuments({
      page,
      limit,
      search: debouncedSearch,
      // status: statusFilter,
      // type: typeFilter,
    })
  );
}, [dispatch, page, limit, debouncedSearch]);

  const filteredUsers = useMemo(() => {
    if (!documents || documents.length === 0) return []

    const transformedUsers: UserData[] = documents.map((item: any) => ({
      fullName: item.user.fullName,
      email: item.user.email,
      createdAt: item.user.createdAt,
      documents: item.documents.map((doc: any) => ({
        title: doc.title,
        url: doc.url,
        createdAt: doc.createdAt,
        publicId: doc.publicId,
      })),
    }))


  const filtered = transformedUsers.filter(
  (user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.documents.some((doc) => doc.title.toLowerCase().includes(searchTerm.toLowerCase())),
     );


    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else {
      filtered.sort((a, b) => a.fullName.localeCompare(b.fullName))
    }

    return filtered
  }, [documents, searchTerm, sortBy])

  // Pagination Handlers
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  // const totalPages = Math.ceil(filteredUsers.length / limit)
  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * limit
    const endIdx = startIdx + limit
    return filteredUsers.slice(startIdx, endIdx)
  }, [filteredUsers, currentPage])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: "name" | "date") => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handleViewDetails = (user: UserData) => {
    setSelectedUser(user)
    setIsDetailsOpen(true)
  }

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setIsViewerOpen(true)
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setTimeout(() => setSelectedUser(null), 300)
  }

  const closeViewer = () => {
    setIsViewerOpen(false)
    setTimeout(() => setSelectedDocument(null), 300)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getFileExtension = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase() || "file"
    return ext
  }

  return (
    <div className="bg-background text-foreground">

      {/* Controls Section */}
      <div className="">
        <div className="">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border p-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 " size={18} />
              <input
                className="w-full border border-border bg-card py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground rounded-md"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                aria-label="Search services"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex gap-2">
              <label className="text-sm font-medium  py-2 hidden sm:block">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as "name" | "date")}
                className="px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-foreground text-sm cursor-pointer"
              >
                <option value="date">Recent First</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredUsers.length > 0 ? (
          <>
            {/* Desktop Grid View */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {paginatedUsers.map((user: UserData, index: number) => (
                <motion.div
                  key={user.email}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewDetails(user)}
                >
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={getAvatarForUser(user.email) || "/placeholder.svg"}
                        alt={user.fullName}
                        className="w-16 h-16 rounded-full border-2 border-primary object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{user.fullName}</h3>
                        <p className="text-sm  truncate">{user.email}</p>
                      </div>
                    </div>

                    <hr className="border-border my-4" />

                    {/* Document Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText size={16} className="text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">{user.documents.length} documents</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-primary flex-shrink-0" />
                        <span className="">Joined: {formatDate(user.createdAt)}</span>
                      </div>
                    </div>

                    {/* Recent Documents Preview */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-semibold  mb-2">Recent uploads</p>
                      <div className="flex flex-col gap-2">
                        {user.documents.slice(0, 2).map((doc) => (
                          <div
                            key={doc.publicId}
                            className="text-xs truncate text-foreground hover:text-primary transition"
                          >
                            📄 {doc.title}
                          </div>
                        ))}
                        {user.documents.length > 2 && (
                          <div className="text-xs  italic">+{user.documents.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Action */}
                  <div className="bg-background border-t border-border px-6 py-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium text-primary">View Documents</span>
                    <span className="text-primary">→</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile & Tablet List View */}
            <div className="md:hidden space-y-4 mb-8">
              {paginatedUsers.map((user: UserData, index: number) => (
                <motion.div
                  key={user.email}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleViewDetails(user)}
                  className="bg-card border border-border rounded-lg p-4 active:bg-muted transition"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={getAvatarForUser(user.email) || "/placeholder.svg"}
                      alt={user.fullName}
                      className="w-14 h-14 rounded-full border-2 border-primary object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground truncate">{user.fullName}</h3>
                      <p className="text-xs  truncate mb-2">{user.email}</p>
                      <div className="flex flex-wrap gap-3 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <FileText size={14} className="text-primary" />
                          {user.documents.length} docs
                        </span>
                        <span className="inline-flex items-center gap-1 ">
                          <Clock size={14} />
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-primary text-lg flex-shrink-0">→</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
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
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-muted rounded-full mb-4">
              <User size={32} className="" />
            </div>
            <p className=" text-lg">No users found</p>
            <p className=" text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Details Slide Panel */}
      {isDetailsOpen && selectedUser && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={closeDetails} />

          {/* Slide Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            {/* Panel Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border px-5 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground truncate">{selectedUser.fullName}</h2>
              <ActionButton label="Close" color="red" icon={
                <X size={12} />
              }  onClick={closeDetails} />
            </div>

            {/* User Info Section */}
            <div className="px-5 py-6 border-b border-border">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={getAvatarForUser(selectedUser.email) || "/placeholder.svg"}
                  alt={selectedUser.fullName}
                  className="w-20 h-20 rounded-full border-2 border-primary object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedUser.fullName}</h3>
                  <p className="text-sm ">{selectedUser.email}</p>
                  <p className="text-xs  mt-2">Joined: {formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className=" border border-border p-3">
                  <p className=" text-xs mb-1">Total Documents</p>
                  <p className="text-2xl font-bold text-primary">{selectedUser.documents.length}</p>
                </div>
                <div className=" border border-border p-3 ">
                  <p className=" text-xs mb-1">Latest Upload</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDate(selectedUser.documents[0]?.createdAt || selectedUser.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="px-5 py-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Uploaded Documents</h3>
              <div className="space-y-2">
                {selectedUser.documents.length > 0 ? (
                  selectedUser.documents.map((doc) => (
                    <div
                      key={doc.publicId}
                      onClick={() => handleViewDocument(doc)}
                      className="flex items-center justify-between p-3 border-border border hover:bg-primary/50 transition group cursor-pointer hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-background flex-shrink-0">
                          <FileText size={18} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{doc.title}</p>
                          <div className="flex gap-2 text-xs mt-1">
                            <span>{getFileExtension(doc.url).toUpperCase()}</span>
                            <span>•</span>
                            <span>{formatDate(doc.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-2 opacity-0 group-hover:opacity-100 transition">
                        <a
                          href={doc.url}
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 hover:bg-background rounded-lg transition text-primary"
                          title="Download"
                        >
                          <Download size={16} />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                          className="p-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition "
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText size={32} className=" mx-auto mb-2 opacity-50" />
                    <p className=" text-sm">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Document Viewer Modal */}
      {isViewerOpen && selectedDocument && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={closeViewer} />

          {/* Viewer Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 sm:inset-8  border border-border rounded-xl shadow-2xl z-50 flex flex-col bg-white overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card flex-shrink-0">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground truncate">{selectedDocument.title}</h3>
                <p className="text-xs mt-1">
                  {getFileExtension(selectedDocument.url).toUpperCase()} • {formatDate(selectedDocument.createdAt)}
                </p>
              </div>

              <ActionButton label="Close" color="red" icon={
                <X size={12} />
              }  onClick={closeViewer} />
              
            </div>

            {/* Viewer Content */}
            <div className="flex-1 overflow-auto flex items-center justify-center  p-4 sm:p-6">
              {["jpg", "jpeg", "png", "gif", "webp"].includes(getFileExtension(selectedDocument.url)) ? (
                <div className=" overflow-hidden max-w-2xl w-full">
                  <img
                    src={selectedDocument.url || "/placeholder.svg"}
                    alt={selectedDocument.title}
                    className="w-full h-auto object-contain max-h-96"
                  />
                  <div className="p-4 border-t border-border flex  gap-2">
                    <a
                      href={selectedDocument.url}
                      download
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium text-sm text-center"
                    >
                      Download
                    </a>
                    <button
                      onClick={closeViewer}
                      className="flex-1 px-4 py-2 bg-warn text-foreground rounded-lg hover:bg-border transition font-medium text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className=" p-8 max-w-2xl w-full text-center">
                  <div className="inline-block p-4 border border-primary rounded-full mb-4">
                    <FileText size={48} className="text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">File Preview</h4>
                  <p className="text-sm  mb-6">
                    Preview not available for {getFileExtension(selectedDocument.url).toUpperCase()} files
                  </p>
                  <div className="space-x-2 flex items-center justify-center">
                    <a
                      href={selectedDocument.url}
                      download
                      className=" px-4 py-2 bg-primary text-background rounded-lg hover:opacity-90 transition font-medium"
                    >
                      Download File
                    </a>
                    <button
                      onClick={closeViewer}
                      className=" px-4 py-2 bg-warn text-background rounded-lg hover:bg-border transition font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
