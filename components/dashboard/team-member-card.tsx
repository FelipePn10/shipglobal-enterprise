import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TeamMemberProps {
  id: string
  name: string
  role: string
  avatar?: string
  initials: string
  status: "online" | "offline" | "away" | "busy"
  email: string
  phone?: string
  department?: string
  className?: string
}

export function TeamMemberCard({
  name,
  role,
  avatar,
  initials,
  status,
  email,
  phone,
  department,
  className,
}: TeamMemberProps) {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-md", className)}>
      <CardContent className="p-0">
        <div className="flex flex-col items-center p-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                status === "online" && "bg-green-500",
                status === "offline" && "bg-gray-400",
                status === "away" && "bg-yellow-500",
                status === "busy" && "bg-red-500",
              )}
            />
          </div>
          <h3 className="mt-3 text-base font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
          {department && (
            <Badge variant="outline" className="mt-1">
              {department}
            </Badge>
          )}
        </div>
        <div className="border-t border-border p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mail text-muted-foreground"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span className="text-muted-foreground">{email}</span>
          </div>
          {phone && (
            <div className="flex items-center gap-2 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-phone text-muted-foreground"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="text-muted-foreground">{phone}</span>
            </div>
          )}
        </div>
        <div className="flex border-t border-border">
          <Button variant="ghost" className="flex-1 rounded-none py-2 text-xs">
            Message
          </Button>
          <div className="w-px bg-border" />
          <Button variant="ghost" className="flex-1 rounded-none py-2 text-xs">
            Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

