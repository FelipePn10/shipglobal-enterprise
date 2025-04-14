"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  UserPlus,
  Mail,
  Building2,
  Briefcase,
  Phone,
  ArrowLeft,
  Shield,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast"; // Assuming path is correct
import type { TeamMemberPermissions } from "@/types/team"; // Assuming path is correct

// --- Zod Schema ---
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.string().min(1, { message: "Role is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  phone: z.string().optional(),
});

// --- Types ---
export type FormValues = z.infer<typeof formSchema>;

type PermissionSectionKey = Exclude<keyof TeamMemberPermissions, "admin">;
type PermissionKey<S extends PermissionSectionKey> = keyof TeamMemberPermissions[S];

// --- Props Interface ---
interface AddTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (
    member: FormValues & { permissions: TeamMemberPermissions }
  ) => Promise<void>;
}

// --- Constants ---
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
];

const initialPermissions: TeamMemberPermissions = {
  admin: false,
  dashboard: { view: true, edit: false },
  team: { view: false, create: false, edit: false, delete: false },
  reports: { view: false, create: false, export: false },
  settings: { view: false, edit: false },
};

// --- Helper Component for Permissions ---
interface PermissionGroupProps<S extends PermissionSectionKey> {
  title: string;
  sectionKey: S;
  permissions: TeamMemberPermissions[S];
  onPermissionChange: <P extends PermissionKey<S>>(
    section: S,
    permission: P,
    checked: boolean
  ) => void;
  disabled?: boolean;
  descriptions: Record<PermissionKey<S>, string>;
}

function PermissionGroup<S extends PermissionSectionKey>({
  title,
  sectionKey,
  permissions,
  onPermissionChange,
  disabled = false,
  descriptions,
}: PermissionGroupProps<S>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }} // Adjust delay as needed
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className={`font-medium ${disabled ? "text-white/50" : "text-white"}`}>
          {title}
        </h3>
        <div className="h-5 w-5"></div> {/* Spacer for alignment */}
      </div>
      <div className={`space-y-3 bg-white/5 p-3 rounded-lg ${disabled ? "opacity-60" : ""}`}>
        {Object.entries(permissions).map(([key, value]) => {
          const permissionKey = key as PermissionKey<S>;
          return (
            <div key={String(permissionKey)} className="flex items-center justify-between">
              <div>
                <span className={`text-sm ${disabled ? "text-white/60" : "text-white/80"}`}>
                  {/* Simple capitalization for display */}
                  {(permissionKey as string).charAt(0).toUpperCase() + (permissionKey as string).slice(1)}
                </span>
                <p className={`text-xs ${disabled ? "text-white/40" : "text-white/60"}`}>
                  {descriptions[permissionKey] ?? `Manage ${String(permissionKey)} access`}
                </p>
              </div>
              <Switch
                checked={value}
                onCheckedChange={(checked) =>
                  onPermissionChange(sectionKey, permissionKey, checked)
                }
                className="data-[state=checked]:bg-indigo-500"
                disabled={disabled}
              />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// --- Main Component ---
export function RefinedAddTeamMemberModal({
  open,
  onOpenChange,
  onAddMember,
}: AddTeamMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState<TeamMemberPermissions>(initialPermissions);
  const { toast } = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      department: "",
      phone: "",
    },
    mode: "onChange", // Trigger validation on change for better UX
  });

  // --- Effects ---

  // Focus first input on open
  useEffect(() => {
    if (open && currentStep === 0 && nameInputRef.current) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100); // Timeout ensures element is rendered and focusable after animation
      return () => clearTimeout(timer);
    }
  }, [open, currentStep]);

  // Reset state on close
  useEffect(() => {
    if (!open) {
      // No timeout needed, reset happens before component unmounts
      setCurrentStep(0);
      form.reset();
      setPermissions(initialPermissions);
      setIsSubmitting(false); // Ensure submitting state is also reset
    }
  }, [open, form]);

  // --- Handlers ---

  const handlePermissionChange = useCallback(
    <S extends PermissionSectionKey, P extends PermissionKey<S>>(
      section: S | "admin",
      permission: P | "",
      checked: boolean
    ) => {
      setPermissions((prev) => {
        const newPermissions = structuredClone(prev); // Deep clone for safe mutation

        if (section === "admin") {
          newPermissions.admin = checked;
          // If admin is toggled, sync all other permissions
          const adminState = checked;
          Object.keys(newPermissions).forEach((secKey) => {
            if (secKey !== "admin") {
              const sKey = secKey as PermissionSectionKey;
              Object.keys(newPermissions[sKey]).forEach((permKey) => {
                const pKey = permKey as PermissionKey<typeof sKey>;
                newPermissions[sKey][pKey] = adminState;
              });
            }
          });
        } else {
          // Type assertion is safe here because we control the inputs
          const sKey = section as S;
          const pKey = permission as P;

          if (sKey in newPermissions && pKey in newPermissions[sKey]) {
            newPermissions[sKey][pKey] = checked as TeamMemberPermissions[S][P];

            // If any permission is disabled, admin must be false
            if (!checked) {
              newPermissions.admin = false;
            } else {
              // Check if *all* specific permissions are now enabled
              const allEnabled = (
                Object.keys(initialPermissions) as Array<
                  keyof TeamMemberPermissions
                >
              )
                .filter((k): k is PermissionSectionKey => k !== "admin")
                .every((secKey) =>
                  (
                    Object.keys(
                      initialPermissions[secKey]
                    ) as Array<PermissionKey<typeof secKey>>
                  ).every((permKey) => newPermissions[secKey][permKey])
                );

              if (allEnabled) {
                newPermissions.admin = true;
              }
            }
          }
        }
        return newPermissions;
      });
    },
    [] // No dependencies, function logic is self-contained
  );

  const onSubmit = async (data: FormValues) => {
    // Final submission triggered only from the last step button
    if (currentStep !== steps.length - 1) return;

    setIsSubmitting(true);
    try {
      await onAddMember({ ...data, permissions });
      toast({
        title: "Team member added",
        description: `${data.name} has been successfully added.`,
        variant: "default",
        duration: 3000,
      });
      onOpenChange(false); // Close modal on success
    } catch (error) {
      console.error("Failed to add team member:", error); // Log the actual error
      toast({
        title: "Operation Failed",
        description:
          error instanceof Error ? error.message : "Could not add team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      // No need to reset state here as useEffect handles it on close
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Basic Information",
      description: "Enter the team member's name and email address.",
      fields: ["name", "email"] as const, // Use 'as const' for better type inference
    },
    {
      title: "Role & Department",
      description: "Specify their role, department, and optional phone number.",
      fields: ["role", "department", "phone"] as const,
    },
    {
      title: "Permissions",
      description: "Configure access levels and permissions.",
      fields: [] as const, // No form fields to validate directly in this step
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNextStep = async () => {
    // Fields to validate for the current step (exclude optional phone)
    const fieldsToValidate = currentStepData.fields.filter(f => f !== 'phone');

    // Trigger validation for the current step's fields
    const isValid = fieldsToValidate.length > 0
      ? await form.trigger(fieldsToValidate)
      : true; // Skip validation if no fields defined for the step (e.g., permissions step)

    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // If on the last step, trigger the actual form submission
        await form.handleSubmit(onSubmit)();
      }
    }
    // If !isValid, react-hook-form automatically displays errors via FormMessage
  };

  const handleBackStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // --- Render ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-gradient-to-br from-gray-900 to-black border-white/10 text-white shadow-xl">
        {/* Using a key on the outer motion.div forces remount on open, ensuring clean state */}
        <motion.div
          key={open ? "modal-open" : "modal-closed"}
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
              <DialogTitle className="text-xl font-semibold text-white">
                {/* Animate title change */}
                <AnimatePresence mode="wait">
                  <motion.span
                     key={currentStepData.title}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.1 }}
                     className="inline-block"
                  >
                     {currentStepData.title}
                  </motion.span>
                </AnimatePresence>
              </DialogTitle>
            </div>
             <DialogDescription className="text-white/60 whitespace-pre-wrap min-h-[40px]">
               {/* Animate description change */}
               <AnimatePresence mode="wait">
                  <motion.span
                     key={currentStepData.description}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.1 }}
                     className="inline-block"
                  >
                     {currentStepData.description}
                  </motion.span>
                </AnimatePresence>
             </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            {/* Use a standard form element for semantics, but prevent default browser submission */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-5 p-6 pt-4"
            >
              {/* Step indicator */}
              <div className="flex items-center justify-center mb-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
                        index === currentStep
                          ? "bg-gradient-to-r from-indigo-500 to-rose-500 text-white scale-110"
                          : index < currentStep
                          ? "bg-indigo-500/80 text-white" // Use a solid color for completed steps
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {index < currentStep ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-1 transition-colors duration-300 ${
                          index < currentStep
                            ? "bg-gradient-to-r from-indigo-500 to-rose-500"
                            : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Animated Step Content */}
              <div className="min-h-[280px]"> {/* Set min height to prevent layout shifts */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    {/* --- Step 0: Basic Info --- */}
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
                                    ref={nameInputRef} // Assign ref here
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

                    {/* --- Step 1: Role & Department --- */}
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
                                    placeholder="e.g., Software Engineer"
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
                              <Select
                                onValueChange={field.onChange}
                                value={field.value} // Controlled component
                              >
                                <FormControl>
                                  <div className="relative">
                                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white data-[placeholder]:text-white/40 pl-10 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all">
                                      <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                  </div>
                                </FormControl>
                                <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-white/10 text-white">
                                  {departments.map((department) => (
                                    <SelectItem
                                      key={department}
                                      value={department}
                                      className="text-white/80 data-[state=checked]:bg-indigo-500/20 data-[highlighted]:bg-white/10 focus:bg-white/10"
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
                                    {...field} // Use value={field.value || ''} if needed
                                    value={field.value ?? ''} // Handle potential null/undefined for optional field
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

                    {/* --- Step 2: Permissions --- */}
                    {currentStep === 2 && (
                      <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Admin Toggle */}
                         <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-between p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Shield className="h-5 w-5 text-rose-400" />
                              <div>
                                <h3 className="font-medium text-white">Administrator</h3>
                                <p className="text-white/60 text-sm">Full access to all features</p>
                              </div>
                            </div>
                            <Switch
                              checked={permissions.admin}
                              onCheckedChange={(checked) =>
                                handlePermissionChange("admin", "", checked)
                              }
                              className="data-[state=checked]:bg-rose-500"
                            />
                          </motion.div>

                          {/* Permission Groups */}
                          <PermissionGroup
                             title="Dashboard"
                             sectionKey="dashboard"
                             permissions={permissions.dashboard}
                             onPermissionChange={handlePermissionChange}
                             disabled={permissions.admin}
                             descriptions={{
                               view: "Access to view dashboard content",
                               edit: "Ability to customize dashboard layout"
                             }}
                          />
                           <PermissionGroup
                             title="Team Management"
                             sectionKey="team"
                             permissions={permissions.team}
                             onPermissionChange={handlePermissionChange}
                             disabled={permissions.admin}
                             descriptions={{
                               view: "View team member profiles",
                               create: "Add new team members",
                               edit: "Modify team member profiles",
                               delete: "Remove team members"
                             }}
                          />
                          <PermissionGroup
                             title="Reports"
                             sectionKey="reports"
                             permissions={permissions.reports}
                             onPermissionChange={handlePermissionChange}
                             disabled={permissions.admin}
                             descriptions={{
                               view: "Access generated reports",
                               create: "Generate new reports",
                               export: "Download and export reports"
                             }}
                          />
                          <PermissionGroup
                             title="Settings"
                             sectionKey="settings"
                             permissions={permissions.settings}
                             onPermissionChange={handlePermissionChange}
                             disabled={permissions.admin}
                             descriptions={{
                               view: "View system settings",
                               edit: "Modify system settings"
                             }}
                          />

                          {/* Info Box */}
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.5 }}
                            className="flex items-start p-3 bg-indigo-500/10 rounded-lg mt-4"
                          >
                            <Info className="h-5 w-5 text-indigo-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-white/80 text-sm">
                              {/* Corrected Line */}
                              Permissions determine system access. &apos;Administrator&apos; grants all permissions automatically.
                            </p>
                          </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>


              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t border-white/10 mt-6">
                {currentStep > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackStep}
                    className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="button" // Changed to type="button" to prevent accidental form submission
                  onClick={handleNextStep} // Use onClick to control step logic
                  disabled={isSubmitting}
                  className="min-w-[120px] bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 text-white transition-all disabled:opacity-60"
                >
                  {isSubmitting && currentStep === steps.length - 1 ? (
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
  );
}