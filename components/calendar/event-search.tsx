"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface EventSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedType: string | null
  setSelectedType: (type: string | null) => void
  eventTypes: Array<{ value: string; label: string; color: string }>
  handleSearch: () => void
  resetFilters: () => void
  filteredEvents: Array<{
    id: number
    title: string
    description?: string
    date: string
    type: string
    status: string
  }>
  formatDate: (date: string) => string
}

export function EventSearch({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  eventTypes,
  handleSearch,
  resetFilters,
  filteredEvents,
  formatDate,
}: EventSearchProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
        </div>
        <Select onValueChange={(value) => setSelectedType(value)} value={selectedType || undefined}>
          <SelectTrigger>
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
            </div>
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
      <div className="flex gap-2">
        <Button onClick={handleSearch} className="flex-1">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button variant="outline" onClick={resetFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {filteredEvents.length > 0 && (
        <div className="pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">Search Results ({filteredEvents.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredEvents.map((event) => {
              const eventType = eventTypes.find((t) => t.value === event.type)
              const color = eventType ? eventType.color : "#4f46e5"

              return (
                <div
                  key={event.id}
                  className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                      borderColor: `${color}40`,
                    }}
                  >
                    {eventType?.label || event.type}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

