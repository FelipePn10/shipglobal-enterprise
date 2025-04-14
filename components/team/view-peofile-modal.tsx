"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  Shield,
  Edit,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from "lucide-react";

import { ModalLayout } from "./modal-layout"; // Assuming path is correct
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TeamMember } from "@/types/team"; // Assuming path is correct

// --- Helper Component for Permissions ---
interface PermissionItemProps {
  label: string;
  allowed: boolean;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ label, allowed }) => (
  <div className="flex items-center justify-between">
    <span className="text-white/80 text-sm">{label}</span>
    <Badge
      className={
        allowed
          ? "bg-green-500/20 text-green-300"
          : "bg-gray-500/20 text-gray-300"
      }
    >
      {allowed ? "Allowed" : "Denied"}
    </Badge>
  </div>
);

// --- Main Component Props ---
interface ViewProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
  onEdit: (member: TeamMember) => void;
  onManagePermissions: (member: TeamMember) => void;
  onActivate?: (member: TeamMember) => void;
  onDeactivate?: (member: TeamMember) => void;
}

// --- Main Component ---
export function ViewProfileModal({
  open,
  onOpenChange,
  member,
  onEdit,
  onManagePermissions,
  onActivate,
  onDeactivate,
}: ViewProfileModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!member) return null;

  const isActive = member.status === "active";

  const handleEditClick = () => {
    onOpenChange(false);
    onEdit(member);
  };

  const handleManagePermissionsClick = () => {
    onOpenChange(false);
    onManagePermissions(member);
  };

  const handleDeactivateClick = () => {
    onOpenChange(false);
    if (onDeactivate) { // Corrected: Use if check
      onDeactivate(member);
    }
  };

  const handleActivateClick = () => {
    onOpenChange(false);
    if (onActivate) { // Corrected: Use if check
      onActivate(member);
    }
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Team Member Profile"
      icon={<User className="h-5 w-5 text-white" />}
      size="lg"
      accentColor={isActive ? "indigo" : "amber"}
    >
      <div className="p-6 pt-2">
        <div className="flex flex-col md:flex-row gap-6">
          {/* --- Left Column: Avatar & Actions --- */}
          <div className="flex flex-col items-center md:w-48 flex-shrink-0">
            <div className="relative mb-3">
              {/* Subtle background gradient blur */}
              <div
                className={`absolute inset-0 rounded-full ${isActive ? "bg-gradient-to-r from-indigo-500 to-rose-500" : "bg-gradient-to-r from-amber-500 to-orange-500"} blur-sm opacity-30`}
              ></div>
              <Image
                src={member.avatar || "/placeholder.svg"} // Use placeholder if no avatar
                alt={`${member.name}'s avatar`} // More descriptive alt text
                width={120}
                height={120}
                className="rounded-full border-2 border-white/10 relative" // Ensure image is above blur
              />
              {/* Status Indicator */}
              <div
                className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-black ${
                  isActive ? "bg-green-500" : "bg-gray-400"
                }`}
                title={isActive ? "Active" : "Inactive"} // Add title for accessibility
              ></div>
            </div>
            <Badge
              variant="outline" // Use variant for consistency if available, otherwise keep className
              className={`${
                isActive
                  ? "border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <div className="flex flex-col gap-2 mt-4 w-full">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border-indigo-500/20"
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20"
                onClick={handleManagePermissionsClick}
              >
                <Shield className="h-4 w-4 mr-2" />
                Manage Permissions
              </Button>
              {isActive ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border-amber-500/20"
                  onClick={handleDeactivateClick}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Deactivate
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-green-400 hover:text-green-300 hover:bg-green-500/10 border-green-500/20"
                  onClick={handleActivateClick}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Activate
                </Button>
              )}
            </div>
          </div>

          {/* --- Right Column: Details & Tabs --- */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{member.name}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <Briefcase className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <span className="text-white/80">{member.role}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm">
              <Building2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
              <span className="text-white/80">{member.department}</span>
            </div>

            {/* --- Tabs --- */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="bg-white/5 border-white/10">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
                >
                  Permissions
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60"
                >
                  Activity
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4" // Apply margin here for consistent spacing
                >
                  {/* --- Overview Tab --- */}
                  <TabsContent value="overview" className="space-y-4 m-0"> {/* Remove margin from TabsContent */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-white">Contact Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2 bg-white/5 p-3 rounded-md">
                          <Mail className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-white/60">Email</p>
                            <a
                              href={`mailto:${member.email}`}
                              className="text-white/80 hover:text-white transition-colors break-all"
                            >
                              {member.email}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 bg-white/5 p-3 rounded-md">
                          <Phone className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-white/60">Phone</p>
                            <a
                              href={`tel:${member.phone}`}
                              className="text-white/80 hover:text-white transition-colors whitespace-nowrap"
                            >
                              {member.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4 bg-white/10" />

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-white">Account Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {member.joinDate && ( // Use && for cleaner conditional rendering
                          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-md">
                            <Calendar className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-white/60">Joined</p>
                              <span className="text-white/80">{member.joinDate}</span>
                            </div>
                          </div>
                        )}
                        {member.lastActive && (
                          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-md">
                            <Clock className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-white/60">Last Active</p>
                              <span className="text-white/80">{member.lastActive}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* --- About Section --- */}
                    {member.bio && (
                      <>
                        <Separator className="my-4 bg-white/10" />
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium text-white">About</h3>
                          <div className="bg-white/5 p-3 rounded-md">
                            {/*
                              Removed dangerouslySetInnerHTML for security.
                              Bio is rendered as plain text. React handles escaping.
                              If HTML rendering is needed, use DOMPurify or similar *before* dangerouslySetInnerHTML.
                            */}
                            <p className="text-white/80 text-sm whitespace-pre-wrap">{member.bio}</p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* --- Deactivation Info Section --- */}
                    {!isActive && member.deactivationReason && (
                      <>
                        <Separator className="my-4 bg-white/10" />
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium text-white flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            Deactivation Information
                          </h3>
                          <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-md">
                            <p className="text-xs text-white/60 mb-1">Reason for Deactivation</p>
                            <p className="text-white/80 text-sm">{member.deactivationReason}</p>
                            {member.deactivatedAt && (
                              <p className="text-white/60 text-xs mt-2">Deactivated on {member.deactivatedAt}</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* --- Permissions Tab --- */}
                  <TabsContent value="permissions" className="space-y-4 m-0"> {/* Remove margin */}
                    {member.permissions ? (
                      <>
                        {member.permissions.admin && (
                          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-md mb-4">
                            <div className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-rose-400" />
                              <h3 className="font-medium text-white">Administrator</h3>
                            </div>
                            <p className="text-white/70 text-sm mt-1">
                              This user has full administrative access to all features and settings.
                            </p>
                          </div>
                        )}
                        {/* Refactored Permission Display */}
                        <div className="space-y-4">
                          <div className="bg-white/5 p-4 rounded-md">
                            <h3 className="font-medium text-white mb-3">Dashboard</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <PermissionItem label="View dashboard" allowed={member.permissions.dashboard.view} />
                              <PermissionItem label="Edit dashboard" allowed={member.permissions.dashboard.edit} />
                            </div>
                          </div>

                          <div className="bg-white/5 p-4 rounded-md">
                            <h3 className="font-medium text-white mb-3">Team Management</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <PermissionItem label="View team members" allowed={member.permissions.team.view} />
                              <PermissionItem label="Create team members" allowed={member.permissions.team.create} />
                              <PermissionItem label="Edit team members" allowed={member.permissions.team.edit} />
                              <PermissionItem label="Delete team members" allowed={member.permissions.team.delete} />
                            </div>
                          </div>

                          <div className="bg-white/5 p-4 rounded-md">
                            <h3 className="font-medium text-white mb-3">Reports</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                               <PermissionItem label="View reports" allowed={member.permissions.reports.view} />
                               <PermissionItem label="Create reports" allowed={member.permissions.reports.create} />
                               <PermissionItem label="Export reports" allowed={member.permissions.reports.export} />
                            </div>
                          </div>

                           <div className="bg-white/5 p-4 rounded-md">
                            <h3 className="font-medium text-white mb-3">Settings</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <PermissionItem label="View settings" allowed={member.permissions.settings.view} />
                              <PermissionItem label="Edit settings" allowed={member.permissions.settings.edit} />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-white/70 hover:text-white hover:bg-white/10 border-white/10"
                            onClick={handleManagePermissionsClick}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                          <Shield className="h-6 w-6 text-white/20" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No permissions set</h3>
                        <p className="text-white/60 max-w-md mb-4">
                          This team member doesn&apos;t have any permissions configured yet. {/* Corrected: Escaped apostrophe */}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white/70 hover:text-white hover:bg-white/10 border-white/10"
                          onClick={handleManagePermissionsClick}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Set Permissions
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* --- Activity Tab --- */}
                  <TabsContent value="activity" className="space-y-4 m-0"> {/* Remove margin */}
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-400" />
                      <h3 className="text-lg font-medium text-white">Recent Activity</h3>
                    </div>
                    {/* --- Activity Timeline --- */}
                    {/* TODO: Replace sample data with actual dynamic activity log */}
                    <div className="relative pl-6 border-l border-white/10 space-y-4">
                       {/* Sample activity item 1 */}
                       <div className="relative">
                         {/* Timeline Dot */}
                         <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-indigo-500/20 border-2 border-indigo-500"></div>
                         <div className="bg-white/5 p-3 rounded-md">
                           <p className="text-white/80 text-sm">Logged in to the platform</p>
                           <p className="text-white/60 text-xs mt-1">Today at 9:30 AM</p>
                         </div>
                       </div>
                       {/* Sample activity item 2 */}
                       <div className="relative">
                         <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500"></div>
                         <div className="bg-white/5 p-3 rounded-md">
                           <p className="text-white/80 text-sm">Updated profile information</p>
                           <p className="text-white/60 text-xs mt-1">Yesterday at 2:15 PM</p>
                         </div>
                       </div>
                       {/* Sample activity item 3 */}
                       <div className="relative">
                         <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-amber-500/20 border-2 border-amber-500"></div>
                         <div className="bg-white/5 p-3 rounded-md">
                           <p className="text-white/80 text-sm">Accessed reports section</p>
                           <p className="text-white/60 text-xs mt-1">3 days ago</p>
                         </div>
                       </div>
                        {/* Sample activity item 4 */}
                       <div className="relative">
                         <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-rose-500/20 border-2 border-rose-500"></div>
                         <div className="bg-white/5 p-3 rounded-md">
                           <p className="text-white/80 text-sm">Changed password</p>
                           <p className="text-white/60 text-xs mt-1">1 week ago</p>
                         </div>
                       </div>
                      {/* Add placeholder if no activity */}

                       <div className="text-center py-6">
                          <p className="text-white/50 text-sm">No recent activity found.</p>
                       </div>
                      
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </ModalLayout>
  );
}