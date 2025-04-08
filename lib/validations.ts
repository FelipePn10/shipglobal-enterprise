import { z } from 'zod'

export const ImportSchema = z.object({
  title: z.string().min(3).max(255),
  origin: z.string().min(3).max(255),
  destination: z.string().min(3).max(255),
  eta: z.date().optional()
})