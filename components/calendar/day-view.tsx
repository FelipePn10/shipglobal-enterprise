"use client"
import { isValid } from "date-fns"

interface DayViewProps {
  selectedDate: Date
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

export function DayView({ selectedDate, events, eventTypes }: DayViewProps) {
  // Ensure selectedDate is valid
  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date()

  // Create array of hours from 7 AM to 8 PM
  const hours = Array.from({ length: 14 }, (_, i) => i + 7)

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })

  // Helper to get hour from time string (e.g., "09:00" -> 9)
  const getHour = (timeString: string) => {
    try {
      return Number.parseInt(timeString.split(":")[0], 10)
    } catch (error) {
      console.error("Invalid time format:", timeString)
      return 0
    }
  }

  // Helper to get minute from time string (e.g., "09:30" -> 30)
  const getMinute = (timeString: string) => {
    try {
      return Number.parseInt(timeString.split(":")[1], 10)
    } catch (error) {
      console.error("Invalid time format:", timeString)
      return 0
    }
  }

  // Format time for display
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":")
      const hour = Number.parseInt(hours, 10)
      return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`
    } catch (error) {
      console.error("Invalid time format:", time)
      return time
    }
  }

  return (
    <div className="border rounded-lg h-[600px] overflow-y-auto">
      {hours.map((hour) => {
        // Find events that start in this hour
        const hourEvents = sortedEvents.filter((event) => {
          const eventHour = getHour(event.startTime)
          return eventHour === hour
        })

        return (
          <div key={hour} className="flex border-b last:border-b-0">
            <div className="w-16 p-2 text-xs text-muted-foreground border-r flex flex-col justify-start sticky left-0 bg-background">
              <span>
                {hour % 12 || 12}
                {hour >= 12 ? "PM" : "AM"}
              </span>
            </div>
            <div className="flex-1 p-2 relative min-h-20">
              {hourEvents.map((event) => {
                const eventType = eventTypes.find((t) => t.value === event.type)
                const color = event.color || (eventType ? eventType.color : "#4f46e5")

                // Calculate position based on minutes
                const topOffset = (getMinute(event.startTime) / 60) * 100

                // Calculate duration in minutes
                const startHour = getHour(event.startTime)
                const startMinute = getMinute(event.startTime)
                const endHour = getHour(event.endTime)
                const endMinute = getMinute(event.endTime)

                const startTotalMinutes = startHour * 60 + startMinute
                const endTotalMinutes = endHour * 60 + endMinute
                const durationMinutes = endTotalMinutes - startTotalMinutes

                // Calculate height based on duration (1 hour = 100% height)
                const height = (durationMinutes / 60) * 100

                return (
                  <div
                    key={event.id}
                    className="absolute left-2 right-2 rounded p-2 overflow-hidden"
                    style={{
                      top: `${topOffset}%`,
                      height: `${Math.max(height, 5)}%`, // Ensure minimum height
                      backgroundColor: `${color}20`,
                      borderLeft: `3px solid ${color}`,
                      minHeight: "24px",
                    }}
                  >
                    <div className="font-medium text-sm truncate">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

