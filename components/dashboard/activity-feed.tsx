import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ActivityType = "message" | "update" | "alert" | "document" | "payment"

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
    initials: string
  }
  status?: "success" | "warning" | "error" | "info"
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  className?: string
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 border-t border-border p-4 transition-colors hover:bg-muted/50"
            >
              {activity.user && (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                </Avatar>
              )}
              {!activity.user && getActivityIcon(activity.type, activity.status)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <time className="text-xs text-muted-foreground">{activity.timestamp}</time>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                {activity.status && (
                  <Badge variant={getVariantFromStatus(activity.status)} className="mt-1">
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getActivityIcon(type: ActivityType, status?: string) {
  const baseClasses = "flex h-9 w-9 items-center justify-center rounded-full"

  switch (type) {
    case "message":
      return (
        <div className={cn(baseClasses, "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-message-circle"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
      )
    case "update":
      return (
        <div className={cn(baseClasses, "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-refresh-cw"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </div>
      )
    case "alert":
      return (
        <div className={cn(baseClasses, "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-alert-triangle"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>
      )
    case "document":
      return (
        <div className={cn(baseClasses, "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-file-text"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
          </svg>
        </div>
      )
    case "payment":
      return (
        <div className={cn(baseClasses, "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-credit-card"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>
      )
    default:
      return (
        <div className={cn(baseClasses, "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
      )
  }
}

function getVariantFromStatus(status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined {
  switch (status) {
    case "success":
      return "default"
    case "warning":
      return "secondary"
    case "error":
      return "destructive"
    case "info":
      return "outline"
    default:
      return "default"
  }
}