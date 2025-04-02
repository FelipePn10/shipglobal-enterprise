"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Mail, Phone, UserPlus } from "lucide-react"
import Image from "next/image"

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // Mock team members data
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      role: "Import Manager",
      department: "Operations",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Customs Specialist",
      department: "Compliance",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 234-5678",
      avatar: "/placeholder.svg",
      status: "active",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Logistics Coordinator",
      department: "Operations",
      email: "michael.chen@example.com",
      phone: "+1 (555) 345-6789",
      avatar: "/placeholder.svg",
      status: "active",
    },
    {
      id: 4,
      name: "Emma Davis",
      role: "Account Manager",
      department: "Sales",
      email: "emma.davis@example.com",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg",
      status: "active",
    },
    {
      id: 5,
      name: "Robert Wilson",
      role: "Finance Analyst",
      department: "Finance",
      email: "robert.wilson@example.com",
      phone: "+1 (555) 567-8901",
      avatar: "/placeholder.svg",
      status: "inactive",
    },
    {
      id: 6,
      name: "Jennifer Lee",
      role: "Documentation Specialist",
      department: "Compliance",
      email: "jennifer.lee@example.com",
      phone: "+1 (555) 678-9012",
      avatar: "/placeholder.svg",
      status: "active",
    },
    {
      id: 7,
      name: "David Brown",
      role: "Warehouse Manager",
      department: "Operations",
      email: "david.brown@example.com",
      phone: "+1 (555) 789-0123",
      avatar: "/placeholder.svg",
      status: "active",
    },
    {
      id: 8,
      name: "Lisa Martinez",
      role: "Customer Support",
      department: "Customer Service",
      email: "lisa.martinez@example.com",
      phone: "+1 (555) 890-1234",
      avatar: "/placeholder.svg",
      status: "active",
    },
  ]

  // Filter team members based on search and department
  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (departmentFilter === "all") return matchesSearch
    return matchesSearch && member.department === departmentFilter
  })

  // Get unique departments for filter
  const departments = [...new Set(teamMembers.map((member) => member.department))]

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Team</h1>
            <p className="text-white/60">Manage your team members and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
            >
              All Members
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
            >
              Inactive
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 w-full md:w-[250px]"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white/80 w-full md:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-lg border-white/10">
                <SelectItem value="all" className="text-white/80 hover:text-white focus:text-white">
                  All Departments
                </SelectItem>
                {departments.map((department) => (
                  <SelectItem
                    key={department}
                    value={department}
                    className="text-white/80 hover:text-white focus:text-white"
                  >
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                          member.status === "active" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{member.name}</h3>
                      <p className="text-white/60 text-sm">{member.role}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
                      <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                        Manage Permissions
                      </DropdownMenuItem>
                      {member.status === "active" ? (
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300">
                          Deactivate
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-400 hover:text-green-300 focus:text-green-300">
                          Activate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-white/40" />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-white/70 text-sm hover:text-white/90 transition-colors"
                    >
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-white/40" />
                    <a
                      href={`tel:${member.phone}`}
                      className="text-white/70 text-sm hover:text-white/90 transition-colors"
                    >
                      {member.phone}
                    </a>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">Department</span>
                    <span className="text-white/90 text-sm font-medium">{member.department}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTeamMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No team members found</h3>
              <p className="text-white/60 max-w-md">
                {searchQuery || departmentFilter !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "You don't have any team members yet. Add your first team member to get started."}
              </p>
              {!searchQuery && departmentFilter === "all" && (
                <Button className="mt-6 bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeamMembers
              .filter((member) => member.status === "active")
              .map((member) => (
                <div
                  key={member.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black bg-green-500"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{member.name}</h3>
                        <p className="text-white/60 text-sm">{member.role}</p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
                        <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                          Manage Permissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:text-red-300 focus:text-red-300">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-white/40" />
                      <a
                        href={`mailto:${member.email}`}
                        className="text-white/70 text-sm hover:text-white/90 transition-colors"
                      >
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-white/40" />
                      <a
                        href={`tel:${member.phone}`}
                        className="text-white/70 text-sm hover:text-white/90 transition-colors"
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Department</span>
                      <span className="text-white/90 text-sm font-medium">{member.department}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTeamMembers
              .filter((member) => member.status === "inactive")
              .map((member) => (
                <div
                  key={member.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          width={50}
                          height={50}
                          className="rounded-full opacity-70"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black bg-gray-400"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-white/70">{member.name}</h3>
                        <p className="text-white/50 text-sm">{member.role}</p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
                        <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white/80 hover:text-white focus:text-white">
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-green-400 hover:text-green-300 focus:text-green-300">
                          Activate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-white/40" />
                      <a
                        href={`mailto:${member.email}`}
                        className="text-white/70 text-sm hover:text-white/90 transition-colors"
                      >
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-white/40" />
                      <a
                        href={`tel:${member.phone}`}
                        className="text-white/70 text-sm hover:text-white/90 transition-colors"
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Department</span>
                      <span className="text-white/90 text-sm font-medium">{member.department}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {filteredTeamMembers.filter((member) => member.status === "inactive").length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No inactive team members</h3>
              <p className="text-white/60 max-w-md">
                There are currently no inactive team members in your organization.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}