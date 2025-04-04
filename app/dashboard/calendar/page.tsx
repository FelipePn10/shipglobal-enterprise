"use client"

import { useState } from "react"
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
} from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { DayView } from "@/components/calendar/day-view"
import { EventForm } from "@/components/calendar/event-form"
import { EventList } from "@/components/calendar/event-list"
import { EventSearch } from "@/components/calendar/event-search"
import { EventStatistics } from "@/components/calendar/event-statistics"
import { MonthView } from "@/components/calendar/moth-view"
import { WeekView } from "@/components/calendar/week-view"


// Sample event data
const initialEvents = [
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
]

// Event type definitions with colors
const eventTypes = [
  { value: "meeting", label: "Meeting", color: "#4f46e5" },
  { value: "presentation", label: "Presentation", color: "#0ea5e9" },
  { value: "deadline", label: "Deadline", color: "#ef4444" },
  { value: "training", label: "Training", color: "#f59e0b" },
  { value: "social", label: "Social", color: "#10b981" },
  { value: "planning", label: "Planning", color: "#8b5cf6" },
  { value: "event", label: "Event", color: "#ec4899" },
]

export default function CalendarPage() {
  const [events, setEvents] = useState(initialEvents)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedView, setSelectedView] = useState("month")
  const [filteredEvents, setFilteredEvents] = useState<typeof initialEvents>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))

  // Ensure dates are valid
  const validSelectedDate = isValid(selectedDate) ? selectedDate : new Date()
  const validWeekStartDate = isValid(weekStartDate) ? weekStartDate : startOfWeek(new Date(), { weekStartsOn: 0 })

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

  // Get upcoming events (sorted by date)
  const upcomingEvents = [...events]
    .filter((event) => {
      try {
        const eventDate = parseISO(event.date)
        const today = new Date()
        return isValid(eventDate) && eventDate >= today
      } catch (error) {
        console.error("Invalid date:", event.date)
        return false
      }
    })
    .sort((a, b) => {
      try {
        const dateA = parseISO(a.date)
        const dateB = parseISO(b.date)
        if (isValid(dateA) && isValid(dateB)) {
          return dateA.getTime() - dateB.getTime()
        }
        return 0
      } catch (error) {
        console.error("Error sorting dates:", error)
        return 0
      }
    })
    .slice(0, 5)

  // Handle date selection in calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date && isValid(date)) {
      setSelectedDate(date)
    }
  }

  // Handle adding a new event
  const handleAddEvent = (newEvent: any) => {
    const eventWithId = {
      ...newEvent,
      id: events.length + 1,
    }
    setEvents([...events, eventWithId])
    setIsAddEventOpen(false)
  }

  // Handle event search
  const handleSearch = () => {
    let filtered = [...events]

    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedType) {
      filtered = filtered.filter((event) => event.type === selectedType)
    }

    setFilteredEvents(filtered)
  }

  // Reset search filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedType(null)
    setFilteredEvents([])
  }

  // Navigate to previous day/week/month
  const navigatePrevious = () => {
    if (selectedView === "day") {
      setSelectedDate(subDays(validSelectedDate, 1))
    } else if (selectedView === "week") {
      setWeekStartDate(subDays(validWeekStartDate, 7))
    } else {
      // Month view - go to previous month
      const prevMonth = new Date(validSelectedDate)
      prevMonth.setMonth(prevMonth.getMonth() - 1)
      setSelectedDate(prevMonth)
    }
  }

  // Navigate to next day/week/month
  const navigateNext = () => {
    if (selectedView === "day") {
      setSelectedDate(addDays(validSelectedDate, 1))
    } else if (selectedView === "week") {
      setWeekStartDate(addDays(validWeekStartDate, 7))
    } else {
      // Month view - go to next month
      const nextMonth = new Date(validSelectedDate)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      setSelectedDate(nextMonth)
    }
  }

  // Navigate to today
  const goToToday = () => {
    const today = new Date()
    setSelectedDate(today)
    setWeekStartDate(startOfWeek(today, { weekStartsOn: 0 }))
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      if (isValid(date)) {
        return format(date, "MMM dd, yyyy")
      }
      return dateString
    } catch (error) {
      console.error("Error formatting date:", dateString)
      return dateString
    }
  }

  // Get week dates for week view
  const weekDates = eachDayOfInterval({
    start: validWeekStartDate,
    end: endOfWeek(validWeekStartDate, { weekStartsOn: 0 }),
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-medium mx-2">
            {selectedView === "day" && format(validSelectedDate, "MMMM d, yyyy")}
            {selectedView === "week" &&
              `${format(validWeekStartDate, "MMM d")} - ${format(endOfWeek(validWeekStartDate, { weekStartsOn: 0 }), "MMM d, yyyy")}`}
            {selectedView === "month" && format(validSelectedDate, "MMMM yyyy")}
          </span>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Add a new event to your calendar. Fill in the details and click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <EventForm onSubmit={handleAddEvent} eventTypes={eventTypes} initialDate={validSelectedDate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>View and manage your events</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
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
                <DayView selectedDate={validSelectedDate} events={eventsForSelectedDate} eventTypes={eventTypes} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next 5 scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <EventList events={upcomingEvents} formatDate={formatDate} eventTypes={eventTypes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Search</CardTitle>
              <CardDescription>Find specific events</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
              <CardDescription>Event distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <EventStatistics events={events} eventTypes={eventTypes} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

