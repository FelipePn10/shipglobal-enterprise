import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface EventStatisticsProps {
  events: Array<{
    id: number
    type: string
  }>
  eventTypes: Array<{ value: string; label: string; color: string }>
}

export function EventStatistics({ events, eventTypes }: EventStatisticsProps) {
  // Count events by type
  const eventCounts = eventTypes
    .map((type) => {
      const count = events.filter((event) => event.type === type.value).length
      return {
        name: type.label,
        value: count,
        color: type.color,
      }
    })
    .filter((item) => item.value > 0)

  // Sort by count (descending)
  eventCounts.sort((a, b) => b.value - a.value)

  return (
    <div className="space-y-4">
      {eventCounts.length > 0 ? (
        <>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventCounts} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value} events`, ""]}
                  labelStyle={{ color: "#000" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {eventCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {eventCounts.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-muted-foreground">No event data available</div>
      )}
    </div>
  )
}

