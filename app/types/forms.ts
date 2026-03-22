import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({
    pattern: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
    message: 'Invalid email address'
  }),
  password: z.string().min(1, 'Password is required'),
})

export const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  category: z.enum([
    'RESTAURANT', 'CAFE', 'HOTEL', 'SHOPPING', 'TRANSPORT',
    'HOSPITAL', 'PHARMACY', 'PARK', 'EDUCATION', 'ENTERTAINMENT',
    'SPORT', 'GOVERNMENT', 'RELIGIOUS', 'TOURISM', 'SUPERMARKET',
    'BANK', 'POST_OFFICE', 'MUSEUM', 'LIBRARY', 'BEACH',
    'PUBLIC_TOILET', 'OTHER'
  ]),
  isApproved: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  verified: z.boolean().optional(),
  accessibilityRating: z.number().min(1).max(5).optional(),
  accessibilityNotes: z.string().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
})

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
})

export const mediaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'AUDIO']),
  url: z.url({ message: 'Invalid URL' }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type LocationFormData = z.infer<typeof locationSchema>
export type BlogFormData = z.infer<typeof blogSchema>
export type MediaFormData = z.infer<typeof mediaSchema>

