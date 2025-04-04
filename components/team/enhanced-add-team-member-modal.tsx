"use client"

import { useState, useRef, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2, UserPlus, Mail, Building2, Briefcase, Phone } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().min(1, { message: "Role is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

// Mock departments data
const departments = ["Operations", "Compliance", "Sales", "Finance", "Customer Service"]

interface AddTeamMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: FormValues) => Promise<void>
}

export function EnhancedAddTeamMemberModal({ open, onOpenChange, onAddMember }: AddTeamMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<FormValues>>({})
  const { toast } = useToast()
  const nameInputRef = useRef<HTMLInputElement>(null)

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
      }, 300)
    }
  }, [open])

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)

    try {
      await onAddMember(data)

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

  // Form steps
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
  ]

  const currentStepData = steps[currentStep]

  // Check if current step is valid
  const isCurrentStepValid = () => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border-white/10 text-white shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-indigo-500/20 rounded-full blur-3xl -z-10" />

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
                  transition={{ duration: 0.2 }}
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
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
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
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
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
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
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
                                  <SelectTrigger className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20">
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
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20"
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
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between pt-4 border-t border-white/10 mt-6">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    Back
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white"
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

          {/* Close button */}
          <Button
            className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

