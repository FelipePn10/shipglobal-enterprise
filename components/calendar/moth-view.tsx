"use client";

import { memo, useMemo } from "react";
import {
  format,
  isSameMonth,
  isSameDay,
  parseISO,
  isValid,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { EventCard } from "./event-card";
import { cn } from "@/lib/utils";

interface CalendarEvent {
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

interface MonthViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
  events: CalendarEvent[];
  eventTypes: EventType[];
}

interface DayProps {
  date: Date;
  disabled?: boolean;
  active?: boolean;
}

const EventCardItem = memo(({ event, eventTypes }: { event: CalendarEvent; eventTypes: EventType[] }) => (
  <div className="p-3" role="listitem">
    <EventCard event={event} eventTypes={eventTypes} />
  </div>
));

EventCardItem.displayName = "EventCardItem";

export function MonthView({ selectedDate, onDateSelect, events, eventTypes }: MonthViewProps) {
  // Stabilize validSelectedDate
  const validSelectedDate = useMemo(
    () => (isValid(selectedDate) ? selectedDate : new Date()),
    [selectedDate],
  );

  // Memoize events by date for the entire month
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, CalendarEvent[]> = {};
    const start = startOfMonth(validSelectedDate);
    const end = endOfMonth(validSelectedDate);
    const currentDate = new Date(start);
    while (currentDate <= end) {
      if (isValid(currentDate)) {
        grouped[currentDate.toISOString()] = events.filter((event) => {
          try {
            const eventDate = parseISO(event.date);
            return isValid(eventDate) && isSameDay(eventDate, currentDate);
          } catch {
            console.error(`Invalid date for event ID ${event.id}: ${event.date}`);
            return false;
          }
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return grouped;
    // Dependencies include events and validSelectedDate since they are props that can change
  }, [events, validSelectedDate]);

  // Get events for selected date
  const eventsForSelectedDate = eventsByDate[validSelectedDate.toISOString()] || [];

  // Custom day render function
  const renderDay = (date: Date) => {
    const dayEvents = eventsByDate[date.toISOString()] || [];
    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, validSelectedDate);

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "h-9 w-9 p-0 font-normal flex items-center justify-center",
            isToday && "bg-primary text-primary-foreground rounded-full",
            !isCurrentMonth && "text-muted-foreground opacity-50",
            isSameDay(date, validSelectedDate) && "bg-primary text-primary-foreground rounded-full",
          )}
        >
          {format(date, "d")}
        </div>
        {dayEvents.length > 0 && (
          <div
            className="absolute bottom-1 left-0 right-0 flex justify-center"
            aria-label={`Events for ${format(date, "MMMM d")}`}
          >
            <div className="flex gap-0.5">
              {dayEvents.slice(0, 3).map((event, i) => {
                const eventType = eventTypes.find((t) => t.value === event.type);
                const color = event.color || eventType?.color || "#4f46e5";
                return (
                  <div
                    key={`${event.id}-${i}`}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                );
              })}
              {dayEvents.length > 3 && (
                <div className="h-1 w-1 rounded-full bg-gray-400" aria-hidden="true" />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Custom Day component
  const DayComponent = ({ date, disabled, ...props }: DayProps) => (
    <button
      {...props}
      onClick={() => onDateSelect(date)}
      disabled={disabled}
      className={cn(
        disabled && "opacity-50 cursor-not-allowed",
        isSameDay(date, validSelectedDate) && "bg-primary text-primary-foreground",
      )}
      aria-label={`Select ${format(date, "EEEE, MMMM d")}`}
      data-selected={isSameDay(date, validSelectedDate)}
    >
      {renderDay(date)}
    </button>
  );

  return (
    <div className="space-y-4" aria-label="Monthly calendar view">
      <div className="border border-border rounded-lg p-3">
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
        <div className="border border-border rounded-lg divide-y" role="list">
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event) => (
              <EventCardItem key={event.id} event={event} eventTypes={eventTypes} />
            ))
          ) : (
            <div
              className="p-6 flex items-center justify-center"
              aria-label="No events for selected date"
            >
              <p className="text-muted-foreground">No events for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}