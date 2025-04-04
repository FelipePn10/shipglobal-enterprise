"use client"

import { useState, useRef, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2, UserPlus, Mail, Building2, Briefcase, Phone, ArrowLeft, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { TeamMemberPermissions } from "@/types/team"

// Update the form schema to include permissions
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().min(1, { message: "Role is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  phone: z.string().optional(),
})

export type FormValues = z.infer<typeof formSchema> // Exported FormValues here

// Update the interface to include permissions
interface AddTeamMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: FormValues & { permissions: TeamMemberPermissions }) => Promise<void>
}

// Define departments
const departments = [
  "Sales",
  "Marketing",
  "Engineering",
  "Human Resources",
  "Finance",
  "Customer Support",
  "Research and Development",
  "Operations",
  "Legal",
  "Information Technology",
]

export function RefinedAddTeamMemberModal({ open, onOpenChange, onAddMember }: AddTeamMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { toast } = useToast()
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Add permissions state
  const [permissions, setPermissions] = useState<TeamMemberPermissions>({
    admin: false,
    dashboard: { view: true, edit: false },
    team: { view: false, create: false, edit: false, delete: false },
    reports: { view: false, create: false, export: false },
    settings: { view: false, edit: false },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      phone: "",
    },
  })

  // Focus the first input when the modal opens
  useEffect(() => {
    if (open && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Reset step when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setCurrentStep(0)
        form.reset()
        setPermissions({
          admin: false,
          dashboard: { view: true, edit: false },
          team: { view: false, create: false, edit: false, delete: false },
          reports: { view: false, create: false, export: false },
          settings: { view: false, edit: false },
        })
      }, 300)
    }
  }, [open, form])

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      // Include permissions in the submission
      await onAddMember({ ...data, permissions })

      toast({
        title: "Team member added",
        description: `${data.name} has been added to your team.`,
        variant: "default",
      })

      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The team member could not be added. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update form steps to include permissions
  const steps = [
    {
      title: "Basic Information",
      description: "Enter the team member's name and email",
      fields: ["name", "email"],
    },
    {
      title: "Role & Department",
      description: "Specify their role and department",
      fields: ["role", "department", "phone"],
    },
    {
      title: "Permissions",
      description: "Configure access permissions",
      fields: [],
    },
  ]

  const currentStepData = steps[currentStep]

  // Check if current step is valid
  const isCurrentStepValid = () => {
    // If we're on the permissions step, it's always valid
    if (currentStep === 2) return true

    const currentFields = currentStepData.fields
    return currentFields.every((field) => {
      // Skip validation for optional fields
      if (field === "phone") return true

      const fieldState = form.getFieldState(field as keyof FormValues)
      // Valid if the field has been touched and has no error, or if it has a value
      return (fieldState.isDirty && !fieldState.error) || !!form.getValues(field as keyof FormValues)
    })
  }

  // Handle next step
  const handleNextStep = () => {
    const isValid = isCurrentStepValid()

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        form.handleSubmit(onSubmit)()
      }
    } else {
      // Trigger validation for current fields
      currentStepData.fields.forEach((field) => {
        if (field !== "phone") {
          // Skip validation for optional fields
          form.trigger(field as keyof FormValues)
        }
      })
    }
  }

  // Handle permission changes
  const handlePermissionChange = (section: string, permission: string, checked: boolean) => {
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
        // @ts-ignore - Dynamic access
        newPermissions[section][permission] = checked

        // If any permission is disabled, admin should be false
        if (!checked) {
          newPermissions.admin = false
        }

        // Check if all permissions are enabled, then admin should be true
        const allEnabled =
          Object.values(newPermissions.dashboard).every((v) => v) &&
          Object.values(newPermissions.team).every((v) => v) &&
          Object.values(newPermissions.reports).every((v) => v) &&
          Object.values(newPermissions.settings).every((v) => v)

        if (allEnabled) {
          newPermissions.admin = true
        }
      }

      return newPermissions
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border-white/10 text-white shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -z-10" />

          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-indigo-500 to-rose-500 p-2 rounded-lg">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-semibold text-white">{currentStepData.title}</DialogTitle>
            </div>
            <DialogDescription className="text-white/60">{currentStepData.description}</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6 pt-4">
              {/* Step indicator */}
              <div className="flex items-center justify-center mb-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        index === currentStep
                          ? "bg-gradient-to-r from-indigo-500 to-rose-500 text-white"
                          : index < currentStep
                            ? "bg-white/10 text-white"
                            : "bg-white/5 text-white/40"
                      }`}
                    >
                      {index < currentStep ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-1 ${
                          index < currentStep ? "bg-gradient-to-r from-indigo-500 to-rose-500" : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {currentStep === 0 && (
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80 flex items-center gap-2">
                              <UserPlus className="h-4 w-4 text-indigo-400" />
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
                                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
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
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-5">
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

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/80 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-indigo-400" />
                              Phone Number (Optional)
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
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
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

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white">Dashboard</h3>
                          <div className="h-5 w-5"></div> {/* Spacer for alignment */}
                        </div>
                        <div className="space-y-3 bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">View dashboard</span>
                              <p className="text-white/60 text-xs">Access to view dashboard content</p>
                            </div>
                            <Switch
                              checked={permissions.dashboard.view}
                              onCheckedChange={(checked) => handlePermissionChange("dashboard", "view", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">Edit dashboard</span>
                              <p className="text-white/60 text-xs">Ability to customize dashboard</p>
                            </div>
                            <Switch
                              checked={permissions.dashboard.edit}
                              onCheckedChange={(checked) => handlePermissionChange("dashboard", "edit", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white">Team Management</h3>
                          <div className="h-5 w-5"></div> {/* Spacer for alignment */}
                        </div>
                        <div className="space-y-3 bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">View team members</span>
                              <p className="text-white/60 text-xs">Access to view team member profiles</p>
                            </div>
                            <Switch
                              checked={permissions.team.view}
                              onCheckedChange={(checked) => handlePermissionChange("team", "view", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">Create team members</span>
                              <p className="text-white/60 text-xs">Ability to add new team members</p>
                            </div>
                            <Switch
                              checked={permissions.team.create}
                              onCheckedChange={(checked) => handlePermissionChange("team", "create", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">Edit team members</span>
                              <p className="text-white/60 text-xs">Ability to modify team member profiles</p>
                            </div>
                            <Switch
                              checked={permissions.team.edit}
                              onCheckedChange={(checked) => handlePermissionChange("team", "edit", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">Delete team members</span>
                              <p className="text-white/60 text-xs">Ability to remove team members</p>
                            </div>
                            <Switch
                              checked={permissions.team.delete}
                              onCheckedChange={(checked) => handlePermissionChange("team", "delete", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white">Reports</h3>
                          <div className="h-5 w-5"></div> {/* Spacer for alignment */}
                        </div>
                        <div className="space-y-3 bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">View reports</span>
                              <p className="text-white/60 text-xs">Access to view generated reports</p>
                            </div>
                            <Switch
                              checked={permissions.reports.view}
                              onCheckedChange={(checked) => handlePermissionChange("reports", "view", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">Create reports</span>
                              <p className="text-white/60 text-xs">Ability to generate new reports</p>
                            </div>
                            <Switch
                              checked={permissions.reports.create}
                              onCheckedChange={(checked) => handlePermissionChange("reports", "create", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">Export reports</span>
                              <p className="text-white/60 text-xs">Ability to download and export reports</p>
                            </div>
                            <Switch
                              checked={permissions.reports.export}
                              onCheckedChange={(checked) => handlePermissionChange("reports", "export", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.4 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white">Settings</h3>
                          <div className="h-5 w-5"></div> {/* Spacer for alignment */}
                        </div>
                        <div className="space-y-3 bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">View settings</span>
                              <p className="text-white/60 text-xs">Access to view system settings</p>
                            </div>
                            <Switch
                              checked={permissions.settings.view}
                              onCheckedChange={(checked) => handlePermissionChange("settings", "view", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white/80 text-sm">Edit settings</span>
                              <p className="text-white/60 text-xs">Ability to modify system settings</p>
                            </div>
                            <Switch
                              checked={permissions.settings.edit}
                              onCheckedChange={(checked) => handlePermissionChange("settings", "edit", checked)}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.5 }}
                        className="flex items-center p-3 bg-indigo-500/10 rounded-lg mt-4"
                      >
                        <Info className="h-5 w-5 text-indigo-400 mr-2 flex-shrink-0" />
                        <p className="text-white/80 text-sm">
                          These permissions will determine what the team member can access in the system.
                        </p>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-4 border-t border-white/10 mt-6">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : currentStep < steps.length - 1 ? (
                    "Continue"
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Add Member
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}