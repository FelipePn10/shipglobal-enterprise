"use client";

import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

const events = [
  { id: 1, title: "Shipment Arrival - ID #8294", date: "2025-04-03", type: "shipment", status: "confirmed" },
  { id: 2, title: "Customs Inspection - ID #8294", date: "2025-04-05", type: "customs", status: "pending" },
  { id: 3, title: "Client Meeting - ABC Corp", date: "2025-04-08", type: "meeting", status: "confirmed" },
  { id: 4, title: "Warehouse Delivery - ID #8301", date: "2025-04-10", type: "delivery", status: "confirmed" },
  { id: 5, title: "Quarterly Review", date: "2025-04-15", type: "internal", status: "confirmed" },
  { id: 6, title: "New Shipment - ID #8315", date: "2025-04-18", type: "shipment", status: "tentative" },
  { id: 7, title: "Team Training", date: "2025-04-22", type: "internal", status: "confirmed" },
  { id: 8, title: "Client Onboarding - XYZ Inc", date: "2025-04-25", type: "meeting", status: "confirmed" },
]

const upcomingEvents = events
  .filter((event) => {
    const eventDate = new Date(event.date)
    const today = new Date()
    return eventDate >= today
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 5)

const typeColors = {
  shipment: "bg-blue-100 text-blue-800",
  customs: "bg-purple-100 text-purple-800",
  meeting: "bg-green-100 text-green-800",
  delivery: "bg-orange-100 text-orange-800",
  internal: "bg-gray-100 text-gray-800",
}

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedView, setSelectedView] = useState("month")
  const [filteredEvents, setFilteredEvents] = useState<typeof events>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  
  // Find events for the selected date
  const eventsForSelectedDate = selectedDate 
    ? events.filter(event => event.date === format(selectedDate, "yyyy-MM-dd"))
    : []
    
  // Date formatter helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMM dd, yyyy")
  }
  
  // Handle date selection in calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }
  
  // Filter events based on search and type
  const handleSearch = () => {
    let filtered = [...events]
    
    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedType) {
      filtered = filtered.filter(event => event.type === selectedType)
    }
    
    setFilteredEvents(filtered)
  }
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedType(null)
    setFilteredEvents([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Add a new event to your calendar. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-title" className="text-right">
                  Title
                </Label>
                <Input id="event-title" placeholder="Event title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-date" className="text-right">
                  Date
                </Label>
                <Input type="date" id="event-date" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-time" className="text-right">
                  Time
                </Label>
                <Input type="time" id="event-time" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shipment">Shipment</SelectItem>
                    <SelectItem value="customs">Customs</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-status" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="tentative">Tentative</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>View and manage your upcoming events</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="month" className="w-full" onValueChange={setSelectedView}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
              <TabsContent value="month" className="space-y-4">
                <div className="border rounded-lg p-3">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md"
                    initialFocus
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">
                    Events for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "April 1, 2025"}
                  </h3>
                  <div className="border rounded-lg divide-y">
                    {eventsForSelectedDate.length > 0 ? (
                      eventsForSelectedDate.map((event) => (
                        <div key={event.id} className="p-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">All day</p>
                          </div>
                          <Badge variant={
                            event.status === "confirmed" ? "default" : 
                            event.status === "tentative" ? "outline" : 
                            "secondary"
                          }>
                            {event.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 flex items-center justify-center">
                        <p className="text-muted-foreground">No events for this date</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="week">
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-1">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center font-medium p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 h-96 border rounded-lg overflow-hidden">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="border-r border-b p-2 h-full overflow-y-auto">
                        <div className="text-xs font-medium mb-2">
                          {format(
                            new Date(
                              new Date().setDate(
                                new Date().getDate() - new Date().getDay() + i
                              )
                            ),
                            "MMM d"
                          )}
                        </div>
                        <div className="space-y-1">
                          {events
                            .filter(event => {
                              const eventDate = new Date(event.date)
                              const weekDay = new Date(
                                new Date().setDate(
                                  new Date().getDate() - new Date().getDay() + i
                                )
                              )
                              return (
                                eventDate.getDate() === weekDay.getDate() &&
                                eventDate.getMonth() === weekDay.getMonth() &&
                                eventDate.getFullYear() === weekDay.getFullYear()
                              )
                            })
                            .map(event => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate ${
                                  typeColors[event.type as keyof typeof typeColors] || "bg-gray-100"
                                }`}
                              >
                                {event.title}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="day">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                      Previous
                    </Button>
                    <h3 className="font-medium">
                      {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Wednesday, April 2, 2025"}
                    </h3>
                    <Button variant="outline" size="sm">
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Button>
                  </div>
                  <div className="border rounded-lg h-96 overflow-y-auto">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const hour = i + 8 // Starting from 8 AM
                      const hourEvents = eventsForSelectedDate.filter(event => {
                        // This is simplified, in a real app you'd use event start/end times
                        return hour === 9 || hour === 11 || hour === 14 // Hardcoded for demo
                      })
                      
                      return (
                        <div key={i} className="flex border-b last:border-b-0">
                          <div className="w-16 p-2 text-xs text-muted-foreground border-r">
                            {hour % 12 || 12}{hour >= 12 ? "PM" : "AM"}
                          </div>
                          <div className="flex-1 p-2 relative min-h-16">
                            {hour === 9 && (
                              <div className="bg-blue-100 text-blue-800 p-2 rounded mb-1">
                                <p className="font-medium text-sm">Team Standup</p>
                                <p className="text-xs">9:00 AM - 9:30 AM</p>
                              </div>
                            )}
                            {hour === 11 && (
                              <div className="bg-gray-100 text-gray-800 p-2 rounded mb-1">
                                <p className="font-medium text-sm">Import Planning</p>
                                <p className="text-xs">11:00 AM - 12:00 PM</p>
                              </div>
                            )}
                            {hour === 14 && (
                              <div className="bg-green-100 text-green-800 p-2 rounded mb-1">
                                <p className="font-medium text-sm">Client Call - Global Imports</p>
                                <p className="text-xs">2:00 PM - 3:00 PM</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
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
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge 
                        variant={
                          event.status === "confirmed" ? "default" : 
                          event.status === "tentative" ? "outline" : 
                          "secondary"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-xs">
                      <Badge variant="outline" className="rounded-sm capitalize">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Event Search</CardTitle>
              <CardDescription>Find specific events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    placeholder="Search events..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Select 
                    onValueChange={(value) => setSelectedType(value)}
                    value={selectedType || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shipment">Shipment</SelectItem>
                      <SelectItem value="customs">Customs</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSearch}>Search</Button>
                  <Button variant="outline" onClick={resetFilters}>Reset</Button>
                </div>
                
                {filteredEvents.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Search Results</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredEvents.map((event) => (
                        <div key={event.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                          <div>
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              event.type === "shipment" ? "bg-blue-50 text-blue-800 border-blue-200" :
                              event.type === "customs" ? "bg-purple-50 text-purple-800 border-purple-200" :
                              event.type === "meeting" ? "bg-green-50 text-green-800 border-green-200" :
                              event.type === "delivery" ? "bg-orange-50 text-orange-800 border-orange-200" :
                              "bg-gray-50 text-gray-800 border-gray-200"
                            }`}
                          >
                            {event.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
              <CardDescription>Event distribution by type</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="space-y-4">
                {Object.entries({
                  "shipment": events.filter(e => e.type === "shipment").length,
                  "customs": events.filter(e => e.type === "customs").length,
                  "meeting": events.filter(e => e.type === "meeting").length,
                  "delivery": events.filter(e => e.type === "delivery").length,
                  "internal": events.filter(e => e.type === "internal").length,
                }).map(([type, count]) => (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{type}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          type === "shipment" ? "bg-blue-500" :
                          type === "customs" ? "bg-purple-500" :
                          type === "meeting" ? "bg-green-500" :
                          type === "delivery" ? "bg-orange-500" :
                          "bg-gray-500"
                        }`}
                        style={{ width: `${(count / events.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-4"></div> {/* Spacer */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage