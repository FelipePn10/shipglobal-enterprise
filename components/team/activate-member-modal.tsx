"use client"

import { motion } from "framer-motion"
import { ModalLayout } from "./modal-layout"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"
import type { TeamMember } from "@/types/team"

interface ActivateMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember | null
  onActivate: (id: number) => Promise<void>
  isSubmitting?: boolean
}

export function ActivateMemberModal({
  open,
  onOpenChange,
  member,
  onActivate,
  isSubmitting = false,
}: ActivateMemberModalProps) {
  const handleActivate = async () => {
    if (!member) return
    await onActivate(member.id)
  }

  if (!member) return null

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Activate Team Member"
      description={`Are you sure you want to activate ${member.name}?`}
      icon={<CheckCircle2 className="h-5 w-5 text-white" />}
      iconBackground="bg-emerald-500/20"
      accentColor="green"
    >
      <div className="p-6 pt-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
        >
          <p className="text-white/80 text-sm">Activating this team member will:</p>
          <ul className="mt-2 space-y-1 text-white/70 text-sm list-disc pl-5">
            <li>Restore their access to the platform</li>
            <li>Allow them to log in and use the system</li>
            <li>Maintain their previous permissions and settings</li>
          </ul>
        </motion.div>

        {member.deactivationReason && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="space-y-2"
          >
            <p className="text-white/80 text-sm">Previous deactivation reason:</p>
            <div className="bg-white/5 p-3 rounded-md text-white/70 text-sm">{member.deactivationReason}</div>
            {member.deactivatedAt && (
              <p className="text-white/60 text-xs mt-1">Deactivated on {member.deactivatedAt}</p>
            )}
          </motion.div>
        )}

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
            onClick={handleActivate}
            disabled={isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Activate Member
              </>
            )}
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}

