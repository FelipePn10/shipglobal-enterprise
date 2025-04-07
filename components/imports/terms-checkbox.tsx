import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import type { Control } from "react-hook-form"
import type { ImportFormValues } from "@/types/types"

interface TermsCheckboxProps {
  control: Control<ImportFormValues>
}

export function TermsCheckbox({ control }: TermsCheckboxProps) {
  return (
    <FormField
      control={control}
      name="acceptTerms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              I accept the{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                terms and conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                privacy policy
              </a>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}

