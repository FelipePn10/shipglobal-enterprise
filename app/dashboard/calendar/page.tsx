"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
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
  isBefore,
  isEqual,
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
import { toast } from "@/components/ui/use-toast"; // Assuming a toast component exists
import { DayView } from "@/components/calendar/day-view";
import { EventForm } from "@/components/calendar/event-form";
import { EventList } from "@/components/calendar/event-list";
import { EventSearch } from "@/components/calendar/event-search";
import { EventStatistics } from "@/components/calendar/event-statistics";
import { WeekView } from "@/components/calendar/week-view";
import { MonthView } from "@/components/calendar/moth-view";
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

// Event type definitions
const eventTypes: EventType[] = [
  { value: "meeting", label: "Meeting", color: "#4f46e5" },
  { value: "presentation", label: "Presentation", color: "#0ea5e9" },
  { value: "deadline", label: "Deadline", color: "#ef4444" },
  { value: "training", label: "Training", color: "#f59e0b" },
  { value: "social", label: "Social", color: "#10b981" },
  { value: "planning", label: "Planning", color: "#8b5cf6" },
  { value: "event", label: "Event", color: "#ec4899" },
];

// Utility function to validate event times
const validateEventTimes = (startTime: string, endTime: string): boolean => {
  try {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const start = new Date(2025, 0, 1, startHours, startMinutes);
    const end = new Date(2025, 0, 1, endHours, endMinutes);
    return isBefore(start, end) || isEqual(start, end);
  } catch {
    return false;
  }
};

export default function CalendarPage() {
  // State
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

  // Memoized valid dates to prevent hook dependency issues
  const validSelectedDate = useMemo(() => {
    return isValid(selectedDate) ? selectedDate : new Date();
  }, [selectedDate]);

  const validWeekStartDate = useMemo(() => {
    return isValid(weekStartDate)
      ? weekStartDate
      : startOfWeek(new Date(), { weekStartsOn: 0 });
  }, [weekStartDate]);

  // Memoized computations
  const eventsForSelectedDate = useMemo(() => {
    return events.filter((event) => {
      try {
        const eventDate = parseISO(event.date);
        return isValid(eventDate) && isSameDay(eventDate, validSelectedDate);
      } catch {
        return false;
      }
    });
  }, [events, validSelectedDate]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return events
      .filter((event) => {
        try {
          const eventDate = parseISO(event.date);
          return isValid(eventDate) && (isEqual(eventDate, today) || isBefore(today, eventDate));
        } catch {
          return false;
        }
      })
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
      .slice(0, 5);
  }, [events]);

  const weekDates = useMemo(() => {
    try {
      return eachDayOfInterval({
        start: validWeekStartDate,
        end: endOfWeek(validWeekStartDate, { weekStartsOn: 0 }),
      });
    } catch {
      return eachDayOfInterval({
        start: startOfWeek(new Date(), { weekStartsOn: 0 }),
        end: endOfWeek(new Date(), { weekStartsOn: 0 }),
      });
    }
  }, [validWeekStartDate]);

  // Handlers
  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (date && isValid(date)) {
      setSelectedDate(new Date(date));
    }
  }, []);

  const handleAddEvent = useCallback((newEvent: Omit<Event, "id">) => {
    // Validate event
    if (!newEvent.title) {
      toast({
        title: "Error",
        description: "Event title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEventTimes(newEvent.startTime, newEvent.endTime)) {
      toast({
        title: "Error",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    try {
      const eventDate = parseISO(newEvent.date);
      if (!isValid(eventDate)) {
        toast({
          title: "Error",
          description: "Invalid event date.",
          variant: "destructive",
        });
        return;
      }
    } catch {
      toast({
        title: "Error",
        description: "Invalid date format.",
        variant: "destructive",
      });
      return;
    }

    setEvents((prevEvents) => [
      ...prevEvents,
      {
        ...newEvent,
        id: prevEvents.length > 0 ? Math.max(...prevEvents.map((e) => e.id)) + 1 : 1,
      },
    ]);
    setIsAddEventOpen(false);
    toast({
      title: "Success",
      description: "Event added successfully.",
    });
  }, []);

  const handleSearch = useCallback(() => {
    try {
      const filtered = events.filter((event) => {
        const matchesQuery = searchQuery
          ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.description &&
              event.description.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
        const matchesType = selectedType ? event.type === selectedType : true;
        return matchesQuery && matchesType;
      });
      setFilteredEvents(filtered);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search events.",
        variant: "destructive",
      });
      setFilteredEvents([]);
    }
  }, [events, searchQuery, selectedType]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedType(null);
    setFilteredEvents([]);
  }, []);

  const navigatePrevious = useCallback(() => {
    switch (selectedView) {
      case "day":
        setSelectedDate(subDays(validSelectedDate, 1));
        break;
      case "week":
        setWeekStartDate(subDays(validWeekStartDate, 7));
        break;
      case "month":
        setSelectedDate(new Date(validSelectedDate.getFullYear(), validSelectedDate.getMonth() - 1, 1));
        break;
    }
  }, [selectedView, validSelectedDate, validWeekStartDate]);

  const navigateNext = useCallback(() => {
    switch (selectedView) {
      case "day":
        setSelectedDate(addDays(validSelectedDate, 1));
        break;
      case "week":
        setWeekStartDate(addDays(validWeekStartDate, 7));
        break;
      case "month":
        setSelectedDate(new Date(validSelectedDate.getFullYear(), validSelectedDate.getMonth() + 1, 1));
        break;
    }
  }, [selectedView, validSelectedDate, validWeekStartDate]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setWeekStartDate(startOfWeek(today, { weekStartsOn: 0 }));
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid Date";
    } catch {
      return "Invalid Date";
    }
  }, []);

  // Effect to trigger search when query or type changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedType, handleSearch]);

  return (
    <div className="container mx-auto py-6 space-y-6 text-white/80">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">Calendar</h1>
        <nav className="flex items-center gap-2">
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
            aria-label={`Go to previous ${selectedView}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={navigateNext}
            className="border-white/10 text-white/80 hover:bg-white/5"
            aria-label={`Go to next ${selectedView}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span
            className="font-medium mx-2 text-white/90"
            aria-live="polite"
            aria-label={`Current ${selectedView} view`}
          >
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
                  Add a new event to your calendar. Fill in the details and click save.
                </DialogDescription>
              </DialogHeader>
              <EventForm
                onSubmit={handleAddEvent}
                eventTypes={eventTypes}
                initialDate={validSelectedDate}
              />
            </DialogContent>
          </Dialog>
        </nav>
      </header>

      <main className="grid gap-6 md:grid-cols-3">
        <section className="md:col-span-2">
          <Card className="border-white/10 bg-white/5">
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
              <Tabs
                value={selectedView}
                onValueChange={(value) =>
                  setSelectedView(value as "month" | "week" | "day")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-4 border-white/10 bg-white/5">
                  {(["month", "week", "day"] as const).map((view) => (
                    <TabsTrigger
                      key={view}
                      value={view}
                      className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white capitalize"
                      aria-label={`${view} view`}
                    >
                      {view}
                    </TabsTrigger>
                  ))}
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
        </section>

        <aside className="space-y-6">
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
        </aside>
      </main>
    </div>
  );
}