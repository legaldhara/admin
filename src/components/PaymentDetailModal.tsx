// import { useEffect, useRef } from "react"
import { X, Calendar, CreditCard, User, DollarSign, FileText, Hash } from "lucide-react"
import { formatCurrency } from "../lib/static"

interface Payment {
  id: string
  date: string
  amount: number
  status: "pending" | "processing" | "completed" | "failed"
  customer: {
    name: string
    email: string
  }
  description: string
  paymentMethod: string
}

interface PaymentDetailModalProps {
  payment: Payment
  onClose: () => void
}

export default function PaymentDetailModal({ payment, onClose }: PaymentDetailModalProps) {
//   const modalRef = useRef<HTMLDivElement>(null)

//   // Close modal when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         onClose()
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [onClose])

//   // Close modal on escape key
//   useEffect(() => {
//     function handleEscapeKey(event: KeyboardEvent) {
//       if (event.key === "Escape") {
//         onClose()
//       }
//     }

//     document.addEventListener("keydown", handleEscapeKey)
//     return () => {
//       document.removeEventListener("keydown", handleEscapeKey)
//     }
//   }, [onClose])

//   // Prevent body scroll when modal is open
//   useEffect(() => {
//     document.body.style.overflow = "hidden"
//     return () => {
//       document.body.style.overflow = "unset"
//     }
//   }, [])

  // Status badge color
  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100"
      case "pending": return "text-yellow-600 bg-yellow-100"
      case "processing": return "text-blue-600 bg-blue-100"
      case "failed": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-4 sm:items-center">
      <div
        // ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto my-8 sm:my-0 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b sticky top-0 bg-white rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Payment Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
          </div>

          <div className="space-y-4">
            <InfoItem icon={<Hash />} label="Payment ID" value={payment.id} />
            <InfoItem icon={<DollarSign />} label="Amount" value={formatCurrency(payment.amount)} bold />
            <InfoItem icon={<Calendar />} label="Date" value={new Date(payment.date).toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric"
            })} />
            <InfoItem icon={<CreditCard />} label="Payment Method" value={payment.paymentMethod} />
            <InfoItem icon={<FileText />} label="Description" value={payment.description} />
          </div>

          {/* Customer Info */}
          <div className="mt-6">
            <div className="flex items-start space-x-3 mb-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg ml-8">
              <p className="font-medium text-gray-900 text-sm sm:text-base">{payment.customer.name}</p>
              <p className="text-gray-600 text-sm break-all">{payment.customer.email}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 rounded-b-lg">
          <button
            type="button"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // TODO: implement receipt download logic
              onClose()
            }}
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper for rendering an icon + label/value pair
function InfoItem({ icon, label, value, bold = false }: { icon: React.ReactNode, label: string, value: string, bold?: boolean }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className={`text-sm sm:text-base text-gray-900 break-words ${bold ? 'font-bold' : ''}`}>{value}</p>
      </div>
    </div>
  )
}
