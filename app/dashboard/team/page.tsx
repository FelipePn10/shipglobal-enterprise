"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (newMemberAdded !== null) {
      const timer = setTimeout(() => setNewMemberAdded(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [newMemberAdded]);

  const fetchTeamMembers = async () => {
    const response = await fetch("/api/team");
    const data = await response.json();
    setTeamMembers(
      data.map((member: any) => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName}`,
        role: member.role,
        department: "Operations", // Adjust based on your schema if you add this field
        email: member.email,
        phone: member.adminPhone || "+1 (555) 123-4567", // Adjust as needed
        avatar: "/placeholder.svg",
        status: "active", // Add status field to schema if needed
        joinDate: new Date(member.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        lastActive: "Today at 9:30 AM", // Adjust based on actual data
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
      })),
    );
  };

  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (departmentFilter === "all") return matchesSearch;
    return matchesSearch && member.department === departmentFilter;
  });

  const departments = [...new Set(teamMembers.map((member) => member.department))];

  const handleAddTeamMember = async (data: FormValues) => {
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
          companyId: 1, // Replace with actual company ID from auth context
        }),
      });
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
      setTeamMembers([...teamMembers, formattedMember]);
      setNewMemberAdded(newMember.id);
      setToast({
        visible: true,
        title: "Team member added",
        description: `${data.name} has been added to your team.`,
        variant: "success",
      });
    } catch (error) {
      setToast({
        visible: true,
        title: "Something went wrong",
        description: "The team member could not be added. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMember = async (id: number, data: Partial<TeamMember>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      const updatedMember = await response.json();
      setTeamMembers((prev) =>
        prev.map((member) => (member.id === id ? { ...member, ...updatedMember } : member)),
      );
      setToast({
        visible: true,
        title: "Profile updated",
        description: "The team member's profile has been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      setToast({
        visible: true,
        title: "Something went wrong",
        description: "The profile could not be updated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePermissions = async (id: number, permissions: TeamMemberPermissions) => {
    setIsSubmitting(true);
    try {
      setTeamMembers((prev) =>
        prev.map((member) => (member.id === id ? { ...member, permissions } : member)),
      );
      setToast({
        visible: true,
        title: "Permissions updated",
        description: "The team member's permissions have been updated successfully.",
        variant: "success",
      });
    } catch (error) {
      setToast({
        visible: true,
        title: "Something went wrong",
        description: "The permissions could not be updated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivateMember = async (id: number, reason: string) => {
    setIsSubmitting(true);
    try {
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
            : member,
        ),
      );
      setToast({
        visible: true,
        title: "Team member deactivated",
        description: "The team member has been deactivated successfully.",
        variant: "default",
      });
    } catch (error) {
      setToast({
        visible: true,
        title: "Something went wrong",
        description: "The team member could not be deactivated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateMember = async (id: number) => {
    setIsSubmitting(true);
    try {
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, status: "active", lastActive: "Just now" } : member,
        ),
      );
      setToast({
        visible: true,
        title: "Team member activated",
        description: "The team member has been activated successfully.",
        variant: "success",
      });
    } catch (error) {
      setToast({
        visible: true,
        title: "Something went wrong",
        description: "The team member could not be activated. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Team</h1>
            <p className="text-white/60">Manage your team members and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white transition-all"
              onClick={() => setIsAddModalOpen(true)}
            >
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
            <AnimatePresence>
              {filteredTeamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  custom={index}
                  initial="hidden"
                  animate={newMemberAdded === member.id ? "highlight" : "visible"}
                  exit="exit"
                  variants={cardVariants}
                  className={`bg-white/5 backdrop-blur-sm border ${
                    member.status === "active" ? "border-white/10" : "border-amber-500/20"
                  } rounded-lg p-4 hover:bg-white/[0.07] transition-colors`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`absolute inset-0 rounded-full ${
                            member.status === "active"
                              ? "bg-gradient-to-r from-indigo-500 to-rose-500"
                              : "bg-gradient-to-r from-amber-500 to-orange-500"
                          } blur-sm opacity-30`}
                        ></div>
                        <Image
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          width={50}
                          height={50}
                          className="rounded-full relative"
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/60 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
                        <DropdownMenuItem
                          className="text-white/80 hover:text-white focus:text-white"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white/80 hover:text-white focus:text-white"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white/80 hover:text-white focus:text-white"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsPermissionsModalOpen(true);
                          }}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                        {member.status === "active" ? (
                          <DropdownMenuItem
                            className="text-rose-400 hover:text-rose-300 focus:text-rose-300"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDeactivateModalOpen(true);
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-green-400 hover:text-green-300 focus:text-green-300"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsActivateModalOpen(true);
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
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
                <Button
                  className="mt-6 bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white transition-all"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              )}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 blur-sm opacity-30"></div>
                          <Image
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            width={50}
                            height={50}
                            className="rounded-full relative"
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/60 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
                          <DropdownMenuItem
                            className="text-white/80 hover:text-white focus:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white/80 hover:text-white focus:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white/80 hover:text-white focus:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsPermissionsModalOpen(true);
                            }}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-400 hover:text-rose-300 focus:text-rose-300"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDeactivateModalOpen(true);
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
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
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                    className="bg-white/5 backdrop-blur-sm border border-amber-500/20 rounded-lg p-4 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 blur-sm opacity-30"></div>
                          <Image
                            src={member.avatar || "/placeholder.svg"}
                            alt={member.name}
                            width={50}
                            height={50}
                            className="rounded-full relative"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black bg-gray-400"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{member.name}</h3>
                          <p className="text-white/60 text-sm">{member.role}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/60 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/10 backdrop-blur-lg border-white/10">
                          <DropdownMenuItem
                            className="text-white/80 hover:text-white focus:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white/80 hover:text-white focus:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white/80 hover:text-white focus:text-white"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsPermissionsModalOpen(true);
                            }}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-green-400 hover:text-green-300 focus:text-green-300"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsActivateModalOpen(true);
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
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