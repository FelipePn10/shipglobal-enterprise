"use client"
import { format, isSameMonth, isSameDay, parseISO, isValid } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { EventCard } from "./event-card"
import { cn } from "@/lib/utils"

interface MonthViewProps {
  selectedDate: Date
  onDateSelect: (date: Date | undefined) => void
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
  eventTypes: Array<{ value: string; label: string; color: string }>
}

export function MonthView({ selectedDate, onDateSelect, events, eventTypes }: MonthViewProps) {
  // Ensure selectedDate is valid
  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date()

  // Get events for the selected date
  const eventsForSelectedDate = events.filter((event) => {
    try {
      const eventDate = parseISO(event.date)
      return isValid(eventDate) && isSameDay(eventDate, validSelectedDate)
    } catch (error) {
      console.error("Invalid date:", event.date)
      return false
    }
  })

  // Custom day render for the calendar to show event indicators
  const renderDay = (day: Date | undefined) => {
    // Ensure day is valid
    if (!day || !isValid(day)) {
      return <div className="h-9 w-9 p-0 font-normal">-</div>
    }

    // Get events for this day
    const dayEvents = events.filter((event) => {
      try {
        // Parse the event date string to a Date object
        const eventDate = parseISO(event.date)
        // Use isSameDay for safer date comparison
        return isValid(eventDate) && isSameDay(eventDate, day)
      } catch (error) {
        // Handle invalid date strings
        console.error("Invalid date:", event.date)
        return false
      }
    })

    // Check if this day is today
    const isToday = isSameDay(day, new Date())

    // Check if this day is in the current month
    const isCurrentMonth = isSameMonth(day, validSelectedDate)

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
            isToday ? "bg-primary text-primary-foreground rounded-full" : "",
            !isCurrentMonth ? "text-muted-foreground opacity-50" : "",
          )}
        >
          {format(day, "d")}
        </div>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center">
            <div className="flex gap-0.5">
              {dayEvents.slice(0, 3).map((event, i) => {
                const eventType = eventTypes.find((t) => t.value === event.type)
                const color = event.color || (eventType ? eventType.color : "#4f46e5")
                return <div key={i} className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
              })}
              {dayEvents.length > 3 && <div className="h-1 w-1 rounded-full bg-gray-400" />}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-3">
        <Calendar
          mode="single"
          selected={validSelectedDate}
          onSelect={onDateSelect}
          className="rounded-md"
          components={{
            Day: ({ day, ...props }) => (
              <button {...props} onClick={() => (day && isValid(day) ? onDateSelect(day) : null)}>
                {renderDay(day)}
              </button>
            ),
          }}
          initialFocus
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Events for {format(validSelectedDate, "MMMM d, yyyy")}</h3>
        <div className="border rounded-lg divide-y">
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event) => (
              <div key={event.id} className="p-3">
                <EventCard event={event} eventTypes={eventTypes} />
              </div>
            ))
          ) : (
            <div className="p-6 flex items-center justify-center">
              <p className="text-muted-foreground">No events for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

