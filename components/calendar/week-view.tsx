"use client"

import { format, isSameDay, parseISO, isValid } from "date-fns"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  weekDates: Date[]
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
  onDateSelect: (date: Date) => void
  selectedDate: Date
  eventTypes: Array<{ value: string; label: string; color: string }>
}

export function WeekView({ weekDates, events, onDateSelect, selectedDate, eventTypes }: WeekViewProps) {
  // Ensure selectedDate is valid
  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          // Ensure date is valid
          if (!isValid(date)) return null

          return (
            <div
              key={date.toString()}
              className={cn(
                "text-center p-2 cursor-pointer rounded-md",
                isSameDay(date, validSelectedDate) ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
              onClick={() => onDateSelect(date)}
            >
              <div className="font-medium">{format(date, "EEE")}</div>
              <div className="text-sm">{format(date, "d")}</div>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-7 gap-1 h-[600px] border rounded-lg overflow-hidden">
        {weekDates.map((date) => {
          // Ensure date is valid
          if (!isValid(date)) return null

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

          return (
            <div
              key={date.toString()}
              className={cn(
                "border-r last:border-r-0 p-1 overflow-y-auto",
                isSameDay(date, new Date()) ? "bg-muted/30" : "",
              )}
            >
              <div className="text-xs font-medium mb-2 text-center">{format(date, "MMM d")}</div>
              <div className="space-y-1">
                {dayEvents.map((event) => {
                  const eventType = eventTypes.find((t) => t.value === event.type)
                  const color = event.color || (eventType ? eventType.color : "#4f46e5")

                  return (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded truncate"
                      style={{
                        backgroundColor: `${color}20`,
                        borderLeft: `3px solid ${color}`,
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-muted-foreground">
                        {event.startTime.substring(0, 5)} - {event.endTime.substring(0, 5)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

