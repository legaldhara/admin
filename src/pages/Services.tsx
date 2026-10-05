import { useEffect, useState } from "react"
import { Plus, Search, X, Eye, Pencil, Trash2, FileText, ListTree, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { useAppDispatch } from "../hooks/hookType"
import { createService, deleteService, fetchServices, updateService } from "../Store/ServiceSlice"
import { useSelector } from "react-redux"
import { Service } from "../utils/types"
import { AnimatedCard } from "../components/AnimatedCard"
import ActionButton from "../components/UI/Button"
import { motion } from "framer-motion"
import CircularText from "../components/UI/CircularText/CircularText";
import { RootState } from "../Store/Store"

export default function ServicesPage() {
  const dispatch = useAppDispatch()
  const { services, loading, pagination } = useSelector((state: RootState) => state.service)

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "process">("overview")
  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  // const [categoryFilter, setCategoryFilter] = useState("");

  const limit = 10;



  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);


  useEffect(() => {
    dispatch(
      fetchServices({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter === "active"
          ? "true"
          : statusFilter === "inactive"
            ? "false"
            : ""
        // category: categoryFilter
      })
    );
  }, [dispatch, page, limit, debouncedSearch, statusFilter]);

  const truncateWords = (text?: string, limit = 10) => {
    if (!text) return ""
    const words = text.trim().split(/\s+/)
    return words.length <= limit ? text : words.slice(0, limit).join(" ") + "..."
  }

  const filteredServices = services.filter((s: Service) =>
    debouncedSearch
      ? (
        s.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
      : true
  );

  const handleCreateService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newService = {
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      note: fd.get("note") as string,
      benifits: fd.get("benifits") as string,
      governmentCharges: Number(fd.get("governmentCharges")),
      price: Number(fd.get("price")),
      deliverables: (fd.get("deliverables") as string)?.split(",").map(d => d.trim()).filter(Boolean),
      docRequired: (fd.get("docRequired") as string)?.split(",").map(d => d.trim()).filter(Boolean),
      isActive: fd.get("isActive") === "on",
    }
    dispatch(createService(newService)).unwrap().then(() => setIsCreateModalOpen(false))
  }

  const handleEditService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedService) return
    const fd = new FormData(e.currentTarget)
    const updatedService = {
      id: selectedService.id,
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      note: fd.get("note") as string,
      benifits: fd.get("benifits") as string,
      governmentCharges: Number(fd.get("governmentCharges")),
      price: Number(fd.get("price")),
      deliverables: (fd.get("deliverables") as string)?.split(",").map(d => d.trim()).filter(Boolean),
      docRequired: (fd.get("docRequired") as string)?.split(",").map(d => d.trim()).filter(Boolean),
      isActive: fd.get("isActive") === "on",
    }
    dispatch(updateService(updatedService)).unwrap().then(() => {
      setIsEditModalOpen(false)
      setSelectedService(null)
    })
  }



  // const handleDeleteService = (id: string) => {
  //   dispatch(deleteService(id)).unwrap()
  // }

  const handleEditClick = (service: Service) => {
    setSelectedService(service)
    setIsEditModalOpen(true)
  }

  const handleViewDetails = (service: Service) => {
    setSelectedService(service)
    setIsDetailsOpen(true)
    setActiveTab("overview")
  }

  const closeModal = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setSelectedService(null)
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setSelectedService(null)
  }

  const getStatusBadgeClass = (status: { active: boolean } | boolean | undefined) => {
    const active = typeof status === 'boolean' ? status : status?.active
    if (active === true) return 'bg-green-100 text-green-800'
    if (active === false) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }


  // Pagination Handlers
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border p-4">

              {/* LEFT — Search + Status */}
              <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full md:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={18}
                  />
                  <input
                    type="text"
                    className="w-full border border-border bg-card py-2 pl-10 pr-3 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                {/* Status Dropdown */}
                <div className="relative w-full md:w-40">
                  <select
                    className="w-full border border-border bg-card p-2 pr-8 rounded-md text-sm cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">InActive</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>
              {/* RIGHT — Add Service Button */}
              <div className="w-full md:w-auto flex justify-end">
                <ActionButton
                  label="Add Service"
                  color="blue"
                  onClick={() => setIsCreateModalOpen(true)}
                  icon={<Plus size={18} />}
                />
              </div>
            </div>




            {/* Table */}
            <div className="hidden md:block overflow-x-auto p-4">
              <table className="w-full border-collapse text-sm min-w-[700px] sm:min-w-full">
                <thead>
                  <tr className="bg-foreground text-background">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 hidden text-left lg:table-cell">Description</th>
                    <th className="p-3 text-center">Price</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 hidden md:table-cell text-center">Applications</th>
                    <th className="p-3 hidden md:table-cell text-center">Payments</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((s: Service, index: number) => (
                      <tr key={index} className="hover:bg-gray-300 transition border-b border-border" >
                        <td className="p-3">
                          <div className="font-semibold">{s.name}</div>
                          <div className="lg:hidden text-muted-foreground text-xs">{truncateWords(s.description, 20) || "No description available."}</div>
                        </td>
                        <td className="p-3 hidden lg:table-cell">{truncateWords(s.description, 7) || "No description available."}</td>
                        <td className="p-3 md:table-cell text-center font-bold">{s.price ?? "-"}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-xl  ${getStatusBadgeClass({ active: s.isActive })}`}
                          >
                            {(s.isActive ? "Active" : "Inactive")}
                          </span>
                        </td>
                        <td className="p-3 hidden md:table-cell text-center">{s._count?.applications ?? "-"}</td>
                        <td className="p-3 hidden md:table-cell text-center">{s._count?.payments ?? "-"}</td>
                        <td className="p-3 flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(s)}
                            className="border border-foreground text-foreground hover:bg-accent hover:text-foreground flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-md"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleViewDetails(s)}
                            className="border border-primary text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-md"
                          >
                            <Eye size={12} />
                            View
                          </button>
                          {/* <ActionButton title="View" label="" color="primary" } />} /> */}
                          {/* <ActionButton title="View" label="" color="red" onClick={() => handleDeleteService(s.id)} icon={<Trash2 size={16} />} /> */}
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
          </AnimatedCard>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4 p-4">

            {loading && (
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <CircularText
                  text="LEGALDHARA PVT LTD. *"
                  onHover="speedUp"
                  spinDuration={5}
                  className="custom-class"
                />
              </div>
            )}

            {filteredServices.map((s: Service, i: number) => (
              <AnimatedCard key={i}>
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-foreground">{s.name}</h4>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-xl ${getStatusBadgeClass({ active: (s.isActive) })}`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-1">{truncateWords(s.description, 10) || "No description available."}</p>
                <div className="flex justify-between mt-3 text-sm">
                  <p><strong>Price:</strong> ₹{s.price}</p>
                  <p><strong>Govt:</strong> ₹{s.governmentCharges}</p>
                </div>
                <p className="text-sm text-foreground mt-1"><strong>Note:</strong> {s.note || "—"}</p>
                <div title="buttons" className="flex justify-end gap-2 mt-3">
                  <ActionButton label="" color="accent" onClick={() => handleViewDetails(s)} icon={<Eye size={14} />} />
                  <ActionButton label="" color="primary" onClick={() => handleEditClick(s)} icon={<Pencil size={14} />} />
                  <ActionButton label="" color="red" onClick={() => dispatch(deleteService(s.id))} icon={<Trash2 size={14} />} />
                </div>
                <hr className="mt-4 border-border" />
              </AnimatedCard>
            ))}
          </div>


          {/* CREATE / EDIT MODAL */}
          {(isCreateModalOpen || isEditModalOpen) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
              <form
                className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card shadow-xl p-6 border border-border grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={isCreateModalOpen ? handleCreateService : handleEditService}
              >
                {/* Header */}
                <div className="col-span-2 flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-semibold">
                    {isCreateModalOpen ? "Create Service" : "Edit Service"}
                  </h3>
                  <button className="p-1 hover:bg-muted transition" type="button" onClick={closeModal}>
                    <X size={18} />
                  </button>
                </div>

                {/* Inputs */}
                {[
                  { label: "Service Name", name: "name", type: "text", required: true },
                  { label: "Price", name: "price", type: "number" },
                  { label: "Government Charges", name: "governmentCharges", type: "number" },
                  { label: "Note", name: "note", type: "text" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-medium">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      required={!!f.required}
                      defaultValue={(selectedService as any)?.[f.name] || ""}
                      className="w-full mt-1 p-2 border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground border-border"
                    />
                  </div>
                ))}

                {/* Description */}
                <div className="col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={selectedService?.description || ""}
                    className="w-full mt-1 p-2 border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground border-border resize-none"
                  />
                </div>

                {/* Benefits */}
                <div className="col-span-2">
                  <label className="text-sm font-medium">Benefits</label>
                  <textarea
                    name="benifits"
                    rows={2}
                    defaultValue={selectedService?.benifits || ""}
                    className="w-full mt-1 p-2 border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground border-border resize-none"
                  />
                </div>

                {/* Deliverables */}
                <div>
                  <label className="text-sm font-medium">Deliverables (comma-separated)</label>
                  <input
                    name="deliverables"
                    defaultValue={selectedService?.deliverables?.join(", ") || ""}
                    className="w-full mt-1 p-2 border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground border-border"
                  />
                </div>

                {/* Documents Required */}
                <div>
                  <label className="text-sm font-medium">Documents Required (comma-separated)</label>
                  <input
                    name="docRequired"
                    defaultValue={selectedService?.docRequired?.join(", ") || ""}
                    className="w-full mt-1 p-2 border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground border-border"
                  />
                </div>

                {/* Active Toggle */}
                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={isCreateModalOpen ? true : selectedService?.isActive}
                    className="w-4 h-4 accent-primary"
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-border mt-2">
                  <ActionButton label={isCreateModalOpen ? "Create" : "Update"} color="accent" type="submit" />
                  <ActionButton label="Cancel" color="red" onClick={closeModal} />
                </div>
              </form>
            </div>
          )}

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

          {/* DETAILS SLIDE PANEL */}
          {isDetailsOpen && selectedService && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[550px] bg-card border-l border-border shadow-xl z-50 overflow-y-auto"
            >
              <div className="flex justify-between items-center px-5 py-6 border-b border-border">
                <h3 className="text-xl font-semibold">{selectedService.name}</h3>
                <ActionButton label="Close" color="red" onClick={closeDetails} icon={<X size={14} />} />
              </div>

              <div className="flex justify-around border-b border-border">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "overview" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                    }`}
                >
                  <FileText size={16} /> Overview
                </button>
                <button
                  onClick={() => setActiveTab("process")}
                  className={`flex items-center gap-2 px-4 py-3 font-medium ${activeTab === "process" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                    }`}
                >
                  <ListTree size={16} /> Process & Documents
                </button>
              </div>

              <div className="p-5 space-y-5 ">
                {activeTab === "overview" ? (
                  <>
                    <p className="text-foreground leading-relaxed">
                      {selectedService.description || "No description available."}
                    </p>
                    <hr />
                    <p><strong>Benefits:</strong> {selectedService.benifits || "-"}</p>
                    <p><strong>Note:</strong> {selectedService.note || "-"}</p>
                    <p><strong>Government Charges:</strong> ₹{selectedService.governmentCharges ?? "-"}</p>
                    <p><strong>Price:</strong> ₹{selectedService.price ?? "-"}</p>
                  </>
                ) : (
                  <>
                    <section>
                      <h4 className="font-semibold mb-1 text-primary">Deliverables</h4>
                      {selectedService.deliverables?.length ? (
                        <ul className="list-disc ml-5 text-foreground space-y-1">
                          {selectedService.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No deliverables listed.</p>
                      )}
                    </section>

                    <section>
                      <h4 className="font-semibold mb-1 text-primary">Documents Required</h4>
                      {selectedService.docRequired?.length ? (
                        <ul className="list-disc ml-5 text-foreground space-y-1">
                          {selectedService.docRequired.map((doc, i) => <li key={i}>{doc}</li>)}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No documents required.</p>
                      )}
                    </section>
                  </>
                )}
              </div>
            </motion.div>
          )}

        </div>
      }
    </>
  )
}
