"use client";

import { useMemo } from "react";
import { isValid } from "date-fns";

// Define interfaces for type safety
interface EventType {
  value: string;
  label: string;
  color: string;
}

interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  location?: string;
  attendees?: string[];
  color?: string;
}

interface DayViewProps {
  selectedDate: Date;
  events: Event[];
  eventTypes: EventType[];
}

export function DayView({ selectedDate, events, eventTypes }: DayViewProps) {
  // Create array of hours from 7 AM to 8 PM
  const hours = useMemo(() => Array.from({ length: 14 }, (_, i) => i + 7), []);

  // Sort events by start time
  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events]
  );

  // Helper to parse time string
  const parseTime = useMemo(
    () => ({
      getHour: (timeString: string): number => {
        const hour = Number.parseInt(timeString.split(":")[0], 10);
        return isNaN(hour) ? 0 : hour;
      },
      getMinute: (timeString: string): number => {
        const minute = Number.parseInt(timeString.split(":")[1], 10);
        return isNaN(minute) ? 0 : minute;
      },
      formatTime: (time: string): string => {
        const [hours, minutes] = time.split(":");
        const hour = Number.parseInt(hours, 10);
        if (isNaN(hour) || !minutes) return time;
        return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
      },
    }),
    []
  );

  // Validate selectedDate (used in conditional rendering if needed)
  if (!isValid(selectedDate)) {
    console.warn("Invalid date provided, using current date");
    selectedDate = new Date();
  }

  return (
    <div className="h-[600px] overflow-y-auto rounded-lg border">
      {hours.map((hour) => {
        // Find events that start in this hour
        const hourEvents = sortedEvents.filter(
          (event) => parseTime.getHour(event.startTime) === hour
        );

        return (
          <div key={hour} className="flex border-b last:border-b-0">
            <div className="sticky left-0 w-16 flex-col justify-start border-r bg-background p-2 text-xs text-muted-foreground">
              <span>
                {hour % 12 || 12}
                {hour >= 12 ? "PM" : "AM"}
              </span>
            </div>
            <div className="relative min-h-20 flex-1 p-2">
              {hourEvents.map((event) => {
                const eventType = eventTypes.find((t) => t.value === event.type);
                const color = event.color || eventType?.color || "#4f46e5";

                // Calculate position and duration
                const topOffset =
                  (parseTime.getMinute(event.startTime) / 60) * 100;

                const startHour = parseTime.getHour(event.startTime);
                const startMinute = parseTime.getMinute(event.startTime);
                const endHour = parseTime.getHour(event.endTime);
                const endMinute = parseTime.getMinute(event.endTime);

                const startTotalMinutes = startHour * 60 + startMinute;
                const endTotalMinutes = endHour * 60 + endMinute;
                const durationMinutes = Math.max(
                  endTotalMinutes - startTotalMinutes,
                  15
                ); // Minimum 15 minutes

                const height = (durationMinutes / 60) * 100;

                return (
                  <div
                    key={event.id}
                    className="absolute left-2 right-2 overflow-hidden rounded p-2"
                    style={{
                      top: `${topOffset}%`,
                      height: `${Math.max(height, 5)}%`,
                      backgroundColor: `${color}20`,
                      borderLeft: `3px solid ${color}`,
                      minHeight: "24px",
                    }}
                    role="button"
                    tabIndex={0}
                    title={event.title}
                  >
                    <div className="truncate text-sm font-medium">
                      {event.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {parseTime.formatTime(event.startTime)} -{" "}
                      {parseTime.formatTime(event.endTime)}
                    </div>
                    {event.location && (
                      <div className="truncate text-xs text-muted-foreground">
                        {event.location}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}