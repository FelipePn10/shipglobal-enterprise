import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventCardProps {
  event: {
    id: number
    title: string
    description?: string
    date: string
    startTime: string
    endTime: string
    type: string
    status: string
    location?: string
    attendees?: string[]
    color?: string
  }
  eventTypes: Array<{ value: string; label: string; color: string }>
  compact?: boolean
}

export function EventCard({ event, eventTypes, compact = false }: EventCardProps) {
  // Find the event type to get the label and color
  const eventType = eventTypes.find((t) => t.value === event.type)
  const eventColor = event.color || (eventType ? eventType.color : "#4f46e5")

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`
  }

  if (compact) {
    return (
      <div
        className="p-2 rounded-md mb-1 text-sm"
        style={{ backgroundColor: `${eventColor}20`, borderLeft: `3px solid ${eventColor}` }}
      >
        <div className="font-medium truncate">{event.title}</div>
        <div className="text-xs flex items-center text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </div>
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-1" style={{ backgroundColor: eventColor }}></div>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{event.title}</h4>
            <Badge
              variant={
                event.status === "confirmed" ? "default" : event.status === "tentative" ? "outline" : "secondary"
              }
            >
              {event.status}
            </Badge>
          </div>

          {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </div>

          {event.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {event.location}
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              {event.attendees.length} attendee{event.attendees.length !== 1 ? "s" : ""}
            </div>
          )}

          <div className="flex items-center">
            <Badge variant="outline" className={cn("rounded-sm capitalize", `hover:bg-${eventType?.value}-50`)}>
              <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: eventColor }}></div>
              {eventType?.label || event.type}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

