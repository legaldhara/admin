import { useEffect, useState } from "react";
import {
  //  Eye, Trash2,
  FileText, MessageCircle, X, User2, ChevronLeft, ChevronRight, Search,
  // ChevronDown
} from "lucide-react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../hooks/hookType";
import {
  fetchUsers, deleteUser,
  //  fetchUserById 
} from "../Store/UserSlice/index";
import { AnimatedCard } from "../components/AnimatedCard";
import ActionButton from "../components/UI/Button";
import { motion } from "framer-motion";
import { RootState } from "../Store/Store";
import CircularText from "../components/UI/CircularText/CircularText";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading, pagination } = useSelector((state: RootState) => state.user as any);

  const [isActiveFilter, setIsActiveFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lastLoginStart, setLastLoginStart] = useState("");
  const [lastLoginEnd, setLastLoginEnd] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; id?: string }>({
    show: false,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // const [statusFilter, setStatusFilter] = useState<string>("");
  // const [startDate, setStartDate] = useState<string>("");
  // const [endDate, setEndDate] = useState<string>("");

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(searchTerm)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    dispatch(
      fetchUsers({
        page,
        limit,
        search: debounceSearch || undefined,
        isActive: isActiveFilter !== "ALL" ? isActiveFilter : undefined,
        startDate,
        endDate,
        lastLoginStart,
        lastLoginEnd,
      })
    );
  }, [dispatch, page, debounceSearch, isActiveFilter, startDate, endDate, lastLoginStart, lastLoginEnd]);


useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 3000);

  return () => clearTimeout(handler);
}, [searchTerm]);


// useEffect(() => {
//   dispatch(
//     fetchUsers({
//       page,
//       limit,
//       search: debouncedSearch,
//       isActive: statusFilter, // "true", "false", or ""
//       startDate,
//       endDate,
//     })
//   );
// }, [dispatch, page, debouncedSearch, statusFilter, startDate, endDate]);


const filteredUsers = users.filter((u: any) =>
  debouncedSearch
    ? (
        (u.fullName ?? "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (u.email ?? "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (u.phone ?? "").toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : true
);


  // const handleViewDetails = (id: string) => {

  //   if (!id) return;

  //   dispatch(fetchUserById(id));
  //   setIsDetailsOpen(true);
  //   setSelectedUser(userDetails);
  // };

  // const handleDeleteClick = (id: string) => {
  //   setConfirmDelete({ show: true, id });
  // };

  const confirmDeleteUser = () => {
    if (confirmDelete.id) {
      dispatch(deleteUser(confirmDelete.id));
      setConfirmDelete({ show: false });
    }
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedUser(null);
  };

  // Pagination Handlers
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };


  const getStatusClass = (active: boolean) =>
    active
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <>
      {loading ?
        <div className="h-[calc(100vh-4rem)] p-8 flex items-center justify-center">
          <CircularText
            text="LEGALDHARA PVT LTD. *"
            onHover="speedUp"
            spinDuration={5}
            className="custom-class"
          />
        </div> :
        <>
          <div className="text-foreground relative">
            <AnimatedCard>
              {/* Search + Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                {/* FILTER ROW */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-4 border-b">

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      className="w-full rounded-md border bg-card py-2 pl-10 pr-3 text-sm"
                      placeholder="Search name, email, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    className="border rounded-md p-2 bg-card text-sm"
                    value={isActiveFilter}
                    onChange={(e) => setIsActiveFilter(e.target.value)}
                  >
                    <option value="ALL">All Users</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>

                  {/* Created Date Start */}
                  <input
                    type="date"
                    className="border rounded-md p-2 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />

                  {/* Created Date End */}
                  <input
                    type="date"
                    className="border rounded-md p-2 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />

                  {/* RESET BUTTON */}
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setIsActiveFilter("ALL");
                      setStartDate("");
                      setEndDate("");
                      setLastLoginStart("");
                      setLastLoginEnd("");
                      setPage(1);
                    }}
                    className=" p-2 bg-red-500 text-white rounded-md text-sm"
                  >
                    Reset Filters
                  </button>
                </div>

                {/* Last Login Filters
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
                  <input
                    type="date"
                    className="border p-2 text-sm"
                    value={lastLoginStart}
                    onChange={(e) => setLastLoginStart(e.target.value)}
                  />

                  <input
                    type="date"
                    className="border p-2 text-sm"
                    value={lastLoginEnd}
                    onChange={(e) => setLastLoginEnd(e.target.value)}
                  />

                  <button
                    onClick={() => {
                      setLastLoginStart("");
                      setLastLoginEnd("");
                    }}
                    className="border p-2 bg-foreground text-background rounded text-sm"
                  >
                    Reset
                  </button>
                </div> */}


              </div>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto p-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-foreground text-background">
                      <th className="p-3 text-left">Full Name</th>
                      <th className="p-3 text-center">Phone</th>
                      <th className="p-3 text-center">Last Active</th>
                      <th className="p-3 text-center">Plans</th>
                      <th className="p-3 text-center">Payments</th>
                      <th className="p-3 text-center">Applications</th>
                      <th className="p-3 text-center">Certificates</th>
                      <th className="p-3 text-center">Queries</th>
                      <th className="p-3 text-center">Status</th>
                      {/* <th className="p-3 text-right">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u: any, i: number) => (
                        <tr key={i} className="border-b border-border hover:bg-gray-300 hover:cursor-pointer">
                          <td className="p-3 font-medium flex items-center gap-2">
                            <User2 size={14} className="inline-block mr-1 mb-1 text-foreground" />
                            <span className="">
                              <h1 className="capitalize text-foreground font-semibold">{u.fullName}</h1>
                              <h6 className="text-xs lowercase text-gray-500">{u.email}</h6>
                            </span>
                          </td>
                          <td className="p-3 text-center">{u.phone}</td>
                          <td className="p-3 text-center text-accent">
                            <span className="text-xs">
                              {u.isActive ?
                                <>
                                  <h6>
                                    {new Date(u.lastLogin).toLocaleDateString()}
                                  </h6>
                                  <h6>
                                    {new Date(u.lastLogin).toLocaleTimeString()}
                                  </h6>
                                </>
                                : <h6 className="text-foreground">-</h6>
                              }
                            </span>
                          </td>
                          <td className="p-3 text-center">{u._count?.userPlans ?? "Not Purchased"}</td>
                          <td className="p-3 text-center">{u._count?.payments ?? 0}</td>
                          <td className="p-3 text-center">{u._count?.applications ?? 0}</td>
                          <td className="p-3 text-center">{u._count?.certificateRequests ?? 0}</td>
                          <td className="p-3 text-center">{u._count?.query ?? 0}</td>
                          <td className="p-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(u.isActive)}`}>
                              {u.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          {/* <td className="p-3 flex justify-end gap-2"> */}
                          {/* <ActionButton label="" color="accent" icon={<Eye size={16} />} onClick={() => handleViewDetails(u.id)} /> */}
                          {/* <ActionButton label="" color="red" icon={<Trash2 size={16} />} onClick={() => handleDeleteClick(u.id)} /> */}
                          {/* </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center p-5 text-muted-foreground">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AnimatedCard>
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4 p-4  ">
              {filteredUsers.map((u: any, i: number) => (
                <AnimatedCard key={i} >
                  <div className="pb-4 border-b border-border">

                    <div className="flex justify-between items-center ">
                      <h3 className="font-semibold text-lg">{u.fullName}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(u.isActive)}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{u.email}</p>
                    <p className="text-sm">{u.phone}</p>
                    <div className="flex justify-between text-sm mt-2">
                      <p>Applications: {u._count?.applications ?? 0}</p>
                      <p>Queries: {u._count?.query ?? 0}</p>
                    </div>
                    {/* <div className="flex justify-end gap-2 mt-3"> */}
                    {/* <ActionButton label="" color="accent" icon={<Eye size={14} />} onClick={() => handleViewDetails(u.id)} />
                    <ActionButton label="" color="red" icon={<Trash2 size={14} />} onClick={() => handleDeleteClick(u.id)} />
                  </div> */}
                  </div>
                </AnimatedCard>
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
            {/* Confirmation Popup */}
            {confirmDelete.show && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <div className="bg-card p-6 rounded-xl border border-border text-center space-y-4 w-[90%] sm:w-96">
                  <h4 className="text-lg font-semibold">Confirm Delete</h4>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                  <div className="flex justify-center gap-3 mt-3">
                    <ActionButton label="Cancel" color="primary" onClick={() => setConfirmDelete({ show: false })} />
                    <ActionButton label="Delete" color="red" onClick={confirmDeleteUser} />
                  </div>
                </div>
              </div>
            )}
            {/* User Details Panel: render immediately when isDetailsOpen true; show loader until selectedUser data arrives */}
            {isDetailsOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-card border-l border-border shadow-xl z-50 overflow-y-auto"
              >
                <div className="flex justify-between items-center p-5 border-b border-border">
                  <h3 className="text-lg font-semibold">{selectedUser?.fullName ?? "User details"}</h3>
                  <ActionButton color="red" label="Close" icon={<X size={14} />} onClick={closeDetails} />
                </div>

                {!selectedUser ? (
                  <div className="p-8 flex items-center justify-center">
                    <CircularText
                      text="LEGALDHARA PVT LTD. *"
                      onHover="speedUp"
                      spinDuration={5}
                      className="custom-class"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row border-b border-border">
                      <button className="flex items-center gap-2 justify-center sm:justify-start px-4 py-3 hover:bg-muted transition">
                        <MessageCircle size={16} /> All Queries ({selectedUser._count?.query ?? 0})
                      </button>
                      <button className="flex items-center gap-2 justify-center sm:justify-start px-4 py-3 hover:bg-muted transition">
                        <FileText size={16} /> Applications ({selectedUser._count?.applications ?? 0})
                      </button>
                    </div>
                    <div className="p-5 space-y-2">
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                      <p><strong>Phone:</strong> {selectedUser.phone}</p>
                      <p><strong>City:</strong> {selectedUser.city || "—"}</p>
                      <p><strong>Gender:</strong> {selectedUser.gender || "—"}</p>
                      <p><strong>Role:</strong> {selectedUser.role}</p>
                      <p><strong>Status:</strong> {selectedUser.isActive ? "Active" : "Inactive"}</p>
                      <p><strong>Last Login:</strong> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : "Never"}</p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </>

      }
    </>
  );
}
