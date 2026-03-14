import { Category } from '@/app/generated/prisma/client'

export interface CreateLocationBody {
  name: string
  slug: string
  description: string
  address: string
  city: string
  latitude: number
  longitude: number
  category: Category
  isApproved?: boolean
  isFeatured?: boolean
  features?: { id: string; name: string }[]
  images?: { id: string; url: string }[]
}

export interface UpdateLocationBody extends Partial<CreateLocationBody> {
  id: string
}