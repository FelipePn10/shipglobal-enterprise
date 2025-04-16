"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  UserPlus,
  Eye,
  Edit,
  Shield,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { RefinedAddTeamMemberModal, FormValues } from "@/components/team/refined-add-team-member-modal";
import { ViewProfileModal } from "@/components/team/view-peofile-modal";
import { EditMemberModal } from "@/components/team/edit-member-modal";
import { ManagePermissionsModal } from "@/components/team/manage-permissions-modal";
import { DeactivateMemberModal } from "@/components/team/deactivate-member-modal";
import { ActivateMemberModal } from "@/components/team/activate-member-modal";
import { RefinedToast } from "@/components/ui/refined-toast";
import type { TeamMember, TeamMemberPermissions } from "@/types/team";

// Interface for API response
interface APITeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  adminPhone?: string;
  createdAt: string;
}

// ... (previous imports and types unchanged)

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    title: string;
    description: string;
    variant: "default" | "destructive" | "success";
  } | null>(null);
  const [newMemberAdded, setNewMemberAdded] = useState<number | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await fetch("/api/team");
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }
      const data: APITeamMember[] = await response.json();
      setTeamMembers(
        data.map((member) => ({
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          role: member.role,
          department: "Operations", // Adjust based on schema
          email: member.email,
          phone: member.adminPhone || "+1 (555) 123-4567",
          avatar: "/placeholder.svg",
          status: "active" as const,
          joinDate: new Date(member.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          lastActive: "Today at 9:30 AM",
          permissions: {
            admin: member.role === "admin",
            dashboard: { view: true, edit: member.role === "admin" },
            team: {
              view: true,
              create: member.role === "admin",
              edit: member.role === "admin",
              delete: member.role === "admin",
            },
            reports: {
              view: true,
              create: member.role === "admin",
              export: member.role === "admin",
            },
            settings: { view: member.role === "admin", edit: member.role === "admin" },
          },
        }))
      );
    } catch {
      setToast({
        visible: true,
        title: "Failed to load team members",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  useEffect(() => {
    if (newMemberAdded !== null) {
      const timer = setTimeout(() => setNewMemberAdded(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [newMemberAdded]);

  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (departmentFilter === "all") return matchesSearch;
    return matchesSearch && member.department === departmentFilter;
  });

  const departments = [...new Set(teamMembers.map((member) => member.department))];

  const handleAddTeamMember = useCallback(async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.name.split(" ")[0],
          lastName: data.name.split(" ").slice(1).join(" ") || "Unknown",
          email: data.email,
          role: data.role,
          companyId: 1, // Replace with actual company ID
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add team member");
      }
      const newMember = await response.json();
      const formattedMember: TeamMember = {
        id: newMember.id,
        name: `${newMember.firstName} ${newMember.lastName}`,
        role: newMember.role,
        department: data.department,
        email: newMember.email,
        phone: data.phone || "",
        avatar: "/placeholder.svg",
        status: "active",
        joinDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        lastActive: "Just now",
        permissions: {
          admin: newMember.role === "admin",
          dashboard: { view: true, edit: newMember.role === "admin" },
          team: {
            view: true,
            create: newMember.role === "admin",
            edit: newMember.role === "admin",
            delete: newMember.role === "admin",
          },
          reports: {
            view: true,
            create: newMember.role === "admin",
            export: newMember.role === "admin",
          },
          settings: { view: newMember.role === "admin", edit: newMember.role === "admin" },
        },
      };
      setTeamMembers((prev) => [...prev, formattedMember]);
      setNewMemberAdded(newMember.id);
      setToast({
        visible: true,
        title: "Team member added",
        description: `${data.name} has been added to your team.`,
        variant: "success",
      });
    } catch {
      setToast({
        visible: true,
        title: "Failed to add team member",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleUpdateMember = useCallback(async (id: number, data: Partial<TeamMember>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (!response.ok) {
        throw new Error("Failed to update member");
      }
      const updatedMember = await response.json();
      setTeamMembers((prev) =>
        prev.map((member) => (member.id === id ? { ...member, ...updatedMember } : member))
      );
      setToast({
        visible: true,
        title: "Profile updated",
        description: "The team member's profile has been updated successfully.",
        variant: "success",
      });
    } catch {
      setToast({
        visible: true,
        title: "Failed to update profile",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleUpdatePermissions = useCallback(
    async (id: number, permissions: TeamMemberPermissions) => {
      setIsSubmitting(true);
      try {
        // Simulate API call - replace with actual API integration
        setTeamMembers((prev) =>
          prev.map((member) => (member.id === id ? { ...member, permissions } : member))
        );
        setToast({
          visible: true,
          title: "Permissions updated",
          description: "The team member's permissions have been updated successfully.",
          variant: "success",
        });
      } catch {
        setToast({
          visible: true,
          title: "Failed to update permissions",
          description: "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handleDeactivateMember = useCallback(async (id: number, reason: string) => {
    setIsSubmitting(true);
    try {
      // Simulate API call - replace with actual API integration
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === id
            ? {
                ...member,
                status: "inactive",
                deactivationReason: reason,
                deactivatedAt: new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              }
            : member
        )
      );
      setToast({
        visible: true,
        title: "Team member deactivated",
        description: "The team member has been deactivated successfully.",
        variant: "default",
      });
    } catch {
      setToast({
        visible: true,
        title: "Failed to deactivate member",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleActivateMember = useCallback(async (id: number) => {
    setIsSubmitting(true);
    try {
      // Simulate API call - replace with actual API integration
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, status: "active", lastActive: "Just now" } : member
        )
      );
      setToast({
        visible: true,
        title: "Team member activated",
        description: "The team member has been activated successfully.",
        variant: "success",
      });
    } catch {
      setToast({
        visible: true,
        title: "Failed to activate member",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    highlight: {
      scale: [1, 1.02, 1],
      boxShadow: [
        "0 0 0 0 rgba(0, 0, 0, 0)",
        "0 0 0 3px rgba(99, 102, 241, 0.4)",
        "0 0 0 0 rgba(0, 0, 0, 0)",
      ],
      transition: { duration: 2, repeat: 2 },
    },
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white">Team</h1>
            <p className="text-white/60">Manage your team members and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white transition-all hover:from-indigo-600 hover:to-rose-600"
              onClick={() => setIsAddModalOpen(true)}
              aria-label="Add new team member"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger
              value="all"
              className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              All Members
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white"
            >
              Inactive
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 pl-9 text-white placeholder:text-white/40 md:w-[250px]"
                aria-label="Search team members"
              />
            </div>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger
                className="w-full bg-white/5 text-white/80 md:w-[180px]"
                aria-label="Filter by department"
              >
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 border-white/10 backdrop-blur-lg">
                <SelectItem
                  value="all"
                  className="text-white/80 focus:text-white hover:text-white"
                >
                  All Departments
                </SelectItem>
                {departments.map((department) => (
                  <SelectItem
                    key={department}
                    value={department}
                    className="text-white/80 focus:text-white hover:text-white"
                  >
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredTeamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  custom={index}
                  initial="hidden"
                  animate={newMemberAdded === member.id ? "highlight" : "visible"}
                  exit="exit"
                  variants={cardVariants}
                  className={`rounded-lg border p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.07] ${
                    member.status === "active" ? "border-white/10 bg-white/5" : "border-amber-500/20 bg-amber-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`absolute inset-0 rounded-full blur-sm opacity-30 ${
                            member.status === "active"
                              ? "bg-gradient-to-r from-indigo-500 to-rose-500"
                              : "bg-gradient-to-r from-amber-500 to-orange-500"
                          }`}
                        />
                        <Image
                          src={member.avatar || "/placeholder.svg"}
                          alt={`${member.name}'s avatar`}
                          width={50}
                          height={50}
                          className="relative rounded-full"
                        />
                        <div
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${
                            member.status === "active" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{member.name}</h3>
                        <p className="text-sm text-white/60">{member.role}</p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/60 hover:text-white"
                          aria-label={`More options for ${member.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-white/10 bg-white/10 backdrop-blur-lg"
                      >
                        <DropdownMenuItem
                          className="text-white/80 focus:text-white hover:text-white"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white/80 focus:text-white hover:text-white"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white/80 focus:text-white hover:text-white"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsPermissionsModalOpen(true);
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Permissions
                        </DropdownMenuItem>
                        {member.status === "active" ? (
                          <DropdownMenuItem
                            className="text-rose-400 focus:text-rose-300 hover:text-rose-300"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDeactivateModalOpen(true);
                            }}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-400 focus:text-green-300 hover:text-green-300"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsActivateModalOpen(true);
                            }}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
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
                        className="text-sm text-white/70 transition-colors hover:text-white/90"
                      >
                        {member.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-white/40" />
                      <a
                        href={`tel:${member.phone}`}
                        className="text-sm text-white/70 transition-colors hover:text-white/90"
                      >
                        {member.phone}
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">Department</span>
                      <span className="text-sm font-medium text-white/90">{member.department}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTeamMembers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <UserPlus className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="mb-2 text-xl font-medium text-white">No team members found</h3>
              <p className="max-w-md text-white/60">
                {searchQuery || departmentFilter !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "You don't have any team members yet. Add your first team member to get started."}
              </p>
              {!searchQuery && departmentFilter === "all" && (
                <Button
                  className="mt-6 bg-gradient-to-r from-indigo-500 to-rose-500 text-white transition-all hover:from-indigo-600 hover:to-rose-600"
                  onClick={() => setIsAddModalOpen(true)}
                  aria-label="Add first team member"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              )}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredTeamMembers
                .filter((member) => member.status === "active")
                .map((member, index) => (
                  <motion.div
                    key={member.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={cardVariants}
                    className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 blur-sm opacity-30" />
                          <Image
                            src={member.avatar || "/placeholder.svg"}
                            alt={`${member.name}'s avatar`}
                            width={50}
                            height={50}
                            className="relative rounded-full"
                          />
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{member.name}</h3>
                          <p className="text-sm text-white/60">{member.role}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/60 hover:text-white"
                            aria-label={`More options for ${member.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-white/10 bg-white/10 backdrop-blur-lg"
                        >
                          <DropdownMenuItem
                            className="text-white/80 focus:text-white hover:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white/80 focus:text-white hover:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white/80 focus:text-white hover:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsPermissionsModalOpen(true);
                            }}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-400 focus:text-rose-300 hover:text-rose-300"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDeactivateModalOpen(true);
                            }}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
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
                          className="text-sm text-white/70 transition-colors hover:text-white/90"
                        >
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-white/40" />
                        <a
                          href={`tel:${member.phone}`}
                          className="text-sm text-white/70 transition-colors hover:text-white/90"
                        >
                          {member.phone}
                        </a>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Department</span>
                        <span className="text-sm font-medium text-white/90">{member.department}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredTeamMembers
                .filter((member) => member.status === "inactive")
                .map((member, index) => (
                  <motion.div
                    key={member.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={cardVariants}
                    className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/[0.07]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 blur-sm opacity-30" />
                          <Image
                            src={member.avatar || "/placeholder.svg"}
                            alt={`${member.name}'s avatar`}
                            width={50}
                            height={50}
                            className="relative rounded-full"
                          />
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{member.name}</h3>
                          <p className="text-sm text-white/60">{member.role}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/60 hover:text-white"
                            aria-label={`More options for ${member.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-white/10 bg-white/10 backdrop-blur-lg"
                        >
                          <DropdownMenuItem
                            className="text-white/80 focus:text-white hover:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white/80 focus:text-white hover:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white/80 focus:text-white hover:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsPermissionsModalOpen(true);
                            }}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-green-400 focus:text-green-300 hover:text-green-300"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsActivateModalOpen(true);
                            }}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
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
                          className="text-sm text-white/70 transition-colors hover:text-white/90"
                        >
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-white/40" />
                        <a
                          href={`tel:${member.phone}`}
                          className="text-sm text-white/70 transition-colors hover:text-white/90"
                        >
                          {member.phone}
                        </a>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Department</span>
                        <span className="text-sm font-medium text-white/90">{member.department}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>

      <RefinedAddTeamMemberModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddMember={handleAddTeamMember}
      />

      <ViewProfileModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        member={selectedMember}
        onEdit={(member) => {
          setIsViewModalOpen(false);
          setSelectedMember(member);
          setIsEditModalOpen(true);
        }}
        onManagePermissions={(member) => {
          setIsViewModalOpen(false);
          setSelectedMember(member);
          setIsPermissionsModalOpen(true);
        }}
        onActivate={(member) => {
          setIsViewModalOpen(false);
          setSelectedMember(member);
          setIsActivateModalOpen(true);
        }}
        onDeactivate={(member) => {
          setIsViewModalOpen(false);
          setSelectedMember(member);
          setIsDeactivateModalOpen(true);
        }}
      />

      <EditMemberModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        member={selectedMember}
        onSave={handleUpdateMember}
        isSubmitting={isSubmitting}
      />

      <ManagePermissionsModal
        open={isPermissionsModalOpen}
        onOpenChange={setIsPermissionsModalOpen}
        member={selectedMember}
        onSavePermissions={handleUpdatePermissions}
        isSubmitting={isSubmitting}
      />

      <DeactivateMemberModal
        open={isDeactivateModalOpen}
        onOpenChange={setIsDeactivateModalOpen}
        member={selectedMember}
        onDeactivate={handleDeactivateMember}
        isSubmitting={isSubmitting}
      />

      <ActivateMemberModal
        open={isActivateModalOpen}
        onOpenChange={setIsActivateModalOpen}
        member={selectedMember}
        onActivate={handleActivateMember}
        isSubmitting={isSubmitting}
      />

      {toast && toast.visible && (
        <RefinedToast
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
    </DashboardLayout>
  );
}