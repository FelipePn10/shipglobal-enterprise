"use client"

import { useRef, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ModalLayout } from "./modal-layout"
import { User, Mail, Building2, Briefcase, Phone, Calendar, FileText, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TeamMember } from "@/types/team"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().min(1, { message: "Role is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  phone: z.string().optional(),
  joinDate: z.string().optional(),
  bio: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// Mock departments data
const departments = ["Operations", "Compliance", "Sales", "Finance", "Customer Service"]

interface EditMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember | null
  onSave: (id: number, data: Partial<TeamMember>) => Promise<void>
  isSubmitting?: boolean
}

export function EditMemberModal({ open, onOpenChange, member, onSave, isSubmitting = false }: EditMemberModalProps) {
  const nameInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || "",
      email: member?.email || "",
      role: member?.role || "",
      department: member?.department || "",
      phone: member?.phone || "",
      joinDate: member?.joinDate || "",
      bio: member?.bio || "",
    },
  })

  // Update form values when member changes
  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        phone: member.phone,
        joinDate: member.joinDate || "",
        bio: member.bio || "",
      })
    }
  }, [member, form])

  // Focus the first input when the modal opens
  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  async function onSubmit(data: FormValues) {
    if (!member) return
    await onSave(member.id, data)
  }

  if (!member) return null

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Team Member"
      description={`Update ${member.name}'s profile information`}
      icon={<User className="h-5 w-5 text-white" />}
      accentColor="indigo"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-400" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter full name"
                        {...field}
                        ref={nameInputRef}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-indigo-400" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="email@example.com"
                        type="email"
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-indigo-400" />
                    Role
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g. Import Manager"
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                      />
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-indigo-400" />
                    Department
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <div className="relative">
                        <SelectTrigger className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                      </div>
                    </FormControl>
                    <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-white/10">
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
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-indigo-400" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="joinDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/80 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    Join Date
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="e.g. January 15, 2023"
                        {...field}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-300" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/80 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  Bio
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Brief description about the team member"
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px] focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-rose-300" />
              </FormItem>
            )}
          />

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
              type="submit"
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
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </ModalLayout>
  )
}

