"use client"

import { format, isSameMonth, isSameDay, parseISO, isValid } from "date-fns"
import { Calendar, CalendarProps } from "@/components/ui/calendar"
import { EventCard } from "./event-card"
import { cn } from "@/lib/utils"

// Define event interface
interface CalendarEvent {
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

// Define event type interface
interface EventType {
  value: string
  label: string
  color: string
}

// Define props for MonthView
interface MonthViewProps {
  selectedDate: Date
  onDateSelect: (date: Date | undefined) => void
  events: CalendarEvent[]
  eventTypes: EventType[]
}

// Define props for the Day component
interface DayProps {
  date: Date
  disabled?: boolean
  active?: boolean
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

  // Custom day render function
  const renderDay = (date: Date) => {
    // Get events for this day
    const dayEvents = events.filter((event) => {
      try {
        const eventDate = parseISO(event.date)
        return isValid(eventDate) && isSameDay(eventDate, date)
      } catch (error) {
        console.error("Invalid date:", event.date)
        return false
      }
    })

    const isToday = isSameDay(date, new Date())
    const isCurrentMonth = isSameMonth(date, validSelectedDate)

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center",
            isToday && "bg-primary text-primary-foreground rounded-full",
            !isCurrentMonth && "text-muted-foreground opacity-50"
          )}
        >
          {format(date, "d")}
        </div>
        {dayEvents.length > 0 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center">
            <div className="flex gap-0.5">
              {dayEvents.slice(0, 3).map((event, i) => {
                const eventType = eventTypes.find((t) => t.value === event.type)
                const color = event.color || eventType?.color || "#4f46e5"
                return (
                  <div
                    key={i}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )
              })}
              {dayEvents.length > 3 && (
                <div className="h-1 w-1 rounded-full bg-gray-400" />
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Custom Day component
  const DayComponent = ({ date, ...props }: DayProps) => (
    <button
      {...props}
      onClick={() => onDateSelect(date)}
      disabled={props.disabled}
      className={cn(props.disabled && "opacity-50 cursor-not-allowed")}
    >
      {renderDay(date)}
    </button>
  )

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-3">
        <Calendar
          mode="single"
          selected={validSelectedDate}
          onSelect={onDateSelect}
          className="rounded-md"
          components={{
            Day: DayComponent,
          }}
          initialFocus
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">
          Events for {format(validSelectedDate, "MMMM d, yyyy")}
        </h3>
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