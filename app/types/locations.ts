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
  features?: string[]
  images?: string[]
}

export interface UpdateLocationBody extends Partial<CreateLocationBody> {
  id: string
}