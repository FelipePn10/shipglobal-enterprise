import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NotificationProps {
  id: string
  title: string
  message: string
  timestamp: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
  actionLabel?: string
  actionUrl?: string
  className?: string
}

export function NotificationCard({
  title,
  message,
  timestamp,
  type,
  read,
  actionLabel,
  actionUrl,
  className,
}: NotificationProps) {
  return (
    <Card
      className={cn("transition-all duration-200 hover:shadow-sm", !read && "border-l-4 border-l-primary", className)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {getNotificationIcon(type)}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className={cn("text-sm font-medium", !read && "font-semibold")}>{title}</h3>
                {!read && (
                  <Badge variant="outline" className="h-5 px-1 text-[10px]">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{message}</p>
              <div className="flex items-center gap-4">
                <time className="text-xs text-muted-foreground">{timestamp}</time>
                {actionLabel && actionUrl && (
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                    {actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
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
              className="lucide lucide-more-horizontal"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
            <span className="sr-only">Options</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getNotificationIcon(type: string) {
  const baseClasses = "flex h-8 w-8 items-center justify-center rounded-full";
  
  switch (type) {
    case 'info':
      return (
        <div className={cn(baseClasses, "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
      );
    case 'warning':
      return (
        <div className={cn(baseClasses, "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 17h.01"/></svg>
        </div>
      );
    case 'error':
      return (
        <div className={cn(baseClasses, "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
        </div>
      );
    case 'success':
      return (
        <div className={cn(baseClasses, "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
        </div>
      );
    default:
      return (
        <div className={cn(baseClasses, "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
      );
  }
}

