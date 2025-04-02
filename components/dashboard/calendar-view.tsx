import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  type: "shipment" | "meeting" | "deadline" | "payment" | "other"
  status?: "upcoming" | "completed" | "cancelled"
}

interface CalendarViewProps {
  events: CalendarEvent[]
  currentMonth: string
  className?: string
}

export function CalendarView({ events, currentMonth, className }: CalendarViewProps) {
  // Get current date for highlighting today
  const today = new Date().getDate()
  const currentMonthNum = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // Generate days for the current month view
  const daysInMonth = new Date(currentYear, currentMonthNum + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonthNum, 1).getDay()

  // Create calendar grid
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const previousMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => null)
  const calendarDays = [...previousMonthDays, ...days]

  // Group events by date
  const eventsByDate: Record<string, CalendarEvent[]> = {}
  events.forEach((event) => {
    const date = new Date(event.date).getDate()
    if (!eventsByDate[date]) {
      eventsByDate[date] = []
    }
    eventsByDate[date].push(event)
  })

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
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
              className="lucide lucide-chevron-left h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <span className="text-sm font-medium">{currentMonth}</span>
          <Button variant="outline" size="sm">
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
              className="lucide lucide-chevron-right h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                "aspect-square rounded-md p-1",
                day === today ? "bg-primary/10 font-bold text-primary" : "",
                day === null ? "opacity-0" : "hover:bg-muted cursor-pointer",
              )}
            >
              {day !== null && (
                <>
                  <div className="text-xs">{day}</div>
                  {eventsByDate[day] && (
                    <div className="mt-1 flex flex-wrap gap-0.5">
                      {eventsByDate[day].slice(0, 2).map((event, i) => (
                        <div
                          key={i}
                          className={cn("h-1.5 w-1.5 rounded-full", getEventTypeColor(event.type))}
                          title={event.title}
                        />
                      ))}
                      {eventsByDate[day].length > 2 && (
                        <div className="text-[10px] text-muted-foreground">+{eventsByDate[day].length - 2}</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Upcoming Events</h4>
          <div className="space-y-2">
            {events
              .filter((event) => new Date(event.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", getEventTypeColor(event.type))} />
                    <span className="font-medium">{event.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(event.date)}
                      {event.time && ` · ${event.time}`}
                    </span>
                    {event.status && (
                      <Badge variant={getStatusVariant(event.status)} className="text-[10px]">
                        {event.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
          {events.filter((event) => new Date(event.date) >= new Date()).length > 3 && (
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View All Events
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function getEventTypeColor(type: string): string {
  switch (type) {
    case "shipment":
      return "bg-blue-500"
    case "meeting":
      return "bg-purple-500"
    case "deadline":
      return "bg-red-500"
    case "payment":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

function getStatusVariant(status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined {
  switch (status) {
    case "upcoming":
      return "secondary"
    case "completed":
      return "default"
    case "cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}