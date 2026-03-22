export type Category =
  | 'RESTAURANT' | 'CAFE' | 'HOTEL' | 'SHOPPING' | 'TRANSPORT'
  | 'HOSPITAL' | 'PHARMACY' | 'PARK' | 'EDUCATION' | 'ENTERTAINMENT'
  | 'SPORT' | 'GOVERNMENT' | 'RELIGIOUS' | 'TOURISM' | 'SUPERMARKET'
  | 'BANK' | 'POST_OFFICE' | 'MUSEUM' | 'LIBRARY' | 'BEACH'
  | 'PUBLIC_TOILET' | 'OTHER'

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
  verified?: boolean
  accessibilityRating?: number
  accessibilityNotes?: string
  features?: string[]
  images?: string[]
}

export interface UpdateLocationBody extends Partial<CreateLocationBody> {
  id: string
}

export interface Location extends Omit<CreateLocationBody, 'features' | 'images'> {
  id: string
  features: { id: string; name: string }[]
  images: { id: string; url: string; alt?: string }[]
  createdAt: string
  updatedAt: string
}