"use client";

import { memo, useMemo } from "react";
import { format, isSameDay, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";

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

interface EventType {
  value: string;
  label: string;
  color: string;
}

interface WeekViewProps {
  weekDates: Date[];
  events: Event[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  eventTypes: EventType[];
}

const EventItem = memo(
  ({ event, eventTypes }: { event: Event; eventTypes: EventType[] }) => {
    const eventType = eventTypes.find((t) => t.value === event.type);
    const color = event.color || (eventType ? eventType.color : "#4f46e5");

    return (
      <div
        className="text-xs p-1 rounded truncate"
        style={{
          backgroundColor: `${color}20`,
          borderLeft: `3px solid ${color}`,
        }}
        aria-label={`${event.title} from ${event.startTime} to ${event.endTime}`}
      >
        <div className="font-medium">{event.title}</div>
        <div className="text-muted-foreground">
          {event.startTime.substring(0, 5)} - {event.endTime.substring(0, 5)}
        </div>
      </div>
    );
  },
);

EventItem.displayName = "EventItem";

export function WeekView({
  weekDates,
  events,
  onDateSelect,
  selectedDate,
  eventTypes,
}: WeekViewProps) {
  // Ensure selectedDate is valid
  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date();

  // Memoize events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    weekDates.forEach((date) => {
      if (isValid(date)) {
        grouped[date.toISOString()] = events.filter((event) => {
          try {
            const eventDate = parseISO(event.date);
            return isValid(eventDate) && isSameDay(eventDate, date);
          } catch {
            console.error(`Invalid date for event ID ${event.id}: ${event.date}`);
            return false;
          }
        });
      }
    });
    return grouped;
    // Dependencies include weekDates and events since they are props that can change
  }, [weekDates, events]);

  // Fallback for empty weekDates
  if (!weekDates.length) {
    return (
      <div
        className="text-center text-muted-foreground"
        aria-label="No dates available"
      >
        No dates available for this week
      </div>
    );
  }

  return (
    <div className="space-y-4" role="grid" aria-label="Weekly calendar view">
      {/* Date Selector Row */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((date) => {
          if (!isValid(date)) return null;

          return (
            <div
              key={date.toString()}
              className={cn(
                "text-center p-2 cursor-pointer rounded-md",
                isSameDay(date, validSelectedDate)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
              onClick={() => onDateSelect(date)}
              role="gridcell"
              aria-selected={isSameDay(date, validSelectedDate)}
              aria-label={`Select ${format(date, "EEEE, MMMM d")}`}
            >
              <div className="font-medium">{format(date, "EEE")}</div>
              <div className="text-sm">{format(date, "d")}</div>
            </div>
          );
        })}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-7 gap-1 h-[600px] border border-border rounded-lg overflow-hidden">
        {weekDates.map((date) => {
          if (!isValid(date)) return null;

          const dayEvents = eventsByDate[date.toISOString()] || [];

          return (
            <div
              key={date.toString()}
              className={cn(
                "border-r last:border-r-0 p-1 overflow-y-auto",
                isSameDay(date, new Date()) ? "bg-muted/30" : "",
              )}
              role="gridcell"
              aria-label={`Events for ${format(date, "MMMM d")}`}
            >
              <div className="text-xs font-medium mb-2 text-center">
                {format(date, "MMM d")}
              </div>
              <div className="space-y-1">
                {dayEvents.length === 0 ? (
                  <div
                    className="text-xs text-muted-foreground text-center"
                    aria-label="No events"
                  >
                    No events
                  </div>
                ) : (
                  dayEvents.map((event) => (
                    <EventItem
                      key={event.id}
                      event={event}
                      eventTypes={eventTypes}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}