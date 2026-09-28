import { Book, Box, DollarSignIcon, FileQuestion, Grid3X3, LayoutDashboard, Users, Warehouse, } from "lucide-react"

const routeHeaders = [
  {
    pathname: "/dashboard",
    title: "Analytics Overview",
    description: "Real-time insights into your application",
    icon: <LayoutDashboard className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },
  {
    pathname: "/queries",
    title: "Query Management",
    description: "Manage and monitor queries across your platform",
    icon: <FileQuestion className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },
  {
    pathname: "/users",
    title: "User Management",
    description: "Manage and monitor user accounts across your platform",
    icon: <Users className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },
  {
    pathname: "/co-admins",
    title: "Co-admin Management",
    description: "Invite and control administrative access",
    icon: <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />,
  },  {
    pathname: "/services",
    title: "Service Management",
    description: "Manage and monitor services across your platform",
    icon: <Box className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },
  {
    pathname: "/documents",
    title: "Document Management",
    description: "Manage and monitor documents across your platform",
    icon: <Box className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },
  {
    pathname: "/certificates",
    title: "Certificate Management",
    description: "Manage and monitor certificates across your platform",
    icon: <Grid3X3 className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },
  {
    pathname: "/settings/profile",
    title: "Profile Management",
    description: "Manage and monitor user profiles across your platform",
    icon: <Warehouse className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },

  {
    pathname: "/payments",
    title: "Payment Management",
    description: "Manage and monitor payments across all users and distributors",
    icon: <DollarSignIcon className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },
  {
    pathname: "/applications",
    title: "Application Management",
    description: "Manage and monitor applications across your platform",
    icon: <Book className="h-4 w-4 sm:h-6 sm:w-6  text-primary" />,
  },
]

export function getHeaderByRoute(pathname: string) {
  const header = routeHeaders.find((item) => item.pathname === pathname)
  if (!header) return null
  return (
    <div className="ml-4 ">
      <div className="flex items-center gap-2">
        <div className=" bg-background rounded-full border border-primary p-2 flex items-center justify-center">
          {header.icon}
        </div>
        <div className="block leading-tight">
          <h1 className="text-sm sm:text-md lg:text-lg font-bold leading-tight ">{header.title}</h1>
          <p className="text-gray-500 text-xs sm:text-sm lg:block hidden">
            {header.description}
          </p>
        </div>
      </div>
    </div>
  )
}