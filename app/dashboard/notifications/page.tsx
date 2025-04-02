"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Package, FileText, MessageSquare, DollarSign, CheckCircle, MoreHorizontal, Settings } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New document uploaded",
      message: "Certificate of Origin for IMP-2023-0042",
      timestamp: "2 hours ago",
      type: "document",
      read: false,
    },
    {
      id: 2,
      title: "Shipment status updated",
      message: "Electronics Shipment is now in transit",
      timestamp: "5 hours ago",
      type: "import",
      read: false,
    },
    {
      id: 3,
      title: "New message received",
      message: "Sarah Johnson sent you a message about customs documentation",
      timestamp: "Yesterday",
      type: "message",
      read: true,
    },
    {
      id: 4,
      title: "Payment received",
      message: "Payment of $8,500 for shipping costs has been processed",
      timestamp: "2 days ago",
      type: "finance",
      read: true,
    },
    {
      id: 5,
      title: "Customs clearance completed",
      message: "Furniture Import has cleared customs",
      timestamp: "3 days ago",
      type: "import",
      read: true,
    },
    {
      id: 6,
      title: "Document requires attention",
      message: "Certificate of Origin for Textile Materials needs revision",
      timestamp: "4 days ago",
      type: "document",
      read: true,
    },
    {
      id: 7,
      title: "New team member added",
      message: "Jennifer Lee has been added to your team",
      timestamp: "1 week ago",
      type: "system",
      read: true,
    },
    {
      id: 8,
      title: "Invoice due soon",
      message: "Invoice #INV-2023-0056 is due in 3 days",
      timestamp: "1 week ago",
      type: "finance",
      read: true,
    },
  ])

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
  }

  // Mark single notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "import":
        return <Package className="h-5 w-5 text-indigo-400" />
      case "document":
        return <FileText className="h-5 w-5 text-rose-400" />
      case "message":
        return <MessageSquare className="h-5 w-5 text-amber-400" />
      case "finance":
        return <DollarSign className="h-5 w-5 text-green-400" />
      case "system":
        return <Bell className="h-5 w-5 text-purple-400" />
      default:
        return <Bell className="h-5 w-5 text-white/60" />
    }
  }

  // Filter notifications based on tab
  const getFilteredNotifications = (filter: string) => {
    if (filter === "all") return notifications
    if (filter === "unread") return notifications.filter((notification) => !notification.read)
    return notifications.filter((notification) => notification.type === filter)
  }

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Notifications</h1>
            <p className="text-white/60">Stay updated with your import operations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:bg-white/5"
              onClick={markAllAsRead}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/5">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60 relative"
          >
            Unread
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="import"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Imports
          </TabsTrigger>
          <TabsTrigger
            value="document"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="finance"
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
          >
            Finances
          </TabsTrigger>
        </TabsList>

        {["all", "unread", "import", "document", "finance", "message", "system"].map((filter) => (
          <TabsContent key={filter} value={filter} className="space-y-4 mt-6">
            {getFilteredNotifications(filter).length > 0 ? (
              getFilteredNotifications(filter).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    notification.read
                      ? "bg-white/5 hover:bg-white/[0.07]"
                      : "bg-white/[0.07] hover:bg-white/[0.09] border-l-2 border-indigo-500"
                  }`}
                >
                  <div className="p-2 bg-white/5 rounded-full flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${notification.read ? "text-white/90" : "text-white"}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm ${notification.read ? "text-white/60" : "text-white/80"}`}>
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-white/40 text-xs">{notification.timestamp}</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
                      {!notification.read && (
                        <DropdownMenuItem
                          className="text-white/80 hover:text-white focus:text-white"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-400 hover:text-red-300 focus:text-red-300"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-white/20" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No notifications</h3>
                <p className="text-white/60 max-w-md">
                  {filter === "unread"
                    ? "You've read all your notifications. Great job staying up to date!"
                    : `You don't have any ${filter === "all" ? "" : filter + " "}notifications at the moment.`}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">Notification Settings</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white/[0.03] rounded-md">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="text-white/90 font-medium">Import Status Updates</p>
                <p className="text-white/60 text-sm">Notifications about your shipment status changes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-white/80 hover:bg-white/5">
                Configure
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/[0.03] rounded-md">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-rose-400" />
              <div>
                <p className="text-white/90 font-medium">Document Alerts</p>
                <p className="text-white/60 text-sm">Notifications about document uploads and requirements</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-white/80 hover:bg-white/5">
                Configure
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/[0.03] rounded-md">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-white/90 font-medium">Message Notifications</p>
                <p className="text-white/60 text-sm">Notifications about new messages and communications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-white/80 hover:bg-white/5">
                Configure
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center p-3 bg-white/[0.03] rounded-md">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-white/90 font-medium">Financial Alerts</p>
                <p className="text-white/60 text-sm">Notifications about payments, invoices, and financial updates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-white/10 text-white/80 hover:bg-white/5">
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}