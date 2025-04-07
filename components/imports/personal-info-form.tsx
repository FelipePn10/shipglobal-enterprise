import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"
import type { Control } from "react-hook-form"
import type { ImportFormValues } from "@/types/types"

interface PersonalInfoFormProps {
  control: Control<ImportFormValues>
  formatCPF: (value: string) => string
}

export function PersonalInfoForm({ control, formatCPF }: PersonalInfoFormProps) {
  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <h3 className="text-md font-medium mb-3 flex items-center">
        <User className="h-4 w-4 mr-2 text-indigo-400" />
        Personal Information
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your full name"
                  {...field}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.000.000-00"
                  {...field}
                  value={formatCPF(field.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

