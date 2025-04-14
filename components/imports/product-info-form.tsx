"use client"

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ExternalLink, Package2, Tag } from "lucide-react"
import type { Control } from "react-hook-form"
import type { ImportFormValues } from "@/types/types"
import { popularCountries, productCategories } from "@/data/data"
import Image from "next/image"

interface ProductInfoFormProps {
  control: Control<ImportFormValues>
  getCountryFlag: (countryCode: string) => string
}

export function ProductInfoForm({ control, getCountryFlag }: ProductInfoFormProps) {
  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10">
      <h3 className="text-md font-medium mb-3 flex items-center">
        <Package2 className="h-4 w-4 mr-2 text-indigo-400" />
        Product Information
      </h3>

      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={control}
            name="productCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {productCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-indigo-400" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="originCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Origin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-[300px]">
                    <SelectGroup>
                      <SelectLabel>Popular Countries</SelectLabel>
                      {popularCountries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          <div className="flex items-center">
                            <Image
                              src={getCountryFlag(country.value) || "/placeholder.svg"}
                              alt={country.label}
                              className="h-3 mr-2"
                            />
                            {country.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="productLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Link</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="https://example.com/product"
                    {...field}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-10"
                  />
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                </div>
              </FormControl>
              <FormDescription className="text-white/60">
                Paste the URL of the product you want to import
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="productValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Value</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">R$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

