"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ModalLayout } from "./modal-layout"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Shield, Info, Loader2, Check } from "lucide-react"
import type { TeamMember, TeamMemberPermissions } from "@/types/team"

interface ManagePermissionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember | null
  onSavePermissions: (id: number, permissions: TeamMemberPermissions) => Promise<void>
  isSubmitting?: boolean
}

export function ManagePermissionsModal({
  open,
  onOpenChange,
  member,
  onSavePermissions,
  isSubmitting = false,
}: ManagePermissionsModalProps) {
  // Initialize permissions state from member or with defaults
  const [permissions, setPermissions] = useState<TeamMemberPermissions>({
    admin: false,
    dashboard: { view: false, edit: false },
    team: { view: false, create: false, edit: false, delete: false },
    reports: { view: false, create: false, export: false },
    settings: { view: false, edit: false },
  })

  // Update permissions when member changes
  useEffect(() => {
    if (member?.permissions) {
      setPermissions(member.permissions)
    } else if (member) {
      // Default permissions for new members
      setPermissions({
        admin: false,
        dashboard: { view: true, edit: false },
        team: { view: false, create: false, edit: false, delete: false },
        reports: { view: false, create: false, export: false },
        settings: { view: false, edit: false },
      })
    }
  }, [member])

  const handlePermissionChange = (
    section: keyof TeamMemberPermissions,
    permission: string,
    checked: boolean
  ) => {
    setPermissions((prev) => {
      const newPermissions = { ...prev }

      if (section === "admin") {
        newPermissions.admin = checked

        // If admin is enabled, enable all other permissions
        if (checked) {
          newPermissions.dashboard = { view: true, edit: true }
          newPermissions.team = { view: true, create: true, edit: true, delete: true }
          newPermissions.reports = { view: true, create: true, export: true }
          newPermissions.settings = { view: true, edit: true }
        }
      } else {
        // Use type assertion for dynamic access
        const sectionPermissions = newPermissions[section] as Record<string, boolean>
        sectionPermissions[permission] = checked

        // If any permission is disabled, admin should be false
        if (!checked) {
          newPermissions.admin = false
        }

        // Check if all permissions are enabled, then admin should be true
        const allEnabled =
          Object.values(newPermissions.dashboard).every(Boolean) &&
          Object.values(newPermissions.team).every(Boolean) &&
          Object.values(newPermissions.reports).every(Boolean) &&
          Object.values(newPermissions.settings).every(Boolean)

        if (allEnabled) {
          newPermissions.admin = true
        }
      }

      return newPermissions
    })
  }

  const handleSavePermissions = async () => {
    if (!member) return
    await onSavePermissions(member.id, permissions)
  }

  if (!member) return null

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Manage Permissions"
      description={`Configure access permissions for ${member.name}`}
      icon={<Shield className="h-5 w-5 text-white" />}
      accentColor="indigo"
    >
      <div className="p-6 pt-4 space-y-6">
        {/* Admin Permission Section */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-rose-400" />
            <div>
              <h3 className="font-medium text-white">Administrator</h3>
              <p className="text-white/60 text-sm">Full access to all features and settings</p>
            </div>
          </div>
          <Switch
            checked={permissions.admin}
            onCheckedChange={(checked) => handlePermissionChange("admin", "", checked)}
            className="data-[state=checked]:bg-rose-500"
          />
        </motion.div>

        <Separator className="bg-white/10" />

        {/* Dashboard Permissions */}
        <PermissionSection
          title="Dashboard"
          delay={0.1}
          permissions={[
            {
              name: "View dashboard",
              description: "Access to view dashboard content",
              checked: permissions.dashboard.view,
              onChange: (checked) => handlePermissionChange("dashboard", "view", checked),
            },
            {
              name: "Edit dashboard",
              description: "Ability to customize dashboard",
              checked: permissions.dashboard.edit,
              onChange: (checked) => handlePermissionChange("dashboard", "edit", checked),
            },
          ]}
        />

        {/* Team Management Permissions */}
        <PermissionSection
          title="Team Management"
          delay={0.2}
          permissions={[
            {
              name: "View team members",
              description: "Access to view team member profiles",
              checked: permissions.team.view,
              onChange: (checked) => handlePermissionChange("team", "view", checked),
            },
            {
              name: "Create team members",
              description: "Ability to add new team members",
              checked: permissions.team.create,
              onChange: (checked) => handlePermissionChange("team", "create", checked),
            },
            {
              name: "Edit team members",
              description: "Ability to modify team member profiles",
              checked: permissions.team.edit,
              onChange: (checked) => handlePermissionChange("team", "edit", checked),
            },
            {
              name: "Delete team members",
              description: "Ability to remove team members",
              checked: permissions.team.delete,
              onChange: (checked) => handlePermissionChange("team", "delete", checked),
            },
          ]}
        />

        {/* Reports Permissions */}
        <PermissionSection
          title="Reports"
          delay={0.3}
          permissions={[
            {
              name: "View reports",
              description: "Access to view generated reports",
              checked: permissions.reports.view,
              onChange: (checked) => handlePermissionChange("reports", "view", checked),
            },
            {
              name: "Create reports",
              description: "Ability to generate new reports",
              checked: permissions.reports.create,
              onChange: (checked) => handlePermissionChange("reports", "create", checked),
            },
            {
              name: "Export reports",
              description: "Ability to download and export reports",
              checked: permissions.reports.export,
              onChange: (checked) => handlePermissionChange("reports", "export", checked),
            },
          ]}
        />

        {/* Settings Permissions */}
        <PermissionSection
          title="Settings"
          delay={0.4}
          permissions={[
            {
              name: "View settings",
              description: "Access to view system settings",
              checked: permissions.settings.view,
              onChange: (checked) => handlePermissionChange("settings", "view", checked),
            },
            {
              name: "Edit settings",
              description: "Ability to modify system settings",
              checked: permissions.settings.edit,
              onChange: (checked) => handlePermissionChange("settings", "edit", checked),
            },
          ]}
        />

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.5 }}
          className="flex items-center p-3 bg-indigo-500/10 rounded-lg mt-4"
        >
          <Info className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
          <p className="text-white/80 text-sm">Changes to permissions will take effect immediately after saving.</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSavePermissions}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Permissions
              </>
            )}
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}

interface PermissionItem {
  name: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

interface PermissionSectionProps {
  title: string
  permissions: PermissionItem[]
  delay?: number
}

function PermissionSection({ title, permissions, delay = 0 }: PermissionSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">{title}</h3>
        <div className="h-5 w-5" /> {/* Spacer for alignment */}
      </div>
      <div className="space-y-3 bg-white/5 p-3 rounded-lg">
        {permissions.map((permission, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <span className="text-white/80 text-sm">{permission.name}</span>
              <p className="text-white/60 text-xs">{permission.description}</p>
            </div>
            <Switch
              checked={permission.checked}
              onCheckedChange={permission.onChange}
              className="data-[state=checked]:bg-indigo-500"
            />
          </div>
        ))}
      </div>
    </motion.div>
  )
}