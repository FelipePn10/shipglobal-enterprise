"use client";

import { useState, useCallback, useMemo } from "react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
  isSameDay,
  isValid,
} from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DayView } from "@/components/calendar/day-view";
import { EventForm } from "@/components/calendar/event-form";
import { EventList } from "@/components/calendar/event-list";
import { EventSearch } from "@/components/calendar/event-search";
import { EventStatistics } from "@/components/calendar/event-statistics";
import { MonthView } from "@/components/calendar/moth-view";
import { WeekView } from "@/components/calendar/week-view";

// Types
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: "confirmed" | "tentative" | "cancelled";
  location: string;
  attendees: string[];
  color: string;
}

interface EventType {
  value: string;
  label: string;
  color: string;
}

// Sample event data
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Team Meeting",
    description: "Weekly team sync to discuss project progress",
    date: "2025-04-04",
    startTime: "09:00",
    endTime: "10:00",
    type: "meeting",
    status: "confirmed",
    location: "Conference Room A",
    attendees: ["John Doe", "Jane Smith"],
    color: "#4f46e5",
  },
  {
    id: 2,
    title: "Product Demo",
    description: "Showcase new features to the client",
    date: "2025-04-05",
    startTime: "13:00",
    endTime: "14:30",
    type: "presentation",
    status: "confirmed",
    location: "Virtual - Zoom",
    attendees: ["Client Team", "Product Team"],
    color: "#0ea5e9",
  },
  {
    id: 3,
    title: "Project Deadline",
    description: "Final submission for Phase 1",
    date: "2025-04-08",
    startTime: "17:00",
    endTime: "17:00",
    type: "deadline",
    status: "confirmed",
    location: "",
    attendees: [],
    color: "#ef4444",
  },
  {
    id: 4,
    title: "Training Session",
    description: "New tool onboarding for the team",
    date: "2025-04-10",
    startTime: "11:00",
    endTime: "12:30",
    type: "training",
    status: "confirmed",
    location: "Training Room B",
    attendees: ["All Team Members"],
    color: "#f59e0b",
  },
  {
    id: 5,
    title: "Client Meeting",
    description: "Quarterly review with major client",
    date: "2025-04-15",
    startTime: "14:00",
    endTime: "15:30",
    type: "meeting",
    status: "tentative",
    location: "Client Office",
    attendees: ["Sales Team", "Client Representatives"],
    color: "#4f46e5",
  },
  {
    id: 6,
    title: "Team Building",
    description: "Outdoor activities and lunch",
    date: "2025-04-18",
    startTime: "12:00",
    endTime: "17:00",
    type: "social",
    status: "confirmed",
    location: "City Park",
    attendees: ["All Employees"],
    color: "#10b981",
  },
  {
    id: 7,
    title: "Strategy Planning",
    description: "Q3 planning session",
    date: "2025-04-22",
    startTime: "09:00",
    endTime: "16:00",
    type: "planning",
    status: "confirmed",
    location: "Board Room",
    attendees: ["Leadership Team"],
    color: "#8b5cf6",
  },
  {
    id: 8,
    title: "Product Launch",
    description: "Official launch of new product line",
    date: "2025-04-25",
    startTime: "10:00",
    endTime: "12:00",
    type: "event",
    status: "confirmed",
    location: "Main Auditorium",
    attendees: ["All Departments", "Press"],
    color: "#ec4899",
  },
];

// Event type definitions with colors
const eventTypes: EventType[] = [
  { value: "meeting", label: "Meeting", color: "#4f46e5" },
  { value: "presentation", label: "Presentation", color: "#0ea5e9" },
  { value: "deadline", label: "Deadline", color: "#ef4444" },
  { value: "training", label: "Training", color: "#f59e0b" },
  { value: "social", label: "Social", color: "#10b981" },
  { value: "planning", label: "Planning", color: "#8b5cf6" },
  { value: "event", label: "Event", color: "#ec4899" },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<"month" | "week" | "day">("month");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );

  // Ensure dates are valid
  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date();
  const validWeekStartDate = isValid(weekStartDate)
    ? weekStartDate
    : startOfWeek(new Date(), { weekStartsOn: 0 });

  // Get events for the selected date
  const eventsForSelectedDate = useMemo(() => {
    return events.filter((event) => {
      const eventDate = parseISO(event.date);
      return isValid(eventDate) && isSameDay(eventDate, validSelectedDate);
    });
  }, [events, validSelectedDate]);

  // Get upcoming events (sorted by date)
  const upcomingEvents = useMemo(() => {
    return [...events]
      .filter((event) => {
        const eventDate = parseISO(event.date);
        const today = new Date();
        return isValid(eventDate) && eventDate >= today;
      })
      .sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  }, [events]);

  // Handle date selection in calendar
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date && isValid(date)) {
      setSelectedDate(date);
    }
  }, []);

  // Handle adding a new event
  const handleAddEvent = useCallback(
    (newEvent: Omit<Event, "id">) => {
      const eventWithId: Event = {
        ...newEvent,
        id: events.length + 1,
      };
      setEvents((prevEvents) => [...prevEvents, eventWithId]);
      setIsAddEventOpen(false);
    },
    [events]
  );

  // Handle event search
  const handleSearch = useCallback(() => {
    let filtered = [...events];

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description &&
            event.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedType) {
      filtered = filtered.filter((event) => event.type === selectedType);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedType]);

  // Reset search filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedType(null);
    setFilteredEvents([]);
  }, []);

  // Navigate to previous day/week/month
  const navigatePrevious = useCallback(() => {
    if (selectedView === "day") {
      setSelectedDate(subDays(validSelectedDate, 1));
    } else if (selectedView === "week") {
      setWeekStartDate(subDays(validWeekStartDate, 7));
    } else {
      const prevMonth = new Date(validSelectedDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setSelectedDate(prevMonth);
    }
  }, [selectedView, validSelectedDate, validWeekStartDate]);

  // Navigate to next day/week/month
  const navigateNext = useCallback(() => {
    if (selectedView === "day") {
      setSelectedDate(addDays(validSelectedDate, 1));
    } else if (selectedView === "week") {
      setWeekStartDate(addDays(validWeekStartDate, 7));
    } else {
      const nextMonth = new Date(validSelectedDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setSelectedDate(nextMonth);
    }
  }, [selectedView, validSelectedDate, validWeekStartDate]);

  // Navigate to today
  const goToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setWeekStartDate(startOfWeek(today, { weekStartsOn: 0 }));
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : dateString;
  }, []);

  // Get week dates for week view
  const weekDates = useMemo(() => {
    return eachDayOfInterval({
      start: validWeekStartDate,
      end: endOfWeek(validWeekStartDate, { weekStartsOn: 0 }),
    });
  }, [validWeekStartDate]);

  return (
    <div className="container mx-auto py-6 space-y-6 text-white/80">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="border-white/10 text-white/80 hover:bg-white/5"
            aria-label="Go to today"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={navigatePrevious}
            className="border-white/10 text-white/80 hover:bg-white/5"
            aria-label="Go to previous period"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={navigateNext}
            className="border-white/10 text-white/80 hover:bg-white/5"
            aria-label="Go to next period"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-medium mx-2 text-white/90">
            {selectedView === "day" && format(validSelectedDate, "MMMM d, yyyy")}
            {selectedView === "week" &&
              `${format(validWeekStartDate, "MMM d")} - ${format(
                endOfWeek(validWeekStartDate, { weekStartsOn: 0 }),
                "MMM d, yyyy"
              )}`}
            {selectedView === "month" && format(validSelectedDate, "MMMM yyyy")}
          </span>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600"
                aria-label="Add new event"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] border-white/10 bg-white/5 text-white/80">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Event</DialogTitle>
                <DialogDescription className="text-white/60">
                  Add a new event to your calendar. Fill in the details and click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <EventForm
                onSubmit={handleAddEvent}
                eventTypes={eventTypes}
                initialDate={validSelectedDate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-white/10 bg-white/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Schedule</CardTitle>
                <CardDescription className="text-white/60">
                  View and manage your events
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as "month" | "week" | "day")} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4 border-white/10 bg-white/5">
                <TabsTrigger
                  value="month"
                  className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  aria-label="Month view"
                >
                  Month
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  aria-label="Week view"
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="day"
                  className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
                  aria-label="Day view"
                >
                  Day
                </TabsTrigger>
              </TabsList>
              <TabsContent value="month" className="mt-0">
                <MonthView
                  selectedDate={validSelectedDate}
                  onDateSelect={handleDateSelect}
                  events={events}
                  eventTypes={eventTypes}
                />
              </TabsContent>
              <TabsContent value="week" className="mt-0">
                <WeekView
                  weekDates={weekDates}
                  events={events}
                  onDateSelect={handleDateSelect}
                  selectedDate={validSelectedDate}
                  eventTypes={eventTypes}
                />
              </TabsContent>
              <TabsContent value="day" className="mt-0">
                <DayView
                  selectedDate={validSelectedDate}
                  events={eventsForSelectedDate}
                  eventTypes={eventTypes}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Events</CardTitle>
              <CardDescription className="text-white/60">
                Your next 5 scheduled events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventList
                events={upcomingEvents}
                formatDate={formatDate}
                eventTypes={eventTypes}
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Event Search</CardTitle>
              <CardDescription className="text-white/60">
                Find specific events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                eventTypes={eventTypes}
                handleSearch={handleSearch}
                resetFilters={resetFilters}
                filteredEvents={filteredEvents}
                formatDate={formatDate}
              />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Event Statistics</CardTitle>
              <CardDescription className="text-white/60">
                Event distribution by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventStatistics events={events} eventTypes={eventTypes} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}