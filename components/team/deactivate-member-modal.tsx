"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ModalLayout } from "./modal-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Loader2 } from "lucide-react"
import type { TeamMember } from "@/types/team"

interface DeactivateMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember | null
  onDeactivate: (id: number, reason: string) => Promise<void>
  isSubmitting?: boolean
}

export function DeactivateMemberModal({
  open,
  onOpenChange,
  member,
  onDeactivate,
  isSubmitting = false,
}: DeactivateMemberModalProps) {
  const [reason, setReason] = useState("")

  const handleDeactivate = async () => {
    if (!member) return
    await onDeactivate(member.id, reason)
    setReason("")
  }

  if (!member) return null

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Deactivate Team Member"
      description={`Are you sure you want to deactivate ${member.name}?`}
      icon={<AlertTriangle className="h-5 w-5 text-white" />}
      iconBackground="bg-rose-500/20"
      accentColor="rose"
    >
      <div className="p-6 pt-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 bg-rose-500/10 rounded-lg border border-rose-500/20"
        >
          <p className="text-white/80 text-sm">Deactivating this team member will:</p>
          <ul className="mt-2 space-y-1 text-white/70 text-sm list-disc pl-5">
            <li>Revoke their access to the platform</li>
            <li>Preserve their account data and history</li>
            <li>Allow you to reactivate them in the future if needed</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="space-y-2"
        >
          <label htmlFor="reason" className="text-white/80 text-sm">
            Reason for deactivation (optional)
          </label>
          <Textarea
            id="reason"
            placeholder="Please provide a reason for deactivating this team member"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px] focus:border-rose-500 focus:ring-rose-500/20 transition-all"
          />
        </motion.div>

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
            onClick={handleDeactivate}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deactivating...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Deactivate Member
              </>
            )}
          </Button>
        </div>
      </div>
    </ModalLayout>
  )
}

