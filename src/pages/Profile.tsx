import type React from "react"
import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Key,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  Settings,
  Activity,
  FileText,
  Download,

  UserCircle2Icon,
} from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "../Store/Store"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    updates: true,
  })

  const { name, email } = useSelector((state: RootState) => state.auth);

  // Mock user data
  const [userProfile, setUserProfile] = useState({
    id: "user123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    dateOfBirth: "1990-05-15",
    joinedDate: "2023-01-15",
    profilePicture: "/placeholder.svg?height=120&width=120",
    isVerified: true,
    role: "Admin",
    department: "Government Services",
    lastLogin: "2024-01-20T14:30:00Z",
    twoFactorEnabled: false,
  })

  const recentActivity = [
    {
      id: 1,
      action: "Updated application status",
      details: "Changed APP-2024-001 to Approved",
      timestamp: "2024-01-20T14:30:00Z",
      type: "update",
    },
    {
      id: 2,
      action: "Processed payment",
      details: "Payment TXN-002 processed successfully",
      timestamp: "2024-01-20T13:15:00Z",
      type: "payment",
    },
    {
      id: 3,
      action: "Document reviewed",
      details: "Reviewed birth certificate for APP-2024-003",
      timestamp: "2024-01-20T11:45:00Z",
      type: "review",
    },
    {
      id: 4,
      action: "User query resolved",
      details: "Resolved query about payment processing",
      timestamp: "2024-01-20T10:20:00Z",
      type: "support",
    },
  ]

  const statistics = {
    applicationsProcessed: 156,
    queriesResolved: 89,
    documentsReviewed: 234,
    averageResponseTime: "2.3 hours",
  }

  const handlePersonalInfoSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const updatedProfile = {
      ...userProfile,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      country: formData.get("country") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
    }
    setUserProfile(updatedProfile)
    setIsEditingPersonal(false)
    alert("Profile updated successfully!")
  }

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Password change logic here
    setIsEditingPassword(false)
    alert("Password changed successfully!")
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "update":
        return <Edit className="h-4 w-4 text-blue-600" />
      case "payment":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "review":
        return <FileText className="h-4 w-4 text-purple-600" />
      case "support":
        return <User className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "activity", label: "Activity", icon: Activity },
  ]

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Profile Header */}
        <div className=" shadow-sm border border-b border-border overflow-hidden">
          <div 
          // style={{ backgroundImage: "url('../cover.png')", objectFit: 'cover' }}
           className=" bg-contain bg-no-repeat bg-right px-4 py-8 sm:px-6 sm:py-12 border-b border-border">
            {/* <img src="../cover.png" alt="cover" className="absolute object-cover" /> */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 ">
              <div className="relative rounded-full p-2">
                {/* <img
                  src={userProfile.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-dark-surface-bg2 shadow-lg object-cover"
                
                /> */}

                <UserCircle2Icon className="h-16 w-16" />
                {/* <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button> */}
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark-surface-bg1 mb-1">
                      {name}
                    </h1>
                    {/* <p className=" mb-2">
                      {userDetails.role} • {userDetails.department}
                    </p> */}
                    <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 text-dark-surface-bg2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {email}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {formatDate(userProfile.joinedDate)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    {userProfile.isVerified && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified Account
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="px-4 py-6 sm:px-6 border-b border-light-brand-primary">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-dark-text-white">{statistics.applicationsProcessed}</div>
                <div className="text-sm text-dark-text-light">Applications Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-dark-text-white">{statistics.queriesResolved}</div>
                <div className="text-sm text-dark-text-light">Queries Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-dark-text-white">{statistics.documentsReviewed}</div>
                <div className="text-sm text-dark-text-light">Documents Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-dark-text-white">{statistics.averageResponseTime}</div>
                <div className="text-sm text-dark-text-light">Avg Response Time</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6">
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 text-sm font-medium mt-2 whitespace-nowrap transition-colors ${activeTab === tab.id
                        ? "bg-light-brand-primary text-dark-surface-bg1 border-b-2 rounded-t-lg border-white"
                        : "text-dark-text-light hover:text-dark-surface-bg2 hover:bg-gray-50"
                      }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className=" shadow-sm border border-border">
              <div className="px-4 py-5 sm:px-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600 mt-1">Update your personal details and contact information</p>
                </div>
                <button
                  onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {isEditingPersonal ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </>
                  )}
                </button>
              </div>
              <div className="px-4 py-5 sm:px-6">
                {isEditingPersonal ? (
                  <form onSubmit={handlePersonalInfoSave} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          defaultValue={userProfile.firstName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          defaultValue={userProfile.lastName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={userProfile.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          defaultValue={userProfile.phone}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          name="address"
                          defaultValue={userProfile.address}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          defaultValue={userProfile.city}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          defaultValue={userProfile.state}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          defaultValue={userProfile.zipCode}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          name="country"
                          defaultValue={userProfile.country}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          defaultValue={userProfile.dateOfBirth}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingPersonal(false)}
                        className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <Save className="h-4 w-4 mr-1 inline" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Full Name</div>
                        <div className="font-medium text-gray-900">
                          {userProfile.firstName} {userProfile.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium text-gray-900 break-all">{userProfile.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium text-gray-900">{userProfile.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Address</div>
                        <div className="font-medium text-gray-900">{userProfile.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">City, State</div>
                        <div className="font-medium text-gray-900">
                          {userProfile.city}, {userProfile.state} {userProfile.zipCode}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Date of Birth</div>
                        <div className="font-medium text-gray-900">{formatDate(userProfile.dateOfBirth)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Password Change */}
              <div className="bg-white rounded-xl shadow-sm border border-border">
                <div className="px-4 py-5 sm:px-6 border-b border-border flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600 mt-1">Change your account password</p>
                  </div>
                  <button
                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Change Password
                  </button>
                </div>
                {isEditingPassword && (
                  <div className="px-4 py-5 sm:px-6">
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            name="currentPassword"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditingPassword(false)}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-xl shadow-sm border border-border">
                <div className="px-4 py-5 sm:px-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                </div>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-500">
                          {userProfile.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setUserProfile((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${userProfile.twoFactorEnabled ? "bg-blue-600" : "bg-gray-200"
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userProfile.twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Login History */}
              <div className="bg-white rounded-xl shadow-sm border border-border">
                <div className="px-4 py-5 sm:px-6 border-b border-border">
                  <h3 className="text-lg font-semibold text-gray-900">Login History</h3>
                  <p className="text-sm text-gray-600 mt-1">Recent login activity on your account</p>
                </div>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-gray-900">Last Login</div>
                      <div className="text-sm text-gray-500">{formatDateTime(userProfile.lastLogin)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl shadow-sm border border-border">
              <div className="px-4 py-5 sm:px-6 border-b border-border">
                <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                <p className="text-sm text-gray-600 mt-1">Choose how you want to receive notifications</p>
              </div>
              <div className="px-4 py-5 sm:px-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Email Notifications</div>
                      <div className="text-sm text-gray-500">Receive notifications via email</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("email", !notifications.email)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications.email ? "bg-blue-600" : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">SMS Notifications</div>
                      <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("sms", !notifications.sms)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications.sms ? "bg-blue-600" : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.sms ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Push Notifications</div>
                      <div className="text-sm text-gray-500">Receive push notifications in browser</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("push", !notifications.push)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications.push ? "bg-blue-600" : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.push ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">System Updates</div>
                      <div className="text-sm text-gray-500">Receive notifications about system updates</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("updates", !notifications.updates)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notifications.updates ? "bg-blue-600" : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.updates ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div className="bg-white rounded-xl shadow-sm border border-border">
              <div className="px-4 py-5 sm:px-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600 mt-1">Your recent actions and activities</p>
                </div>
                <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex space-x-3 sm:space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                        {activity.id !== recentActivity[recentActivity.length - 1].id && (
                          <div className="h-8 w-px bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                          </div>
                          <div className="text-xs text-gray-400 mt-2 sm:mt-0">{formatDateTime(activity.timestamp)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
