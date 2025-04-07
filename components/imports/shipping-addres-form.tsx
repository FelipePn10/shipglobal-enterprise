import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"
import type { Control } from "react-hook-form"
import type { ImportFormValues } from "@/types/types"

interface ShippingAddressFormProps {
  control: Control<ImportFormValues>
  formatZipCode: (value: string) => string
}

export function ShippingAddressForm({ control, formatZipCode }: ShippingAddressFormProps) {
  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <h3 className="text-md font-medium mb-3 flex items-center">
        <MapPin className="h-4 w-4 mr-2 text-indigo-400" />
        Shipping Address
      </h3>

      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Street name"
                    {...field}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={control}
              name="address.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123"
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
              name="address.complement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complement</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apt 101"
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="address.neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Neighborhood</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your neighborhood"
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
            name="address.zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="00000-000"
                    {...field}
                    value={formatZipCode(field.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your city"
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
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SP"
                    maxLength={2}
                    {...field}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}

