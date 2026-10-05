"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  Mail,
  Send,
  Reply,
  ReplyAll,
  Forward,
  Trash2,
  Archive,
  Star,
  StarOff,
  Search,
  Paperclip,
  Download,
  Plus,
  X,
  Inbox,
  SendIcon as Sent,
  DraftingCompassIcon as Drafts,
  SpellCheckIcon as Spam,
  RefreshCw,
} from "lucide-react"

interface Email {
  id: string
  from: string
  fromEmail: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  hasAttachments: boolean
  attachments?: Array<{
    id: string
    name: string
    size: string
    type: string
  }>
  folder: "inbox" | "sent" | "drafts" | "spam" | "trash"
  priority: "high" | "normal" | "low"
}

// interface Draft {
//   id: string
//   to: string
//   cc: string
//   bcc: string
//   subject: string
//   body: string
//   attachments: File[]
//   lastSaved: string
// }

export default function Email() {
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent" | "drafts" | "spam" | "trash">("inbox")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [isComposing, setIsComposing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  // const [showFilters, setShowFilters] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyType, setReplyType] = useState<"reply" | "replyAll" | "forward">("reply")
  const [showCcBcc, setShowCcBcc] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock email data
  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      from: "John Smith",
      fromEmail: "john.smith@example.com",
      to: ["admin@government.gov"],
      subject: "Application Status Update Required",
      body: `Dear Admin,

I hope this email finds you well. I am writing to inquire about the status of my birth certificate application (Reference: APP-2024-001) that I submitted on January 15th, 2024.

It has been over a week since I submitted all the required documents, and I haven't received any updates regarding the processing status. Could you please provide me with an update on when I can expect to receive my birth certificate?

I have attached copies of my identification documents for your reference. Please let me know if you need any additional information from my end.

Thank you for your time and assistance.

Best regards,
John Smith
Phone: +1 (555) 123-4567
Email: john.smith@example.com`,
      timestamp: "2024-01-22T10:30:00Z",
      isRead: false,
      isStarred: true,
      hasAttachments: true,
      attachments: [
        { id: "att1", name: "ID_Copy.pdf", size: "2.3 MB", type: "application/pdf" },
        { id: "att2", name: "Proof_of_Address.pdf", size: "1.8 MB", type: "application/pdf" },
      ],
      folder: "inbox",
      priority: "high",
    },
    {
      id: "2",
      from: "Sarah Johnson",
      fromEmail: "sarah.johnson@example.com",
      to: ["admin@government.gov"],
      subject: "Payment Confirmation Request",
      body: `Hello,

I made a payment of $50 for my passport application yesterday, but I haven't received a confirmation email yet. My transaction ID is TXN-789456123.

Could you please confirm that the payment was processed successfully?

Thank you,
Sarah Johnson`,
      timestamp: "2024-01-22T09:15:00Z",
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      folder: "inbox",
      priority: "normal",
    },
    {
      id: "3",
      from: "Admin Panel",
      fromEmail: "admin@government.gov",
      to: ["john.smith@example.com"],
      subject: "Re: Application Status Update Required",
      body: `Dear John Smith,

Thank you for your inquiry regarding your birth certificate application (Reference: APP-2024-001).

I'm pleased to inform you that your application has been processed and approved. Your birth certificate has been printed and will be mailed to your registered address within the next 2-3 business days.

You can track the delivery status using the tracking number: TRACK123456789

If you have any further questions, please don't hesitate to contact us.

Best regards,
Government Services Team`,
      timestamp: "2024-01-22T11:45:00Z",
      isRead: true,
      isStarred: false,
      hasAttachments: false,
      folder: "sent",
      priority: "normal",
    },
  ])

  const [composeData, setComposeData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    attachments: [] as File[],
  })

  const folders = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: emails.filter((e) => e.folder === "inbox" && !e.isRead).length },
    { id: "sent", label: "Sent", icon: Sent, count: emails.filter((e) => e.folder === "sent").length },
    { id: "drafts", label: "Drafts", icon: Drafts, count: emails.filter((e) => e.folder === "drafts").length },
    { id: "spam", label: "Spam", icon: Spam, count: emails.filter((e) => e.folder === "spam").length },
    { id: "trash", label: "Trash", icon: Trash2, count: emails.filter((e) => e.folder === "trash").length },
  ]

  const filteredEmails = emails.filter((email) => {
    const matchesFolder = email.folder === activeFolder
    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.body.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFolder && matchesSearch
  })

  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email)
    if (!email.isRead) {
      setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e)))
    }
    setIsReplying(false)
  }

  const handleCompose = () => {
    setIsComposing(true)
    setSelectedEmail(null)
    setIsReplying(false)
    setComposeData({
      to: "",
      cc: "",
      bcc: "",
      subject: "",
      body: "",
      attachments: [],
    })
  }

  const handleReply = (type: "reply" | "replyAll" | "forward") => {
    if (!selectedEmail) return
    setReplyType(type)
    setIsReplying(true)
    setIsComposing(false)

    let toEmails = ""
    let subject = ""
    let body = ""

    switch (type) {
      case "reply":
        toEmails = selectedEmail.fromEmail
        subject = selectedEmail.subject.startsWith("Re:") ? selectedEmail.subject : `Re: ${selectedEmail.subject}`
        body = `\n\n--- Original Message ---\nFrom: ${selectedEmail.from} <${selectedEmail.fromEmail}>\nDate: ${new Date(
          selectedEmail.timestamp,
        ).toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`
        break
      case "replyAll":
        toEmails = [
          selectedEmail.fromEmail,
          ...selectedEmail.to.filter((email) => email !== "admin@government.gov"),
        ].join(", ")
        subject = selectedEmail.subject.startsWith("Re:") ? selectedEmail.subject : `Re: ${selectedEmail.subject}`
        body = `\n\n--- Original Message ---\nFrom: ${selectedEmail.from} <${selectedEmail.fromEmail}>\nDate: ${new Date(
          selectedEmail.timestamp,
        ).toLocaleString()}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`
        break
      case "forward":
        subject = selectedEmail.subject.startsWith("Fwd:") ? selectedEmail.subject : `Fwd: ${selectedEmail.subject}`
        body = `\n\n--- Forwarded Message ---\nFrom: ${selectedEmail.from} <${selectedEmail.fromEmail}>\nDate: ${new Date(
          selectedEmail.timestamp,
        ).toLocaleString()}\nTo: ${selectedEmail.to.join(", ")}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`
        break
    }

    setComposeData({
      to: toEmails,
      cc: "",
      bcc: "",
      subject,
      body,
      attachments: [],
    })
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    const newEmail: Email = {
      id: Date.now().toString(),
      from: "Admin Panel",
      fromEmail: "admin@government.gov",
      to: composeData.to.split(",").map((email) => email.trim()),
      cc: composeData.cc ? composeData.cc.split(",").map((email) => email.trim()) : undefined,
      bcc: composeData.bcc ? composeData.bcc.split(",").map((email) => email.trim()) : undefined,
      subject: composeData.subject,
      body: composeData.body,
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      hasAttachments: composeData.attachments.length > 0,
      attachments: composeData.attachments.map((file, index) => ({
        id: `att${Date.now()}_${index}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.type,
      })),
      folder: "sent",
      priority: "normal",
    }

    setEmails((prev) => [newEmail, ...prev])
    setIsComposing(false)
    setIsReplying(false)
    alert("Email sent successfully!")
  }

  const handleStarToggle = (emailId: string) => {
    setEmails((prev) => prev.map((email) => (email.id === emailId ? { ...email, isStarred: !email.isStarred } : email)))
  }

  const handleDelete = (emailIds: string[]) => {
    setEmails((prev) => prev.map((email) => (emailIds.includes(email.id) ? { ...email, folder: "trash" } : email)))
    setSelectedEmails([])
    if (selectedEmail && emailIds.includes(selectedEmail.id)) {
      setSelectedEmail(null)
    }
  }

  const handleArchive = (emailIds: string[]) => {
    // In a real app, you'd have an archive folder
    void emailIds;
    
    alert("Emails archived successfully!")
    setSelectedEmails([])
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setComposeData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeAttachment = (index: number) => {
    setComposeData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  // const getPriorityColor = (priority: string) => {
  //   switch (priority) {
  //     case "high":
  //       return "text-red-600"
  //     case "low":
  //       return "text-green-600"
  //     default:
  //       return "text-gray-600"
  //   }
  // }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                  <Mail className="mr-3 h-8 w-8 text-blue-600" />
                  Email Management
                </h1>
                <p className="text-gray-600 mt-1">Manage your emails and communications</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </button>
                <button
                  onClick={handleCompose}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Compose
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
            {/* Sidebar */}
            <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
              <div className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Folders */}
                <nav className="space-y-1">
                  {folders.map((folder) => {
                    const Icon = folder.icon
                    return (
                      <button
                        key={folder.id}
                        onClick={() => setActiveFolder(folder.id as any)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeFolder === folder.id ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="h-4 w-4 mr-3" />
                          {folder.label}
                        </div>
                        {folder.count > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {folder.count}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Email List */}
            <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white overflow-y-auto">
              {/* Email List Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedEmails.length === filteredEmails.length && filteredEmails.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmails(filteredEmails.map((email) => email.id))
                        } else {
                          setSelectedEmails([])
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">
                      {filteredEmails.length} email{filteredEmails.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {selectedEmails.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleArchive(selectedEmails)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedEmails)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Email List Items */}
              <div className="divide-y divide-gray-200">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => handleEmailSelect(email)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedEmail?.id === email.id ? "bg-blue-50 border-r-2 border-blue-600" : ""
                    } ${!email.isRead ? "bg-blue-25" : ""}`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedEmails.includes(email.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          if (e.target.checked) {
                            setSelectedEmails([...selectedEmails, email.id])
                          } else {
                            setSelectedEmails(selectedEmails.filter((id) => id !== email.id))
                          }
                        }}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <p
                              className={`text-sm truncate ${!email.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}
                            >
                              {email.from}
                            </p>
                            {email.hasAttachments && <Paperclip className="h-3 w-3 text-gray-400" />}
                            {email.isStarred && <Star className="h-3 w-3 text-yellow-400 fill-current" />}
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(email.timestamp)}</span>
                        </div>
                        <p
                          className={`text-sm mb-1 truncate ${!email.isRead ? "font-medium text-gray-900" : "text-gray-600"}`}
                        >
                          {email.subject}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{email.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredEmails.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No emails found</p>
                </div>
              )}
            </div>

            {/* Email Content */}
            <div className="flex-1 bg-white overflow-y-auto">
              {(isComposing || isReplying) && (
                <div className="h-full flex flex-col">
                  {/* Compose Header */}
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isReplying ? `${replyType.charAt(0).toUpperCase() + replyType.slice(1)}` : "New Message"}
                      </h3>
                      <button
                        onClick={() => {
                          setIsComposing(false)
                          setIsReplying(false)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Compose Form */}
                  <form onSubmit={handleSendEmail} className="flex-1 flex flex-col">
                    <div className="px-6 py-4 space-y-4 border-b border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                          type="email"
                          value={composeData.to}
                          onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="recipient@example.com"
                          required
                        />
                      </div>

                      {showCcBcc && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CC</label>
                            <input
                              type="email"
                              value={composeData.cc}
                              onChange={(e) => setComposeData({ ...composeData, cc: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="cc@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">BCC</label>
                            <input
                              type="email"
                              value={composeData.bcc}
                              onChange={(e) => setComposeData({ ...composeData, bcc: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="bcc@example.com"
                            />
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setShowCcBcc(!showCcBcc)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {showCcBcc ? "Hide" : "Show"} CC/BCC
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                          type="text"
                          value={composeData.subject}
                          onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Email subject"
                          required
                        />
                      </div>

                      {/* Attachments */}
                      {composeData.attachments.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                          <div className="space-y-2">
                            {composeData.attachments.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                              >
                                <div className="flex items-center space-x-2">
                                  <Paperclip className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email Body */}
                    <div className="flex-1 px-6 py-4">
                      <textarea
                        value={composeData.body}
                        onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                        className="w-full h-full min-h-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Write your message here..."
                        required
                      />
                    </div>

                    {/* Compose Footer */}
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <Paperclip className="h-4 w-4 mr-1" />
                            Attach
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsComposing(false)
                              setIsReplying(false)
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {selectedEmail && !isComposing && !isReplying && (
                <div className="h-full flex flex-col">
                  {/* Email Header */}
                  <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedEmail.subject}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{selectedEmail.from}</span>
                            <span className="text-gray-400 mx-2">&lt;{selectedEmail.fromEmail}&gt;</span>
                          </div>
                          <span>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <span>To: {selectedEmail.to.join(", ")}</span>
                          {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                            <span className="block">CC: {selectedEmail.cc.join(", ")}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleStarToggle(selectedEmail.id)}
                          className={`p-2 rounded-md transition-colors ${
                            selectedEmail.isStarred
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-gray-400 hover:text-gray-600"
                          }`}
                        >
                          {selectedEmail.isStarred ? (
                            <Star className="h-5 w-5 fill-current" />
                          ) : (
                            <StarOff className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReply("reply")}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                        >
                          <Reply className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReply("replyAll")}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                        >
                          <ReplyAll className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReply("forward")}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                        >
                          <Forward className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete([selectedEmail.id])}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Attachments */}
                    {selectedEmail.hasAttachments && selectedEmail.attachments && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEmail.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md"
                            >
                              <Paperclip className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{attachment.name}</span>
                              <span className="text-xs text-gray-500">({attachment.size})</span>
                              <button className="text-blue-600 hover:text-blue-700">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email Body */}
                  <div className="flex-1 px-6 py-6 overflow-y-auto">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">{selectedEmail.body}</div>
                    </div>
                  </div>

                  {/* Email Actions */}
                  <div className="border-t border-gray-200 px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => handleReply("reply")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </button>
                      <button
                        onClick={() => handleReply("replyAll")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <ReplyAll className="h-4 w-4 mr-1" />
                        Reply All
                      </button>
                      <button
                        onClick={() => handleReply("forward")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Forward className="h-4 w-4 mr-1" />
                        Forward
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!selectedEmail && !isComposing && !isReplying && (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Mail className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No email selected</h3>
                    <p className="text-gray-500">Select an email from the list to read it, or compose a new message.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
