"use client";

import { useState, useCallback, useMemo } from "react";
import { format, isValid } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DialogFooter } from "@/components/ui/dialog";

// Define interfaces for type safety
interface EventType {
  value: string;
  label: string;
  color: string;
}
interface EventData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: "confirmed" | "tentative" | "cancelled"; // Match the type from Event
  location: string;
  attendees: string[];
  color: string;
}

interface EventFormProps {
  onSubmit: (event: EventData) => void;
  eventTypes: EventType[];
  initialDate?: Date;
}

export function EventForm({ onSubmit, eventTypes, initialDate = new Date() }: EventFormProps) {
  // Ensure initialDate is valid
  const validInitialDate = isValid(initialDate) ? initialDate : new Date();

  // State management
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: string;
    status: "confirmed" | "tentative" | "cancelled";
    location: string;
    attendees: string;
  }>({
    title: "",
    description: "",
    date: validInitialDate,
    startTime: "09:00",
    endTime: "10:00",
    type: "",
    status: "confirmed",
    location: "",
    attendees: "",
  });

  // Handle input changes
  const handleInputChange = useCallback(
    (field: keyof typeof formData, value: string | Date) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const selectedType = eventTypes.find((t) => t.value === formData.type);
      const eventColor = selectedType?.color || "#4f46e5";

      onSubmit({
        title: formData.title,
        description: formData.description,
        date: isValid(formData.date)
          ? format(formData.date, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type,
        status: formData.status,
        location: formData.location,
        attendees: formData.attendees
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
        color: eventColor,
      });
    },
    [formData, eventTypes, onSubmit]
  );

  // Status options
  const statusOptions = useMemo(
    () => [
      { value: "confirmed", label: "Confirmed" },
      { value: "tentative", label: "Tentative" },
      { value: "cancelled", label: "Cancelled" },
    ],
    []
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Event title"
            className="col-span-3"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
            autoFocus
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
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "col-span-3 justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date && isValid(formData.date)
                  ? format(formData.date, "PPP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && handleInputChange("date", date)}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
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
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
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
            <Input
              id="end-time"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="event-type" className="text-right">
            Type
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleInputChange("type", value)}
            required
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    <div
                      className="mr-2 h-3 w-3 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
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
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
            required
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
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
              value={formData.attendees}
              onChange={(e) => handleInputChange("attendees", e.target.value)}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={!formData.title || !formData.type}>
          Save Event
        </Button>
      </DialogFooter>
    </form>
  );
}