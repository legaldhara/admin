import {
    Home, Users, Box,
    
    //  Edit,
     ShoppingCart,
    //    History, 
    MessageSquareTextIcon,
    //   AlertCircle, Shield,
    Settings,
    FileTypeIcon,
    FileAxis3D,
    IndianRupee,
} from "lucide-react";

export const SIDEBAR_DATA = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },

    {
        icon: Users,
        label: "Users",
        href: "/users",
    },
    {
        icon: MessageSquareTextIcon,
        label: "Queries",
        href: "/queries",
    },

    {
        label: "Applications",
        href: "/applications",
        icon: Box,
    },
    {
        icon: ShoppingCart,
        label: "Services",
        href: "/services",
    },
    {
        icon: IndianRupee,
        label: "Finance",
        href: "/payments",
    },
    {
        icon: FileAxis3D,
        label: "Certificates",
        href: "/certificates",
    },
    {
        icon: FileTypeIcon,
        label: "Documents",
        href: "/documents",
    },
    // { icon: Mail, label: "Emails", href: "/emails" },
    {
        icon: Settings,
        label: "Settings",
        href: "/settings/profile"
        // children: [
        //     { label: "Profile", href: "/settings/profile", icon: UserCog },
        //     // { label: "Document Verification", href: "/settings/verification", icon: FileCheck },
        // ],
    },
    // {
    //     icon: Settings,
    //     label: "Settings",
    //     href: "#",
    //     children: [
    //         { label: "Profile", href: "/settings/profile", icon: UserCog },
    //         // { label: "Document Verification", href: "/settings/verification", icon: FileCheck },
    //     ],
    // },

];

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount)
}


//Date Time
export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

export const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
}
// Example: 7/26/2025

export const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}
// Example: Saturday, July 26, 2025

export const formatDateISO = (dateString: string) => {
    return new Date(dateString).toISOString().split("T")[0]
}
// Example: 2025-07-26

export const splitter = (str: string) => {
    return str.split("_").join(" ").toLowerCase();
}