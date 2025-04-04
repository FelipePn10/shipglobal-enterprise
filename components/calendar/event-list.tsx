import { EventCard } from "./event-card"

interface EventListProps {
  events: Array<{
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
  }>
  formatDate: (date: string) => string
  eventTypes: Array<{ value: string; label: string; color: string }>
}

export function EventList({ events, formatDate, eventTypes }: EventListProps) {
  if (events.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No events to display</div>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="space-y-2">
          <div className="text-sm text-muted-foreground">{formatDate(event.date)}</div>
          <EventCard event={event} eventTypes={eventTypes} />
        </div>
      ))}
    </div>
  )
}

