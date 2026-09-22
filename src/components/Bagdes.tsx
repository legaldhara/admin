import {
    CheckCircle,
    Clock,
    AlertTriangle,
    XCircle,
    Info,
    BadgeDollarSign,
    DollarSign,
    Edit3,
    AlertCircle,
    BadgeCheck,
    CreditCard,
    FileText,
    Key,
} from "lucide-react";


export const getStatusBadge = (type: "ApplicationStatus" | "PaymentStatus" | "PaymentType" | "QueryType" | "UserStatus", value: string) => {
    const baseClass =
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold";

    switch (type) {
        case "ApplicationStatus":
            switch (value) {
                case "AWAITING_ACTION":
                    return (
                        <span className={`${baseClass} bg-amber-100 text-amber-800`}>
                            <AlertTriangle className="w-3 h-3" />
                            Awaiting Action
                        </span>
                    );
                case "PAYMENT_REQUIRED":
                    return (
                        <span className={`${baseClass} bg-orange-100 text-orange-800`}>
                            <CreditCard className="w-3 h-3" />
                            Payment Required
                        </span>
                    );
                case "PAYMENT_DONE":
                    return (
                        <span className={`${baseClass} bg-teal-100 text-teal-800`}>
                            <CheckCircle className="w-3 h-3" />
                            Payment Done
                        </span>
                    );
                case "DATA_REQUIRED":
                    return (
                        <span className={`${baseClass} bg-indigo-100 text-indigo-800`}>
                            <FileText className="w-3 h-3" />
                            Data Required
                        </span>
                    );
                case "UNDER_REVIEW":
                    return (
                        <span className={`${baseClass} bg-blue-100 text-blue-800`}>
                            <Info className="w-3 h-3" />
                            Under Review
                        </span>
                    );
                case "APPROVED":
                    return (
                        <span className={`${baseClass} bg-green-100 text-green-800`}>
                            <CheckCircle className="w-3 h-3" />
                            Approved
                        </span>
                    );
                case "REJECTED":
                    return (
                        <span className={`${baseClass} bg-red-100 text-red-800`}>
                            <XCircle className="w-3 h-3" />
                            Rejected
                        </span>
                    );
                case "COMPLETED":
                    return (
                        <span className={`${baseClass} bg-emerald-100 text-emerald-800`}>
                            <BadgeCheck className="w-3 h-3" />
                            Completed
                        </span>
                    );
                case "CLOSED":
                    return (
                        <span className={`${baseClass} bg-gray-100 text-gray-800`}>
                            <Key className="w-3 h-3" />
                            Closed
                        </span>
                    );
                default:
                    return (
                        <span className={`${baseClass} bg-slate-100 text-slate-800`}>
                            <Info className="w-3 h-3" />
                            {value}
                        </span>
                    );
            }


        case "PaymentStatus":
            switch (value) {
                case "PENDING":
                    return (
                        <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>
                            <Clock className="w-3 h-3" />
                            Pending
                        </span>
                    );
                case "SUCCESS":
                    return (
                        <span className={`${baseClass} bg-green-100 text-green-800`}>
                            <CheckCircle className="w-3 h-3" />
                            Success
                        </span>
                    );
                case "FAILED":
                    return (
                        <span className={`${baseClass} bg-red-100 text-red-800`}>
                            <XCircle className="w-3 h-3" />
                            Failed
                        </span>
                    );
                default:
                    return (
                        <span className={`${baseClass} bg-gray-100 text-gray-800`}>
                            <Info className="w-3 h-3" />
                            {value}
                        </span>
                    );
            }
        case "UserStatus":
            switch (value) {
                case "INACTIVE":
                    return (
                        <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>
                            <AlertCircle className="w-3 h-3" />
                            Inactive
                        </span>
                    );
                case "ACTIVE":
                    return (
                        <span className={`${baseClass} bg-green-100 text-green-800`}>
                            <CheckCircle className="w-3 h-3" />
                            Active
                        </span>
                    );
                default:
                    return (
                        <span className={`${baseClass} bg-gray-100 text-gray-800`}>
                            <Info className="w-3 h-3" />
                            {value}
                        </span>
                    );
            }

        case "PaymentType":
            switch (value) {
                case "INITIAL":
                    return (
                        <span className={`${baseClass} bg-blue-100 text-blue-800`}>
                            <DollarSign className="w-3 h-3" />
                            Initial
                        </span>
                    );
                case "OBJECTION":
                    return (
                        <span className={`${baseClass} bg-orange-100 text-orange-800`}>
                            <AlertTriangle className="w-3 h-3" />
                            Objection
                        </span>
                    );
                case "ADDITIONAL":
                    return (
                        <span className={`${baseClass} bg-purple-100 text-purple-800`}>
                            <BadgeDollarSign className="w-3 h-3" />
                            Additional
                        </span>
                    );
                case "CORRECTION":
                    return (
                        <span className={`${baseClass} bg-indigo-100 text-indigo-800`}>
                            <Edit3 className="w-3 h-3" />
                            Correction
                        </span>
                    );
                default:
                    return (
                        <span className={`${baseClass} bg-gray-100 text-gray-800`}>
                            <Info className="w-3 h-3" />
                            {value}
                        </span>
                    );
            }
        case "QueryType":
            switch (value) {
                case "PENDING":
                    return (
                        <span className={`${baseClass} bg-blue-100 text-blue-800`}>
                            <Clock className="w-3 h-3" />
                            Pending
                        </span>
                    );
                case "RESOLVED":
                    return (
                        <span className={`${baseClass} bg-green-100 text-green-800`}>
                            <CheckCircle className="w-3 h-3" />
                            Resolved
                        </span>
                    );
                default:
                    return (
                        <span className={`${baseClass} bg-gray-100 text-gray-800`}>
                            <Info className="w-3 h-3" />
                            {value}
                        </span>
                    );
            }

        default:
            return (
                <span className={`${baseClass} bg-gray-100 text-gray-800`}>
                    <Info className="w-3 h-3" />
                    {value}
                </span>
            );
    }
};
