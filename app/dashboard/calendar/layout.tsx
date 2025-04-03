import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendar",
  description: "View and manage your import schedule and events",
}

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return children
}