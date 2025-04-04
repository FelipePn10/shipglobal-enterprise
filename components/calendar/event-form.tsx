"use client"

import type React from "react"

import { useState } from "react"
import { format, isValid } from "date-fns"
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { DialogFooter } from "@/components/ui/dialog"

interface EventFormProps {
  onSubmit: (event: any) => void
  eventTypes: Array<{ value: string; label: string; color: string }>
  initialDate?: Date
}

export function EventForm({ onSubmit, eventTypes, initialDate = new Date() }: EventFormProps) {
  // Ensure initialDate is valid
  const validInitialDate = isValid(initialDate) ? initialDate : new Date()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(validInitialDate)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("confirmed")
  const [location, setLocation] = useState("")
  const [attendees, setAttendees] = useState("")
  const [color, setColor] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Find the color for the selected event type
    const selectedType = eventTypes.find((t) => t.value === type)
    const eventColor = color || (selectedType ? selectedType.color : "#4f46e5")

    onSubmit({
      title,
      description,
      date: date && isValid(date) ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
      startTime,
      endTime,
      type,
      status,
      location,
      attendees: attendees
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a),
      color: eventColor,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Event title"
            className="col-span-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Event description"
            className="col-span-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date && isValid(date) ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="start-time" className="text-right">
            Start Time
          </Label>
          <div className="col-span-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="end-time" className="text-right">
            End Time
          </Label>
          <div className="col-span-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-type" className="text-right">
            Type
          </Label>
          <Select value={type} onValueChange={setType} required>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }}></div>
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-status" className="text-right">
            Status
          </Label>
          <Select value={status} onValueChange={setStatus} required>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="tentative">Tentative</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Location
          </Label>
          <div className="col-span-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="attendees" className="text-right">
            Attendees
          </Label>
          <div className="col-span-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Input
              id="attendees"
              placeholder="Comma-separated list of attendees"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save Event</Button>
      </DialogFooter>
    </form>
  )
}

